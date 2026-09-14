import {
  DateTime,
} from "luxon";

import {
  BookingStatus,
} from "@/generated/prisma/enums";

import {
  getDb,
} from "@/lib/db";

import {
  buildBookingManageUrl,
} from "@/lib/booking/manage-url";

import {
  createBookingManageToken,
} from "@/lib/booking/tokens";

import {
  sendBooking24hReminderEmail,
  sendBooking30mReminderEmail,
} from "@/lib/email/booking-reminders";

/* =========================================================
   POLICY
========================================================= */

/*
 * Send the optional 24h reminder only when the current
 * schedule was established at least 48 hours before the call.
 */
const MINIMUM_ADVANCE_FOR_24H_REMINDER_HOURS =
  48;

/*
 * A "tomorrow" reminder stops being useful if the worker
 * missed its intended window by too much.
 *
 * Target:
 * 24 hours before
 *
 * Latest acceptable:
 * 20 hours before
 */
const REMINDER_24H_LATE_TOLERANCE_HOURS =
  4;

/*
 * Critical reminder containing the Google Meet URL.
 *
 * Once due, keep attempting delivery until the meeting starts.
 */
const REMINDER_30M_MINUTES =
  30;

/* =========================================================
   RESULT
========================================================= */

export type BookingReminderRunResult = {
  checked: number;

  reminder24h: {
    sent: number;

    skippedTooRecent: number;
    skippedLate: number;
  };

  reminder30m: {
    sent: number;

    missingMeetingUrl: number;
  };

  errors: Array<{
    bookingId: string;

    type:
      | "24h"
      | "30m";

    message: string;
  }>;
};

/* =========================================================
   HELPERS
========================================================= */

function getErrorMessage(
  error: unknown,
): string {
  return error instanceof Error
    ? error.message
    : "Unknown reminder error.";
}

/* =========================================================
   ENGINE
========================================================= */

export async function processBookingReminders(
  nowInput =
    new Date(),

  origin =
    process.env.SITE_URL ??
    "http://localhost:3000",
): Promise<BookingReminderRunResult> {
  const db =
    getDb();

  const now =
    DateTime.fromJSDate(
      nowInput,
      {
        zone:
          "utc",
      },
    );

  if (!now.isValid) {
    throw new Error(
      "Invalid reminder engine time.",
    );
  }

  /*
   * Nothing further than 24h away can have either reminder
   * due yet.
   */
  const searchUntil =
    now.plus({
      hours:
        24,
    });

  const bookings =
    await db.booking.findMany({
      where: {
        status:
          BookingStatus.CONFIRMED,

        startsAt: {
          gt:
            now.toJSDate(),

          lte:
            searchUntil.toJSDate(),
        },
      },

      select: {
        id: true,

        startsAt: true,
        endsAt: true,

        timezone: true,

        scheduleChangedAt:
          true,

        meetingUrl:
          true,

        cancelTokenHash:
          true,

        reminder24hEmailId:
          true,

        reminder30mEmailId:
          true,

        lead: {
          select: {
            name: true,
            email: true,
          },
        },
      },

      orderBy: {
        startsAt:
          "asc",
      },
    });

  const result:
    BookingReminderRunResult =
    {
      checked:
        bookings.length,

      reminder24h: {
        sent:
          0,

        skippedTooRecent:
          0,

        skippedLate:
          0,
      },

      reminder30m: {
        sent:
          0,

        missingMeetingUrl:
          0,
      },

      errors: [],
    };

  for (
    const booking of
    bookings
  ) {
    const start =
      DateTime.fromJSDate(
        booking.startsAt,
        {
          zone:
            "utc",
        },
      );

    if (!start.isValid) {
      continue;
    }

    /* =====================================================
       MANAGEMENT ACCESS
    ===================================================== */

    if (
      !booking.cancelTokenHash
    ) {
      console.error(
        "Reminder worker skipped booking because cancelTokenHash is missing.",
        {
          bookingId:
            booking.id,
        },
      );

      continue;
    }

    let manageUrl:
      string;

    try {
      const manageToken =
        createBookingManageToken({
          bookingId:
            booking.id,

          tokenHash:
            booking.cancelTokenHash,
        });

      manageUrl =
        buildBookingManageUrl({
          origin,

          bookingId:
            booking.id,

          token:
            manageToken,
        });
    } catch (error) {
      console.error(
        "Could not create booking management URL for reminder.",
        {
          bookingId:
            booking.id,

          error,
        },
      );

      result.errors.push({
        bookingId:
          booking.id,

        type:
          "30m",

        message:
          getErrorMessage(
            error,
          ),
      });

      continue;
    }

    /* =====================================================
       24 HOUR REMINDER
    ===================================================== */

    if (
      !booking.reminder24hEmailId
    ) {
      const reminderAt =
        start.minus({
          hours:
            24,
        });

      const reminderLatest =
        reminderAt.plus({
          hours:
            REMINDER_24H_LATE_TOLERANCE_HOURS,
        });

      const scheduleChangedAt =
        DateTime.fromJSDate(
          booking.scheduleChangedAt,
          {
            zone:
              "utc",
          },
        );

      const eligibilityCutoff =
        start.minus({
          hours:
            MINIMUM_ADVANCE_FOR_24H_REMINDER_HOURS,
        });

      const enoughAdvance =
        scheduleChangedAt.isValid &&
        scheduleChangedAt.toMillis() <=
          eligibilityCutoff.toMillis();

      const due =
        now.toMillis() >=
        reminderAt.toMillis();

      const stillUseful =
        now.toMillis() <
        reminderLatest.toMillis();

      if (due) {
        if (
          !enoughAdvance
        ) {
          result.reminder24h
            .skippedTooRecent +=
            1;
        } else if (
          !stillUseful
        ) {
          result.reminder24h
            .skippedLate +=
            1;
        } else {
          try {
            const emailId =
              await sendBooking24hReminderEmail(
                {
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

                  manageUrl,
                },
              );

            /*
             * Only record delivery if this is still the
             * exact same booking occurrence.
             */
            const update =
              await db.booking.updateMany({
                where: {
                  id:
                    booking.id,

                  status:
                    BookingStatus.CONFIRMED,

                  startsAt:
                    booking.startsAt,

                  reminder24hEmailId:
                    null,
                },

                data: {
                  reminder24hEmailId:
                    emailId,
                },
              });

            if (
              update.count >
              0
            ) {
              result.reminder24h
                .sent +=
                1;
            }
          } catch (error) {
            console.error(
              "24h booking reminder failed.",
              {
                bookingId:
                  booking.id,

                error,
              },
            );

            result.errors.push({
              bookingId:
                booking.id,

              type:
                "24h",

              message:
                getErrorMessage(
                  error,
                ),
            });
          }
        }
      }
    }

    /* =====================================================
       30 MINUTE REMINDER
    ===================================================== */

    if (
      !booking.reminder30mEmailId
    ) {
      const reminderAt =
        start.minus({
          minutes:
            REMINDER_30M_MINUTES,
        });

      const due =
        now.toMillis() >=
        reminderAt.toMillis();

      const meetingHasNotStarted =
        now.toMillis() <
        start.toMillis();

      if (
        due &&
        meetingHasNotStarted
      ) {
        if (
          !booking.meetingUrl
        ) {
          /*
           * Do not mark it as sent.
           *
           * A later worker run can retry if the Meet URL
           * is repaired before the call starts.
           */
          result.reminder30m
            .missingMeetingUrl +=
            1;

          console.error(
            "30m reminder cannot be sent because meetingUrl is missing.",
            {
              bookingId:
                booking.id,
            },
          );
        } else {
          try {
            const emailId =
              await sendBooking30mReminderEmail(
                {
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

                  meetingUrl:
                    booking.meetingUrl,

                  manageUrl,
                },
              );

            const update =
              await db.booking.updateMany({
                where: {
                  id:
                    booking.id,

                  status:
                    BookingStatus.CONFIRMED,

                  startsAt:
                    booking.startsAt,

                  reminder30mEmailId:
                    null,
                },

                data: {
                  reminder30mEmailId:
                    emailId,
                },
              });

            if (
              update.count >
              0
            ) {
              result.reminder30m
                .sent +=
                1;
            }
          } catch (error) {
            console.error(
              "30m booking reminder failed.",
              {
                bookingId:
                  booking.id,

                error,
              },
            );

            result.errors.push({
              bookingId:
                booking.id,

              type:
                "30m",

              message:
                getErrorMessage(
                  error,
                ),
            });
          }
        }
      }
    }
  }

  return result;
}