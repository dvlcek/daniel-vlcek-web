import {
  NextRequest,
  NextResponse,
} from "next/server";

/* =========================================================
   PUBLIC ROUTE GATE

   The main website is temporarily hidden behind
   /coming-soon.

   These routes must remain directly accessible:

   - /coming-soon
   - /admin
   - /booking/manage
   - /api/*
   - Next.js internal assets
   - static/public assets
========================================================= */

export function proxy(
  request: NextRequest,
) {
  const {
    pathname,
  } =
    request.nextUrl;

  /* =======================================================
     NEXT INTERNAL
  ======================================================= */

  if (
    pathname.startsWith(
      "/_next",
    )
  ) {
    return NextResponse.next();
  }

  /* =======================================================
     API

     Includes:
     - booking
     - contact
     - admin auth/actions
     - cron worker
  ======================================================= */

  if (
    pathname.startsWith(
      "/api/",
    )
  ) {
    return NextResponse.next();
  }

  /* =======================================================
     COMING SOON PAGE

     Must not rewrite itself.
  ======================================================= */

  if (
    pathname ===
      "/coming-soon" ||
    pathname.startsWith(
      "/coming-soon/",
    )
  ) {
    return NextResponse.next();
  }

  /* =======================================================
     ADMIN CONTROL CENTER

     Authentication is handled inside /admin itself.
  ======================================================= */

  if (
    pathname ===
      "/admin" ||
    pathname.startsWith(
      "/admin/",
    )
  ) {
    return NextResponse.next();
  }

  /* =======================================================
     CUSTOMER BOOKING MANAGEMENT

     Required for links coming from confirmation
     and reminder emails.
  ======================================================= */

  if (
    pathname ===
      "/booking/manage" ||
    pathname.startsWith(
      "/booking/manage/",
    )
  ) {
    return NextResponse.next();
  }

  /* =======================================================
     WELL-KNOWN / SEO / BASIC PUBLIC FILES
  ======================================================= */

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

  /* =======================================================
     STATIC PUBLIC FILES

     Files such as:
     /images/hero/earth.png
     /fonts/...
     etc.

     Do not rewrite requests that clearly target a file.
  ======================================================= */

  const lastSegment =
    pathname
      .split("/")
      .pop() ??
    "";

  if (
    lastSegment.includes(
      ".",
    )
  ) {
    return NextResponse.next();
  }

  /* =======================================================
     EVERYTHING ELSE -> COMING SOON

     The URL stays unchanged in the browser while Next.js
     renders /coming-soon internally.
  ======================================================= */

  const url =
    request.nextUrl.clone();

  url.pathname =
    "/coming-soon";

  return NextResponse.rewrite(
    url,
  );
}

/* =========================================================
   MATCHER

   Avoid running Proxy for the most common Next.js
   static/image internals.

   Everything else is evaluated by the logic above.
========================================================= */

export const config = {
  matcher: [
    "/((?!_next/static|_next/image).*)",
  ],
};