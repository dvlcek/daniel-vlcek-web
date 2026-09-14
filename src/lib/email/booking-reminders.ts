import {
  DateTime,
} from "luxon";

import {
  Resend,
} from "resend";

/* =========================================================
   TYPES
========================================================= */

type BaseBookingReminderInput = {
  bookingId: string;

  clientName: string;
  clientEmail: string;

  startsAt: Date;
  endsAt: Date;

  timezone: string;

  manageUrl: string;
};

export type SendBooking24hReminderInput =
  BaseBookingReminderInput;

export type SendBooking30mReminderInput =
  BaseBookingReminderInput & {
    meetingUrl: string;
  };

/* =========================================================
   CONFIG
========================================================= */

function getEmailConfig() {
  const apiKey =
    process.env.RESEND_API_KEY;

  const from =
    process.env.BOOKING_FROM_EMAIL ??
    process.env.CONTACT_FROM_EMAIL;

  const replyTo =
    process.env.BOOKING_REPLY_TO_EMAIL;

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

  return {
    apiKey,
    from,
    replyTo,
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

function getSafeUrl(
  value: string,
): string {
  const url =
    new URL(
      value,
    );

  if (
    url.protocol !==
      "https:" &&
    url.protocol !==
      "http:"
  ) {
    throw new Error(
      "Unsupported URL.",
    );
  }

  return url.toString();
}

function getFormattedBooking(
  input:
    BaseBookingReminderInput,
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
   SHELL
========================================================= */

function buildEmailShell({
  eyebrow,
  title,
  name,
  content,
}: {
  eyebrow: string;
  title: string;
  name: string;
  content: string;
}): string {
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
                  ${escapeHtml(
                    eyebrow,
                  )}
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
                  ${escapeHtml(
                    title,
                  )}
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
                    name,
                  )},
                </p>

                ${content}
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
   BOOKING SUMMARY
========================================================= */

function buildBookingSummary(
  input:
    BaseBookingReminderInput,
): string {
  const formatted =
    getFormattedBooking(
      input,
    );

  return `
<div
  style="
    margin-top:30px;
    padding:24px 0;
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
`;
}

/* =========================================================
   MANAGE BOOKING CTA
========================================================= */

function buildManageBookingButton(
  manageUrl: string,
): string {
  const safeUrl =
    escapeHtml(
      getSafeUrl(
        manageUrl,
      ),
    );

  return `
<div
  style="
    margin-top:14px;
  "
>
  <a
    href="${safeUrl}"
    style="
      display:inline-block;
      border:1px solid #ddddda;
      border-radius:999px;
      padding:13px 20px;
      background:#ffffff;
      color:#333330;
      font-size:11px;
      line-height:1;
      font-weight:700;
      text-decoration:none;
    "
  >
    Manage booking
  </a>
</div>
`;
}

/* =========================================================
   24H REMINDER
========================================================= */

function build24hHtml(
  input:
    SendBooking24hReminderInput,
): string {
  return buildEmailShell({
    eyebrow:
      "Discovery call reminder",

    title:
      "Your call is tomorrow.",

    name:
      input.clientName,

    content: `
<p
  style="
    margin:6px 0 0;
    font-size:14px;
    line-height:1.7;
    color:#686864;
  "
>
  Just a quick reminder about your upcoming discovery call.
</p>

${buildBookingSummary(
  input,
)}

<div
  style="
    margin-top:26px;
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
    Your meeting link will arrive shortly before the call.
  </div>
</div>

<div
  style="
    margin-top:30px;
    padding-top:25px;
    border-top:1px solid #eeeeea;
  "
>
  <div
    style="
      font-size:11px;
      line-height:1.7;
      color:#979792;
    "
  >
    Need to reschedule or cancel?
  </div>

  ${buildManageBookingButton(
    input.manageUrl,
  )}
</div>
`,
  });
}

function build24hText(
  input:
    SendBooking24hReminderInput,
): string {
  const formatted =
    getFormattedBooking(
      input,
    );

  return [
    "Daniel VLKO",
    "",
    "Your discovery call is tomorrow.",
    "",
    `Hi ${input.clientName},`,
    "",
    "Just a quick reminder about your upcoming discovery call.",
    "",
    formatted.date,
    `${formatted.startTime} — ${formatted.endTime}`,
    input.timezone,
    "",
    "Your Google Meet link will arrive shortly before the call.",
    "",
    "Manage booking:",
    input.manageUrl,
  ].join(
    "\n",
  );
}

export async function sendBooking24hReminderEmail(
  input:
    SendBooking24hReminderInput,
): Promise<string> {
  const config =
    getEmailConfig();

  const resend =
    new Resend(
      config.apiKey,
    );

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
          "Your discovery call is tomorrow — Daniel VLKO",

        html:
          build24hHtml(
            input,
          ),

        text:
          build24hText(
            input,
          ),

        tags: [
          {
            name:
              "type",

            value:
              "booking_reminder_24h",
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
          `booking-reminder-24h/${input.bookingId}/${input.startsAt.getTime()}`,
      },
    );

  if (error) {
    throw new Error(
      `Resend 24h reminder failed: ${error.message}`,
    );
  }

  if (!data?.id) {
    throw new Error(
      "Resend did not return an email ID for the 24h reminder.",
    );
  }

  return data.id;
}

/* =========================================================
   30M REMINDER
========================================================= */

function build30mHtml(
  input:
    SendBooking30mReminderInput,
): string {
  const safeMeetingUrl =
    escapeHtml(
      getSafeUrl(
        input.meetingUrl,
      ),
    );

  return buildEmailShell({
    eyebrow:
      "Starting soon",

    title:
      "Your discovery call starts soon.",

    name:
      input.clientName,

    content: `
<p
  style="
    margin:6px 0 0;
    font-size:14px;
    line-height:1.7;
    color:#686864;
  "
>
  Everything is ready. You can join the call using the link below.
</p>

${buildBookingSummary(
  input,
)}

<div
  style="
    margin-top:28px;
  "
>
  <a
    href="${safeMeetingUrl}"
    style="
      display:inline-block;
      border-radius:999px;
      padding:14px 22px;
      background:#FF5A1F;
      color:#ffffff;
      font-size:12px;
      line-height:1;
      font-weight:700;
      text-decoration:none;
    "
  >
    Join Google Meet
  </a>
</div>

<div
  style="
    margin-top:16px;
    font-size:10px;
    line-height:1.65;
    color:#aaa9a4;
    word-break:break-all;
  "
>
  ${safeMeetingUrl}
</div>

<div
  style="
    margin-top:30px;
    padding-top:25px;
    border-top:1px solid #eeeeea;
  "
>
  <div
    style="
      font-size:11px;
      line-height:1.7;
      color:#979792;
    "
  >
    Need to make a last-minute change?
  </div>

  ${buildManageBookingButton(
    input.manageUrl,
  )}
</div>
`,
  });
}

function build30mText(
  input:
    SendBooking30mReminderInput,
): string {
  const formatted =
    getFormattedBooking(
      input,
    );

  return [
    "Daniel VLKO",
    "",
    "Your discovery call starts soon.",
    "",
    `Hi ${input.clientName},`,
    "",
    formatted.date,
    `${formatted.startTime} — ${formatted.endTime}`,
    input.timezone,
    "",
    "Join Google Meet:",
    input.meetingUrl,
    "",
    "Manage booking:",
    input.manageUrl,
  ].join(
    "\n",
  );
}

export async function sendBooking30mReminderEmail(
  input:
    SendBooking30mReminderInput,
): Promise<string> {
  const config =
    getEmailConfig();

  const resend =
    new Resend(
      config.apiKey,
    );

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
          "Your discovery call starts soon — Daniel VLKO",

        html:
          build30mHtml(
            input,
          ),

        text:
          build30mText(
            input,
          ),

        tags: [
          {
            name:
              "type",

            value:
              "booking_reminder_30m",
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
          `booking-reminder-30m/${input.bookingId}/${input.startsAt.getTime()}`,
      },
    );

  if (error) {
    throw new Error(
      `Resend 30m reminder failed: ${error.message}`,
    );
  }

  if (!data?.id) {
    throw new Error(
      "Resend did not return an email ID for the 30m reminder.",
    );
  }

  return data.id;
}