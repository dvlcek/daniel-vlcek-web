import { NextRequest, NextResponse } from "next/server";
import { parseBookingIntake, BOOKING_INTAKE_MAX_BODY_BYTES } from "@/lib/booking/intake";
import { readAttemptToken, setAttemptCookie, startOwnedAttempt } from "@/lib/booking/session";
import { readJson, requireSameOrigin, securityResponse, SecurityError } from "@/lib/security/http";
import { limitIdentity, limitRequest } from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request);
    await limitRequest(request, "intake");
    const body = await readJson(request, BOOKING_INTAKE_MAX_BODY_BYTES);
    const parsed = parseBookingIntake(body);
    if (!parsed.success) throw new SecurityError(400, parsed.message);
    if (parsed.data.isBot) return NextResponse.json({ ok: true, leadId: null, status: "BOOKING_STARTED" });
    const attemptId = String(body.attemptId).toLowerCase();
    await limitIdentity("intake", parsed.data.email);
    const result = await startOwnedAttempt(parsed.data, attemptId, readAttemptToken(request, attemptId));
    const response = NextResponse.json({
      ok: true, leadId: result.lead.id, status: result.lead.status, reused: result.reused,
    }, { status: result.reused ? 200 : 201, headers: { "Cache-Control": "no-store" } });
    if (result.token) setAttemptCookie(response, attemptId, result.token);
    return response;
  } catch (error) {
    return securityResponse(error, "booking_intake");
  }
}
