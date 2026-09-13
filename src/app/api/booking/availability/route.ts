import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getBookingAvailability,
} from "@/lib/booking/availability";

/* =========================================================
   ROUTE
========================================================= */

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

/* =========================================================
   HELPERS
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

function isDateKey(
  value: string,
): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(
    value,
  );
}

/* =========================================================
   GET /api/booking/availability
========================================================= */

export async function GET(
  request: NextRequest,
) {
  try {
    const params =
      request.nextUrl.searchParams;

    const from =
      params.get("from");

    const daysRaw =
      params.get("days");

    let days:
      | number
      | undefined;

    if (daysRaw) {
      const parsed =
        Number(daysRaw);

      if (
        !Number.isFinite(
          parsed,
        ) ||
        parsed < 1
      ) {
        return noStoreJson(
          {
            ok: false,
            message:
              "Invalid days parameter.",
          },
          400,
        );
      }

      days =
        Math.floor(parsed);
    }

    if (
      from &&
      !isDateKey(from)
    ) {
      return noStoreJson(
        {
          ok: false,
          message:
            "Invalid from date.",
        },
        400,
      );
    }

    const availability =
      await getBookingAvailability({
        fromDate:
          from ?? undefined,

        days,
      });

    return noStoreJson({
      ok: true,
      ...availability,
    });
  } catch (error) {
    console.error(
      "Booking availability API error:",
      error,
    );

    return noStoreJson(
      {
        ok: false,
        message:
          "Availability is temporarily unavailable.",
      },
      500,
    );
  }
}