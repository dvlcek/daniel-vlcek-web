import type {
  CalendarProvider,
} from "@/lib/booking/calendar/provider";

import {
  GoogleCalendarProvider,
} from "@/lib/booking/calendar/google";

/* =========================================================
   CONFIG
========================================================= */

export function isGoogleCalendarConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CALENDAR_CLIENT_ID &&
      process.env.GOOGLE_CALENDAR_CLIENT_SECRET &&
      process.env.GOOGLE_CALENDAR_REFRESH_TOKEN,
  );
}

/* =========================================================
   PROVIDER
========================================================= */

export function getCalendarProvider():
  | CalendarProvider
  | null {
  if (!isGoogleCalendarConfigured()) {
    return null;
  }

  return new GoogleCalendarProvider();
}