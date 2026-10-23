import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { trackContactEvent } from "../src/lib/contact-analytics";
import { savePrivacyChoice } from "../src/lib/privacy";
import { proxy } from "../src/proxy";

const previousLaunchSetting = process.env.COMING_SOON_ENABLED;
try {
  for (const setting of [undefined, "true", "false"]) {
    if (setting === undefined) delete process.env.COMING_SOON_ENABLED;
    else process.env.COMING_SOON_ENABLED = setting;
    for (const path of ["/contact", "/privacy", "/cookies", "/legal"]) {
      const response = proxy(new NextRequest(`https://danielvlko.com${path}`));
      assert.equal(response.headers.get("x-middleware-next"), "1", `${path} must remain accessible in launch mode ${setting}`);
    }
  }
  process.env.COMING_SOON_ENABLED = "true";
  assert.equal(
    proxy(new NextRequest("https://danielvlko.com/work")).headers.get("x-middleware-rewrite"),
    "https://danielvlko.com/coming-soon",
    "The existing launch gate remains active for other pages",
  );
} finally {
  if (previousLaunchSetting === undefined) delete process.env.COMING_SOON_ENABLED;
  else process.env.COMING_SOON_ENABLED = previousLaunchSetting;
}

const existingWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
const storage = new Map<string, string>();
const events: unknown[] = [];
const location = { pathname: "/", search: "?email=private@example.com", hash: "#secret" };
const testWindow = {
  location,
  localStorage: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  },
  va: (type: string, payload: unknown) => events.push({ type, payload }),
};

Object.defineProperty(globalThis, "window", { configurable: true, value: testWindow });

try {
  trackContactEvent("contact_click", "hero");
  assert.equal(events.length, 0, "No events before consent");
  savePrivacyChoice(false);
  trackContactEvent("contact_click", "hero");
  assert.equal(events.length, 0, "No events after rejection");

  savePrivacyChoice(true);
  trackContactEvent("contact_click", "hero");
  assert.deepEqual(events[0], {
    type: "event",
    payload: {
      name: "contact_click",
      data: { path: "/", source: "hero" },
      options: undefined,
    },
  }, "Clicks contain only public path and source, excluding query parameters");

  location.pathname = "/contact";
  trackContactEvent("booking_time_selected");
  trackContactEvent("booking_confirmed");
  assert.equal(events.length, 3);
  assert.deepEqual(events[2], {
    type: "event",
    payload: { name: "booking_confirmed", data: { path: "/contact" }, options: undefined },
  }, "Confirmation contains no personal details or booking identifiers");

  for (const path of ["/admin", "/booking/manage", "/api/booking/confirm"]) {
    location.pathname = path;
    trackContactEvent("booking_confirmed");
  }
  assert.equal(events.length, 3, "Private routes never emit contact analytics");

  location.pathname = "/coming-soon";
  trackContactEvent("contact_click", "coming-soon-contact");
  assert.equal(events.length, 4, "Coming-soon CTAs are measured after consent");

  location.pathname = "/contact";
  savePrivacyChoice(false);
  trackContactEvent("booking_confirmed");
  assert.equal(events.length, 4, "Withdrawal takes effect on the next event");

  savePrivacyChoice(true);
  testWindow.va = () => { throw new Error("Analytics unavailable"); };
  assert.doesNotThrow(() => trackContactEvent("booking_confirmed"));
} finally {
  if (existingWindow) Object.defineProperty(globalThis, "window", existingWindow);
  else Reflect.deleteProperty(globalThis, "window");
}

console.log("Contact checks passed: launch-mode routing, consent, source labels, conversion events, sensitive-route exclusion and telemetry failures.");
