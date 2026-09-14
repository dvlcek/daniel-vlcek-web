type BuildBookingManageUrlInput = {
  origin: string;
  bookingId: string;
  token: string;
};

function resolveSiteBase(origin: string): URL {
  const configuredSiteUrl =
    process.env.SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredSiteUrl) {
    try {
      return new URL(configuredSiteUrl);
    } catch {
      console.error("Invalid SITE_URL / NEXT_PUBLIC_SITE_URL.");
    }
  }

  return new URL(origin);
}

export function buildBookingManageUrl(
  input: BuildBookingManageUrlInput,
): string {
  const base = resolveSiteBase(input.origin);

  const url = new URL("/booking/manage", base);

  const fragment = new URLSearchParams({
    booking: input.bookingId,
    token: input.token,
  });

  url.hash = fragment.toString();

  return url.toString();
}