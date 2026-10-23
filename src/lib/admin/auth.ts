import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";

export const ADMIN_COOKIE_NAME = "dv_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

function secureEqual(left: string, right: string): boolean {
  const a = Buffer.from(left), b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function credentials(): { password: string; secret: string } {
  const password = process.env.ADMIN_PASSWORD?.trim();
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!password || !secret || secret.length < 32) throw new Error("Admin authentication is not configured.");
  return { password, secret };
}

function credentialVersion(): string {
  const { password, secret } = credentials();
  return createHmac("sha256", secret).update(password).digest("hex");
}

function tokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function verifyAdminPassword(password: string): boolean {
  return secureEqual(password, credentials().password);
}

export async function createAdminSessionToken(): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  await getDb().adminSession.create({ data: {
    tokenHash: tokenHash(token), credentialVersion: credentialVersion(),
    expiresAt: new Date(Date.now() + SESSION_DURATION_SECONDS * 1000),
  } });
  return token;
}

export async function verifyAdminSessionToken(token: string): Promise<boolean> {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return false;
  try {
    const session = await getDb().adminSession.findUnique({ where: { tokenHash: tokenHash(token) } });
    return !!session && !session.revokedAt && session.expiresAt.getTime() > Date.now()
      && secureEqual(session.credentialVersion, credentialVersion());
  } catch { return false; } // DB/configuration failures never grant access.
}

export async function revokeAdminSession(token: string): Promise<void> {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return;
  await getDb().adminSession.updateMany({
    where: { tokenHash: tokenHash(token), revokedAt: null }, data: { revokedAt: new Date() },
  });
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  return token ? verifyAdminSessionToken(token) : false;
}

export function getAdminSessionMaxAge(): number { return SESSION_DURATION_SECONDS; }
