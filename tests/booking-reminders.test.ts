import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import type { PrismaClient } from "@/generated/prisma/client";
import { GoogleCalendarProvider } from "@/lib/booking/calendar/google";
import { processBookingReminders } from "@/lib/booking/reminders";

// In-memory persistence and intercepted HTTP only. Never loads local credentials.
const now = new Date("2026-10-25T08:00:00Z");
const globals = globalThis as typeof globalThis & { __danielVlkoPrisma?: PrismaClient };
let rows: ReturnType<typeof booking>[];
let sent: Record<string, unknown>[];
let failEmail: boolean;
let idempotencyKeys: (string | null)[];

function booking(minutes = 30) {
  return {
    id: "synthetic-reminder", status: "CONFIRMED", startsAt: new Date(+now + minutes * 60000),
    endsAt: new Date(+now + (minutes + 30) * 60000), timezone: "Europe/Vienna",
    scheduleChangedAt: new Date(+now - 72 * 3600000),
    externalCalendarEventId: null as string | null,
    meetingUrl: "https://example.test/meet", cancelTokenHash: "synthetic-hash",
    reminder24hEmailId: null as string | null, reminder30mEmailId: null as string | null,
    lead: { name: "Synthetic visitor", email: "visitor@example.test" },
  };
}

beforeEach(() => {
  rows = [booking()]; sent = []; failEmail = false; idempotencyKeys = [];
  Object.assign(process.env, {
    RESEND_API_KEY: "re_fixture", BOOKING_FROM_EMAIL: "fixture@example.test",
    BOOKING_MANAGE_SECRET: "synthetic-signature-secret-more-than-32-characters",
    SITE_URL: "https://example.test",
  });
  globals.__danielVlkoPrisma = {
    booking: {
      findMany: async () => rows.filter(row => row.status === "CONFIRMED" && +row.startsAt > +now && +row.startsAt <= +now + 24 * 3600000).map(row => ({ ...row })),
      updateMany: async ({ where, data }: { where: Record<string, unknown>; data: Record<string, unknown> }) => {
        const row = rows.find(row => Object.entries(where).every(([key, value]) => {
          const actual = row[key as keyof typeof row];
          return value instanceof Date ? +value === +(actual as Date) : actual === value;
        }));
        if (!row) return { count: 0 };
        Object.assign(row, data); return { count: 1 };
      },
    },
  } as unknown as PrismaClient;
  mock.method(console, "error", () => {});
  mock.method(globalThis, "fetch", async (_url: unknown, options?: RequestInit) => {
    if (failEmail) throw Object.assign(new Error("cookie=synthetic-secret token=synthetic-secret customer@example.test"), { code: "ETIMEDOUT" });
    idempotencyKeys.push(new Headers(options?.headers).get("idempotency-key"));
    sent.push(JSON.parse(String(options?.body)));
    return new Response(JSON.stringify({ id: `fixture-${sent.length}` }), { headers: { "content-type": "application/json" } });
  });
});
afterEach(() => { mock.restoreAll(); delete globals.__danielVlkoPrisma; });

test("30m reminder includes Meet, records success and sequential retry sends nothing", async () => {
  assert.equal((await processBookingReminders(now)).reminder30m.sent, 1);
  assert.match(JSON.stringify(sent[0]), /https:\/\/example.test\/meet/);
  assert.equal((await processBookingReminders(now)).reminder30m.sent, 0);
  assert.equal(sent.length, 1);
});

test("email outage retains retry eligibility and recovers on the next worker run", async () => {
  failEmail = true;
  assert.equal((await processBookingReminders(now)).errors.length, 1);
  assert.equal(rows[0].reminder30mEmailId, null);
  failEmail = false;
  assert.equal((await processBookingReminders(now)).reminder30m.sent, 1);
});

test("missing Meet can be repaired before start; cancelled and past bookings never send", async () => {
  rows[0].meetingUrl = "";
  assert.equal((await processBookingReminders(now)).reminder30m.missingMeetingUrl, 1);
  assert.equal(sent.length, 0);
  rows[0].meetingUrl = "https://example.test/repaired";
  assert.equal((await processBookingReminders(now)).reminder30m.sent, 1);
  rows = [{ ...booking(), status: "CANCELLED" }, booking(-1)];
  await processBookingReminders(now);
  assert.equal(sent.length, 1);
});

test("24h reminder requires 48h advance and expires four hours after its target", async () => {
  rows = [booking(24 * 60)];
  assert.equal((await processBookingReminders(now)).reminder24h.sent, 1);
  rows = [{ ...booking(24 * 60), scheduleChangedAt: now }];
  assert.equal((await processBookingReminders(now)).reminder24h.skippedTooRecent, 1);
  rows = [booking(19 * 60)];
  assert.equal((await processBookingReminders(now)).reminder24h.skippedLate, 1);
  assert.equal(sent.length, 1);
});

test("overlapping workers reuse the provider idempotency key and only one database marker wins", async () => {
  const results = await Promise.all([processBookingReminders(now), processBookingReminders(now)]);
  assert.equal(sent.length, 2, "Two requests reach the mocked provider; this does not count delivered emails");
  assert.ok(idempotencyKeys[0]);
  assert.equal(idempotencyKeys[0], idempotencyKeys[1]);
  assert.equal(results.reduce((sum, result) => sum + result.reminder30m.sent, 0), 1);
});


test("reminder delivery errors never expose provider payloads in logs or scheduler results", async () => {
  failEmail = true;
  const logs: unknown[][] = [];
  mock.method(console, "error", (...args: unknown[]) => { logs.push(args); });
  const result = await processBookingReminders(now);
  assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0].message, "Reminder operation failed (unavailable)."); // Resend wraps transport failures without their original code.
  const output = JSON.stringify({ logs, result });
  assert(!output.includes("synthetic-secret"));
  assert(!output.includes("customer@example.test"));
});


test("missing Meet is retrieved automatically, persisted and included in the 30m reminder", async () => {
  Object.assign(process.env, { GOOGLE_CALENDAR_CLIENT_ID: "fixture", GOOGLE_CALENDAR_CLIENT_SECRET: "fixture", GOOGLE_CALENDAR_REFRESH_TOKEN: "fixture" });
  rows[0].externalCalendarEventId = "fixture-event"; rows[0].meetingUrl = "";
  let available = false;
  mock.method(GoogleCalendarProvider.prototype, "getEvent", async (id: string, repair?: boolean) => {
    assert.equal(id, "fixture-event"); assert.equal(repair, true);
    return { externalEventId: id, ...(available ? { meetingUrl: "https://meet.google.com/fixture-only" } : {}) };
  });
  assert.equal((await processBookingReminders(now)).reminder30m.missingMeetingUrl, 1); assert.equal(sent.length, 0);
  available = true;
  assert.equal((await processBookingReminders(now)).reminder30m.sent, 1);
  assert.equal(rows[0].meetingUrl, "https://meet.google.com/fixture-only"); assert(JSON.stringify(sent).includes(rows[0].meetingUrl));
});
