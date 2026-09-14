import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  z,
} from "zod";

import {
  getDb,
} from "@/lib/db";

import {
  verifyBookingAccessToken,
} from "@/lib/booking/tokens";

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

const manageBookingSchema =
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
   POST /api/booking/manage
========================================================= */

export async function POST(
  request: NextRequest,
) {
  const db =
    getDb();

  try {
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
      manageBookingSchema.safeParse(
        body,
      );

    if (!parsed.success) {
      return noStoreJson(
        {
          ok: false,

          message:
            "Invalid booking management request.",
        },
        400,
      );
    }

    const {
      bookingId,
      token,
    } =
      parsed.data;

    const booking =
      await db.booking.findUnique({
        where: {
          id:
            bookingId,
        },

        select: {
          id: true,

          startsAt: true,
          endsAt: true,

          timezone: true,

          status: true,

          cancelTokenHash:
            true,
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

    return noStoreJson({
      ok: true,

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
    });
  } catch (error) {
    console.error(
      "Booking manage API error:",
      error,
    );

    return noStoreJson(
      {
        ok: false,

        message:
          "Could not load this booking.",
      },
      500,
    );
  }
}