import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { securityResponse } from "@/lib/security/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const provided = request.headers.get("authorization") ?? "";
  if (!secret || secret.length < 32) return securityResponse(new Error(), "security_cleanup_config");
  const expected = `Bearer ${secret}`;
  if (Buffer.byteLength(provided) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(provided), Buffer.from(expected))) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  try {
    const db = getDb();
    // Bounded batches; remove ONLY expired security records, never leads or bookings.
    const attempts = await db.$executeRaw`
      DELETE FROM "BookingAttempt" WHERE "id" IN (
        SELECT "id" FROM "BookingAttempt" WHERE "expiresAt" < clock_timestamp() ORDER BY "expiresAt" LIMIT 5000
      )
    `;
    const limits = await db.$executeRaw`
      DELETE FROM "SecurityRateLimit" WHERE "expiresAt" < clock_timestamp() - interval '1 day' AND "key" IN (
        SELECT "key" FROM "SecurityRateLimit" WHERE "expiresAt" < clock_timestamp() - interval '1 day' ORDER BY "expiresAt" LIMIT 5000
      )
    `;
    return NextResponse.json({ ok: true, attempts, limits }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return securityResponse(error, "security_cleanup");
  }
}
