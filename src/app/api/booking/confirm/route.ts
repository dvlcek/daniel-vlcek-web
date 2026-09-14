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
  LeadStatus,
} from "@/generated/prisma/enums";

import {
  getBookingAvailability,
} from "@/lib/booking/availability";

import {
  getCalendarProvider,
} from "@/lib/booking/calendar";

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
  sendBookingConfirmationEmail,
} from "@/lib/email/booking-confirmation";

import {
  buildBookingManageUrl,
} from "@/lib/booking/manage-url";

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

  if (lead.company) {
    lines.push(
      `Company: ${lead.company}`,
    );
  }

  if (lead.website) {
    lines.push(
      `Website: ${lead.website}`,
    );
  }

  if (lead.message) {
    lines.push(
      "",
      "Context:",
      lead.message,
    );
  }

  return lines.join("\n");
}

/* =========================================================
   POST /api/booking/confirm
========================================================= */

export async function POST(
  request: NextRequest,
) {
  const db =
    getDb();

  let reservedBookingId:
    | string
    | null = null;

  let reservedLeadId:
    | string
    | null = null;

  try {
    /* =====================================================
       REQUEST
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
    } = parsed.data;

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

       Raw token:
       - returned to current browser session
       - later can also be included in branded email links

       Database stores only its SHA-256 hash.
    ===================================================== */

    const {
      token:
        manageToken,

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
            const conflict =
              await tx.booking.findFirst({
                where: {
                  status: {
                    in: [
                      BookingStatus.PENDING,
                      BookingStatus.CONFIRMED,
                    ],
                  },

                  startsAt: {
                    lt:
                      normalizedEndsAt.toJSDate(),
                  },

                  endsAt: {
                    gt:
                      normalizedStartsAt.toJSDate(),
                  },
                },

                select: {
                  id: true,
                },
              });

            if (conflict) {
              return {
                conflict:
                  true as const,
              };
            }

            const booking =
              await tx.booking.create({
                data: {
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

            return {
              conflict:
                false as const,

              booking,
            };
          },
        );

      if (
        reservation.conflict
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

      reservedBookingId =
        reservation.booking.id;

      reservedLeadId =
        lead.id;
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

    /* =====================================================
       PHASE 2 — GOOGLE CALENDAR

       IMPORTANT:

       Client is intentionally NOT added as
       a Google Calendar attendee.

       Google only provides:
       - Daniel's internal event
       - Google Meet
       - busy availability

       Resend owns client communication.
    ===================================================== */

    const calendarProvider =
      getCalendarProvider();

    if (!calendarProvider) {
      throw new Error(
        "Calendar provider is not configured.",
      );
    }

    let calendarEvent:
      Awaited<
        ReturnType<
          typeof calendarProvider.createEvent
        >
      >;

    try {
      calendarEvent =
        await calendarProvider.createEvent({
          title:
            `Discovery Call — ${lead.name} × Daniel VLKO`,

          description:
            buildCalendarDescription(
              lead,
            ),

          startsAt:
            normalizedStartsAt.toJSDate(),

          endsAt:
            normalizedEndsAt.toJSDate(),

          timezone:
            bookingConfig.timezone,

          /*
           * NO attendees.
           *
           * We do not want Google to send
           * customer-facing invitation emails.
           */
        });
    } catch (error) {
      /* ===================================================
         GOOGLE FAILED → RELEASE RESERVATION
      =================================================== */

      try {
        await db.$transaction(
          async (tx) => {
            if (
              reservedBookingId
            ) {
              await tx.booking.update({
                where: {
                  id:
                    reservedBookingId,
                },

                data: {
                  status:
                    BookingStatus.CANCELLED,

                  activeSlotKey:
                    null,
                },
              });
            }

            if (
              reservedLeadId
            ) {
              await tx.lead.update({
                where: {
                  id:
                    reservedLeadId,
                },

                data: {
                  status:
                    LeadStatus.BOOKING_STARTED,
                },
              });
            }
          },
        );
      } catch (
        cleanupError
      ) {
        console.error(
          "CRITICAL: Google failure reservation cleanup failed:",
          cleanupError,
        );
      }

      console.error(
        "Google Calendar event creation failed:",
        error,
      );

      return noStoreJson(
        {
          ok: false,

          message:
            "Your time could not be added to the calendar. Please try again.",
        },
        503,
      );
    }

    /* =====================================================
       PHASE 3 — FINALIZE DATABASE

       Google event now exists.

       Persist:
       - CONFIRMED
       - event ID
       - Calendar URL
       - Meet URL
       - Lead BOOKED
    ===================================================== */

    try {
      const finalized =
        await db.$transaction(
          async (tx) => {
            const booking =
              await tx.booking.update({
                where: {
                  id:
                    reservedBookingId!,
                },

                data: {
                  status:
                    BookingStatus.CONFIRMED,

                  externalCalendarEventId:
                    calendarEvent
                      .externalEventId,

                  externalCalendarUrl:
                    calendarEvent
                      .htmlUrl ??
                    null,

                  meetingUrl:
                    calendarEvent
                      .meetingUrl ??
                    null,
                },

                select: {
                  id: true,

                  startsAt: true,
                  endsAt: true,

                  timezone: true,

                  status: true,

                  externalCalendarEventId:
                    true,

                  externalCalendarUrl:
                    true,

                  meetingUrl:
                    true,
                },
              });

            await tx.lead.update({
              where: {
                id:
                  lead.id,
              },

              data: {
                status:
                  LeadStatus.BOOKED,
              },
            });

            return booking;
          },
        );

      /* ===================================================
         GOOGLE MEET CHECK

         Meet is intentionally not exposed in the initial
         customer email.

         We still create/store it now so the reminder
         worker can safely send it 30 minutes before.
      =================================================== */

      if (
        !finalized.meetingUrl
      ) {
        console.error(
          "Booking confirmed but Google Calendar did not return a Meet URL.",
          {
            bookingId:
              finalized.id,

            externalCalendarEventId:
              finalized.externalCalendarEventId,
          },
        );
      }

      /* ===================================================
         PHASE 4 — BRANDED CONFIRMATION EMAIL

         Email failure MUST NOT destroy a valid booking.

         At this point:
         ✓ slot reserved
         ✓ DB confirmed
         ✓ Google Calendar event exists

         Resend is customer communication only.
      =================================================== */

      let confirmationEmailSent =
        false;

      try {
        const manageUrl =
          buildBookingManageUrl({
            origin:
              request.nextUrl.origin,

            bookingId:
              finalized.id,

            token:
              manageToken,
          });

        await sendBookingConfirmationEmail({
          bookingId:
            finalized.id,

          clientName:
            lead.name,

          clientEmail:
            lead.email,

          startsAt:
            finalized.startsAt,

          endsAt:
            finalized.endsAt,

          timezone:
            finalized.timezone,

          manageUrl,

          mode:
            "confirmed",
        });

        confirmationEmailSent =
          true;
      } catch (
        emailError
      ) {
        console.error(
          "Booking confirmation email failed:",
          emailError,
        );
      }

      /* ===================================================
         SUCCESS

         manageToken is intentionally returned to this
         browser session so our custom success state can:

         - Cancel booking
         - Reschedule booking

         Database never exposes the token hash.
      =================================================== */

      return noStoreJson(
        {
          ok: true,

          booking: {
            id:
              finalized.id,

            startsAt:
              finalized.startsAt.toISOString(),

            endsAt:
              finalized.endsAt.toISOString(),

            timezone:
              finalized.timezone,

            status:
              finalized.status,

            /*
             * Meeting URL is intentionally NOT
             * returned to the booking UI.
             *
             * The visitor receives it later via
             * the 30-minute reminder.
             */
          },

          manageToken,

          confirmationEmailSent,
        },
        201,
      );
    } catch (error) {
      /* ===================================================
         GOOGLE EXISTS BUT DB FINALIZATION FAILED

         Compensating rollback:

         1. delete Google Calendar event
         2. cancel DB reservation
         3. release activeSlotKey
         4. restore lead state
      =================================================== */

      try {
        await calendarProvider.cancelEvent(
          calendarEvent
            .externalEventId,
        );
      } catch (
        calendarCleanupError
      ) {
        console.error(
          "CRITICAL: Could not remove orphaned Google Calendar event:",
          calendarCleanupError,
        );
      }

      try {
        await db.$transaction(
          async (tx) => {
            if (
              reservedBookingId
            ) {
              await tx.booking.update({
                where: {
                  id:
                    reservedBookingId,
                },

                data: {
                  status:
                    BookingStatus.CANCELLED,

                  activeSlotKey:
                    null,
                },
              });
            }

            if (
              reservedLeadId
            ) {
              await tx.lead.update({
                where: {
                  id:
                    reservedLeadId,
                },

                data: {
                  status:
                    LeadStatus.BOOKING_STARTED,
                },
              });
            }
          },
        );
      } catch (
        cleanupError
      ) {
        console.error(
          "CRITICAL: Could not release failed booking reservation:",
          cleanupError,
        );
      }

      throw error;
    }
  } catch (error) {
    console.error(
      "Booking confirmation API error:",
      error,
    );

    /* =====================================================
       FINAL SAFETY CLEANUP

       An unexpected failure may happen after the slot
       was reserved but before normal rollback ran.

       Only PENDING bookings are released here.

       CONFIRMED bookings are never silently destroyed.
    ===================================================== */

    if (
      reservedBookingId
    ) {
      try {
        await db.booking.updateMany({
          where: {
            id:
              reservedBookingId,

            status:
              BookingStatus.PENDING,
          },

          data: {
            status:
              BookingStatus.CANCELLED,

            activeSlotKey:
              null,
          },
        });
      } catch (
        cleanupError
      ) {
        console.error(
          "Booking reservation cleanup failed:",
          cleanupError,
        );
      }
    }

    return noStoreJson(
      {
        ok: false,

        message:
          "Booking is temporarily unavailable. Please try again.",
      },
      500,
    );
  }
}