import { DateTime } from "luxon";
import { Resend } from "resend";

import { createBookingIcs } from "@/lib/booking/ics";

export type SendBookingConfirmationInput = {
  bookingId: string;

  clientName: string;
  clientEmail: string;

  startsAt: Date;
  endsAt: Date;

  timezone: string;

  manageUrl: string;

  mode?: "confirmed" | "rescheduled";
};

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY;

  const from =
    process.env.BOOKING_FROM_EMAIL ??
    process.env.CONTACT_FROM_EMAIL;

  const replyTo =
    process.env.BOOKING_REPLY_TO_EMAIL;

  const organizerEmail =
    process.env.BOOKING_ORGANIZER_EMAIL ??
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getFormattedDate(
  input: SendBookingConfirmationInput,
) {
  const start = DateTime.fromJSDate(
    input.startsAt,
    {
      zone: "utc",
    },
  ).setZone(input.timezone);

  const end = DateTime.fromJSDate(
    input.endsAt,
    {
      zone: "utc",
    },
  ).setZone(input.timezone);

  if (!start.isValid || !end.isValid) {
    throw new Error(
      "Invalid booking date.",
    );
  }

  return {
    date: start.toFormat(
      "cccc, d LLLL yyyy",
    ),

    startTime: start.toFormat(
      "HH:mm",
    ),

    endTime: end.toFormat(
      "HH:mm",
    ),
  };
}

function buildHtml(
  input: SendBookingConfirmationInput,
): string {
  const formatted =
    getFormattedDate(input);

  const name =
    escapeHtml(input.clientName);

  const manageUrl =
    escapeHtml(input.manageUrl);

  const rescheduled =
    input.mode === "rescheduled";

  const eyebrow =
    rescheduled
      ? "Booking updated"
      : "Booking confirmed";

  const heading =
    rescheduled
      ? "Your discovery call has been updated."
      : "Your discovery call is booked.";

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
                  ${eyebrow}
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
                  ${heading}
                </h1>

                <p
                  style="
                    margin:20px 0 0;
                    font-size:14px;
                    line-height:1.7;
                    color:#686864;
                  "
                >
                  Hi ${name},
                </p>

                <p
                  style="
                    margin:5px 0 0;
                    font-size:14px;
                    line-height:1.7;
                    color:#686864;
                  "
                >
                  Everything is set for your discovery call with Daniel.
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
                      color:#676763;
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

                <div
                  style="
                    margin-top:27px;
                  "
                >
                  <div
                    style="
                      font-size:12px;
                      font-weight:600;
                      color:#333330;
                    "
                  >
                    Google Meet
                  </div>

                  <div
                    style="
                      margin-top:6px;
                      font-size:12px;
                      line-height:1.7;
                      color:#83837e;
                    "
                  >
                    Your meeting link will arrive 30 minutes before the call.
                  </div>
                </div>

                <p
                  style="
                    margin:22px 0 0;
                    font-size:11px;
                    line-height:1.7;
                    color:#9a9a95;
                  "
                >
                  A calendar invitation is attached to this email.
                </p>

                <div
                  style="
                    margin-top:34px;
                    padding-top:28px;
                    border-top:1px solid #eeeeea;
                  "
                >
                  <div
                    style="
                      font-size:12px;
                      font-weight:600;
                      color:#333330;
                    "
                  >
                    Need to make a change?
                  </div>

                  <div
                    style="
                      margin-top:7px;
                      max-width:390px;
                      font-size:12px;
                      line-height:1.7;
                      color:#858580;
                    "
                  >
                    If something comes up, you can reschedule or cancel your booking anytime.
                  </div>

                  <div
                    style="
                      margin-top:18px;
                    "
                  >
                    <a
                      href="${manageUrl}"
                      style="
                        display:inline-block;
                        border:1px solid #ddddda;
                        border-radius:999px;
                        padding:12px 19px;
                        font-size:11px;
                        line-height:1;
                        font-weight:600;
                        color:#222220;
                        text-decoration:none;
                        background:#ffffff;
                      "
                    >
                      Manage booking
                    </a>
                  </div>
                </div>
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

function buildText(
  input: SendBookingConfirmationInput,
): string {
  const formatted =
    getFormattedDate(input);

  const heading =
    input.mode === "rescheduled"
      ? "Your discovery call has been updated."
      : "Your discovery call is booked.";

  return [
    "Daniel VLKO",
    "Software · Automation · AI",
    "",
    heading,
    "",
    `Hi ${input.clientName},`,
    "",
    "Everything is set for your discovery call.",
    "",
    formatted.date,
    `${formatted.startTime} — ${formatted.endTime}`,
    input.timezone,
    "",
    "Your Google Meet link will arrive 30 minutes before the call.",
    "",
    "A calendar invitation is attached.",
    "",
    "Need to make a change?",
    "If something comes up, you can reschedule or cancel your booking here:",
    input.manageUrl,
    "",
    "Daniel VLKO",
    "Software Developer & Automation Architect",
    "danielvlko.com",
  ].join("\n");
}

export async function sendBookingConfirmationEmail(
  input: SendBookingConfirmationInput,
): Promise<string> {
  const config =
    getEmailConfig();

  const resend =
    new Resend(config.apiKey);

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
    });

  const subject =
    input.mode === "rescheduled"
      ? "Your discovery call has been updated — Daniel VLKO"
      : "Your discovery call is confirmed — Daniel VLKO";

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

        subject,

        html:
          buildHtml(input),

        text:
          buildText(input),

        attachments: [
          {
            filename:
              "daniel-vlko-discovery-call.ics",

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
              input.mode ===
              "rescheduled"
                ? "booking_rescheduled"
                : "booking_confirmation",
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
          `booking-email/${input.bookingId}/${input.startsAt.getTime()}`,
      },
    );

  if (error) {
    throw new Error(
      `Resend booking email failed: ${error.message}`,
    );
  }

  if (!data?.id) {
    throw new Error(
      "Resend did not return an email ID.",
    );
  }

  return data.id;
}