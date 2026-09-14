export type BookingIcsInput = {
  bookingId: string;

  clientEmail: string;

  startsAt: Date;
  endsAt: Date;

  organizerEmail: string;
};

function escapeIcsText(
  value: string,
): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function formatUtcDate(
  date: Date,
): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

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

  const parts: string[] =
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

export function createBookingIcs(
  input: BookingIcsInput,
): string {
  const now =
    new Date();

  const uid =
    `booking-${input.bookingId}@danielvlko.com`;

  const description =
    [
      "Daniel VLKO Discovery Call",
      "",
      "Your Google Meet link will be sent 30 minutes before the call.",
      "",
      "https://danielvlko.com",
    ].join("\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Daniel VLKO//Booking System//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",

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

    "SEQUENCE:0",

    `SUMMARY:${escapeIcsText(
      "Discovery Call — Daniel VLKO",
    )}`,

    `DESCRIPTION:${escapeIcsText(
      description,
    )}`,

    `LOCATION:${escapeIcsText(
      "Online meeting",
    )}`,

    `ORGANIZER;CN=Daniel VLKO:mailto:${input.organizerEmail}`,

    `ATTENDEE;RSVP=FALSE:mailto:${input.clientEmail}`,

    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",

    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return (
    lines
      .map(
        foldIcsLine,
      )
      .join("\r\n") +
    "\r\n"
  );
}