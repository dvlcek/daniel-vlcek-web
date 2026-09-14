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
  getCalendarProvider,
} from "@/lib/booking/calendar";

import {
  bookingConfig,
} from "@/lib/booking/config";

import {
  buildBookingManageUrl,
} from "@/lib/booking/manage-url";

import {
  validateRescheduleSlot,
} from "@/lib/booking/reschedule-availability";

import {
  verifyBookingAccessToken,
} from "@/lib/booking/tokens";

import {
  sendBookingConfirmationEmail,
} from "@/lib/email/booking-confirmation";

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
          .min(1),

      token:
        z
          .string()
          .trim()
          .min(1),

      startsAt:
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
   ERROR HELPERS
========================================================= */

function hasErrorCode(
  error: unknown,
  code: string,
): boolean {
  if (
    typeof error !==
      "object" ||
    error ===
      null ||
    !("code" in error)
  ) {
    return false;
  }

  return (
    (
      error as {
        code?: unknown;
      }
    ).code ===
    code
  );
}

/* =========================================================
   CALENDAR DESCRIPTION
========================================================= */

function buildCalendarDescription(
  lead: {
    name: string;
    email: string;

    company: string | null;
    website: string | null;
    message: string | null;
  },
): string {
  const lines = [
    "Discovery call booked via danielvlko.com",
    "",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
  ];

  if (
    lead.company
  ) {
    lines.push(
      `Company: ${lead.company}`,
    );
  }

  if (
    lead.website
  ) {
    lines.push(
      `Website: ${lead.website}`,
    );
  }

  if (
    lead.message
  ) {
    lines.push(
      "",
      "Biggest bottleneck / context:",
      lead.message,
    );
  }

  return lines.join(
    "\n",
  );
}

/* =========================================================
   POST /api/booking/reschedule
========================================================= */

export async function POST(
  request: NextRequest,
) {
  const db =
    getDb();

  try {
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
        404,
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
      console.error(
        "Confirmed booking is missing calendar event ID.",
        {
          bookingId:
            booking.id,
        },
      );

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

        confirmationEmailSent:
          false,
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

    /* =====================================================
       ORIGINAL STATE
    ===================================================== */

    const originalStartsAt =
      booking.startsAt;

    const originalEndsAt =
      booking.endsAt;

    const originalActiveSlotKey =
      booking.activeSlotKey;

    const originalCalendarUrl =
      booking.externalCalendarUrl;

    const originalMeetingUrl =
      booking.meetingUrl;

    /* =====================================================
       PHASE 1 — RESERVE NEW SLOT

       Recheck internal DB in a transaction.

       Buffers are included so another simultaneous website
       booking cannot claim an adjacent protected period
       between availability validation and reservation.
    ===================================================== */

    try {
      await db.$transaction(
        async (
          tx,
        ) => {
          const conflict =
            await tx.booking.findFirst({
              where: {
                id: {
                  not:
                    booking.id,
                },

                status: {
                  in: [
                    BookingStatus.PENDING,
                    BookingStatus.CONFIRMED,
                  ],
                },

                startsAt: {
                  lt:
                    newEnd
                      .plus({
                        minutes:
                          bookingConfig
                            .bufferBeforeMinutes,
                      })
                      .toJSDate(),
                },

                endsAt: {
                  gt:
                    newStart
                      .minus({
                        minutes:
                          bookingConfig
                            .bufferAfterMinutes,
                      })
                      .toJSDate(),
                },
              },

              select: {
                id:
                  true,
              },
            });

          if (
            conflict
          ) {
            throw Object.assign(
              new Error(
                "Slot conflict.",
              ),
              {
                code:
                  "SLOT_CONFLICT",
              },
            );
          }

          await tx.booking.update({
            where: {
              id:
                booking.id,
            },

            data: {
              startsAt:
                newStart.toJSDate(),

              endsAt:
                newEnd.toJSDate(),

              timezone:
                bookingConfig.timezone,

              activeSlotKey:
                newActiveSlotKey,

              status:
                BookingStatus.PENDING,
            },
          });
        },
      );
    } catch (error) {
      if (
        hasErrorCode(
          error,
          "P2002",
        ) ||
        hasErrorCode(
          error,
          "SLOT_CONFLICT",
        )
      ) {
        return noStoreJson(
          {
            ok:
              false,

            message:
              "This time was just booked. Please choose another slot.",
          },
          409,
        );
      }

      throw error;
    }

    /* =====================================================
       CALENDAR PROVIDER
    ===================================================== */

    const calendarProvider =
      getCalendarProvider();

    if (
      !calendarProvider
    ) {
      await db.booking.update({
        where: {
          id:
            booking.id,
        },

        data: {
          startsAt:
            originalStartsAt,

          endsAt:
            originalEndsAt,

          timezone:
            booking.timezone,

          activeSlotKey:
            originalActiveSlotKey,

          status:
            BookingStatus.CONFIRMED,
        },
      });

      throw new Error(
        "Calendar provider is not configured.",
      );
    }

    /* =====================================================
       PHASE 2 — UPDATE GOOGLE CALENDAR
    ===================================================== */

    let calendarUpdated =
      false;

    let updatedCalendarEvent:
      Awaited<
        ReturnType<
          typeof calendarProvider.updateEvent
        >
      >;

    try {
      updatedCalendarEvent =
        await calendarProvider.updateEvent({
          externalEventId:
            booking.externalCalendarEventId,

          title:
            `Discovery Call — ${booking.lead.name} × Daniel VLKO`,

          description:
            buildCalendarDescription(
              booking.lead,
            ),

          startsAt:
            newStart.toJSDate(),

          endsAt:
            newEnd.toJSDate(),

          timezone:
            bookingConfig.timezone,
        });

      calendarUpdated =
        true;
    } catch (error) {
      try {
        await db.booking.update({
          where: {
            id:
              booking.id,
          },

          data: {
            startsAt:
              originalStartsAt,

            endsAt:
              originalEndsAt,

            timezone:
              booking.timezone,

            activeSlotKey:
              originalActiveSlotKey,

            status:
              BookingStatus.CONFIRMED,

            externalCalendarUrl:
              originalCalendarUrl,

            meetingUrl:
              originalMeetingUrl,
          },
        });
      } catch (
        rollbackError
      ) {
        console.error(
          "CRITICAL: Could not restore booking after Google Calendar update failure:",
          rollbackError,
        );
      }

      console.error(
        "Google Calendar reschedule failed:",
        error,
      );

      return noStoreJson(
        {
          ok:
            false,

          message:
            "The calendar could not be updated. Your original booking is still active.",
        },
        503,
      );
    }

    /* =====================================================
       PHASE 3 — FINALIZE DATABASE
    ===================================================== */

    let updatedBooking:
      | {
          id:
            string;

          startsAt:
            Date;

          endsAt:
            Date;

          timezone:
            string;

          status:
            BookingStatus;
        }
      | null =
      null;

    try {
      updatedBooking =
        await db.booking.update({
          where: {
            id:
              booking.id,
          },

          data: {
            startsAt:
              newStart.toJSDate(),

            endsAt:
              newEnd.toJSDate(),

            timezone:
              bookingConfig.timezone,

            activeSlotKey:
              newActiveSlotKey,

            status:
              BookingStatus.CONFIRMED,

            externalCalendarUrl:
              updatedCalendarEvent.htmlUrl ??
              originalCalendarUrl,

            meetingUrl:
              updatedCalendarEvent.meetingUrl ??
              originalMeetingUrl,

            /*
             * New reminder lifecycle begins from this
             * schedule change.
             */
            scheduleChangedAt:
              new Date(),

            /*
             * Reminder state from the previous occurrence
             * must never carry over.
             */
            reminder24hEmailId:
              null,

            reminder30mEmailId:
              null,
          },

          select: {
            id:
              true,

            startsAt:
              true,

            endsAt:
              true,

            timezone:
              true,

            status:
              true,
          },
        });
    } catch (error) {
      /* ===================================================
         GOOGLE COMPENSATION
      =================================================== */

      if (
        calendarUpdated
      ) {
        try {
          await calendarProvider.updateEvent({
            externalEventId:
              booking.externalCalendarEventId,

            title:
              `Discovery Call — ${booking.lead.name} × Daniel VLKO`,

            description:
              buildCalendarDescription(
                booking.lead,
              ),

            startsAt:
              originalStartsAt,

            endsAt:
              originalEndsAt,

            timezone:
              booking.timezone,
          });
        } catch (
          calendarRollbackError
        ) {
          console.error(
            "CRITICAL: Could not restore original Google Calendar event:",
            calendarRollbackError,
          );
        }
      }

      /* ===================================================
         DATABASE COMPENSATION
      =================================================== */

      try {
        await db.booking.update({
          where: {
            id:
              booking.id,
          },

          data: {
            startsAt:
              originalStartsAt,

            endsAt:
              originalEndsAt,

            timezone:
              booking.timezone,

            activeSlotKey:
              originalActiveSlotKey,

            status:
              BookingStatus.CONFIRMED,

            externalCalendarUrl:
              originalCalendarUrl,

            meetingUrl:
              originalMeetingUrl,
          },
        });
      } catch (
        dbRollbackError
      ) {
        console.error(
          "CRITICAL: Could not restore original booking:",
          dbRollbackError,
        );
      }

      throw error;
    }

    /* =====================================================
       RESCHEDULE EMAIL
    ===================================================== */

    let confirmationEmailSent =
      false;

    try {
      const manageUrl =
        buildBookingManageUrl({
          origin:
            request.nextUrl.origin,

          bookingId:
            updatedBooking.id,

          token,
        });

      await sendBookingConfirmationEmail({
        bookingId:
          updatedBooking.id,

        clientName:
          booking.lead.name,

        clientEmail:
          booking.lead.email,

        startsAt:
          updatedBooking.startsAt,

        endsAt:
          updatedBooking.endsAt,

        timezone:
          updatedBooking.timezone,

        manageUrl,

        mode:
          "rescheduled",
      });

      confirmationEmailSent =
        true;
    } catch (
      emailError
    ) {
      console.error(
        "Reschedule confirmation email failed:",
        emailError,
      );
    }

    /* =====================================================
       SUCCESS
    ===================================================== */

    return noStoreJson({
      ok:
        true,

      booking: {
        id:
          updatedBooking.id,

        startsAt:
          updatedBooking.startsAt.toISOString(),

        endsAt:
          updatedBooking.endsAt.toISOString(),

        timezone:
          updatedBooking.timezone,

        status:
          updatedBooking.status,
      },

      confirmationEmailSent,
    });
  } catch (error) {
    console.error(
      "Booking reschedule API error:",
      error,
    );

    return noStoreJson(
      {
        ok:
          false,

        message:
          "Could not reschedule the booking. Please try again.",
      },
      500,
    );
  }
}