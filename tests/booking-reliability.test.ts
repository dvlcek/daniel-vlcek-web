import assert from "node:assert/strict";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID, randomBytes } from "node:crypto";
import { beforeEach, afterEach, mock, test } from "node:test";
import { DateTime } from "luxon";
import { NextRequest } from "next/server";
import { Prisma, type Booking, type PrismaClient } from "@/generated/prisma/client";
import { GoogleCalendarProvider } from "@/lib/booking/calendar/google";
import type { CalendarEventResult } from "@/lib/booking/calendar/provider";
import { beginCalendarOperation, deliverBookingNotification, lockReservations, operationData, processBookingRecovery, recoverCalendarOperation, requireFreeSlot, stableCalendarId } from "@/lib/booking/recovery";
import { createBookingToken } from "@/lib/booking/tokens";
import { attemptCookieName, hashCapability } from "@/lib/booking/session";
import { POST as confirm } from "@/app/api/booking/confirm/route";
import { POST as cancel } from "@/app/api/booking/cancel/route";
import { POST as reschedule } from "@/app/api/booking/reschedule/route";
import { POST as adminStatus } from "@/app/api/admin/bookings/status/route";
import { createAdminSessionToken } from "@/lib/admin/auth";

type Row = Record<string, unknown> & { id: string };
type Args = { where?: Record<string, unknown>; data?: Record<string, unknown>; take?: number };
const origin = "https://example.test";
const globals = globalThis as typeof globalThis & { __danielVlkoPrisma?: PrismaClient };
const savedEnv = { ...process.env };
let db: PrismaClient, rows: Map<string, Row>, leads: Map<string, Row>, attempts: Map<string, Row>;
let remote: Map<string, CalendarEventResult>, email: { key: string | null; body: string }[];
const transactionScope = new AsyncLocalStorage<boolean>();
const transactionWrites = new AsyncLocalStorage<Set<Row>>();
let logs: unknown[][], lockCount: number, createCount: number, patchCount: number, deleteCount: number;
let failCreate: boolean, timeoutCreate: boolean, timeoutPatch: boolean, failFinalize: boolean, failEmail: boolean, failEmailMarker: boolean;
let token: string, booking: Booking;
const tomorrow = () => DateTime.now().setZone("Europe/Vienna").plus({ days: 1 }).startOf("day").plus({ hours: 12 }).toJSDate();
function matches(row: Row, where: Record<string, unknown> = {}): boolean {
  return Object.entries(where).every(([key, value]) => {
    if (key === "OR") return (value as Record<string, unknown>[]).some(w => matches(row, w));
    const actual = row[key];
    if (value instanceof Date) return +(actual as Date) === +value;
    if (value && typeof value === "object") {
      const filter = value as Record<string, unknown>;
      if ("equals" in filter) return JSON.stringify(actual) === JSON.stringify(filter.equals);
      if ("not" in filter) return actual !== (filter.not === Prisma.DbNull ? null : filter.not);
      if ("in" in filter) return (filter.in as unknown[]).includes(actual);
      return Object.entries(filter).every(([op, bound]) => {
        const a = Number(actual), b = Number(bound);
        return op === "lt" ? a < b : op === "lte" ? a <= b : op === "gt" ? a > b : op === "gte" ? a >= b : false;
      });
    }
    return actual === value;
  });
}
function model(map: Map<string, Row>, bookings = false) {
  const read = (where?: Record<string, unknown>) => {
    const row = [...map.values()].find(row => matches(row, where));
    return row ? { ...row, ...(bookings ? { lead: { ...leads.get(String(row.leadId)) } } : {}) } : null;
  };
  return {
    findUnique: async ({ where }: Args) => read(where),
    findUniqueOrThrow: async ({ where }: Args) => { const row = read(where); assert(row); return row; },
    findFirst: async ({ where }: Args) => read(where),
    findMany: async ({ where, take }: Args = {}) => [...map.values()].filter(row => matches(row, where)).slice(0, take ?? Infinity).map(row => ({ ...row })),
    create: async ({ data }: Args) => { const row = makeBooking({ ...data }); transactionWrites.getStore()?.add(row); map.set(row.id, row); return { ...row }; },
    update: async ({ where, data }: Args) => { const row = [...map.values()].find(row => matches(row, where)); assert(row); transactionWrites.getStore()?.add(row); Object.assign(row, data); return { ...row }; },
    updateMany: async ({ where, data }: Args) => {
      if (bookings && data?.status === "CONFIRMED" && failFinalize) { failFinalize = false; throw Object.assign(new Error("synthetic-db-secret"), { code: "P2028" }); }
      if (bookings && data?.notificationSentAt && failEmailMarker) { failEmailMarker = false; throw new Error("synthetic marker loss"); }
      let count = 0;
      for (const row of map.values()) if (matches(row, where)) { transactionWrites.getStore()?.add(row); Object.assign(row, data); count++; }
      return { count };
    },
  };
}
function makeBooking(data: Record<string, unknown> = {}): Row {
  const startsAt = tomorrow();
  return { id: randomUUID(), leadId: "lead-fixture", startsAt, endsAt: new Date(+startsAt + 1800000), timezone: "Europe/Vienna", status: "CONFIRMED",
    activeSlotKey: startsAt.toISOString(), cancelTokenHash: null, externalCalendarEventId: "fixture-event", externalCalendarUrl: null, meetingUrl: "https://example.test/meet",
    calendarOperation: null, calendarOperationKey: null, calendarOperationEtag: null, calendarLeaseUntil: null, calendarError: null,
    notification: null, notificationSentAt: null, notificationFirstAttemptAt: null, notificationLeaseUntil: null,
    reminder24hEmailId: null, reminder30mEmailId: null, scheduleChangedAt: new Date(Date.now() - 10000), createdAt: new Date(), updatedAt: new Date(), ...data };
}
function snapshot() { return { ...rows.get(booking.id)! } as unknown as Booking; }
function post(path: string, body: unknown, cookie = "") {
  return new NextRequest(origin + "/api/" + path, { method: "POST", headers: { origin, cookie, "content-type": "application/json" }, body: JSON.stringify(body) });
}
function noTransaction() { assert(!transactionScope.getStore(), "Provider I/O must occur outside database transactions"); }

beforeEach(() => {
  Object.assign(process.env, { NODE_ENV: "test", SECURITY_ALLOWED_ORIGINS: origin, SECURITY_RATE_LIMIT_SECRET: "fixture-rate-secret-at-least-32-characters",
    ADMIN_PASSWORD: "fixture-password", ADMIN_SESSION_SECRET: "fixture-session-secret-at-least-32-characters", BOOKING_MANAGE_SECRET: "fixture-management-secret-at-least-32-characters",
    GOOGLE_CALENDAR_CLIENT_ID: "fixture", GOOGLE_CALENDAR_CLIENT_SECRET: "fixture", GOOGLE_CALENDAR_REFRESH_TOKEN: "fixture",
    RESEND_API_KEY: "re_fixture", BOOKING_FROM_EMAIL: "fixture@example.test", BOOKING_ORGANIZER_EMAIL: "organizer@example.test", SITE_URL: origin });
  rows = new Map(); attempts = new Map(); leads = new Map([["lead-fixture", { id: "lead-fixture", name: "Synthetic client", email: "client@example.test", company: null, website: null, message: null, status: "BOOKED", source: "WEBSITE_BOOKING" }]]);
  email = []; remote = new Map(); logs = []; lockCount = createCount = patchCount = deleteCount = 0;
  failCreate = timeoutCreate = timeoutPatch = failFinalize = failEmail = failEmailMarker = false;
  const capability = createBookingToken(); token = capability.token;
  const row = makeBooking({ id: "booking-fixture", cancelTokenHash: capability.tokenHash }); rows.set(row.id, row); booking = { ...row } as unknown as Booking;
  remote.set("fixture-event", { externalEventId: "fixture-event", etag: "v1", startsAt: booking.startsAt, endsAt: booking.endsAt, meetingUrl: "https://example.test/meet" });
  let tail = Promise.resolve();
  db = {
    booking: model(rows, true), lead: model(leads), bookingAttempt: model(attempts),
    adminSession: { create: async ({ data }: { data: Row }) => { sessions.set(String(data.tokenHash), data); return data; }, findUnique: async ({ where }: { where: { tokenHash: string } }) => sessions.get(where.tokenHash) ?? null },
    availabilityRule: { findMany: async () => Array.from({ length: 7 }, (_, weekday) => ({ weekday, startMinute: 0, endMinute: 1440, enabled: true })) },
    availabilityOverride: { findMany: async () => [] },
    $executeRaw: async () => { lockCount++; return 1; },
    $queryRaw: async (strings: TemplateStringsArray, ...values: unknown[]) => {
      if (strings.join("").includes("SecurityRateLimit")) return [{ hits: 1, retryAfter: 60 }];
      const row = attempts.get(String(values[0])); return row && row.tokenHash === values[1] ? [{ id: row.id }] : [];
    },
    $transaction: async (fn: (tx: PrismaClient) => Promise<unknown>) => {
      let unlock!: () => void; const previous = tail; tail = new Promise(resolve => { unlock = resolve; }); await previous;
      const snapshots = [structuredClone(rows), structuredClone(leads), structuredClone(attempts)];
      const changed = new Set<Row>();
      try { return await transactionScope.run(true, () => transactionWrites.run(changed, () => fn(db))); } catch (error) {
        for (const [index, map] of [rows, leads, attempts].entries()) for (const [key, value] of map) if (changed.has(value)) {
          const original = snapshots[index].get(key); if (original) map.set(key, original); else map.delete(key);
        }
        throw error;
      } finally { unlock(); }
    },
  } as unknown as PrismaClient;
  const sessions = new Map<string, Row>();
  globals.__danielVlkoPrisma = db;
  mock.method(console, "error", (...args: unknown[]) => { logs.push(args); });
  mock.method(GoogleCalendarProvider.prototype, "getBusyPeriods", async () => []);
  mock.method(GoogleCalendarProvider.prototype, "getBusyPeriodsExcludingEvent", async () => []);
  mock.method(GoogleCalendarProvider.prototype, "getEvent", async (id: string) => { noTransaction(); return remote.get(id) ?? null; });
  mock.method(GoogleCalendarProvider.prototype, "createEvent", async (input: import("@/lib/booking/calendar/provider").CreateCalendarEventInput) => {
    noTransaction(); createCount++;
    if (failCreate) throw new Error("synthetic-provider-secret");
    const id = input.externalEventId!;
    if (!remote.has(id)) remote.set(id, { externalEventId: id, bookingId: input.bookingId, etag: "v1", startsAt: input.startsAt, endsAt: input.endsAt, meetingUrl: "https://example.test/meet" });
    if (timeoutCreate) { timeoutCreate = false; throw new Error("synthetic-provider-secret"); }
    return remote.get(id)!;
  });
  mock.method(GoogleCalendarProvider.prototype, "updateEvent", async (input: import("@/lib/booking/calendar/provider").UpdateCalendarEventInput) => {
    noTransaction(); const event = remote.get(input.externalEventId)!;
    if (input.etag !== event.etag) throw Object.assign(new Error("precondition"), { code: 412 });
    patchCount++; Object.assign(event, { startsAt: input.startsAt, endsAt: input.endsAt, etag: "v" + (patchCount + 1) });
    if (timeoutPatch) { timeoutPatch = false; throw new Error("synthetic-provider-secret"); }
    return { ...event };
  });
  mock.method(GoogleCalendarProvider.prototype, "cancelEvent", async (id: string, etag?: string) => {
    noTransaction(); const event = remote.get(id);
    if (event && event.etag !== etag) throw Object.assign(new Error("precondition"), { code: 412 });
    remote.delete(id); deleteCount++;
  });
  mock.method(globalThis, "fetch", async (_url: unknown, input?: RequestInit) => {
    noTransaction(); email.push({ key: new Headers(input?.headers).get("idempotency-key"), body: String(input?.body) });
    if (failEmail) throw new Error("synthetic-email-secret");
    return new Response(JSON.stringify({ id: "fixture-email" }), { headers: { "content-type": "application/json" } });
  });
});
afterEach(() => { mock.restoreAll(); delete globals.__danielVlkoPrisma; for (const key of Object.keys(process.env)) if (!(key in savedEnv)) delete process.env[key]; Object.assign(process.env, savedEnv); });

for (const pair of [["CANCEL", "RESCHEDULE"], ["RESCHEDULE", "RESCHEDULE"], ["CANCEL", "CANCEL"]] as const) {
  test(`competing ${pair.join("/")} operations have one owner; stale snapshot cannot mutate`, async () => {
    const results = await Promise.allSettled(pair.map(kind => beginCalendarOperation(snapshot(), kind, kind === "RESCHEDULE" ? { startsAt: new Date(+booking.startsAt + 3600000), endsAt: new Date(+booking.endsAt + 3600000) } : undefined)));
    assert.equal(results.filter(r => r.status === "fulfilled").length, 1);
    assert.equal(snapshot().status, "PENDING");
    assert(await recoverCalendarOperation(booking.id));
    if (snapshot().status === "CANCELLED") assert.equal(remote.size, 0);
    await assert.rejects(beginCalendarOperation(booking, "RESCHEDULE", { startsAt: booking.startsAt, endsAt: booking.endsAt }));
    assert.equal(lockCount >= 3, true);
  });
}

test("distinct attempts cannot reserve overlapping or buffered adjacent intervals in either order", async () => {
  rows.clear();
  const a = tomorrow(), b = new Date(+a + 1800000);
  const reserve = (start: Date) => db.$transaction(async tx => { await lockReservations(tx); await requireFreeSlot(tx, start, new Date(+start + 1800000)); return tx.booking.create({ data: { leadId: "lead-fixture", startsAt: start, endsAt: new Date(+start + 1800000), timezone: "Europe/Vienna", status: "PENDING" } }); });
  for (const order of [[a, b], [b, a]]) {
    rows.clear(); const result = await Promise.allSettled(order.map(reserve));
    assert.equal(result.filter(r => r.status === "fulfilled").length, 1); assert.equal(rows.size, 1);
  }
});

function pendingCreate() { const row = rows.get(booking.id)!; Object.assign(row, { ...operationData("CREATE"), status: "PENDING", externalCalendarEventId: stableCalendarId(row.id) }); remote.clear(); }

test("calendar creation failure retains ownership/slot; retry reuses stable event identity", async () => {
  pendingCreate(); failCreate = true;
  assert(!await recoverCalendarOperation(booking.id)); assert.equal(snapshot().status, "PENDING"); assert(snapshot().activeSlotKey);
  failCreate = false; assert(await recoverCalendarOperation(booking.id)); assert.equal(snapshot().status, "CONFIRMED"); assert.equal(remote.size, 1);
});

test("accepted create followed by timeout or DB failure recovers without duplicate event or compensation", async () => {
  for (const failure of ["timeout", "db"]) {
    pendingCreate(); timeoutCreate = failure === "timeout"; failFinalize = failure === "db";
    assert(!await recoverCalendarOperation(booking.id)); assert.equal(snapshot().status, "PENDING"); assert.equal(remote.size, 1); assert.equal(deleteCount, 0);
    assert(await recoverCalendarOperation(booking.id)); assert.equal(snapshot().status, "CONFIRMED"); assert.equal(remote.size, 1);
  }
  assert(!JSON.stringify(logs).includes("synthetic-provider-secret")); assert(!JSON.stringify(logs).includes("synthetic-db-secret"));
});

test("reschedule timeout converges forward; DB failure after patch never restores a stale schedule", async () => {
  const target = { startsAt: new Date(+booking.startsAt + 3600000), endsAt: new Date(+booking.endsAt + 3600000) };
  await beginCalendarOperation(booking, "RESCHEDULE", target); timeoutPatch = true;
  assert(!await recoverCalendarOperation(booking.id)); assert.equal(snapshot().status, "PENDING");
  failFinalize = true; assert(!await recoverCalendarOperation(booking.id));
  assert(await recoverCalendarOperation(booking.id)); assert.equal(snapshot().status, "CONFIRMED");
  assert.equal(+snapshot().startsAt, +target.startsAt); assert.equal(patchCount, 1);
});

test("unrelated provider version changes are held for review instead of overwritten", async () => {
  await beginCalendarOperation(booking, "RESCHEDULE", { startsAt: new Date(+booking.startsAt + 3600000), endsAt: new Date(+booking.endsAt + 3600000) });
  Object.assign(rows.get(booking.id)!, { calendarOperationEtag: "v0" });
  assert(!await recoverCalendarOperation(booking.id)); assert.equal(patchCount, 0); assert.equal(snapshot().status, "PENDING"); assert(JSON.stringify(logs).includes("HTTP_412"));
});

test("expired crashed lease recovers; a live lease cannot be stolen", async () => {
  pendingCreate(); Object.assign(rows.get(booking.id)!, { calendarLeaseUntil: new Date(Date.now() + 60000) });
  assert(!await recoverCalendarOperation(booking.id)); assert.equal(createCount, 0);
  Object.assign(rows.get(booking.id)!, { calendarLeaseUntil: new Date(0) });
  assert(await recoverCalendarOperation(booking.id)); assert.equal(createCount, 1);
});

test("cancel retry after provider deletion and local failure converges, then duplicate route sends once", async () => {
  await beginCalendarOperation(booking, "CANCEL");
  // A database finalization failure is injected after the delete by replacing only the transaction entry point.
  const transaction = db.$transaction.bind(db);
  mock.method(db, "$transaction", async () => { throw new Error("synthetic local outage"); });
  assert(!await recoverCalendarOperation(booking.id)); assert.equal(remote.size, 0); assert.equal(snapshot().status, "PENDING");
  mock.restoreAll(); globals.__danielVlkoPrisma = db; Object.assign(db, { $transaction: transaction });
  // Reinstall the harmless provider and HTTP boundaries after restoring the transaction mock.
  mock.method(GoogleCalendarProvider.prototype, "getEvent", async () => null);
  mock.method(globalThis, "fetch", async () => { email.push({ key: "cancellation", body: "fixture" }); return new Response('{"id":"fixture"}', { headers: { "content-type": "application/json" } }); });
  assert(await recoverCalendarOperation(booking.id));
  for (let i = 0; i < 2; i++) assert.equal((await cancel(post("booking/cancel", { bookingId: booking.id, token }))).status, 200);
  assert.equal(snapshot().status, "CANCELLED"); assert.equal(email.length, 1);
});

test("failed confirmation email retries byte-identically with the same idempotency key; marker loss is safe", async () => {
  pendingCreate(); assert(await recoverCalendarOperation(booking.id));
  failEmail = true; assert(!await deliverBookingNotification(booking.id, origin));
  failEmail = false; failEmailMarker = true; assert(!await deliverBookingNotification(booking.id, origin));
  assert(await deliverBookingNotification(booking.id, origin));
  assert.equal(email.length, 3); assert.equal(new Set(email.map(e => e.key)).size, 1); assert.equal(new Set(email.map(e => e.body)).size, 1);
  assert(await deliverBookingNotification(booking.id, origin)); assert.equal(email.length, 3);
  assert(!JSON.stringify(logs).includes("synthetic-email-secret"));
});

test("expired email deduplication window stops automatic retries and reports operator action", async () => {
  pendingCreate(); assert(await recoverCalendarOperation(booking.id));
  rows.get(booking.id)!.notificationFirstAttemptAt = new Date(Date.now() - 24 * 3600000);
  assert(!await deliverBookingNotification(booking.id, origin)); assert.equal(email.length, 0);
  assert(JSON.stringify(logs).includes("retry_window_expired"));
});

test("admin cannot revive cancelled, completed, pending or provider-inconsistent bookings", async () => {
  const admin = await createAdminSessionToken();
  for (const status of ["CANCELLED", "COMPLETED", "PENDING"]) {
    Object.assign(rows.get(booking.id)!, { status });
    const response = await adminStatus(post("admin/bookings/status", { bookingId: booking.id, status: "CONFIRMED" }, `dv_admin_session=${admin}`));
    assert.equal(response.status, 409); assert.equal(snapshot().status, status);
  }
  Object.assign(rows.get(booking.id)!, { status: "NO_SHOW", activeSlotKey: null });
  assert.equal((await adminStatus(post("admin/bookings/status", { bookingId: booking.id, status: "CONFIRMED" }, `dv_admin_session=${admin}`))).status, 409);
});

test("owned confirmation retries recover email and duplicate confirmations do not create another booking", async () => {
  rows.clear();
  const attemptId = randomUUID(), capability = "A".repeat(43);
  attempts.set(attemptId, { id: attemptId, leadId: "lead-fixture", bookingId: null, tokenHash: hashCapability(capability), expiresAt: new Date(Date.now() + 60000), confirmationEmailSent: false });
  const body = { attemptId, leadId: "lead-fixture", startsAt: tomorrow().toISOString() };
  const request = () => post("booking/confirm", body, `${attemptCookieName(attemptId)}=${capability}`);
  failEmail = true;
  const result = await Promise.all([confirm(request()), confirm(request())]);
  assert(result.some(r => r.status === 201), JSON.stringify({ responses: await Promise.all(result.map(r => r.clone().json())), createCount, rows: [...rows.values()].map(r => ({ id: r.id, op: r.calendarOperation, error: r.calendarError, status: r.status })), logs })); assert(result.every(r => [200, 201, 409].includes(r.status)));
  assert.equal(rows.size, 1); assert.equal(createCount, 1);
  failEmail = false; const response = await confirm(request()); assert.equal(response.status, 200); assert.equal((await response.json()).confirmationEmailSent, true);
  assert.equal(createCount, 1);
});

test("same-target reschedule retries recover notification and cannot resurrect a cancelled booking", async () => {
  const target = new Date(+booking.startsAt + 3600000).toISOString();
  const request = () => post("booking/reschedule", { bookingId: booking.id, token, startsAt: target });
  timeoutPatch = true;
  assert.equal((await reschedule(request())).status, 503);
  assert.equal((await reschedule(request())).status, 200); assert.equal(patchCount, 1);
  assert.equal((await cancel(post("booking/cancel", { bookingId: booking.id, token }))).status, 200);
  assert.equal((await reschedule(request())).status, 409); assert.equal(snapshot().status, "CANCELLED");
});

test("existing recovery worker reports legacy unowned PENDING rows without inventing events", async () => {
  Object.assign(rows.get(booking.id)!, { status: "PENDING", calendarOperation: null });
  const result = await processBookingRecovery(origin);
  assert.equal(result.calendarPending, 1); assert.equal(createCount, 0);
  assert(JSON.stringify(logs).includes("legacy_pending"));
});


test("bounded worker retries durable email without a customer replay", async () => {
  pendingCreate(); assert(await recoverCalendarOperation(booking.id));
  failEmail = true; assert.equal((await processBookingRecovery(origin)).emailPending, 1);
  failEmail = false; assert.equal((await processBookingRecovery(origin)).emailPending, 0);
  assert(snapshot().notificationSentAt); assert.equal(email.length, 2);
});

test("returning to a previous schedule creates a distinct notification occurrence", async () => {
  for (const offset of [3600000, 0]) {
    await beginCalendarOperation(snapshot(), "RESCHEDULE", { startsAt: new Date(+booking.startsAt + offset), endsAt: new Date(+booking.endsAt + offset) });
    assert(await recoverCalendarOperation(booking.id)); assert(await deliverBookingNotification(booking.id, origin));
  }
  assert.equal(email.length, 2); assert.notEqual(email[0].key, email[1].key);
});


test("an expired delayed worker cannot acquire a newer event version and overwrite a later schedule", async () => {
  let entered!: () => void, release!: () => void;
  const waiting = new Promise<void>(resolve => { entered = resolve; });
  const gate = new Promise<void>(resolve => { release = resolve; });
  let first = true;
  mock.method(GoogleCalendarProvider.prototype, "getEvent", async (id: string) => {
    noTransaction();
    if (first) { first = false; entered(); await gate; }
    return { ...remote.get(id)! };
  });
  const slot = (offset: number) => ({ startsAt: new Date(+booking.startsAt + offset), endsAt: new Date(+booking.endsAt + offset) });
  await beginCalendarOperation(booking, "RESCHEDULE", slot(3600000));
  const delayed = recoverCalendarOperation(booking.id); await waiting;
  rows.get(booking.id)!.calendarLeaseUntil = new Date(0);
  assert(await recoverCalendarOperation(booking.id));
  await beginCalendarOperation(snapshot(), "RESCHEDULE", slot(7200000)); assert(await recoverCalendarOperation(booking.id));
  release(); assert(!await delayed);
  assert.equal(remote.get("fixture-event")?.startsAt?.getTime(), +booking.startsAt + 7200000);
  assert.equal(snapshot().startsAt.getTime(), +booking.startsAt + 7200000); assert.equal(patchCount, 2);
});


for (const offsets of [[0, 1800000], [1800000, 0]]) {
  test(`HTTP confirmations from distinct owned attempts serialize buffered reservations (${offsets.join(",")})`, async () => {
    rows.clear(); remote.clear();
    let checked = 0, release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    mock.method(GoogleCalendarProvider.prototype, "getBusyPeriods", async () => { if (++checked === 2) release(); await gate; return []; });
    const requests = offsets.map((offset, index) => {
      const attemptId = randomUUID(), capability = randomBytes(32).toString("base64url"), leadId = `lead-${index}`;
      leads.set(leadId, { ...leads.get("lead-fixture")!, id: leadId });
      attempts.set(attemptId, { id: attemptId, leadId, bookingId: null, tokenHash: hashCapability(capability), expiresAt: new Date(Date.now() + 60000), confirmationEmailSent: false });
      return post("booking/confirm", { attemptId, leadId, startsAt: new Date(+tomorrow() + offset).toISOString() }, `${attemptCookieName(attemptId)}=${capability}`);
    });
    const responses = await Promise.all(requests.map(confirm));
    assert.deepEqual(responses.map(r => r.status).sort(), [201, 409]);
    assert.equal(rows.size, 1); assert.equal(remote.size, 1); assert.equal(createCount, 1);
  });
}


test("admin restores an intact no-show only when buffered reservation remains free", async () => {
  const admin = await createAdminSessionToken();
  const request = () => post("admin/bookings/status", { bookingId: booking.id, status: "CONFIRMED" }, `dv_admin_session=${admin}`);
  Object.assign(rows.get(booking.id)!, { status: "NO_SHOW" });
  const conflict = makeBooking({ id: "other-booking", startsAt: new Date(+booking.startsAt + 900000), endsAt: new Date(+booking.endsAt + 900000) });
  rows.set(conflict.id, conflict);
  assert.equal((await adminStatus(request())).status, 409); assert.equal(snapshot().status, "NO_SHOW");
  rows.delete(conflict.id);
  assert.equal((await adminStatus(request())).status, 303); assert.equal(snapshot().status, "CONFIRMED");
});

test("operation revision prevents stale ABA writes even if timestamps collide", async () => {
  const original = snapshot();
  for (const offset of [3600000, 0]) {
    await beginCalendarOperation(snapshot(), "RESCHEDULE", { startsAt: new Date(+booking.startsAt + offset), endsAt: new Date(+booking.endsAt + offset) });
    assert(await recoverCalendarOperation(booking.id));
  }
  rows.get(booking.id)!.scheduleChangedAt = original.scheduleChangedAt;
  await assert.rejects(beginCalendarOperation(original, "CANCEL"));
  assert.equal(snapshot().status, "CONFIRMED");
});
