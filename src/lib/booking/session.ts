import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@/generated/prisma/client";
import { getDb } from "@/lib/db";
import { SecurityError } from "@/lib/security/http";
import type { BookingIntakeInput } from "./intake";

export const ATTEMPT_TTL_SECONDS = 3600;
export const ATTEMPT_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const denied = () => new SecurityError(403, "Booking session is invalid or expired. Please start again.");

export function attemptCookieName(attemptId: string): string {
  if (!ATTEMPT_ID_PATTERN.test(attemptId)) throw denied();
  return `${process.env.NODE_ENV === "production" ? "__Host-" : ""}dv_booking_${attemptId.toLowerCase()}`;
}

export function hashCapability(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function validCapability(token: string | undefined, hash: string, expiresAt: Date, now = new Date()): boolean {
  if (!token || !TOKEN_PATTERN.test(token) || !/^[0-9a-f]{64}$/.test(hash) || expiresAt <= now) return false;
  return timingSafeEqual(Buffer.from(hashCapability(token), "hex"), Buffer.from(hash, "hex"));
}

export function readAttemptToken(request: NextRequest, attemptId: string): string | undefined {
  return request.cookies.get(attemptCookieName(attemptId))?.value;
}

export function setAttemptCookie(response: NextResponse, attemptId: string, token: string): void {
  response.cookies.set(attemptCookieName(attemptId), token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
    path: "/", maxAge: ATTEMPT_TTL_SECONDS,
  });
}

export async function ownedAttempt(tx: Prisma.TransactionClient, attemptId: string, token: string | undefined, leadId?: string) {
  if (!ATTEMPT_ID_PATTERN.test(attemptId) || !token || !TOKEN_PATTERN.test(token)) throw denied();
  // Revalidate inside the reservation transaction, not only before costly provider calls.
  const rows = await tx.$queryRaw<{ id: string }[]>`
    SELECT "id" FROM "BookingAttempt" WHERE "id" = ${attemptId}::uuid
      AND "tokenHash" = ${hashCapability(token)} AND "expiresAt" > clock_timestamp() FOR UPDATE
  `;
  if (!rows[0]) throw denied();
  const attempt = await tx.bookingAttempt.findUnique({ where: { id: attemptId } });
  if (!attempt || (leadId && attempt.leadId !== leadId)) throw denied();
  return attempt;
}

export async function startOwnedAttempt(input: BookingIntakeInput, attemptId: string, token?: string, db = getDb()) {
  if (!ATTEMPT_ID_PATTERN.test(attemptId)) throw denied();
  return db.$transaction(async tx => {
    // Serialize creation too, when the attempt row does not exist yet.
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${attemptId}, 0))`;
    const existing = await tx.bookingAttempt.findUnique({ where: { id: attemptId } });
    if (existing) {
      const attempt = await ownedAttempt(tx, attemptId, token);
      const activeBooking = attempt.bookingId ? await tx.booking.findUnique({ where: { id: attempt.bookingId } }) : null;
      if (activeBooking && activeBooking.status !== "CANCELLED") {
        return { lead: { id: attempt.leadId, status: "BOOKED" }, reused: true, token: undefined };
      }
      const lead = await tx.lead.update({ where: { id: attempt.leadId }, data: {
        name: input.name, email: input.email, emailNormalized: input.email,
        company: input.company, website: input.website, phone: input.phone, message: input.message,
      }, select: { id: true, status: true } });
      return { lead, reused: true, token: undefined };
    }
    // An attacker-supplied cookie never becomes the new capability (fixation prevention).
    if (token) throw denied();
    const capability = randomBytes(32).toString("base64url");
    const lead = await tx.lead.create({ data: {
      name: input.name, email: input.email, emailNormalized: input.email,
      company: input.company, website: input.website, phone: input.phone, message: input.message,
      source: "WEBSITE_BOOKING", status: "BOOKING_STARTED",
    }, select: { id: true, status: true } });
    await tx.bookingAttempt.create({ data: {
      id: attemptId, tokenHash: hashCapability(capability), leadId: lead.id,
      expiresAt: new Date(Date.now() + ATTEMPT_TTL_SECONDS * 1000),
    } });
    return { lead, reused: false, token: capability };
  });
}
