import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Resend } from "resend";

export const runtime = "nodejs";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  website?: unknown;
  message?: unknown;
  companyWebsite?: unknown;
  source?: unknown;
};

function stringValue(
  value: unknown,
): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function isValidEmail(
  email: string,
): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email,
  );
}

function escapeHtml(
  value: string,
): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeWebsite(
  value: string,
): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(
      /^https?:\/\//i.test(value)
        ? value
        : `https://${value}`,
    );

    if (
      url.protocol !== "http:" &&
      url.protocol !== "https:"
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    /* ========================================================
       ENVIRONMENT
    ======================================================== */

    const resendApiKey =
      process.env.RESEND_API_KEY;

    const contactToEmail =
      process.env.CONTACT_TO_EMAIL;

    const contactFromEmail =
      process.env.CONTACT_FROM_EMAIL;

    const calLink =
      process.env.NEXT_PUBLIC_CAL_LINK ?? "";

    if (
      !resendApiKey ||
      !contactToEmail ||
      !contactFromEmail
    ) {
      console.error(
        "Contact API: missing email environment variables.",
      );

      return NextResponse.json(
        {
          ok: false,
          message:
            "Contact service is temporarily unavailable.",
        },
        {
          status: 500,
        },
      );
    }

    /* ========================================================
       REQUEST BODY
    ======================================================== */

    let body: ContactPayload;

    try {
      body =
        (await request.json()) as ContactPayload;
    } catch {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Invalid request.",
        },
        {
          status: 400,
        },
      );
    }

    const name =
      stringValue(body.name);

    const email =
      stringValue(
        body.email,
      ).toLowerCase();

    const website =
      stringValue(body.website);

    const message =
      stringValue(body.message);

    const source =
      stringValue(body.source);

    const honeypot =
      stringValue(
        body.companyWebsite,
      );

    /* ========================================================
       HONEYPOT
    ======================================================== */

    if (honeypot) {
      /*
       * Pretend success so automated bots
       * cannot easily detect the honeypot.
       */
      return NextResponse.json({
        ok: true,
      });
    }

    /* ========================================================
       VALIDATION
    ======================================================== */

    if (
      !name ||
      !email ||
      !message
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Please fill in all required fields.",
        },
        {
          status: 400,
        },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Please enter a valid email address.",
        },
        {
          status: 400,
        },
      );
    }

    if (name.length > 120) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Name is too long.",
        },
        {
          status: 400,
        },
      );
    }

    if (email.length > 160) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Email address is too long.",
        },
        {
          status: 400,
        },
      );
    }

    if (website.length > 250) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Website URL is too long.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      message.length < 20 ||
      message.length > 2500
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Please provide a little more detail about the problem.",
        },
        {
          status: 400,
        },
      );
    }

    /* ========================================================
       NORMALIZATION
    ======================================================== */

    const normalizedWebsite =
      normalizeWebsite(website);

    const normalizedCalLink =
      normalizeWebsite(calLink);

    const firstName =
      name.split(/\s+/)[0] || name;

    /* ========================================================
       SAFE VALUES
    ======================================================== */

    const safeName =
      escapeHtml(name);

    const safeFirstName =
      escapeHtml(firstName);

    const safeEmail =
      escapeHtml(email);

    const safeWebsite =
      escapeHtml(website);

    const safeWebsiteUrl =
      normalizedWebsite
        ? escapeHtml(
            normalizedWebsite,
          )
        : "";

    const safeMessage =
      escapeHtml(
        message,
      ).replaceAll(
        "\n",
        "<br />",
      );

    const safeSource =
      escapeHtml(source);

    const safeCalLink =
      normalizedCalLink
        ? escapeHtml(
            normalizedCalLink,
          )
        : "";

    /* ========================================================
       RESEND CLIENT
    ======================================================== */

    const resend =
      new Resend(resendApiKey);

    /* ========================================================
       INTERNAL EMAIL
       Sent to Daniel.
    ======================================================== */

    const internalHtml = `
<!doctype html>
<html lang="en">
  <body
    style="
      margin:0;
      padding:0;
      background:#f3f4f5;
      font-family:
        -apple-system,
        BlinkMacSystemFont,
        'Segoe UI',
        Arial,
        sans-serif;
      color:#111418;
    "
  >
    <div
      style="
        width:100%;
        padding:42px 18px;
        box-sizing:border-box;
      "
    >
      <div
        style="
          width:100%;
          max-width:640px;
          margin:0 auto;
          overflow:hidden;
          border:1px solid #e3e5e7;
          border-radius:20px;
          background:#ffffff;
          box-shadow:
            0 20px 70px rgba(13,18,22,0.06);
        "
      >
        <!-- HEADER -->

        <div
          style="
            padding:28px 30px;
            background:#071014;
          "
        >
          <div
            style="
              margin-bottom:9px;
              color:#ff6a32;
              font-size:9px;
              font-weight:700;
              letter-spacing:2px;
              text-transform:uppercase;
            "
          >
            Daniel VLKO
          </div>

          <div
            style="
              color:#ffffff;
              font-size:24px;
              font-weight:500;
              line-height:1.2;
              letter-spacing:-0.5px;
            "
          >
            New website inquiry
          </div>
        </div>

        <!-- CONTENT -->

        <div
          style="
            padding:30px;
          "
        >
          <table
            role="presentation"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
              border-collapse:collapse;
              font-size:14px;
            "
          >
            <tr>
              <td
                style="
                  width:115px;
                  padding:9px 0;
                  color:#8b9094;
                "
              >
                Name
              </td>

              <td
                style="
                  padding:9px 0;
                  color:#171a1d;
                  font-weight:600;
                "
              >
                ${safeName}
              </td>
            </tr>

            <tr>
              <td
                style="
                  width:115px;
                  padding:9px 0;
                  color:#8b9094;
                "
              >
                Email
              </td>

              <td
                style="
                  padding:9px 0;
                "
              >
                <a
                  href="mailto:${safeEmail}"
                  style="
                    color:#171a1d;
                    text-decoration:none;
                  "
                >
                  ${safeEmail}
                </a>
              </td>
            </tr>

            ${
              website
                ? `
                  <tr>
                    <td
                      style="
                        width:115px;
                        padding:9px 0;
                        color:#8b9094;
                      "
                    >
                      Website
                    </td>

                    <td
                      style="
                        padding:9px 0;
                      "
                    >
                      ${
                        normalizedWebsite
                          ? `
                            <a
                              href="${safeWebsiteUrl}"
                              style="
                                color:#ff5a1f;
                                text-decoration:none;
                              "
                            >
                              ${safeWebsite}
                            </a>
                          `
                          : safeWebsite
                      }
                    </td>
                  </tr>
                `
                : ""
            }
          </table>

          <!-- MESSAGE -->

          <div
            style="
              margin-top:25px;
              padding-top:25px;
              border-top:1px solid #eceeef;
            "
          >
            <div
              style="
                margin-bottom:12px;
                color:#9a9fa3;
                font-size:9px;
                font-weight:700;
                letter-spacing:1.7px;
                text-transform:uppercase;
              "
            >
              Message
            </div>

            <div
              style="
                color:#373c40;
                font-size:14px;
                line-height:1.75;
              "
            >
              ${safeMessage}
            </div>
          </div>

          ${
            source
              ? `
                <div
                  style="
                    margin-top:28px;
                    padding-top:18px;
                    border-top:1px solid #f0f1f2;
                    color:#a6aaad;
                    font-size:9px;
                    line-height:1.5;
                  "
                >
                  Source: ${safeSource}
                </div>
              `
              : ""
          }
        </div>
      </div>
    </div>
  </body>
</html>
    `.trim();

    const internalText = `
NEW WEBSITE INQUIRY

Name: ${name}
Email: ${email}
Website: ${website || "-"}

Message:
${message}

${source ? `Source: ${source}` : ""}

Daniel VLKO
danielvlko.com
    `.trim();

    const {
      data: internalData,
      error: internalError,
    } = await resend.emails.send({
      from: contactFromEmail,

      to: [
        contactToEmail,
      ],

      /*
       * When you click Reply,
       * you reply directly to the lead.
       */
      replyTo: email,

      subject:
        `New inquiry — ${name}`,

      html: internalHtml,

      text: internalText,

      tags: [
        {
          name: "source",
          value: "website-contact",
        },
      ],
    });

    /* ========================================================
       INTERNAL DELIVERY FAILED

       The lead is the critical email.
       If it does not reach us, submission fails.
    ======================================================== */

    if (internalError) {
      console.error(
        "Resend internal email error:",
        internalError,
      );

      return NextResponse.json(
        {
          ok: false,
          message:
            "Your message could not be sent. Please try again.",
        },
        {
          status: 502,
        },
      );
    }

    /* ========================================================
       CLIENT CONFIRMATION EMAIL
    ======================================================== */

    const confirmationHtml = `
<!doctype html>
<html lang="en">
  <body
    style="
      margin:0;
      padding:0;
      background:#f3f4f5;
      font-family:
        -apple-system,
        BlinkMacSystemFont,
        'Segoe UI',
        Arial,
        sans-serif;
      color:#111418;
    "
  >
    <!-- PREHEADER -->

    <div
      style="
        display:none;
        max-height:0;
        overflow:hidden;
        opacity:0;
        color:transparent;
      "
    >
      I've received your inquiry and I'll review it personally.
      I'll get back to you with the next best step.
    </div>

    <div
      style="
        width:100%;
        padding:54px 18px;
        box-sizing:border-box;
      "
    >
      <div
        style="
          width:100%;
          max-width:620px;
          margin:0 auto;
        "
      >
        <!-- BRAND ABOVE CARD -->

        <div
          style="
            margin-bottom:18px;
            padding:0 4px;
          "
        >
          <table
            role="presentation"
            cellpadding="0"
            cellspacing="0"
          >
            <tr>
              <td
                style="
                  padding-right:10px;
                  vertical-align:middle;
                "
              >
                <div
                  style="
                    width:7px;
                    height:7px;
                    border-radius:999px;
                    background:#ff5a1f;
                  "
                ></div>
              </td>

              <td
                style="
                  color:#181b1e;
                  font-size:10px;
                  font-weight:700;
                  letter-spacing:2px;
                  text-transform:uppercase;
                  vertical-align:middle;
                "
              >
                Daniel VLKO
              </td>
            </tr>
          </table>
        </div>

        <!-- MAIN CARD -->

        <div
          style="
            overflow:hidden;
            border:1px solid #e3e5e7;
            border-radius:22px;
            background:#ffffff;
            box-shadow:
              0 24px 80px rgba(13,18,22,0.07),
              0 2px 8px rgba(13,18,22,0.03);
          "
        >
          <!-- DARK HERO -->

          <div
            style="
              padding:31px 32px 32px;
              background:#071014;
            "
          >
            <div
              style="
                margin-bottom:10px;
                color:#ff6a32;
                font-size:9px;
                font-weight:700;
                letter-spacing:2px;
                text-transform:uppercase;
              "
            >
              Message received
            </div>

            <div
              style="
                max-width:470px;
                color:#ffffff;
                font-size:29px;
                font-weight:500;
                line-height:1.18;
                letter-spacing:-0.9px;
              "
            >
              Thanks, ${safeFirstName}.<br />
              I've received your message.
            </div>
          </div>

          <!-- MAIN CONTENT -->

          <div
            style="
              padding:34px 32px 33px;
            "
          >
            <p
              style="
                margin:0 0 14px;
                max-width:500px;
                color:#464c51;
                font-size:14px;
                line-height:1.75;
              "
            >
              Thanks for reaching out.
              I'll review your inquiry personally
              and take a closer look at what you're
              trying to build, improve or automate.
            </p>

            <p
              style="
                margin:0;
                max-width:500px;
                color:#464c51;
                font-size:14px;
                line-height:1.75;
              "
            >
              I'll get back to you as soon as possible
              with a clear next step and, where useful,
              an initial perspective on how we could
              approach it.
            </p>

            <!-- MESSAGE PREVIEW -->

            <div
              style="
                margin-top:29px;
                padding:20px;
                border:1px solid #e8eaeb;
                border-radius:14px;
                background:#f8f9f9;
              "
            >
              <div
                style="
                  margin-bottom:10px;
                  color:#9a9fa3;
                  font-size:9px;
                  font-weight:700;
                  letter-spacing:1.6px;
                  text-transform:uppercase;
                "
              >
                Your inquiry
              </div>

              <div
                style="
                  color:#51575c;
                  font-size:13px;
                  line-height:1.72;
                "
              >
                ${safeMessage}
              </div>
            </div>

            ${
              normalizedCalLink
                ? `
                  <!-- CTA SECTION -->

                  <div
                    style="
                      margin-top:31px;
                      padding-top:29px;
                      border-top:1px solid #eceeef;
                    "
                  >
                    <div
                      style="
                        margin-bottom:7px;
                        color:#171a1d;
                        font-size:17px;
                        font-weight:600;
                        letter-spacing:-0.3px;
                      "
                    >
                      Want to move this forward faster?
                    </div>

                    <p
                      style="
                        margin:0 0 21px;
                        max-width:480px;
                        color:#70767b;
                        font-size:12.5px;
                        line-height:1.7;
                      "
                    >
                      If this is already a priority,
                      book a free discovery call.
                      We'll look at your current situation,
                      identify the biggest bottlenecks
                      and see where software, automation
                      or AI can create the most leverage.
                    </p>

                    <a
                      href="${safeCalLink}"
                      style="
                        display:inline-block;
                        padding:13px 21px;
                        border-radius:999px;
                        background:#ff5a1f;
                        color:#ffffff;
                        font-size:12px;
                        font-weight:600;
                        line-height:1.2;
                        text-decoration:none;
                        box-shadow:
                          0 10px 28px rgba(255,90,31,0.18);
                      "
                    >
                      Book a free discovery call →
                    </a>
                  </div>
                `
                : ""
            }

            <!-- SIGNATURE -->

            <div
              style="
                margin-top:37px;
                padding-top:24px;
                border-top:1px solid #eceeef;
              "
            >
              <div
                style="
                  color:#171a1d;
                  font-size:13px;
                  font-weight:650;
                  line-height:1.5;
                "
              >
                Daniel VLKO
              </div>

              <div
                style="
                  margin-top:3px;
                  color:#7e8489;
                  font-size:10.5px;
                  line-height:1.5;
                "
              >
                Software Developer &amp;
                Automation Architect
              </div>

              <div
                style="
                  margin-top:12px;
                  color:#adb1b4;
                  font-size:9px;
                  line-height:1.5;
                "
              >
                danielvlko.com
              </div>
            </div>
          </div>
        </div>

        <!-- OUTSIDE FOOTER -->

        <div
          style="
            padding:18px 8px 0;
            text-align:center;
            color:#a4a9ac;
            font-size:9px;
            line-height:1.55;
          "
        >
          You're receiving this email because
          you submitted an inquiry through
          danielvlko.com.
        </div>
      </div>
    </div>
  </body>
</html>
    `.trim();

    const confirmationText = `
Thanks, ${firstName}. I've received your message.

Thanks for reaching out.

I'll review your inquiry personally and take a closer look at what you're trying to build, improve or automate.

I'll get back to you as soon as possible with a clear next step and, where useful, an initial perspective on how we could approach it.

YOUR INQUIRY

${message}

${
  normalizedCalLink
    ? `
WANT TO MOVE THIS FORWARD FASTER?

If this is already a priority, book a free discovery call. We'll look at your current situation, identify the biggest bottlenecks and see where software, automation or AI can create the most leverage.

Book a free discovery call:
${normalizedCalLink}
`
    : ""
}

Daniel VLKO
Software Developer & Automation Architect

danielvlko.com
    `.trim();

    const {
      data: confirmationData,
      error: confirmationError,
    } = await resend.emails.send({
      from: contactFromEmail,

      to: [
        email,
      ],

      /*
       * If the lead replies to the confirmation,
       * it goes directly to your inbox.
       */
      replyTo: contactToEmail,

      subject:
        "Thanks for reaching out — Daniel VLKO",

      html: confirmationHtml,

      text: confirmationText,

      tags: [
        {
          name: "source",
          value:
            "website-confirmation",
        },
      ],
    });

    /* ========================================================
       CONFIRMATION EMAIL FAILED

       Internal lead was already delivered,
       so we do NOT return an error to the user.
    ======================================================== */

    if (confirmationError) {
      console.error(
        "Resend confirmation email error:",
        confirmationError,
      );
    }

    /* ========================================================
       SUCCESS
    ======================================================== */

    console.log(
      "Contact inquiry processed:",
      {
        internalEmailId:
          internalData?.id,

        confirmationEmailId:
          confirmationData?.id,

        confirmationSent:
          !confirmationError,

        name,
        email,
      },
    );

    return NextResponse.json({
      ok: true,
      message:
        "Message sent successfully.",
    });
  } catch (error) {
    console.error(
      "Contact API error:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        message:
          "Could not process your message.",
      },
      {
        status: 500,
      },
    );
  }
}