import {
  config,
} from "dotenv";

config({
  path:
    ".env.local",
});

import {
  BookingStatus,
} from "../src/generated/prisma/enums";

import {
  getDb,
} from "../src/lib/db";

import {
  buildBookingManageUrl,
} from "../src/lib/booking/manage-url";

import {
  createBookingManageToken,
} from "../src/lib/booking/tokens";

import {
  sendBooking24hReminderEmail,
  sendBooking30mReminderEmail,
} from "../src/lib/email/booking-reminders";

/* =========================================================
   HELPERS
========================================================= */

function requireEnv(
  name: string,
): string {
  const value =
    process.env[
      name
    ]?.trim();

  if (!value) {
    throw new Error(
      `${name} is required.`,
    );
  }

  return value;
}

/* =========================================================
   SAFETY
========================================================= */

const enabled =
  process.env
    .RUN_BOOKING_REMINDER_EMAIL_TEST ===
  "YES";

if (!enabled) {
  console.error(
    [
      "",
      "Reminder email test is disabled.",
      "",
      "Run explicitly with:",
      "",
      '$env:RUN_BOOKING_REMINDER_EMAIL_TEST="YES"',
      '$env:REMINDER_TEST_EMAIL="your@email.com"',
      "npx tsx .\\scripts\\test-booking-reminders.ts",
      "",
    ].join(
      "\n",
    ),
  );

  process.exit(
    1,
  );
}

/* =========================================================
   CONFIG
========================================================= */

const targetEmail =
  requireEnv(
    "REMINDER_TEST_EMAIL",
  );

const requestedBookingId =
  process.env
    .REMINDER_TEST_BOOKING_ID
    ?.trim();

const siteOrigin =
  process.env.SITE_URL
    ?.trim() ||
  "http://localhost:3000";

/* =========================================================
   MAIN
========================================================= */

async function main() {
  const db =
    getDb();

  console.log(
    "",
  );

  console.log(
    "Daniel VLKO — Booking Reminder Test",
  );

  console.log(
    "====================================",
  );

  console.log(
    `Recipient: ${targetEmail}`,
  );

  console.log(
    "",
  );

  /* =======================================================
     FIND BOOKING
  ======================================================= */

  const booking =
    requestedBookingId
      ? await db.booking.findUnique({
          where: {
            id:
              requestedBookingId,
          },

          include: {
            lead: {
              select: {
                name:
                  true,

                email:
                  true,
              },
            },
          },
        })
      : await db.booking.findFirst({
          where: {
            status:
              BookingStatus.CONFIRMED,

            meetingUrl: {
              not:
                null,
            },

            cancelTokenHash: {
              not:
                null,
            },
          },

          include: {
            lead: {
              select: {
                name:
                  true,

                email:
                  true,
              },
            },
          },

          orderBy: {
            startsAt:
              "desc",
          },
        });

  if (!booking) {
    throw new Error(
      requestedBookingId
        ? `Booking ${requestedBookingId} was not found.`
        : "No confirmed booking with a Google Meet URL was found.",
    );
  }

  if (
    booking.status !==
    BookingStatus.CONFIRMED
  ) {
    throw new Error(
      `Booking ${booking.id} is not CONFIRMED.`,
    );
  }

  if (!booking.meetingUrl) {
    throw new Error(
      `Booking ${booking.id} does not have a meetingUrl.`,
    );
  }

  if (!booking.cancelTokenHash) {
    throw new Error(
      `Booking ${booking.id} does not have cancelTokenHash.`,
    );
  }

  /* =======================================================
     MANAGEMENT URL
  ======================================================= */

  const manageToken =
    createBookingManageToken({
      bookingId:
        booking.id,

      tokenHash:
        booking.cancelTokenHash,
    });

  const manageUrl =
    buildBookingManageUrl({
      origin:
        siteOrigin,

      bookingId:
        booking.id,

      token:
        manageToken,
    });

  console.log(
    `Source booking: ${booking.id}`,
  );

  console.log(
    `Original client: ${booking.lead.email}`,
  );

  console.log(
    `Starts at: ${booking.startsAt.toISOString()}`,
  );

  console.log(
    "Meet URL available: YES",
  );

  console.log(
    "Manage booking URL available: YES",
  );

  console.log(
    "",
  );

  /*
   * Fake IDs are intentionally used for Resend
   * idempotency keys.
   *
   * This prevents this test from consuming the real
   * production reminder idempotency key.
   */
  const runId =
    `${Date.now()}-${Math.random()
      .toString(
        36,
      )
      .slice(
        2,
        10,
      )}`;

  /* =======================================================
     24H TEST
  ======================================================= */

  console.log(
    "Sending 24h reminder test...",
  );

  const reminder24hEmailId =
    await sendBooking24hReminderEmail({
      bookingId:
        `test-24h-${runId}`,

      clientName:
        booking.lead.name,

      clientEmail:
        targetEmail,

      startsAt:
        booking.startsAt,

      endsAt:
        booking.endsAt,

      timezone:
        booking.timezone,

      manageUrl,
    });

  console.log(
    "24h reminder: PASS",
  );

  console.log(
    `Resend ID: ${reminder24hEmailId}`,
  );

  console.log(
    "",
  );

  /* =======================================================
     30M TEST
  ======================================================= */

  console.log(
    "Sending 30m Meet reminder test...",
  );

  const reminder30mEmailId =
    await sendBooking30mReminderEmail({
      bookingId:
        `test-30m-${runId}`,

      clientName:
        booking.lead.name,

      clientEmail:
        targetEmail,

      startsAt:
        booking.startsAt,

      endsAt:
        booking.endsAt,

      timezone:
        booking.timezone,

      meetingUrl:
        booking.meetingUrl,

      manageUrl,
    });

  console.log(
    "30m reminder: PASS",
  );

  console.log(
    `Resend ID: ${reminder30mEmailId}`,
  );

  console.log(
    "",
  );

  console.log(
    "RESULT: PASS",
  );

  console.log(
    "",
  );

  console.log(
    "No reminder state was modified in the Booking record.",
  );

  console.log(
    "",
  );

  console.log(
    "Verify in your inbox:",
  );

  console.log(
    "1. 24h reminder design",
  );

  console.log(
    "2. 24h Manage booking button",
  );

  console.log(
    "3. 30m reminder design",
  );

  console.log(
    "4. Join Google Meet button",
  );

  console.log(
    "5. 30m Manage booking button",
  );

  console.log(
    "6. Reschedule and Cancel work through the Manage page",
  );

  console.log(
    "",
  );
}

main()
  .catch(
    (
      error,
    ) => {
      console.error(
        "",
      );

      console.error(
        "RESULT: FAILED",
      );

      console.error(
        error,
      );

      process.exitCode =
        1;
    },
  );