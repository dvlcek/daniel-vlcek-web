import { beginCalendarOperation, deliverBookingNotification, recoverCalendarOperation } from "@/lib/booking/recovery";
import { logSecurityFailure } from "@/lib/security/log";
import { SecurityError, readJson, requireSameOrigin, securityResponse } from "@/lib/security/http";
import { limitRequest } from "@/lib/security/rate-limit";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  z,
} from "zod";

import {
  BookingStatus,
} from "@/generated/prisma/enums";

import {
  verifyBookingAccessToken,
} from "@/lib/booking/tokens";

import {
  getDb,
} from "@/lib/db";

/* =========================================================
   ROUTE CONFIG
========================================================= */

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

/* =========================================================
   SCHEMA
========================================================= */

const cancelBookingSchema =
  z
    .object({
      bookingId:
        z
          .string()
          .trim()
          .min(1)
          .max(256),

      token:
        z
          .string()
          .trim()
          .min(1)
          .max(256),
    })
    .strict();

/* =========================================================
   RESPONSE
========================================================= */

function noStoreJson(
  body: unknown,
  status = 200,
) {
  return NextResponse.json(
    body,
    {
      status,

      headers: {
        "Cache-Control":
          "no-store, max-age=0",

        "Referrer-Policy":
          "no-referrer",
      },
    },
  );
}

/* =========================================================
   CRM
========================================================= */

export async function POST(
  request: NextRequest,
) {
  try {
    requireSameOrigin(request);
    await limitRequest(request, "cancel");
    const db = getDb();
    /* =====================================================
       PARSE REQUEST
    ===================================================== */

    let body:
      unknown;

    try {
      body =
        await readJson(request);
    } catch (error) {
      if (error instanceof SecurityError) return securityResponse(error, "booking_request");
      return noStoreJson(
        {
          ok:
            false,

          message:
            "Invalid request.",
        },
        400,
      );
    }

    const parsed =
      cancelBookingSchema.safeParse(
        body,
      );

    if (
      !parsed.success
    ) {
      return noStoreJson(
        {
          ok:
            false,

          message:
            "Invalid cancellation request.",
        },
        400,
      );
    }

    const {
      bookingId,
      token,
    } =
      parsed.data;

    /* =====================================================
       LOAD BOOKING
    ===================================================== */

    const booking =
      await db.booking.findUnique({
        where: {
          id:
            bookingId,
        },

        include: {
          lead: {
            select: {
              id:
                true,

              name:
                true,

              email:
                true,

              status:
                true,
            },
          },
        },
      });

    if (
      !booking ||
      !booking.cancelTokenHash
    ) {
      return noStoreJson(
        {
          ok:
            false,

          message:
            "This booking link is invalid or no longer available.",
        },
        403,
      );
    }

    /* =====================================================
       AUTHORIZE
    ===================================================== */

    const authorized =
      verifyBookingAccessToken({
        bookingId:
          booking.id,

        token,

        tokenHash:
          booking.cancelTokenHash,
      });

    if (
      !authorized
    ) {
      return noStoreJson(
        {
          ok:
            false,

          message:
            "This booking link is invalid or no longer available.",
        },
        403,
      );
    }

    /* =====================================================
       IDEMPOTENT CANCEL
    ===================================================== */

    if (booking.status === BookingStatus.CANCELLED) {
      const cancellationEmailSent = await deliverBookingNotification(booking.id, request.nextUrl.origin);
      return noStoreJson({ ok: true, alreadyCancelled: true, cancellationEmailSent, booking: { id: booking.id, status: booking.status } });
    }
    if (booking.calendarOperation && booking.calendarOperation !== "CANCEL") throw new SecurityError(409, "A booking operation is processing. Retry shortly.");
    if (!booking.calendarOperation) await beginCalendarOperation(booking, "CANCEL");
    if (!await recoverCalendarOperation(booking.id)) throw new SecurityError(503, "Cancellation is being reconciled. Retry shortly.");
    const cancellationEmailSent = await deliverBookingNotification(booking.id, request.nextUrl.origin);
    return noStoreJson({ ok: true, alreadyCancelled: false, cancellationEmailSent, booking: { id: booking.id, status: BookingStatus.CANCELLED } });
  } catch (error) {
    if (error instanceof SecurityError) return securityResponse(error, "booking_request");
    logSecurityFailure("Booking cancellation API error:", error);
    return noStoreJson({ ok: false, message: "Could not cancel the booking. Please try again." }, 503);
  }
}
