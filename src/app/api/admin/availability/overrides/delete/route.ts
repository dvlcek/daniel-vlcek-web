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
   POST
========================================================= */

export async function POST(
  request: NextRequest,
) {
  try {
    const formData =
      await readAdminForm(request, "deleteOverride");

    const overrideId =
      formData
        .get(
          "overrideId",
        )
        ?.toString()
        .trim();

    if (overrideId) {
      const db =
        getDb();

      await db.availabilityOverride.deleteMany({
        where: {
          id:
            overrideId,
        },
      });

      revalidatePath(
        "/admin",
      );
    }
  } catch (error) {
    if (error instanceof SecurityError) return securityResponse(error, "admin_mutation");
    logSecurityFailure("Admin availability override deletion failed:", error);
  }

  return NextResponse.redirect(
    new URL(
      "/admin#availability",
      request.url,
    ),
    303,
  );
}