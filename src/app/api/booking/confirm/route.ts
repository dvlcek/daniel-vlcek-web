import { randomUUID } from "node:crypto";
import { deliverBookingNotification, lockReservations, recoverCalendarOperation, requireFreeSlot, stableCalendarId } from "@/lib/booking/recovery";
import { logSecurityFailure } from "@/lib/security/log";
import { ownedAttempt, readAttemptToken } from "@/lib/booking/session";
import { SecurityError, readJson, requireSameOrigin, securityResponse } from "@/lib/security/http";
import { limitIdentity, limitRequest } from "@/lib/security/rate-limit";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  DateTime,
} from "luxon";

import {
  BookingStatus,
  LeadSource,
} from "@/generated/prisma/enums";

import {
  getBookingAvailability,
} from "@/lib/booking/availability";

import {
  bookingConfig,
} from "@/lib/booking/config";

import {
  parseBookingConfirmation,
} from "@/lib/booking/confirm";

import {
  createBookingToken,
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
      },
    },
  );
}

/* =========================================================
   ERROR HELPERS
========================================================= */

function hasErrorCode(
  error: unknown,
  code: string,
): boolean {
  if (
    typeof error !==
      "object" ||
    error === null ||
    !("code" in error)
  ) {
    return false;
  }

  return (
    (
      error as {
        code?: unknown;
      }
    ).code === code
  );
}

/* =========================================================
   CALENDAR DESCRIPTION
========================================================= */

export async function POST(
  request: NextRequest,
) {
  let db: ReturnType<typeof getDb> | undefined;

  let reservedBookingId:
    | string
    | null = null;



  try {
    requireSameOrigin(request);
    await limitRequest(request, "confirm");
    db = getDb();
    /* =====================================================
       REQUEST
    ===================================================== */

    let body: unknown;

    try {
      body =
        await readJson(request);
    } catch (error) {
      if (error instanceof SecurityError) return securityResponse(error, "booking_confirm");
      return noStoreJson(
        {
          ok: false,

          message:
            "Invalid request.",
        },
        400,
      );
    }

    const parsed =
      parseBookingConfirmation(
        body,
      );

    if (!parsed.success) {
      return noStoreJson(
        {
          ok: false,

          message:
            parsed.message,
        },
        400,
      );
    }

    const {
      leadId,
      startsAt,
      attemptId,
    } = parsed.data;
    const capability = readAttemptToken(request, attemptId);
    const attempt = await db.$transaction(tx => ownedAttempt(tx, attemptId, capability, leadId));
    await limitIdentity("confirm", attempt.id);
    let previous = attempt.bookingId ? await db.booking.findUnique({ where: { id: attempt.bookingId } }) : null;
    if (previous?.calendarOperation === "CREATE" && previous.startsAt.getTime() === new Date(startsAt).getTime()) {
      await recoverCalendarOperation(previous.id);
      previous = await db.booking.findUnique({ where: { id: previous.id } });
    }
    if (previous && previous.status !== BookingStatus.CANCELLED) {
      if (previous.status === BookingStatus.CONFIRMED && previous.startsAt.getTime() === new Date(startsAt).getTime()) {
        const confirmationEmailSent = previous.notification
          ? await deliverBookingNotification(previous.id, request.nextUrl.origin)
          : attempt.confirmationEmailSent;
        return noStoreJson({ ok: true, booking: {
          id: previous.id, startsAt: previous.startsAt.toISOString(), endsAt: previous.endsAt.toISOString(),
          timezone: previous.timezone, status: previous.status,
        }, confirmationEmailSent, reused: true });
      }
      throw new SecurityError(409, "This booking is already completed or processing. Please try again shortly.");
    }

    /* =====================================================
       CANDIDATE TIME
    ===================================================== */

    const candidateStart =
      DateTime.fromISO(
        startsAt,
        {
          zone: "utc",
        },
      );

    if (
      !candidateStart.isValid
    ) {
      return noStoreJson(
        {
          ok: false,

          message:
            "Invalid booking time.",
        },
        400,
      );
    }

    const localDate =
      candidateStart
        .setZone(
          bookingConfig.timezone,
        )
        .toFormat(
          "yyyy-MM-dd",
        );

    /* =====================================================
       LIVE AVAILABILITY REVALIDATION

       Includes:
       - weekly schedule
       - manual overrides
       - existing website bookings
       - Google Calendar busy periods
       - booking buffers
       - minimum notice
    ===================================================== */

    const availability =
      await getBookingAvailability({
        fromDate:
          localDate,

        days:
          1,
      });

    const selectedSlot =
      availability.days
        .flatMap(
          (day) =>
            day.slots,
        )
        .find(
          (slot) =>
            DateTime.fromISO(
              slot.startsAt,
              {
                zone: "utc",
              },
            ).toMillis() ===
            candidateStart.toMillis(),
        );

    if (!selectedSlot) {
      return noStoreJson(
        {
          ok: false,

          message:
            "This time is no longer available. Please choose another slot.",
        },
        409,
      );
    }

    /* =====================================================
       LEAD
    ===================================================== */

    const lead =
      await db.lead.findUnique({
        where: {
          id:
            leadId,
        },

        select: {
          id: true,

          name: true,
          email: true,

          company: true,
          website: true,
          message: true,

          source: true,
        },
      });

    if (!lead) {
      return noStoreJson(
        {
          ok: false,

          message:
            "Booking session expired. Please enter your details again.",
        },
        404,
      );
    }

    if (
      lead.source !==
      LeadSource.WEBSITE_BOOKING
    ) {
      return noStoreJson(
        {
          ok: false,

          message:
            "Invalid booking session.",
        },
        400,
      );
    }

    /* =====================================================
       NORMALIZE SLOT
    ===================================================== */

    const normalizedStartsAt =
      DateTime.fromISO(
        selectedSlot.startsAt,
        {
          zone: "utc",
        },
      );

    const normalizedEndsAt =
      DateTime.fromISO(
        selectedSlot.endsAt,
        {
          zone: "utc",
        },
      );

    if (
      !normalizedStartsAt.isValid ||
      !normalizedEndsAt.isValid
    ) {
      return noStoreJson(
        {
          ok: false,

          message:
            "Could not validate this time.",
        },
        500,
      );
    }

    const activeSlotKey =
      normalizedStartsAt.toISO({
        suppressMilliseconds:
          true,
      });

    if (!activeSlotKey) {
      return noStoreJson(
        {
          ok: false,

          message:
            "Could not prepare this booking.",
        },
        500,
      );
    }

    /* =====================================================
       MANAGEMENT TOKEN

       The random capability is hashed here. Recovery emails use the existing derived management token.

       It is used to build the secure Manage booking URL
       included in the branded confirmation email.

       It is NOT returned in the public API response.

       The database stores only its SHA-256 hash.
    ===================================================== */
    const {
      tokenHash:
        manageTokenHash,
    } =
      createBookingToken();

    /* =====================================================
       PHASE 1 — RESERVE SLOT

       Booking starts as PENDING.

       This immediately blocks the time while
       Google Calendar creation is happening.
    ===================================================== */

    try {
      const reservation =
        await db.$transaction(
          async (tx) => {
            const currentAttempt = await ownedAttempt(tx, attemptId, capability, leadId);
            if (currentAttempt.bookingId) {
              const currentBooking = await tx.booking.findUnique({ where: { id: currentAttempt.bookingId } });
              if (currentBooking && currentBooking.status !== BookingStatus.CANCELLED) {
                throw new SecurityError(409, "This booking is already completed or processing. Please try again shortly.");
              }
            }
            await lockReservations(tx);
            await requireFreeSlot(tx, normalizedStartsAt.toJSDate(), normalizedEndsAt.toJSDate());
            const bookingId = randomUUID();
            const booking =
              await tx.booking.create({
                data: {
                  id: bookingId,
                  externalCalendarEventId: stableCalendarId(bookingId),
                  calendarOperation: "CREATE", calendarOperationKey: randomUUID(),
                  leadId:
                    lead.id,

                  startsAt:
                    normalizedStartsAt.toJSDate(),

                  endsAt:
                    normalizedEndsAt.toJSDate(),

                  timezone:
                    bookingConfig.timezone,

                  status:
                    BookingStatus.PENDING,

                  activeSlotKey,

                  cancelTokenHash:
                    manageTokenHash,
                },

                select: {
                  id: true,
                },
              });

            await tx.bookingAttempt.update({ where: { id: attemptId }, data: { bookingId: booking.id, confirmationEmailSent: false } });
            return {
              conflict:
                false as const,

              booking,
            };
          },
        );

      reservedBookingId =
        reservation.booking.id;


    } catch (error) {
      /*
       * activeSlotKey is unique.
       *
       * Even if two requests pass the overlap
       * query at the same time, PostgreSQL is
       * the final concurrency guard.
       */
      if (
        hasErrorCode(
          error,
          "P2002",
        )
      ) {
        return noStoreJson(
          {
            ok: false,

            message:
              "This time was just booked. Please choose another slot.",
          },
          409,
        );
      }

      throw error;
    }

    if (!await recoverCalendarOperation(reservedBookingId!)) {
      throw new SecurityError(503, "Your booking is being reconciled with the calendar. Retry this request shortly.");
    }
    const finalized = await db.booking.findUniqueOrThrow({ where: { id: reservedBookingId! } });
    const confirmationEmailSent = await deliverBookingNotification(finalized.id, request.nextUrl.origin);
    return noStoreJson({ ok: true, booking: {
      id: finalized.id, startsAt: finalized.startsAt.toISOString(), endsAt: finalized.endsAt.toISOString(),
      timezone: finalized.timezone, status: finalized.status,
    }, confirmationEmailSent }, 201);
  } catch (error) {
    if (error instanceof SecurityError) return securityResponse(error, "booking_confirm");
    logSecurityFailure("Booking confirmation API error:", error);
    // Ambiguous provider/DB outcomes retain PENDING ownership and its reserved slot for recovery.
    return noStoreJson({ ok: false, message: "Booking is temporarily unavailable. Please retry shortly." }, 503);
  }
}
