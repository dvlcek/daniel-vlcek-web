import { logSecurityFailure } from "@/lib/security/log";
import { SecurityError, readJson, requireSameOrigin, securityResponse } from "@/lib/security/http";
import { limitRequest } from "@/lib/security/rate-limit";
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
          .min(1)
          .max(256),

      token:
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
   POST /api/booking/manage
========================================================= */

export async function POST(
  request: NextRequest,
) {
  try {
    requireSameOrigin(request);
    await limitRequest(request, "manage");
    const db = getDb();
    let body: unknown;

    try {
      body =
        await readJson(request);
    } catch (error) {
      if (error instanceof SecurityError) return securityResponse(error, "booking_request");
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
        403,
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
    if (error instanceof SecurityError) return securityResponse(error, "booking_request");
    logSecurityFailure("Booking manage API error:", error);

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