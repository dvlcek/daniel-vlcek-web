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
  bookingConfig,
} from "@/lib/booking/config";

import {
  parseBookingConfirmation,
} from "@/lib/booking/confirm";

import {
  createBookingToken,
} from "@/lib/booking/tokens";

import {
  getDb,
} from "@/lib/db";

/* =========================================================
   ROUTE
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
   PRISMA ERROR HELPERS
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
    (error as {
      code?: unknown;
    }).code === code
  );
}

/* =========================================================
   POST /api/booking/confirm
========================================================= */

export async function POST(
  request: NextRequest,
) {
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

    if (!candidateStart.isValid) {
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
       VERIFY AGAINST LIVE AVAILABILITY

       Never trust a slot sent by the browser.
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
       LEAD VALIDATION
    ===================================================== */

    const db =
      getDb();

    const lead =
      await db.lead.findUnique({
        where: {
          id:
            leadId,
        },

        select: {
          id: true,
          source: true,
          status: true,
          name: true,
          email: true,
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
       NORMALIZED SLOT
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

    /*
     * Unique guard against two people
     * clicking the same slot simultaneously.
     */
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
       CANCELLATION TOKEN

       Raw token will later be sent to the client
       by email.

       Only its hash is stored in the database.
    ===================================================== */

    const {
      token:
        cancelToken,
      tokenHash:
        cancelTokenHash,
    } =
      createBookingToken();

    /* =====================================================
       CREATE BOOKING
    ===================================================== */

    try {
      const result =
        await db.$transaction(
          async (tx) => {
            /*
             * Final overlap check.
             *
             * activeSlotKey is still the hard
             * concurrency guard.
             */
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
                    BookingStatus.CONFIRMED,

                  activeSlotKey,

                  cancelTokenHash,
                },

                select: {
                  id: true,
                  startsAt: true,
                  endsAt: true,
                  timezone: true,
                  status: true,
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

            return {
              conflict:
                false as const,

              booking,
            };
          },
        );

      if (result.conflict) {
        return noStoreJson(
          {
            ok: false,
            message:
              "This time was just booked. Please choose another slot.",
          },
          409,
        );
      }

      /*
       * Do not return token permanently
       * once email automation exists.
       *
       * For now we don't expose it at all.
       */
      void cancelToken;

      return noStoreJson(
        {
          ok: true,

          booking: {
            id:
              result.booking.id,

            startsAt:
              result.booking.startsAt.toISOString(),

            endsAt:
              result.booking.endsAt.toISOString(),

            timezone:
              result.booking.timezone,

            status:
              result.booking.status,
          },
        },
        201,
      );
    } catch (error) {
      /*
       * Unique activeSlotKey collision.
       *
       * Two requests tried to book
       * the same exact slot.
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
  } catch (error) {
    console.error(
      "Booking confirmation API error:",
      error,
    );

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