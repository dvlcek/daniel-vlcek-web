import {
  DateTime,
} from "luxon";

import {
  Resend,
} from "resend";

import {
  createBookingIcs,
} from "@/lib/booking/ics";

/* =========================================================
   TYPES
========================================================= */

export type SendBookingCancellationInput = {
  bookingId: string;

  clientName: string;
  clientEmail: string;

  startsAt: Date;
  endsAt: Date;

  timezone: string;
};

/* =========================================================
   CONFIG
========================================================= */

function getEmailConfig() {
  const apiKey =
    process.env.RESEND_API_KEY;

  const from =
    process.env
      .BOOKING_FROM_EMAIL ??
    process.env
      .CONTACT_FROM_EMAIL;

  const replyTo =
    process.env
      .BOOKING_REPLY_TO_EMAIL;

  const organizerEmail =
    process.env
      .BOOKING_ORGANIZER_EMAIL ??
    replyTo;

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not configured.",
    );
  }

  if (!from) {
    throw new Error(
      "BOOKING_FROM_EMAIL or CONTACT_FROM_EMAIL is not configured.",
    );
  }

  if (!organizerEmail) {
    throw new Error(
      "BOOKING_ORGANIZER_EMAIL is not configured.",
    );
  }

  return {
    apiKey,
    from,
    replyTo,
    organizerEmail,
  };
}

/* =========================================================
   HELPERS
========================================================= */

function escapeHtml(
  value: string,
): string {
  return value
    .replace(
      /&/g,
      "&amp;",
    )
    .replace(
      /</g,
      "&lt;",
    )
    .replace(
      />/g,
      "&gt;",
    )
    .replace(
      /"/g,
      "&quot;",
    )
    .replace(
      /'/g,
      "&#039;",
    );
}

function getFormattedBooking(
  input:
    SendBookingCancellationInput,
) {
  const start =
    DateTime.fromJSDate(
      input.startsAt,
      {
        zone:
          "utc",
      },
    ).setZone(
      input.timezone,
    );

  const end =
    DateTime.fromJSDate(
      input.endsAt,
      {
        zone:
          "utc",
      },
    ).setZone(
      input.timezone,
    );

  if (
    !start.isValid ||
    !end.isValid
  ) {
    throw new Error(
      "Invalid booking date.",
    );
  }

  return {
    date:
      start.toFormat(
        "cccc, d LLLL yyyy",
      ),

    startTime:
      start.toFormat(
        "HH:mm",
      ),

    endTime:
      end.toFormat(
        "HH:mm",
      ),
  };
}

/* =========================================================
   HTML
========================================================= */

function buildHtml(
  input:
    SendBookingCancellationInput,
): string {
  const formatted =
    getFormattedBooking(
      input,
    );

  return `
<!doctype html>
<html>
  <body
    style="
      margin:0;
      padding:0;
      background:#f5f5f3;
      color:#111111;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;
    "
  >
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="
        width:100%;
        background:#f5f5f3;
      "
    >
      <tr>
        <td
          align="center"
          style="
            padding:48px 18px;
          "
        >
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              width:100%;
              max-width:560px;
            "
          >
            <tr>
              <td
                style="
                  padding:0 2px 26px;
                "
              >
                <div
                  style="
                    font-size:15px;
                    font-weight:700;
                    letter-spacing:-0.025em;
                    color:#111111;
                  "
                >
                  Daniel VLKO
                </div>

                <div
                  style="
                    margin-top:5px;
                    font-size:9px;
                    font-weight:600;
                    letter-spacing:0.17em;
                    text-transform:uppercase;
                    color:#9a9a96;
                  "
                >
                  Software · Automation · AI
                </div>
              </td>
            </tr>

            <tr>
              <td
                style="
                  border:1px solid #e6e6e2;
                  border-radius:18px;
                  background:#ffffff;
                  padding:42px 40px;
                "
              >
                <div
                  style="
                    font-size:10px;
                    font-weight:700;
                    letter-spacing:0.16em;
                    text-transform:uppercase;
                    color:#FF5A1F;
                  "
                >
                  Booking cancelled
                </div>

                <h1
                  style="
                    margin:14px 0 0;
                    font-size:28px;
                    line-height:1.18;
                    font-weight:600;
                    letter-spacing:-0.04em;
                    color:#111111;
                  "
                >
                  Your discovery call has been cancelled.
                </h1>

                <p
                  style="
                    margin:20px 0 0;
                    font-size:14px;
                    line-height:1.7;
                    color:#686864;
                  "
                >
                  Hi ${escapeHtml(
                    input.clientName,
                  )},
                </p>

                <p
                  style="
                    margin:5px 0 0;
                    font-size:14px;
                    line-height:1.7;
                    color:#686864;
                  "
                >
                  Your booking has been cancelled successfully. No further reminders will be sent for this call.
                </p>

                <div
                  style="
                    margin-top:32px;
                    padding:26px 0;
                    border-top:1px solid #eeeeea;
                    border-bottom:1px solid #eeeeea;
                  "
                >
                  <div
                    style="
                      font-size:16px;
                      line-height:1.45;
                      font-weight:600;
                      color:#141414;
                      text-decoration:line-through;
                      text-decoration-color:#b8b8b3;
                    "
                  >
                    ${escapeHtml(
                      formatted.date,
                    )}
                  </div>

                  <div
                    style="
                      margin-top:6px;
                      font-size:14px;
                      line-height:1.5;
                      color:#8d8d88;
                    "
                  >
                    ${escapeHtml(
                      formatted.startTime,
                    )}
                    —
                    ${escapeHtml(
                      formatted.endTime,
                    )}
                  </div>

                  <div
                    style="
                      margin-top:5px;
                      font-size:10px;
                      line-height:1.5;
                      color:#a0a09b;
                    "
                  >
                    ${escapeHtml(
                      input.timezone,
                    )}
                  </div>
                </div>

                <p
                  style="
                    margin:24px 0 0;
                    font-size:11px;
                    line-height:1.7;
                    color:#92928d;
                  "
                >
                  A cancellation update is attached for your calendar.
                </p>

                <p
                  style="
                    margin:14px 0 0;
                    font-size:11px;
                    line-height:1.7;
                    color:#92928d;
                  "
                >
                  If you would like to choose another time, you can book a new discovery call through danielvlko.com.
                </p>
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding:22px 2px 0;
                  font-size:10px;
                  line-height:1.65;
                  color:#aaa9a4;
                "
              >
                Daniel VLKO
                <br />
                Software Developer &amp; Automation Architect
                <br />
                danielvlko.com
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

/* =========================================================
   TEXT
========================================================= */

function buildText(
  input:
    SendBookingCancellationInput,
): string {
  const formatted =
    getFormattedBooking(
      input,
    );

  return [
    "Daniel VLKO",
    "Software · Automation · AI",
    "",
    "Your discovery call has been cancelled.",
    "",
    `Hi ${input.clientName},`,
    "",
    "Your booking has been cancelled successfully.",
    "No further reminders will be sent for this call.",
    "",
    formatted.date,
    `${formatted.startTime} — ${formatted.endTime}`,
    input.timezone,
    "",
    "A cancellation update is attached for your calendar.",
    "",
    "If you would like to choose another time, you can book a new discovery call through danielvlko.com.",
    "",
    "Daniel VLKO",
    "Software Developer & Automation Architect",
    "danielvlko.com",
  ].join(
    "\n",
  );
}

/* =========================================================
   SEND
========================================================= */

export async function sendBookingCancellationEmail(
  input:
    SendBookingCancellationInput,
): Promise<string> {
  const config =
    getEmailConfig();

  const resend =
    new Resend(
      config.apiKey,
    );

  const ics =
    createBookingIcs({
      bookingId:
        input.bookingId,

      clientEmail:
        input.clientEmail,

      startsAt:
        input.startsAt,

      endsAt:
        input.endsAt,

      organizerEmail:
        config.organizerEmail,

      method:
        "CANCEL",

      status:
        "CANCELLED",

      description:
        "This Daniel VLKO discovery call has been cancelled.",
    });

  const {
    data,
    error,
  } =
    await resend.emails.send(
      {
        from:
          config.from,

        to: [
          input.clientEmail,
        ],

        replyTo:
          config.replyTo,

        subject:
          "Your discovery call has been cancelled — Daniel VLKO",

        html:
          buildHtml(
            input,
          ),

        text:
          buildText(
            input,
          ),

        attachments: [
          {
            filename:
              "daniel-vlko-discovery-call-cancelled.ics",

            content:
              Buffer.from(
                ics,
                "utf8",
              ),
          },
        ],

        tags: [
          {
            name:
              "type",

            value:
              "booking_cancellation",
          },

          {
            name:
              "booking_id",

            value:
              input.bookingId,
          },
        ],
      },

      {
        idempotencyKey:
          `booking-cancellation/${input.bookingId}/${input.startsAt.getTime()}`,
      },
    );

  if (error) {
    throw new Error(
      `Resend booking cancellation failed: ${error.message}`,
    );
  }

  if (!data?.id) {
    throw new Error(
      "Resend did not return an email ID for the cancellation.",
    );
  }

  return data.id;
}