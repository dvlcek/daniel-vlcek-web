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

// VLKO_BOOKING_PERF_V1: coalesce concurrent public reads only; no stored results.
const pendingAvailability = new Map<string, ReturnType<typeof getBookingAvailability>>();
const MAX_PENDING_KEYS = 32;

function loadAvailability(
  fromDate: string | undefined,
  days: number | undefined,
  fresh: boolean,
): ReturnType<typeof getBookingAvailability> {
  const input = { fromDate, days };
  if (fresh) return getBookingAvailability(input);
  const key = JSON.stringify([fromDate ?? null, days ?? 14]);
  const existing = pendingAvailability.get(key);
  if (existing) return existing;
  if (pendingAvailability.size >= MAX_PENDING_KEYS) return getBookingAvailability(input);
  const pending = getBookingAvailability(input).finally(() => {
    pendingAvailability.delete(key);
  });
  pendingAvailability.set(key, pending);
  return pending;
}

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

    const startedAt = performance.now();
    const availability = await loadAvailability(
      from ?? undefined,
      days,
      params.get("fresh") === "1",
    );

    const response = noStoreJson({ ok: true, ...availability });
    response.headers.set("Server-Timing", `availability;dur=${(performance.now() - startedAt).toFixed(1)}`);
    return response;
  } catch (error) {
    console.error(
      "Booking availability API error:",
      error instanceof Error ? error.message : "Unknown error",
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
