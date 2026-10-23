import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { beforeEach, afterEach, mock, test } from "node:test";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";
import type { PrismaClient } from "@/generated/prisma/client";
import { POST as intake } from "@/app/api/booking/intake/route";
import { POST as confirm } from "@/app/api/booking/confirm/route";
import { POST as contact } from "@/app/api/contact/route";
import { POST as login } from "@/app/api/admin/login/route";
import { POST as manage } from "@/app/api/booking/manage/route";
import { POST as cancel } from "@/app/api/booking/cancel/route";
import { POST as reschedule } from "@/app/api/booking/reschedule/route";
import { GET as availability } from "@/app/api/booking/availability/route";
import { GoogleCalendarProvider } from "@/lib/booking/calendar/google";
import { attemptCookieName, hashCapability, setAttemptCookie, validCapability } from "@/lib/booking/session";
import { consumeLimit, networkIdentity, rateKey } from "@/lib/security/rate-limit";
import { SecurityError, readBody, readJson, requireSameOrigin, securityResponse } from "@/lib/security/http";
import { logSecurityFailure } from "@/lib/security/log";
import { createAdminSessionToken, verifyAdminSessionToken } from "@/lib/admin/auth";
import { createBookingToken } from "@/lib/booking/tokens";

// Entirely in-memory test fixture. No dotenv, real DB, real email or calendar I/O.
type Row = Record<string, unknown> & { id: string };
type Args = { where?: { id?: string; status?: string }; data?: Record<string, unknown> };
function fixture() {
  const leads = new Map<string, Row>(), attempts = new Map<string, Row>(), bookings = new Map<string, Row>();
  const counters = new Map<string, { hits: number; expiresAt: number }>();
  let now = Date.now();
  function delegate(rows: Map<string, Row>) {
    return {
      async findUnique({ where }: Args) { return rows.get(where?.id ?? "") ?? null; },
      async create({ data }: Args) {
        const row = { id: randomUUID(), ...data } as Row;
        rows.set(row.id, row); return row;
      },
      async update({ where, data }: Args) {
        const row = rows.get(where?.id ?? ""); assert(row); Object.assign(row, data); return row;
      },
      async updateMany({ where, data }: Args) {
        const row = rows.get(where?.id ?? "");
        if (row && (!where?.status || row.status === where.status)) { Object.assign(row, data); return { count: 1 }; }
        return { count: 0 };
      },
    };
  }
  let tail = Promise.resolve();
  const db = {
    lead: delegate(leads), bookingAttempt: delegate(attempts),
    booking: {
      ...delegate(bookings),
      async findFirst() { return [...bookings.values()].find(row => row.status === "PENDING" || row.status === "CONFIRMED") ?? null; },
      async findMany() { return [...bookings.values()].filter(row => row.status !== "CANCELLED"); },
    },
    availabilityRule: { async findMany() { return Array.from({ length: 7 }, (_, weekday) => ({ weekday, startMinute: 0, endMinute: 1440, enabled: true })); } },
    availabilityOverride: { async findMany() { return []; } },
    async $executeRaw() { return 1; },
    async $queryRaw(strings: TemplateStringsArray, ...values: unknown[]) {
      if (strings.join("").includes('INSERT INTO "SecurityRateLimit"')) {
        const [key, seconds, maximum] = values as [string, number, number];
        const current = counters.get(key);
        const counter = current && current.expiresAt > now ? current : { hits: 0, expiresAt: now + seconds * 1000 };
        counter.hits = Math.min(counter.hits + 1, maximum ?? Number.MAX_SAFE_INTEGER);
        counters.set(key, counter);
        return [{ hits: counter.hits, retryAfter: Math.max(1, Math.ceil((counter.expiresAt - now) / 1000)) }];
      }
      const [id, hash] = values as [string, string];
      const row = attempts.get(id);
      return row && row.tokenHash === hash && (row.expiresAt as Date).getTime() > Date.now() ? [{ id }] : [];
    },
    async $transaction<T>(fn: (tx: PrismaClient) => Promise<T>) {
      // Model transaction serialization; actual PostgreSQL locks must additionally be integration-tested.
      let unlock!: () => void;
      const previous = tail;
      tail = new Promise(resolve => { unlock = resolve; });
      await previous;
      try { return await fn(db as unknown as PrismaClient); } finally { unlock(); }
    },
  };
  return { db: db as unknown as PrismaClient, leads, attempts, bookings, counters, advance(ms: number) { now += ms; } };
}

let state: ReturnType<typeof fixture>;
let events = 0;
let outbound = 0;
let emailPayloads: { html?: string; text?: string }[] = [];
const savedEnv = { ...process.env };
const origin = "https://example.test";
beforeEach(() => {
  state = fixture(); events = 0; outbound = 0; emailPayloads = [];
  Object.assign(process.env, {
    NODE_ENV: "test", SECURITY_ALLOWED_ORIGINS: origin, SECURITY_RATE_LIMIT_SECRET: "test-only-secret-that-is-at-least-32-characters",
    SECURITY_TRUST_PROXY: "", VERCEL: "", ADMIN_PASSWORD: "fixture-password", ADMIN_SESSION_SECRET: "fixture-admin-session-secret-at-least-32-chars",
    GOOGLE_CALENDAR_CLIENT_ID: "fixture", GOOGLE_CALENDAR_CLIENT_SECRET: "fixture", GOOGLE_CALENDAR_REFRESH_TOKEN: "fixture",
    RESEND_API_KEY: "re_fixture", CONTACT_TO_EMAIL: "owner@example.test", CONTACT_FROM_EMAIL: "fixture@example.test",
    BOOKING_ORGANIZER_EMAIL: "organizer@example.test", BOOKING_REPLY_TO_EMAIL: "reply@example.test",
  });
  (globalThis as typeof globalThis & { __danielVlkoPrisma?: PrismaClient }).__danielVlkoPrisma = state.db;
  mock.method(GoogleCalendarProvider.prototype, "getBusyPeriods", async () => []);
  mock.method(GoogleCalendarProvider.prototype, "createEvent", async () => { events++; return { externalEventId: "fixture-event", meetingUrl: "https://example.test/meet" }; });
  mock.method(GoogleCalendarProvider.prototype, "cancelEvent", async () => { throw new Error("Unexpected fixture calendar cancellation"); });
  mock.method(GoogleCalendarProvider.prototype, "updateEvent", async () => { throw new Error("Unexpected fixture calendar update"); });
  // Hard outbound boundary: even a missed provider mock cannot contact a real service.
  mock.method(globalThis, "fetch", async (_input: unknown, options?: RequestInit) => { outbound++; emailPayloads.push(JSON.parse(String(options?.body ?? "{}"))); return new Response(JSON.stringify({ id: "fixture-email" }), { headers: { "content-type": "application/json" } }); });
});
afterEach(() => {
  mock.restoreAll();
  delete (globalThis as typeof globalThis & { __danielVlkoPrisma?: PrismaClient }).__danielVlkoPrisma;
  for (const key of Object.keys(process.env)) if (!(key in savedEnv)) delete process.env[key];
  Object.assign(process.env, savedEnv);
});

function request(path: string, body: unknown, cookie?: string, extra: Record<string, string> = {}) {
  return new NextRequest(origin + path, { method: "POST", headers: {
    origin, "content-type": "application/json", ...(cookie ? { cookie } : {}), ...extra,
  }, body: JSON.stringify(body) });
}
const details = { name: "Fixture A", email: "shared@example.test", timezone: "Europe/Vienna", message: "A fixture only; no real customer data." };
async function start(id = randomUUID(), cookie?: string, name = details.name) {
  const response = await intake(request("/api/booking/intake", { ...details, name, attemptId: id }, cookie));
  const body = await response.json();
  return { id, response, body, cookie: response.headers.get("set-cookie")?.split(";")[0] ?? cookie };
}
function confirmation(a: Awaited<ReturnType<typeof start>>, leadId = a.body.leadId) {
  const startsAt = DateTime.now().setZone("Europe/Vienna").plus({ days: 1 }).startOf("day").plus({ hours: 12 }).toUTC().toISO();
  return request("/api/booking/confirm", { attemptId: a.id, leadId, startsAt }, a.cookie);
}

test("same email creates separate owned leads; B cannot reuse, modify or confirm A", async () => {
  const a = await start(), b = await start();
  assert.equal(a.response.status, 201); assert.equal(b.response.status, 201);
  assert.notEqual(a.body.leadId, b.body.leadId);
  const attack = await start(a.id, b.cookie, "Attacker");
  assert.equal(attack.response.status, 403);
  assert.equal(state.leads.get(a.body.leadId)?.name, details.name);
  assert.equal((await confirm(confirmation(b, a.body.leadId))).status, 403);
  assert.equal(state.bookings.size, 0); assert.equal(events, 0); assert.equal(outbound, 0);
});

test("missing, invalid, tampered and expired capabilities fail closed", async () => {
  const a = await start();
  const badCookies = [undefined, `${attemptCookieName(a.id)}=invalid`, `${attemptCookieName(a.id)}=${"A".repeat(43)}`];
  for (const cookie of badCookies) {
    const response = await confirm(new NextRequest(confirmation(a), { headers: { origin, "content-type": "application/json", ...(cookie ? { cookie } : {}) } }));
    assert.equal(response.status, 403);
  }
  state.attempts.get(a.id)!.expiresAt = new Date(0);
  assert.equal((await confirm(confirmation(a))).status, 403);
  assert.equal((await start(a.id, a.cookie, "Expired attempt update")).response.status, 403);
  assert.equal(state.leads.get(a.body.leadId)?.name, details.name);
  assert.equal(events, 0); assert.equal(outbound, 0);
});

test("legitimate intake retry/refresh reuses only owned lead", async () => {
  const a = await start(), retry = await start(a.id, a.cookie, "Updated fixture");
  assert.equal(retry.response.status, 200); assert.equal(retry.body.leadId, a.body.leadId);
  assert.equal(state.leads.size, 1); assert.equal(state.leads.get(a.body.leadId)?.name, "Updated fixture");
  const persisted = state.attempts.get(a.id)!;
  const token = a.cookie!.split("=")[1];
  assert.notEqual(persisted.tokenHash, token); assert.equal(persisted.tokenHash, hashCapability(token));
  assert(!JSON.stringify(a.body).includes(token));
});

test("normal confirmation and replay produce one booking/event without repeated email", async () => {
  const a = await start();
  const response = await confirm(confirmation(a));
  assert.equal(response.status, 201); const result = await response.json();
  assert.equal(result.booking.status, "CONFIRMED"); assert.equal(events, 1); assert.equal(outbound, 1);
  const retry = await confirm(confirmation(a));
  assert.equal(retry.status, 200); const replay = await retry.json();
  assert.equal(replay.booking.id, result.booking.id); assert.equal(replay.confirmationEmailSent, true);
  assert.equal(events, 1); assert.equal(outbound, 1);
});

test("concurrent same-attempt initialization cannot issue two capabilities", async () => {
  const id = randomUUID(); const results = await Promise.all([start(id), start(id)]);
  assert.deepEqual(results.map(r => r.response.status).sort(), [201, 403]);
  assert.equal(state.leads.size, 1); assert.equal(state.attempts.size, 1);
});

test("concurrent confirmations cannot reserve twice", async () => {
  const a = await start(); const results = await Promise.all([confirm(confirmation(a)), confirm(confirmation(a))]);
  assert(results.some(r => r.status === 201)); assert(results.every(r => [200, 201, 409].includes(r.status)));
  assert.equal(state.bookings.size, 1); assert.equal(events, 1); assert.equal(outbound, 1);
});

test("session fixation is rejected; cookie attributes are production safe", async () => {
  const id = randomUUID(); const response = await start(id, `${attemptCookieName(id)}=${"A".repeat(43)}`);
  assert.equal(response.response.status, 403); assert.equal(state.leads.size, 0);
  Object.assign(process.env, { NODE_ENV: "production" });
  const r = NextResponse.json({ ok: true }); setAttemptCookie(r, id, "A".repeat(43));
  const cookie = r.headers.get("set-cookie")!;
  for (const expected of ["__Host-", "HttpOnly", "Secure", "SameSite=strict", "Path=/", "Max-Age=3600"]) assert(cookie.includes(expected));
  assert(!validCapability("A".repeat(43), hashCapability("A".repeat(43)), new Date(0)));
});

test("durable limiter model rejects bursts atomically and resets predictably", async () => {
  const results = await Promise.allSettled(Array.from({ length: 8 }, () => consumeLimit("fixture", "identity", 3, 60, state.db)));
  assert.equal(results.filter(r => r.status === "fulfilled").length, 3);
  for (const result of results) if (result.status === "rejected") {
    assert(result.reason instanceof SecurityError); assert.equal(result.reason.status, 429);
    assert.equal(securityResponse(result.reason, "fixture").headers.get("retry-after"), "60");
  }
  state.advance(60_001); await consumeLimit("fixture", "identity", 3, 60, state.db);
  assert(!rateKey("fixture", details.email).includes(details.email));
});

test("untrusted IP headers cannot bypass network limits; trusted IPv6 groups /64", async () => {
  const a = request("/api/contact", {}, undefined, { "x-forwarded-for": "1.1.1.1", "x-vercel-forwarded-for": "1.1.1.1" });
  assert.equal(networkIdentity(a), "untrusted-network");
  Object.assign(process.env, { SECURITY_TRUST_PROXY: "vercel", VERCEL: "1" });
  assert.equal(networkIdentity(a), "1.1.1.1");
  assert.equal(networkIdentity(request("/", {}, undefined, { "x-vercel-forwarded-for": "1.1.1.1, 2.2.2.2" })), "untrusted-network");
  assert.equal(networkIdentity(request("/", {}, undefined, { "x-vercel-forwarded-for": "2001:db8::1" })), networkIdentity(request("/", {}, undefined, { "x-vercel-forwarded-for": "2001:db8::abcd" })));
});

test("login is throttled even when spoofed headers change; existing admin sessions still verify", async () => {
  for (let i = 0; i < 6; i++) {
    const response = await login(new NextRequest(origin + "/api/admin/login", { method: "POST", headers: { origin, "content-type": "application/x-www-form-urlencoded", "x-forwarded-for": `1.1.1.${i}` }, body: "password=wrong" }));
    assert.equal(response.status, i < 5 ? 303 : 429);
    if (i === 5) assert(response.headers.get("retry-after"));
  }
  const token = createAdminSessionToken(); assert(verifyAdminSessionToken(token)); assert(!verifyAdminSessionToken(token + "x"));
});

test("valid admin login preserves redirect and session cookie contract", async () => {
  const response = await login(new NextRequest(origin + "/api/admin/login", { method: "POST", headers: { origin, "content-type": "application/x-www-form-urlencoded" }, body: "password=fixture-password" }));
  assert.equal(response.status, 303); assert.equal(response.headers.get("location"), origin + "/admin");
  assert(response.headers.get("set-cookie")!.includes("dv_admin_session="));
});

test("malformed JSON shapes and oversized streamed bodies reject safely", async () => {
  for (const value of [null, [], "text"]) await assert.rejects(readJson(request("/", value)), { status: 400 });
  await assert.rejects(readJson(new Request(origin, { method: "POST", headers: { "content-type": "application/json" }, body: "{" })), { status: 400 });
  await assert.rejects(readBody(new Request(origin, { method: "POST", body: "é".repeat(10) }), 19), { status: 413 });
  assert.equal((await contact(request("/api/contact", null))).status, 400);
  assert.equal((await contact(request("/api/contact", { ...details, message: "x".repeat(17000) }))).status, 413);
  assert.equal(outbound, 0);
});

test("contact validation and ordinary valid submission remain compatible", async () => {
  process.env.NEXT_PUBLIC_CAL_LINK = "https://obsolete.example.test/old-calendar";
  assert.equal((await contact(request("/api/contact", { ...details, email: "invalid" }))).status, 400);
  assert.equal((await contact(request("/api/contact", details))).status, 200);
  assert.equal(outbound, 2); // mock internal notification + mock client confirmation
  const confirmation = emailPayloads[1];
  assert(confirmation.html?.includes('href="https://danielvlko.com/contact"'));
  assert(confirmation.text?.includes("https://danielvlko.com/contact"));
  assert(!JSON.stringify(emailPayloads).includes("obsolete.example.test"));
});

test("missing storage/secret and foreign origins fail closed", async () => {
  assert.throws(() => requireSameOrigin(request("/", {}, undefined, { origin: "https://attacker.test" })), { status: 403 });
  assert.throws(() => requireSameOrigin(new Request("https://attacker.test/api/booking/confirm", { headers: { origin } })), { status: 403 });
  const rejected = await intake(request("/api/booking/intake", details, undefined, { origin: "https://attacker.test" }));
  assert.equal(rejected.status, 403); assert.equal(state.leads.size, 0);
  delete process.env.SECURITY_RATE_LIMIT_SECRET;
  assert.equal((await contact(request("/api/contact", details))).status, 503);
  Object.assign(process.env, { NODE_ENV: "production" }); delete process.env.SECURITY_ALLOWED_ORIGINS;
  assert.throws(() => requireSameOrigin(request("/", {})), { status: 503 });
});

test("sanitized diagnostics never include capability or provider payload", async () => {
  const messages: unknown[][] = [];
  mock.method(console, "error", (...args: unknown[]) => { messages.push(args); });
  const secret = "private-capability-fixture";
  logSecurityFailure("fixture", { message: secret, code: secret, config: { token: secret } });
  const response = securityResponse(new Error(secret), "fixture");
  assert(!JSON.stringify(messages).includes(secret)); assert(!(await response.text()).includes(secret));
});

test("management token remains required; nonexistent and unauthorized IDs have same status", async () => {
  const capability = createBookingToken();
  state.bookings.set("fixture-booking", { id: "fixture-booking", cancelTokenHash: capability.tokenHash, startsAt: new Date(), endsAt: new Date(), timezone: "Europe/Vienna", status: "CONFIRMED" });
  assert.equal((await manage(request("/api/booking/manage", { bookingId: "fixture-booking", token: capability.token }))).status, 200);
  for (const handler of [manage, cancel, reschedule]) {
    const extra = handler === reschedule ? { startsAt: new Date(Date.now() + 86_400_000).toISOString() } : {};
    const a = await handler(request("/api/booking/manage", { bookingId: "fixture-booking", token: "wrong", ...extra }));
    const b = await handler(request("/api/booking/manage", { bookingId: "missing", token: "wrong", ...extra }));
    assert.equal(a.status, 403); assert.equal(b.status, 403);
  }
  assert.equal(events, 0); assert.equal(outbound, 0);
});

test("contact rate limit returns 429 with no email even with changing spoofed IPs", async () => {
  for (let i = 0; i < 6; i++) {
    const response = await contact(request("/api/contact", { companyWebsite: "bot" }, undefined, { "x-forwarded-for": `10.0.0.${i}` }));
    assert.equal(response.status, i < 5 ? 200 : 429);
    if (i === 5) assert(response.headers.get("retry-after"));
  }
  assert.equal(outbound, 0);
});

test("availability rejects impossible dates and oversized ranges before calendar calls", async () => {
  for (const query of ["days=1000000", "days=1.5", "from=2026-02-30"]) {
    assert.equal((await availability(new NextRequest(origin + "/api/booking/availability?" + query))).status, 400);
  }
  assert.equal(events, 0); assert.equal(outbound, 0);
});

test("storage outage blocks intake and outbound work without leaking diagnostics", async () => {
  const messages: unknown[][] = [];
  mock.method(console, "error", (...args: unknown[]) => { messages.push(args); });
  mock.method(state.db, "$queryRaw", async () => { throw new Error("fixture-private-database-connection"); });
  const response = await intake(request("/api/booking/intake", { ...details, attemptId: randomUUID() }));
  assert.equal(response.status, 503); assert.equal(state.leads.size, 0); assert.equal(outbound, 0);
  assert(!JSON.stringify(messages).includes("fixture-private-database-connection"));
});
