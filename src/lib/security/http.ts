import { NextResponse } from "next/server";

export class SecurityError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfter?: number) {
    super(message);
  }
}

export function securityResponse(error: unknown, operation: string): NextResponse {
  if (error instanceof SecurityError) {
    return NextResponse.json({ ok: false, message: error.message }, {
      status: error.status,
      headers: {
        "Cache-Control": "no-store",
        ...(error.retryAfter ? { "Retry-After": String(error.retryAfter) } : {}),
      },
    });
  }
  // Never serialize provider/Prisma errors: they can contain credentials or payloads.
  console.error("Security operation failed", { operation });
  return NextResponse.json({ ok: false, message: "Service temporarily unavailable. Please try again." }, {
    status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "30" },
  });
}

export function requireSameOrigin(request: Request): void {
  const configured = process.env.SECURITY_ALLOWED_ORIGINS?.split(",").map(value => value.trim()).filter(Boolean);
  if (process.env.NODE_ENV === "production" && !configured?.length) {
    throw new SecurityError(503, "Service temporarily unavailable.");
  }
  const allowed = configured?.length ? configured : [new URL(request.url).origin];
  if (allowed.some(value => {
    try {
      const url = new URL(value);
      return url.origin !== value || (process.env.NODE_ENV === "production" && url.protocol !== "https:");
    } catch { return true; }
  })) throw new SecurityError(503, "Service temporarily unavailable.");
  const origin = request.headers.get("origin");
  const destination = new URL(request.url).origin;
  if (!origin || origin === "null" || !allowed.includes(origin) || origin !== destination || request.headers.get("sec-fetch-site") === "cross-site") {
    throw new SecurityError(403, "Request not permitted.");
  }
}

export async function readBody(request: Request, limit: number): Promise<string> {
  const length = request.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > limit)) {
    throw new SecurityError(413, "Request is too large.");
  }
  if (!request.body) throw new SecurityError(400, "Invalid request.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => reject(new SecurityError(408, "Request timed out.")), 10_000);
  });
  try {
    while (true) {
      const { done, value } = await Promise.race([reader.read(), deadline]);
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) {
        void reader.cancel().catch(() => {});
        throw new SecurityError(413, "Request is too large.");
      }
      chunks.push(value);
    }
    return new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks));
  } catch (error) {
    if (error instanceof SecurityError) throw error;
    throw new SecurityError(400, "Invalid request.");
  } finally {
    clearTimeout(timeout);
    void reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

export async function readJson(request: Request, limit = 16_000): Promise<Record<string, unknown>> {
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    throw new SecurityError(415, "Expected JSON request.");
  }
  let parsed: unknown;
  try { parsed = JSON.parse(await readBody(request, limit)); }
  catch (error) {
    if (error instanceof SecurityError) throw error;
    throw new SecurityError(400, "Invalid request.");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new SecurityError(400, "Invalid request.");
  }
  return parsed as Record<string, unknown>;
}
