import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  getAdminSessionMaxAge,
  verifyAdminPassword,
} from "@/lib/admin/auth";

/* =========================================================
   CONFIG
========================================================= */

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

/* =========================================================
   POST /api/admin/login
========================================================= */

export async function POST(
  request: NextRequest,
) {
  try {
    const formData =
      await request.formData();

    const password =
      formData
        .get(
          "password",
        )
        ?.toString() ??
      "";

    const valid =
      verifyAdminPassword(
        password,
      );

    if (!valid) {
      return NextResponse.redirect(
        new URL(
          "/admin/login?error=1",
          request.url,
        ),
        303,
      );
    }

    const token =
      createAdminSessionToken();

    const response =
      NextResponse.redirect(
        new URL(
          "/admin",
          request.url,
        ),
        303,
      );

    response.cookies.set({
      name:
        ADMIN_COOKIE_NAME,

      value:
        token,

      httpOnly:
        true,

      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite:
        "lax",

      path:
        "/",

      maxAge:
        getAdminSessionMaxAge(),
    });

    return response;
  } catch (error) {
    console.error(
      "Admin login failed:",
      error,
    );

    return NextResponse.redirect(
      new URL(
        "/admin/login?error=server",
        request.url,
      ),
      303,
    );
  }
}