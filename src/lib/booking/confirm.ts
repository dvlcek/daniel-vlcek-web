import { DateTime } from "luxon";
import { z } from "zod";

import { bookingConfig } from "@/lib/booking/config";

/* =========================================================
   SCHEMA
========================================================= */

const bookingConfirmSchema = z
  .object({
    leadId: z
      .string()
      .trim()
      .min(1, "Missing lead.")
      .max(100, "Invalid lead."),

    startsAt: z
      .string()
      .trim()
      .min(1, "Please select a time."),
  })
  .strict();

/* =========================================================
   TYPES
========================================================= */

export type BookingConfirmInput = {
  leadId: string;
  startsAt: string;
};

/* =========================================================
   PARSER
========================================================= */

export function parseBookingConfirmation(
  input: unknown,
):
  | {
      success: true;
      data: BookingConfirmInput;
    }
  | {
      success: false;
      message: string;
    } {
  const parsed =
    bookingConfirmSchema.safeParse(
      input,
    );

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.issues[0]
          ?.message ??
        "Invalid booking request.",
    };
  }

  const startsAt =
    DateTime.fromISO(
      parsed.data.startsAt,
      {
        setZone: true,
      },
    );

  if (!startsAt.isValid) {
    return {
      success: false,
      message:
        "Please select a valid time.",
    };
  }

  const utcStartsAt =
    startsAt.toUTC();

  if (
    utcStartsAt.toMillis() <=
    DateTime.utc().toMillis()
  ) {
    return {
      success: false,
      message:
        "This time is no longer available.",
    };
  }

  const maximumDate =
    DateTime.now()
      .setZone(
        bookingConfig.timezone,
      )
      .plus({
        days:
          bookingConfig
            .bookingHorizonDays +
          1,
      });

  if (
    utcStartsAt.toMillis() >
    maximumDate
      .toUTC()
      .toMillis()
  ) {
    return {
      success: false,
      message:
        "This time is outside the booking window.",
    };
  }

  const normalizedStartsAt =
    utcStartsAt.toISO({
      suppressMilliseconds: true,
    });

  if (!normalizedStartsAt) {
    return {
      success: false,
      message:
        "Could not normalize booking time.",
    };
  }

  return {
    success: true,

    data: {
      leadId:
        parsed.data.leadId,

      startsAt:
        normalizedStartsAt,
    },
  };
}