import { requireSameOrigin, readBody, readJson, SecurityError, securityResponse } from "@/lib/security/http";
import { revokeAdminSession } from "@/lib/admin/auth";
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
  try {
    requireSameOrigin(request);
    if (request.body) {
      if (request.headers.get("content-type")?.split(";")[0].trim() === "application/json") {
        if (Object.keys(await readJson(request, 4096)).length) throw new SecurityError(400, "Invalid request.");
      } else { await readBody(request, 4096); }
    }
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (token) await revokeAdminSession(token);
  } catch (error) { return securityResponse(error, "admin_logout"); }

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