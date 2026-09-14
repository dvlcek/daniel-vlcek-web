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
  sendBookingCancellationEmail,
} from "@/lib/email/booking-cancellation";

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
   CRM
========================================================= */

function getLeadStatusAfterCancellation(
  currentStatus:
    LeadStatus,
): LeadStatus {
  /*
   * Never downgrade a lead that has already moved deeper
   * into the sales pipeline.
   */
  if (
    currentStatus ===
      LeadStatus.QUALIFIED ||
    currentStatus ===
      LeadStatus.WON ||
    currentStatus ===
      LeadStatus.LOST ||
    currentStatus ===
      LeadStatus.ARCHIVED
  ) {
    return currentStatus;
  }

  return LeadStatus.BOOKING_STARTED;
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

    let body:
      unknown;

    try {
      body =
        await request.json();
    } catch {
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

    if (
      booking.status ===
      BookingStatus.CANCELLED
    ) {
      return noStoreJson({
        ok:
          true,

        alreadyCancelled:
          true,

        cancellationEmailSent:
          false,

        booking: {
          id:
            booking.id,

          status:
            BookingStatus.CANCELLED,
        },
      });
    }

    /* =====================================================
       VALID STATE
    ===================================================== */

    if (
      booking.status !==
        BookingStatus.CONFIRMED &&
      booking.status !==
        BookingStatus.PENDING
    ) {
      return noStoreJson(
        {
          ok:
            false,

          message:
            "This booking can no longer be cancelled.",
        },
        409,
      );
    }

    const shouldSendCancellationEmail =
      booking.status ===
      BookingStatus.CONFIRMED;

    /* =====================================================
       GOOGLE CALENDAR

       If an external event exists, cancellation must also
       succeed in Google before the booking is released.

       We fail closed instead of silently leaving an active
       calendar event behind.
    ===================================================== */

    if (
      booking.externalCalendarEventId
    ) {
      const calendarProvider =
        getCalendarProvider();

      if (
        !calendarProvider
      ) {
        console.error(
          "Cannot cancel Google Calendar event because calendar provider is unavailable.",
          {
            bookingId:
              booking.id,

            externalCalendarEventId:
              booking.externalCalendarEventId,
          },
        );

        return noStoreJson(
          {
            ok:
              false,

            message:
              "The booking could not be cancelled right now. Please try again.",
          },
          503,
        );
      }

      try {
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

        return noStoreJson(
          {
            ok:
              false,

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

    const nextLeadStatus =
      getLeadStatusAfterCancellation(
        booking.lead.status,
      );

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
             * Release the booking slot.
             */
            activeSlotKey:
              null,

            /*
             * Reminder IDs are intentionally preserved.
             *
             * They describe historical email delivery and
             * are useful for the admin audit trail.
             *
             * The worker itself only processes CONFIRMED
             * bookings, so a cancelled booking can never
             * receive another reminder.
             */
          },
        });

        if (
          booking.lead.status !==
          nextLeadStatus
        ) {
          await tx.lead.update({
            where: {
              id:
                booking.lead.id,
            },

            data: {
              status:
                nextLeadStatus,
            },
          });
        }
      },
    );

    /* =====================================================
       CANCELLATION EMAIL

       A valid cancellation must remain cancelled even if
       Resend is temporarily unavailable.

       Email delivery is communication, not transaction
       authority.
    ===================================================== */

    let cancellationEmailSent =
      false;

    if (
      shouldSendCancellationEmail
    ) {
      try {
        await sendBookingCancellationEmail({
          bookingId:
            booking.id,

          clientName:
            booking.lead.name,

          clientEmail:
            booking.lead.email,

          startsAt:
            booking.startsAt,

          endsAt:
            booking.endsAt,

          timezone:
            booking.timezone,
        });

        cancellationEmailSent =
          true;
      } catch (
        emailError
      ) {
        console.error(
          "Booking cancellation email failed:",
          {
            bookingId:
              booking.id,

            error:
              emailError,
          },
        );
      }
    }

    /* =====================================================
       SUCCESS
    ===================================================== */

    return noStoreJson({
      ok:
        true,

      alreadyCancelled:
        false,

      cancellationEmailSent,

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
        ok:
          false,

        message:
          "Could not cancel the booking. Please try again.",
      },
      500,
    );
  }
}