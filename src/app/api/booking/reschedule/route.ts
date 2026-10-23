import { beginCalendarOperation, deliverBookingNotification, recoverCalendarOperation } from "@/lib/booking/recovery";
import { logSecurityFailure } from "@/lib/security/log";
import { SecurityError, readJson, requireSameOrigin, securityResponse } from "@/lib/security/http";
import { limitRequest } from "@/lib/security/rate-limit";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  DateTime,
} from "luxon";

import {
  z,
} from "zod";

import {
  BookingStatus,
} from "@/generated/prisma/enums";

import {
  validateRescheduleSlot,
} from "@/lib/booking/reschedule-availability";

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
   REQUEST
========================================================= */

const rescheduleSchema =
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

      startsAt:
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
   ERROR HELPERS
========================================================= */

export async function POST(
  request: NextRequest,
) {
  try {
    requireSameOrigin(request);
    await limitRequest(request, "reschedule");
    const db = getDb();
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
      rescheduleSchema.safeParse(
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
            "Invalid reschedule request.",
        },
        400,
      );
    }

    const {
      bookingId,
      token,
      startsAt,
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

              company:
                true,

              website:
                true,

              message:
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
       TOKEN
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

    if (booking.calendarOperation === "RESCHEDULE" && booking.startsAt.getTime() === new Date(startsAt).getTime()) {
      if (!await recoverCalendarOperation(booking.id)) throw new SecurityError(503, "Reschedule is being reconciled. Retry shortly.");
      const updated = await db.booking.findUniqueOrThrow({ where: { id: booking.id } });
      const confirmationEmailSent = await deliverBookingNotification(booking.id, request.nextUrl.origin);
      return noStoreJson({ ok: true, booking: { id: updated.id, startsAt: updated.startsAt.toISOString(), endsAt: updated.endsAt.toISOString(), timezone: updated.timezone, status: updated.status }, confirmationEmailSent });
    }
    /* =====================================================
       STATUS
    ===================================================== */

    if (
      booking.status !==
      BookingStatus.CONFIRMED
    ) {
      return noStoreJson(
        {
          ok:
            false,

          message:
            "This booking can no longer be rescheduled.",
        },
        409,
      );
    }

    if (
      !booking.externalCalendarEventId
    ) {
      logSecurityFailure("Confirmed booking is missing calendar event ID.");

      return noStoreJson(
        {
          ok:
            false,

          message:
            "This booking cannot currently be rescheduled.",
        },
        500,
      );
    }

    /* =====================================================
       REQUESTED TIME
    ===================================================== */

    const requestedStart =
      DateTime.fromISO(
        startsAt,
        {
          setZone:
            true,
        },
      ).toUTC();

    if (
      !requestedStart.isValid
    ) {
      return noStoreJson(
        {
          ok:
            false,

          message:
            "Invalid booking time.",
        },
        400,
      );
    }

    /* =====================================================
       SAME SLOT
    ===================================================== */

    const currentStart =
      DateTime.fromJSDate(
        booking.startsAt,
        {
          zone:
            "utc",
        },
      );

    if (
      requestedStart.toMillis() ===
      currentStart.toMillis()
    ) {
      return noStoreJson({
        ok:
          true,

        booking: {
          id:
            booking.id,

          startsAt:
            booking.startsAt.toISOString(),

          endsAt:
            booking.endsAt.toISOString(),

          timezone:
            booking.timezone,

          status:
            booking.status,
        },

        confirmationEmailSent: await deliverBookingNotification(booking.id, request.nextUrl.origin),
      });
    }

    /* =====================================================
       RESCHEDULE-SPECIFIC AVAILABILITY

       Unlike normal availability this excludes:
       - this booking from internal DB busy periods
       - this booking's exact Google Calendar event

       All other Google events remain blocking.
    ===================================================== */

    const validatedSlot =
      await validateRescheduleSlot({
        bookingId:
          booking.id,

        externalCalendarEventId:
          booking.externalCalendarEventId,

        requestedStartsAt:
          requestedStart.toJSDate(),
      });

    if (
      !validatedSlot
    ) {
      return noStoreJson(
        {
          ok:
            false,

          message:
            "This time is no longer available. Please choose another slot.",
        },
        409,
      );
    }

    const newStart =
      DateTime.fromJSDate(
        validatedSlot.startsAt,
        {
          zone:
            "utc",
        },
      );

    const newEnd =
      DateTime.fromJSDate(
        validatedSlot.endsAt,
        {
          zone:
            "utc",
        },
      );

    if (
      !newStart.isValid ||
      !newEnd.isValid
    ) {
      return noStoreJson(
        {
          ok:
            false,

          message:
            "Could not validate the selected time.",
        },
        500,
      );
    }

    const newActiveSlotKey =
      newStart.toISO({
        suppressMilliseconds:
          true,
      });

    if (
      !newActiveSlotKey
    ) {
      return noStoreJson(
        {
          ok:
            false,

          message:
            "Could not prepare the new booking time.",
        },
        500,
      );
    }

    await beginCalendarOperation(booking, "RESCHEDULE", { startsAt: newStart.toJSDate(), endsAt: newEnd.toJSDate() });
    if (!await recoverCalendarOperation(booking.id)) throw new SecurityError(503, "Reschedule is being reconciled. Retry shortly.");
    const updated = await db.booking.findUniqueOrThrow({ where: { id: booking.id } });
    const confirmationEmailSent = await deliverBookingNotification(booking.id, request.nextUrl.origin);
    return noStoreJson({ ok: true, booking: { id: updated.id, startsAt: updated.startsAt.toISOString(), endsAt: updated.endsAt.toISOString(), timezone: updated.timezone, status: updated.status }, confirmationEmailSent });
  } catch (error) {
    if (error instanceof SecurityError) return securityResponse(error, "booking_request");
    logSecurityFailure("Booking reschedule API error:", error);
    return noStoreJson({ ok: false, message: "Could not reschedule the booking. Please try again." }, 503);
  }
}
