import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  revalidatePath,
} from "next/cache";

import {
  isAdminAuthenticated,
} from "@/lib/admin/auth";

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
  const authenticated =
    await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.redirect(
      new URL(
        "/admin/login",
        request.url,
      ),
      303,
    );
  }

  try {
    const formData =
      await request.formData();

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
    console.error(
      "Admin availability override deletion failed:",
      error,
    );
  }

  return NextResponse.redirect(
    new URL(
      "/admin#availability",
      request.url,
    ),
    303,
  );
}