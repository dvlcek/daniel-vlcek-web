import { z } from "zod";

import {
  bookingConfig,
} from "@/lib/booking/config";

/* =========================================================
   LIMITS
========================================================= */

export const BOOKING_INTAKE_MAX_BODY_BYTES =
  16_000;

/* =========================================================
   SCHEMA
========================================================= */

const bookingIntakeSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Please enter your name.",
      )
      .max(
        120,
        "Name is too long.",
      ),

    email: z
      .string()
      .trim()
      .max(
        160,
        "Email address is too long.",
      )
      .email(
        "Please enter a valid email address.",
      ),

    company: z
      .string()
      .trim()
      .max(
        160,
        "Company name is too long.",
      )
      .optional()
      .default(""),

    website: z
      .string()
      .trim()
      .max(
        250,
        "Website URL is too long.",
      )
      .optional()
      .default(""),

    phone: z
      .string()
      .trim()
      .max(
        50,
        "Phone number is too long.",
      )
      .optional()
      .default(""),

    message: z
      .string()
      .trim()
      .max(
        2_000,
        "Message is too long.",
      )
      .optional()
      .default(""),

    timezone: z
      .string()
      .trim()
      .max(
        100,
        "Timezone is too long.",
      )
      .optional()
      .default(""),

    /*
     * Honeypot.
     *
     * Real users never see or fill this.
     * We will connect it to a hidden
     * field in the booking UI later.
     */
    companyWebsite: z
      .string()
      .trim()
      .max(500)
      .optional()
      .default(""),
  })
  .strict();

/* =========================================================
   TYPES
========================================================= */

export type BookingIntakeInput = {
  name: string;
  email: string;

  company?: string;
  website?: string;
  phone?: string;
  message?: string;

  timezone: string;

  isBot: boolean;
};

/* =========================================================
   HELPERS
========================================================= */

function emptyToUndefined(
  value: string,
): string | undefined {
  const normalized =
    value.trim();

  return normalized.length > 0
    ? normalized
    : undefined;
}

function normalizeWebsite(
  value: string,
): string | undefined {
  const raw =
    value.trim();

  if (!raw) {
    return undefined;
  }

  try {
    const url =
      new URL(
        /^https?:\/\//i.test(raw)
          ? raw
          : `https://${raw}`,
      );

    if (
      url.protocol !== "http:" &&
      url.protocol !== "https:"
    ) {
      return undefined;
    }

    /*
     * Remove trailing slash for cleaner
     * CRM data where possible.
     */
    const normalized =
      url.toString();

    return normalized.endsWith("/")
      ? normalized.slice(0, -1)
      : normalized;
  } catch {
    return undefined;
  }
}

function isValidTimezone(
  timezone: string,
): boolean {
  try {
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone: timezone,
      },
    ).format();

    return true;
  } catch {
    return false;
  }
}

/* =========================================================
   PARSER
========================================================= */

export function parseBookingIntake(
  input: unknown,
):
  | {
      success: true;
      data: BookingIntakeInput;
    }
  | {
      success: false;
      message: string;
    } {
  const parsed =
    bookingIntakeSchema.safeParse(
      input,
    );

  if (!parsed.success) {
    const firstIssue =
      parsed.error.issues[0];

    return {
      success: false,
      message:
        firstIssue?.message ??
        "Invalid booking information.",
    };
  }

  const {
    name,
    email,
    company,
    website,
    phone,
    message,
    timezone,
    companyWebsite,
  } = parsed.data;

  const normalizedWebsite =
    normalizeWebsite(website);

  if (
    website &&
    !normalizedWebsite
  ) {
    return {
      success: false,
      message:
        "Please enter a valid website address.",
    };
  }

  const resolvedTimezone =
    timezone ||
    bookingConfig.timezone;

  if (
    !isValidTimezone(
      resolvedTimezone,
    )
  ) {
    return {
      success: false,
      message:
        "Please select a valid timezone.",
    };
  }

  return {
    success: true,

    data: {
      name,

      email:
        email
          .trim()
          .toLowerCase(),

      company:
        emptyToUndefined(
          company,
        ),

      website:
        normalizedWebsite,

      phone:
        emptyToUndefined(
          phone,
        ),

      message:
        emptyToUndefined(
          message,
        ),

      timezone:
        resolvedTimezone,

      isBot:
        companyWebsite.length >
        0,
    },
  };
}