import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  ADMIN_COOKIE_NAME,
} from "@/lib/admin/auth";

/* =========================================================
   CONFIG
========================================================= */

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

/* =========================================================
   POST /api/admin/logout
========================================================= */

export async function POST(
  request: NextRequest,
) {
  const response =
    NextResponse.redirect(
      new URL(
        "/admin/login",
        request.url,
      ),
      303,
    );

  response.cookies.set({
    name:
      ADMIN_COOKIE_NAME,

    value:
      "",

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
      0,
  });

  return response;
}