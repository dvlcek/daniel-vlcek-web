"use client";

import { track } from "@vercel/analytics";
import { isPublicTelemetryPath, readPrivacyChoice } from "@/lib/privacy";

type ContactEvent = "contact_click" | "booking_time_selected" | "booking_confirmed";

// Send only fixed labels and the public path, never booking or personal details.
export function trackContactEvent(event: ContactEvent, source?: string) {
  if (
    typeof window === "undefined" ||
    !readPrivacyChoice()?.analytics ||
    !isPublicTelemetryPath(window.location.pathname)
  ) return;

  try {
    track(event, { path: window.location.pathname, ...(source ? { source } : {}) });
  } catch {
    // Measurement must never interrupt navigation or a successful booking.
  }
}
