import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  z,
} from "zod";

import {
  BookingStatus,
  LeadStatus,
} from "@/generated/prisma/enums";

import {
  getCalendarProvider,
} from "@/lib/booking/calendar";

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
          .min(1),

      token:
        z
          .string()
          .trim()
          .min(1),
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
   POST /api/booking/cancel
========================================================= */

export async function POST(
  request: NextRequest,
) {
  const db =
    getDb();

  try {
    /* =====================================================
       PARSE REQUEST
    ===================================================== */

    let body: unknown;

    try {
      body =
        await request.json();
    } catch {
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
      cancelBookingSchema.safeParse(
        body,
      );

    if (!parsed.success) {
      return noStoreJson(
        {
          ok: false,

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
          ok: false,

          message:
            "This booking link is invalid or no longer available.",
        },
        404,
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

    if (!authorized) {
      return noStoreJson(
        {
          ok: false,

          message:
            "This booking link is invalid or no longer available.",
        },
        403,
      );
    }

    /* =====================================================
       ALREADY CANCELLED
    ===================================================== */

    if (
      booking.status ===
      BookingStatus.CANCELLED
    ) {
      return noStoreJson({
        ok: true,

        booking: {
          id:
            booking.id,

          status:
            BookingStatus.CANCELLED,
        },
      });
    }

    /* =====================================================
       VALID BOOKING STATE
    ===================================================== */

    if (
      booking.status !==
        BookingStatus.CONFIRMED &&
      booking.status !==
        BookingStatus.PENDING
    ) {
      return noStoreJson(
        {
          ok: false,

          message:
            "This booking can no longer be cancelled.",
        },
        409,
      );
    }

    /* =====================================================
       GOOGLE CALENDAR
    ===================================================== */

    const calendarProvider =
      getCalendarProvider();

    if (
      calendarProvider &&
      booking.externalCalendarEventId
    ) {
      try {
        /*
         * CalendarProvider.cancelEvent expects the external
         * event ID directly as a string.
         */
        await calendarProvider.cancelEvent(
          booking.externalCalendarEventId,
        );
      } catch (error) {
        console.error(
          "Google Calendar cancellation failed:",
          {
            bookingId:
              booking.id,

            externalCalendarEventId:
              booking.externalCalendarEventId,

            error,
          },
        );

        /*
         * Do not mark the booking cancelled in our DB if
         * the external calendar event could not be removed.
         *
         * This avoids silently diverging the two systems.
         */
        return noStoreJson(
          {
            ok: false,

            message:
              "The booking could not be cancelled right now. Please try again.",
          },
          503,
        );
      }
    }

    /* =====================================================
       DATABASE
    ===================================================== */

    await db.$transaction(
      async (
        tx,
      ) => {
        await tx.booking.update({
          where: {
            id:
              booking.id,
          },

          data: {
            status:
              BookingStatus.CANCELLED,

            /*
             * Release the slot so it can appear in
             * availability again.
             */
            activeSlotKey:
              null,

            /*
             * Cancelled bookings never receive reminders.
             */
            reminder24hEmailId:
              null,

            reminder30mEmailId:
              null,
          },
        });

        /*
         * The lead can book another discovery call later.
         */
        await tx.lead.update({
          where: {
            id:
              booking.lead.id,
          },

          data: {
            status:
              LeadStatus.BOOKING_STARTED,
          },
        });
      },
    );

    /* =====================================================
       SUCCESS
    ===================================================== */

    return noStoreJson({
      ok: true,

      booking: {
        id:
          booking.id,

        status:
          BookingStatus.CANCELLED,
      },
    });
  } catch (error) {
    console.error(
      "Booking cancellation API error:",
      error,
    );

    return noStoreJson(
      {
        ok: false,

        message:
          "Could not cancel the booking. Please try again.",
      },
      500,
    );
  }
}