import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const LAUNCH_ROUTE = "/coming-soon";

export function proxy(request: NextRequest) {
  /*
   * Production:
   * SITE_MODE=coming-soon
   *
   * Development / Preview:
   * SITE_MODE missing or anything else
   */
  if (process.env.SITE_MODE !== "coming-soon") {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;

  /*
   * Prevent rewrite loop.
   */
  if (pathname === LAUNCH_ROUTE) {
    return NextResponse.next();
  }

  if (pathname === "/contact") {
    return NextResponse.next();
  }

  /*
   * Keep API routes available.
   *
   * This allows the temporary contact modal
   * to continue using your existing API.
   */
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  /*
   * Next.js internal files.
   */
  if (pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

  /*
   * Public images.
   */
  if (pathname.startsWith("/images/")) {
    return NextResponse.next();
  }

  /*
   * Allow static files:
   *
   * favicon.ico
   * robots.txt
   * manifest
   * fonts
   * svg
   * etc.
   */
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  /*
   * Rewrite instead of redirect.
   *
   * Visitor still sees:
   *
   * https://danielvlko.com
   *
   * instead of:
   *
   * /coming-soon
   */
  const url = request.nextUrl.clone();

  url.pathname = LAUNCH_ROUTE;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: "/:path*",
};