export type BookingIcsMethod =
  | "REQUEST"
  | "CANCEL";

export type BookingIcsStatus =
  | "CONFIRMED"
  | "CANCELLED";

export type BookingIcsInput = {
  bookingId: string;

  clientEmail: string;

  startsAt: Date;
  endsAt: Date;

  organizerEmail: string;

  method?: BookingIcsMethod;

  status?: BookingIcsStatus;

  sequence?: number;

  summary?: string;

  description?: string;
};

/* =========================================================
   ESCAPING
========================================================= */

function escapeIcsText(
  value: string,
): string {
  return value
    .replace(
      /\\/g,
      "\\\\",
    )
    .replace(
      /\r?\n/g,
      "\\n",
    )
    .replace(
      /,/g,
      "\\,",
    )
    .replace(
      /;/g,
      "\\;",
    );
}

/* =========================================================
   DATE
========================================================= */

function formatUtcDate(
  date: Date,
): string {
  return date
    .toISOString()
    .replace(
      /[-:]/g,
      "",
    )
    .replace(
      /\.\d{3}Z$/,
      "Z",
    );
}

/* =========================================================
   LINE FOLDING
========================================================= */

function foldIcsLine(
  line: string,
): string {
  const maxLength =
    72;

  if (
    line.length <=
    maxLength
  ) {
    return line;
  }

  const parts:
    string[] =
    [];

  let remaining =
    line;

  while (
    remaining.length >
    maxLength
  ) {
    parts.push(
      remaining.slice(
        0,
        maxLength,
      ),
    );

    remaining =
      remaining.slice(
        maxLength,
      );
  }

  parts.push(
    remaining,
  );

  return parts.join(
    "\r\n ",
  );
}

/* =========================================================
   ICS
========================================================= */

export function createBookingIcs(
  input: BookingIcsInput,
): string {
  const now =
    new Date();

  const method =
    input.method ??
    "REQUEST";

  const status =
    input.status ??
    (
      method ===
      "CANCEL"
        ? "CANCELLED"
        : "CONFIRMED"
    );

  /*
   * RFC5545 SEQUENCE should increase whenever the same
   * UID is modified.
   *
   * Using current Unix seconds gives us a naturally
   * increasing integer across:
   *
   * initial confirmation
   * reschedule
   * cancellation
   */
  const sequence =
    input.sequence ??
    Math.floor(
      Date.now() /
        1000,
    );

  const uid =
    `booking-${input.bookingId}@danielvlko.com`;

  const summary =
    input.summary ??
    "Discovery Call — Daniel VLKO";

  const description =
    input.description ??
    (
      method ===
      "CANCEL"
        ? [
            "Daniel VLKO Discovery Call",
            "",
            "This discovery call has been cancelled.",
            "",
            "https://danielvlko.com",
          ].join(
            "\n",
          )
        : [
            "Daniel VLKO Discovery Call",
            "",
            "Your Google Meet link will be sent 30 minutes before the call.",
            "",
            "https://danielvlko.com",
          ].join(
            "\n",
          )
    );

  const lines = [
    "BEGIN:VCALENDAR",

    "VERSION:2.0",

    "PRODID:-//Daniel VLKO//Booking System//EN",

    "CALSCALE:GREGORIAN",

    `METHOD:${method}`,

    "BEGIN:VEVENT",

    `UID:${uid}`,

    `DTSTAMP:${formatUtcDate(
      now,
    )}`,

    `DTSTART:${formatUtcDate(
      input.startsAt,
    )}`,

    `DTEND:${formatUtcDate(
      input.endsAt,
    )}`,

    `SEQUENCE:${sequence}`,

    `SUMMARY:${escapeIcsText(
      summary,
    )}`,

    `DESCRIPTION:${escapeIcsText(
      description,
    )}`,

    `LOCATION:${escapeIcsText(
      "Online meeting",
    )}`,

    `ORGANIZER;CN=Daniel VLKO:mailto:${input.organizerEmail}`,

    `ATTENDEE;RSVP=FALSE:mailto:${input.clientEmail}`,

    `STATUS:${status}`,

    "TRANSP:OPAQUE",

    "END:VEVENT",

    "END:VCALENDAR",
  ];

  return (
    lines
      .map(
        foldIcsLine,
      )
      .join(
        "\r\n",
      ) +
    "\r\n"
  );
}