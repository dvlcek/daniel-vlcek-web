import { logSecurityFailure } from "@/lib/security/log";
import { SecurityError, readBody, requireSameOrigin, securityResponse } from "@/lib/security/http";
import { limitRequest } from "@/lib/security/rate-limit";
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
    requireSameOrigin(request);
    await limitRequest(request, "login");
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.startsWith("application/x-www-form-urlencoded") && !contentType.startsWith("multipart/form-data;")) {
      throw new SecurityError(415, "Invalid request.");
    }
    const body = await readBody(request, 4096);
    let formData: FormData;
    try {
      formData = await new Request(request.url, { method: "POST", headers: { "content-type": contentType }, body }).formData();
    } catch {
      throw new SecurityError(400, "Invalid request.");
    }

    const password =
      formData
        .get(
          "password",
        )
        ?.toString() ??
      "";

    if (typeof formData.get("password") !== "string" || password.length > 256 || !password) {
      throw new SecurityError(400, "Invalid request.");
    }
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
    if (error instanceof SecurityError) return securityResponse(error, "admin_login");
    logSecurityFailure("Admin login failed:", error);

    return NextResponse.redirect(
      new URL(
        "/admin/login?error=server",
        request.url,
      ),
      303,
    );
  }
}