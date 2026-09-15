import {
  NextRequest,
  NextResponse,
} from "next/server";

/**
 * Coming Soon gate
 *
 * Local development:
 *   COMING_SOON_ENABLED=false
 *   -> full real website is available.
 *
 * Production:
 *   env missing / true
 *   -> public website is redirected to /coming-soon.
 *
 * Admin, APIs and booking management always remain accessible.
 */
export function proxy(
  request: NextRequest,
) {
  const pathname =
    request.nextUrl.pathname;

  const comingSoonEnabled =
    process.env.COMING_SOON_ENABLED !==
    "false";

  /*
   * When Coming Soon is disabled,
   * expose the complete application.
   */
  if (!comingSoonEnabled) {
    return NextResponse.next();
  }

  /*
   * Next.js internals.
   */
  if (
    pathname.startsWith(
      "/_next",
    )
  ) {
    return NextResponse.next();
  }

  /*
   * API routes must always work.
   */
  if (
    pathname.startsWith(
      "/api/",
    )
  ) {
    return NextResponse.next();
  }

  /*
   * Coming Soon page itself.
   */
  if (
    pathname ===
      "/coming-soon" ||
    pathname.startsWith(
      "/coming-soon/",
    )
  ) {
    return NextResponse.next();
  }

  /*
   * Private admin.
   */
  if (
    pathname ===
      "/admin" ||
    pathname.startsWith(
      "/admin/",
    )
  ) {
    return NextResponse.next();
  }

  /*
   * Customer booking management.
   */
  if (
    pathname ===
      "/booking/manage" ||
    pathname.startsWith(
      "/booking/manage/",
    )
  ) {
    return NextResponse.next();
  }

  /*
   * SEO / browser metadata.
   */
  if (
    pathname ===
      "/favicon.ico" ||
    pathname ===
      "/robots.txt" ||
    pathname ===
      "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  /*
   * Static assets.
   *
   * Examples:
   * .png
   * .webp
   * .svg
   * .jpg
   * .woff2
   * .json
   */
  if (
    /\.[a-zA-Z0-9]+$/.test(
      pathname,
    )
  ) {
    return NextResponse.next();
  }

  /*
   * Everything else is temporarily hidden
   * behind the Coming Soon page.
   */
  const url =
    request.nextUrl.clone();

  url.pathname =
    "/coming-soon";

  return NextResponse.rewrite(
    url,
  );
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image).*)",
  ],
};