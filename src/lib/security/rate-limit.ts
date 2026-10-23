import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { getDb } from "@/lib/db";
import { SecurityError } from "./http";

export const RATE_POLICIES = {
  contact: { network: 5, global: 100, seconds: 900 },
  login: { network: 5, global: 30, seconds: 900 },
  intake: { network: 10, global: 200, seconds: 900 },
  confirm: { network: 10, global: 100, seconds: 900 },
  availability: { network: 60, global: 600, seconds: 60 },
  manage: { network: 30, global: 300, seconds: 900 },
  cancel: { network: 10, global: 100, seconds: 900 },
  reschedule: { network: 10, global: 100, seconds: 900 },
} as const;

export function networkIdentity(request: Request): string {
  // Trust ONLY the edge-overwritten header, and ONLY in an explicitly configured Vercel runtime.
  if (process.env.SECURITY_TRUST_PROXY === "vercel" && process.env.VERCEL === "1") {
    const ip = request.headers.get("x-vercel-forwarded-for")?.trim();
    if (ip && isIP(ip)) {
      // Group IPv6 clients by /64 so privacy-address rotation does not evade quotas.
      if (isIP(ip) === 6) {
        const normalized = new URL(`http://[${ip}]/`).hostname.slice(1, -1);
        const [left, right = ""] = normalized.split("::");
        const a = left ? left.split(":") : [];
        const b = right ? right.split(":") : [];
        const expanded = normalized.includes("::") ? [...a, ...Array(8 - a.length - b.length).fill("0"), ...b] : a;
        return expanded.slice(0, 4).map(part => part.padStart(4, "0")).join(":");
      }
      return ip;
    }
  }
  // Unknown/self-hosted ingress shares one restrictive quota; never accept arbitrary XFF/X-Real-IP.
  return "untrusted-network";
}

export function rateKey(scope: string, identity: string): string {
  const secret = process.env.SECURITY_RATE_LIMIT_SECRET?.trim();
  if (!secret || secret.length < 32) throw new SecurityError(503, "Service temporarily unavailable.");
  return createHmac("sha256", secret).update(`${scope}\0${identity}`).digest("hex");
}

type RateStore = Pick<ReturnType<typeof getDb>, "$queryRaw">;

export async function consumeLimit(scope: string, identity: string, limit: number, seconds: number, store: RateStore = getDb()): Promise<void> {
  const key = rateKey(scope, identity);
  // One stable row per HMAC identity; reset atomically against the DATABASE clock.
  const rows = await store.$queryRaw<{ hits: number; retryAfter: number }[]>`
    INSERT INTO "SecurityRateLimit" ("key", "hits", "expiresAt")
    VALUES (${key}, 1, clock_timestamp() + ${seconds} * interval '1 second')
    ON CONFLICT ("key") DO UPDATE SET
      "hits" = CASE WHEN "SecurityRateLimit"."expiresAt" <= clock_timestamp() THEN 1
        ELSE LEAST("SecurityRateLimit"."hits" + 1, ${limit + 1}) END,
      "expiresAt" = CASE WHEN "SecurityRateLimit"."expiresAt" <= clock_timestamp()
        THEN clock_timestamp() + ${seconds} * interval '1 second' ELSE "SecurityRateLimit"."expiresAt" END
    RETURNING "hits", GREATEST(1, ceil(extract(epoch FROM "expiresAt" - clock_timestamp())))::integer AS "retryAfter"
  `;
  if (!rows[0]) throw new SecurityError(503, "Service temporarily unavailable.");
  if (rows[0].hits > limit) throw new SecurityError(429, "Too many requests. Please try again later.", rows[0].retryAfter);
}

export async function limitRequest(request: Request, policy: keyof typeof RATE_POLICIES): Promise<void> {
  const config = RATE_POLICIES[policy];
  // Global budget first bounds distinct identity rows and expensive work even across distributed attackers.
  await consumeLimit(`${policy}:global`, "all", config.global, config.seconds);
  await consumeLimit(`${policy}:network`, networkIdentity(request), config.network, config.seconds);
}

export async function limitIdentity(policy: "contact" | "intake" | "confirm", identity: string): Promise<void> {
  await consumeLimit(`${policy}:identity`, identity.trim().toLowerCase(), policy === "confirm" ? 10 : 5, 3600);
}
