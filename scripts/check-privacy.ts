import assert from "node:assert/strict";
import {
  PRIVACY_CHOICE_KEY, PRIVACY_CHOICE_MAX_AGE, parsePrivacyChoice,
  readPrivacyChoice, savePrivacyChoice, sanitizeTelemetryUrl,
  isPublicTelemetryPath,
} from "../src/lib/privacy";

const now = Date.now();
assert.equal(parsePrivacyChoice(null, now), null);
assert.equal(parsePrivacyChoice("broken", now), null);
assert.equal(parsePrivacyChoice("null", now), null);
assert.equal(parsePrivacyChoice(JSON.stringify({ version: 2, analytics: true, savedAt: now }), now), null);
assert.equal(parsePrivacyChoice(JSON.stringify({ version: 1, analytics: "true", savedAt: now }), now), null);
assert.equal(parsePrivacyChoice(JSON.stringify({ version: 1, analytics: true, savedAt: now + 1 }), now), null);
assert.equal(parsePrivacyChoice(JSON.stringify({ version: 1, analytics: true, savedAt: now - PRIVACY_CHOICE_MAX_AGE }), now), null);
assert.equal(parsePrivacyChoice(JSON.stringify({ version: 1, analytics: false, savedAt: now }), now)?.analytics, false);

assert.equal(sanitizeTelemetryUrl("https://danielvlko.com/contact?email=private@example.com#token"), "https://danielvlko.com/contact");
assert.equal(sanitizeTelemetryUrl("https://danielvlko.com/booking/manage?token=secret"), null);
assert.equal(sanitizeTelemetryUrl("https://danielvlko.com/admin"), null);
assert.equal(sanitizeTelemetryUrl("https://danielvlko.com/admin/login"), null);
assert.equal(sanitizeTelemetryUrl("not-a-url"), null);
assert.equal(isPublicTelemetryPath(null), false);
assert.equal(isPublicTelemetryPath("/contact"), true);

const existingWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
const storage = new Map<string, string>();
let storageBlocked = false;
let writesBlocked = false;
Object.defineProperty(globalThis, "window", {
  configurable: true,
  value: {
    localStorage: {
      getItem(key: string) {
        if (storageBlocked) throw new Error("Storage disabled");
        return storage.get(key) ?? null;
      },
      setItem(key: string, value: string) {
        if (storageBlocked || writesBlocked) throw new Error("Storage disabled");
        storage.set(key, value);
      },
    },
  },
});

try {
  assert.equal(readPrivacyChoice(), null);
  savePrivacyChoice(true);
  assert.equal(readPrivacyChoice()?.analytics, true);
  savePrivacyChoice(false);
  assert.equal(readPrivacyChoice()?.analytics, false, "Withdrawal must be effective for the next event");
  storage.set(PRIVACY_CHOICE_KEY, JSON.stringify({ version: 1, analytics: true, savedAt: Date.now() }));
  assert.equal(readPrivacyChoice()?.analytics, true, "Read the latest choice, including another tab's change");
  storage.delete(PRIVACY_CHOICE_KEY);
  assert.equal(readPrivacyChoice(), null);
  storageBlocked = true;
  savePrivacyChoice(true);
  assert.equal(readPrivacyChoice()?.analytics, true);
  savePrivacyChoice(false);
  assert.equal(readPrivacyChoice()?.analytics, false);
  storageBlocked = false;
  writesBlocked = true;
  savePrivacyChoice(true);
  assert.equal(readPrivacyChoice()?.analytics, true, "Quota/readable-storage failures retain the page-session choice");
  savePrivacyChoice(false);
  assert.equal(readPrivacyChoice()?.analytics, false);
} finally {
  if (existingWindow) Object.defineProperty(globalThis, "window", existingWindow);
  else Reflect.deleteProperty(globalThis, "window");
}

console.log("Privacy checks passed: consent parsing, expiration, withdrawal, blocked storage and sensitive URL exclusion.");
