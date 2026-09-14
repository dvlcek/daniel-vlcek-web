import {
  timingSafeEqual,
} from "node:crypto";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  processBookingReminders,
} from "@/lib/booking/reminders";

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
   SECURITY
========================================================= */

function secureEqual(
  left: string,
  right: string,
): boolean {
  const leftBuffer =
    Buffer.from(
      left,
      "utf8",
    );

  const rightBuffer =
    Buffer.from(
      right,
      "utf8",
    );

  if (
    leftBuffer.length !==
    rightBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    leftBuffer,
    rightBuffer,
  );
}

/* =========================================================
   GET /api/cron/booking-reminders
========================================================= */

export async function GET(
  request: NextRequest,
) {
  const secret =
    process.env.CRON_SECRET
      ?.trim();

  if (!secret) {
    console.error(
      "CRON_SECRET is not configured.",
    );

    return noStoreJson(
      {
        ok: false,

        message:
          "Reminder worker is not configured.",
      },
      500,
    );
  }

  const authorization =
    request.headers.get(
      "authorization",
    );

  const expected =
    `Bearer ${secret}`;

  if (
    !authorization ||
    !secureEqual(
      authorization,
      expected,
    )
  ) {
    return noStoreJson(
      {
        ok: false,

        message:
          "Unauthorized.",
      },
      401,
    );
  }

  try {
    const startedAt =
      new Date();

    const result =
      await processBookingReminders(
        startedAt,
        request.nextUrl.origin,
      );

    return noStoreJson({
      ok: true,

      ranAt:
        startedAt.toISOString(),

      result,
    });
  } catch (error) {
    console.error(
      "Booking reminder worker failed:",
      error,
    );

    return noStoreJson(
      {
        ok: false,

        message:
          "Booking reminder worker failed.",
      },
      500,
    );
  }
}