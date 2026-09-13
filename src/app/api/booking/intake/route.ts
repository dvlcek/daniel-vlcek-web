import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  LeadSource,
  LeadStatus,
} from "@/generated/prisma/enums";

import {
  getDb,
} from "@/lib/db";

import {
  BOOKING_INTAKE_MAX_BODY_BYTES,
  parseBookingIntake,
} from "@/lib/booking/intake";

/* =========================================================
   ROUTE CONFIG
========================================================= */

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

/* =========================================================
   CONSTANTS
========================================================= */

/*
 * If a visitor submits the first booking
 * step repeatedly, we reuse their recent
 * unfinished lead instead of creating
 * duplicates.
 */
const ACTIVE_LEAD_REUSE_WINDOW_MS =
  24 * 60 * 60 * 1000;

/* =========================================================
   RESPONSE HELPERS
========================================================= */

function jsonResponse(
  body: unknown,
  status = 200,
) {
  return NextResponse.json(
    body,
    {
      status,

      headers: {
        "Cache-Control":
          "no-store",
      },
    },
  );
}

/* =========================================================
   POST /api/booking/intake
========================================================= */

export async function POST(
  request: NextRequest,
) {
  try {
    /* =====================================================
       BODY SIZE
    ===================================================== */

    const rawBody =
      await request.text();

    if (
      rawBody.length >
      BOOKING_INTAKE_MAX_BODY_BYTES
    ) {
      return jsonResponse(
        {
          ok: false,
          message:
            "Request is too large.",
        },
        413,
      );
    }

    /* =====================================================
       JSON
    ===================================================== */

    let body: unknown;

    try {
      body =
        JSON.parse(rawBody);
    } catch {
      return jsonResponse(
        {
          ok: false,
          message:
            "Invalid request.",
        },
        400,
      );
    }

    /* =====================================================
       VALIDATION
    ===================================================== */

    const parsed =
      parseBookingIntake(
        body,
      );

    if (!parsed.success) {
      return jsonResponse(
        {
          ok: false,
          message:
            parsed.message,
        },
        400,
      );
    }

    const input =
      parsed.data;

    /* =====================================================
       HONEYPOT
    ===================================================== */

    if (input.isBot) {
      /*
       * Pretend that the request was accepted.
       *
       * Do not tell automated spam systems that
       * the honeypot triggered.
       */
      return jsonResponse({
        ok: true,
        leadId: null,
        status:
          "BOOKING_STARTED",
      });
    }

    /* =====================================================
       DATABASE
    ===================================================== */

    const db =
      getDb();

    const reuseSince =
      new Date(
        Date.now() -
          ACTIVE_LEAD_REUSE_WINDOW_MS,
      );

    /*
     * Prevent double-clicks / refreshes from
     * filling the CRM with duplicate leads.
     *
     * Only unfinished booking attempts from
     * the last 24 hours are reused.
     */
    const existingLead =
      await db.lead.findFirst({
        where: {
          emailNormalized:
            input.email,

          source:
            LeadSource.WEBSITE_BOOKING,

          status:
            LeadStatus.BOOKING_STARTED,

          createdAt: {
            gte: reuseSince,
          },
        },

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          company: true,
          website: true,
          phone: true,
          message: true,
        },
      });

    /* =====================================================
       REUSE EXISTING LEAD
    ===================================================== */

    if (existingLead) {
      const lead =
        await db.lead.update({
          where: {
            id:
              existingLead.id,
          },

          data: {
            name:
              input.name,

            email:
              input.email,

            emailNormalized:
              input.email,

            company:
              input.company ??
              existingLead.company,

            website:
              input.website ??
              existingLead.website,

            phone:
              input.phone ??
              existingLead.phone,

            message:
              input.message ??
              existingLead.message,

            status:
              LeadStatus.BOOKING_STARTED,
          },

          select: {
            id: true,
            status: true,
          },
        });

      return jsonResponse({
        ok: true,

        leadId:
          lead.id,

        status:
          lead.status,

        reused:
          true,
      });
    }

    /* =====================================================
       CREATE LEAD
    ===================================================== */

    const lead =
      await db.lead.create({
        data: {
          name:
            input.name,

          email:
            input.email,

          emailNormalized:
            input.email,

          company:
            input.company,

          website:
            input.website,

          phone:
            input.phone,

          message:
            input.message,

          source:
            LeadSource.WEBSITE_BOOKING,

          status:
            LeadStatus.BOOKING_STARTED,
        },

        select: {
          id: true,
          status: true,
        },
      });

    return jsonResponse(
      {
        ok: true,

        leadId:
          lead.id,

        status:
          lead.status,

        reused:
          false,
      },
      201,
    );
  } catch (error) {
    console.error(
      "Booking intake API error:",
      error,
    );

    /*
     * Never expose Prisma / Postgres internals
     * to the browser.
     */
    return jsonResponse(
      {
        ok: false,

        message:
          "Booking is temporarily unavailable. Please try again.",
      },
      500,
    );
  }
}