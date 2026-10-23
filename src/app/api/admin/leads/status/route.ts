import { readAdminForm } from "@/lib/admin/request";
import { SecurityError, securityResponse } from "@/lib/security/http";
import { logSecurityFailure } from "@/lib/security/log";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  revalidatePath,
} from "next/cache";

import {
  LeadStatus,
} from "@/generated/prisma/enums";

import {
  getDb,
} from "@/lib/db";

/* =========================================================
   CONFIG
========================================================= */

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

/* =========================================================
   ALLOWED STATUSES
========================================================= */

const allowedStatuses =
  new Set<LeadStatus>([
    LeadStatus.NEW,
    LeadStatus.BOOKING_STARTED,
    LeadStatus.BOOKED,
    LeadStatus.QUALIFIED,
    LeadStatus.WON,
    LeadStatus.LOST,
    LeadStatus.NO_SHOW,
    LeadStatus.ARCHIVED,
  ]);

/* =========================================================
   POST
========================================================= */

export async function POST(
  request: NextRequest,
) {
  try {
    const formData =
      await readAdminForm(request, "lead");

    const leadId =
      formData
        .get(
          "leadId",
        )
        ?.toString();

    const statusRaw =
      formData
        .get(
          "status",
        )
        ?.toString();

    if (
      !leadId ||
      !statusRaw
    ) {
      return NextResponse.redirect(
        new URL(
          "/admin",
          request.url,
        ),
        303,
      );
    }

    const status =
      statusRaw as
        LeadStatus;

    if (
      !allowedStatuses.has(
        status,
      )
    ) {
      return NextResponse.redirect(
        new URL(
          "/admin",
          request.url,
        ),
        303,
      );
    }

    const db =
      getDb();

    await db.lead.update({
      where: {
        id:
          leadId,
      },

      data: {
        status,
      },
    });

    revalidatePath(
      "/admin",
    );

    return NextResponse.redirect(
      new URL(
        "/admin",
        request.url,
      ),
      303,
    );
  } catch (error) {
    if (error instanceof SecurityError) return securityResponse(error, "admin_mutation");
    logSecurityFailure("Admin lead status update failed:", error);

    return NextResponse.redirect(
      new URL(
        "/admin",
        request.url,
      ),
      303,
    );
  }
}