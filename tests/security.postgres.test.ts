import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { before, beforeEach, after, afterEach, mock, test } from "node:test";
import pg from "pg";
import { DateTime } from "luxon";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { NextRequest } from "next/server";
import { POST as intake } from "@/app/api/booking/intake/route";
import { POST as confirm } from "@/app/api/booking/confirm/route";
import { POST as contact } from "@/app/api/contact/route";
import { POST as login } from "@/app/api/admin/login/route";
import { GET as availability } from "@/app/api/booking/availability/route";
import { POST as manage } from "@/app/api/booking/manage/route";
import { POST as cancel } from "@/app/api/booking/cancel/route";
import { POST as reschedule } from "@/app/api/booking/reschedule/route";
import { GET as cleanup } from "@/app/api/cron/security-cleanup/route";
import { GoogleCalendarProvider } from "@/lib/booking/calendar/google";
import { attemptCookieName, hashCapability } from "@/lib/booking/session";
import { consumeLimit, rateKey } from "@/lib/security/rate-limit";
import { SecurityError } from "@/lib/security/http";

let db: PrismaClient;
let second: PrismaClient;
let events = 0;
let deliveries = 0;
const origin = "https://example.test";
const details = { name: "Acceptance A", email: "example@test.local", timezone: "Europe/Vienna", message: "Synthetic acceptance record only." };
const globals = globalThis as typeof globalThis & { __danielVlkoPrisma?: PrismaClient };
before(async () => {
  const value = process.env.A2_TEST_DATABASE_URL;
  assert(value && value === process.env.DATABASE_URL && value === process.env.DIRECT_URL, "Unknown credentials refused.");
  const url = new URL(value);
  assert.equal(url.hostname, "127.0.0.1"); assert.equal(url.username, "dv_a2_test"); assert.equal(url.pathname, "/dv_a2_acceptance_test");
  assert(process.env.A2_TEST_RUN_NONCE);
  const identity = new pg.Client({ connectionString: value });
  await identity.connect();
  try {
    const row = (await identity.query('SELECT current_database() AS db, current_user AS role, (SELECT nonce::text FROM "_A2AcceptanceGuard") AS nonce')).rows[0];
    assert.equal(row.db, "dv_a2_acceptance_test"); assert.equal(row.role, "dv_a2_test"); assert.equal(row.nonce, process.env.A2_TEST_RUN_NONCE);
  } finally { await identity.end(); }
  db = new PrismaClient({ adapter: new PrismaPg({ connectionString: value, max: 5, connectionTimeoutMillis: 3000 }) });
  second = new PrismaClient({ adapter: new PrismaPg({ connectionString: value, max: 5, connectionTimeoutMillis: 3000 }) });
});
beforeEach(async () => {
  // Only runner-owned disposable DB; keep the representative pre-migration records intact.
  await db.bookingAttempt.deleteMany();
  await db.booking.deleteMany({ where: { id: { not: "previous-booking" } } });
  await db.lead.deleteMany({ where: { id: { not: "previous-lead" } } });
  await db.securityRateLimit.deleteMany();
  await db.availabilityRule.deleteMany();
  await db.availabilityRule.createMany({ data: Array.from({ length: 7 }, (_, weekday) => ({ weekday, startMinute: 0, endMinute: 1440 })) });
  globals.__danielVlkoPrisma = db;
  events = 0; deliveries = 0;
  Object.assign(process.env, { NODE_ENV: "test", SECURITY_ALLOWED_ORIGINS: origin, SECURITY_TRUST_PROXY: "", VERCEL: "",
    GOOGLE_CALENDAR_CLIENT_ID: "fixture", GOOGLE_CALENDAR_CLIENT_SECRET: "fixture", GOOGLE_CALENDAR_REFRESH_TOKEN: "fixture",
    RESEND_API_KEY: "re_fixture", CONTACT_TO_EMAIL: "owner@test.local", CONTACT_FROM_EMAIL: "fixture@test.local",
    BOOKING_REPLY_TO_EMAIL: "reply@test.local", BOOKING_ORGANIZER_EMAIL: "organizer@test.local",
    ADMIN_PASSWORD: "fixture-password", ADMIN_SESSION_SECRET: "fixture-admin-signature-secret-more-than-32-characters" });
  mock.method(GoogleCalendarProvider.prototype, "getBusyPeriods", async () => []);
  mock.method(GoogleCalendarProvider.prototype, "createEvent", async () => { events++; await new Promise(done => setTimeout(done, 25)); return { externalEventId: "fixture-event", meetingUrl: origin + "/fixture-meet" }; });
  mock.method(GoogleCalendarProvider.prototype, "cancelEvent", async () => { throw new Error("Unplanned external calendar operation blocked"); });
  mock.method(GoogleCalendarProvider.prototype, "updateEvent", async () => { throw new Error("Unplanned external calendar operation blocked"); });
  // The only fetch implementation is a local stub. No email/calendar HTTP reaches any provider.
  mock.method(globalThis, "fetch", async () => { deliveries++; return new Response(JSON.stringify({ id: "fixture-email" }), { headers: { "content-type": "application/json" } }); });
});
afterEach(() => { mock.restoreAll(); globals.__danielVlkoPrisma = db; });
after(async () => { delete globals.__danielVlkoPrisma; await Promise.all([db?.$disconnect(), second?.$disconnect()]); });
function request(path: string, body: unknown, cookie?: string, headers: Record<string, string> = {}) {
  return new NextRequest(origin + path, { method: "POST", headers: { origin, "content-type": "application/json", ...(cookie ? { cookie } : {}), ...headers }, body: JSON.stringify(body) });
}
async function start(id = randomUUID(), cookie?: string, name = details.name) {
  const response = await intake(request("/api/booking/intake", { ...details, name, attemptId: id }, cookie));
  return { id, response, body: await response.json(), cookie: response.headers.get("set-cookie")?.split(";")[0] ?? cookie };
}
function confirmation(a: Awaited<ReturnType<typeof start>>, leadId = a.body.leadId, cookie = a.cookie) {
  const startsAt = DateTime.now().setZone("Europe/Vienna").plus({ days: 1 }).startOf("day").plus({ hours: 12 }).toUTC().toISO();
  return request("/api/booking/confirm", { attemptId: a.id, leadId, startsAt }, cookie);
}

test("actual PostgreSQL: same-email sessions are independent, B cannot read/update/confirm A", async () => {
  const [a, b] = await Promise.all([start(), start()]);
  assert.equal(a.response.status, 201); assert.equal(b.response.status, 201); assert.notEqual(a.body.leadId, b.body.leadId);
  assert.deepEqual(Object.keys(a.body).sort(), ["leadId", "ok", "reused", "status"]);
  const attack = await start(a.id, b.cookie, "Attacker fixture"); assert.equal(attack.response.status, 403);
  assert.equal((await db.lead.findUniqueOrThrow({ where: { id: a.body.leadId } })).name, details.name);
  assert.equal((await confirm(confirmation(b, a.body.leadId))).status, 403);
  const stored = await second.bookingAttempt.findUniqueOrThrow({ where: { id: a.id } });
  assert.equal(stored.tokenHash, hashCapability(a.cookie!.split("=")[1]));
  assert(!JSON.stringify(a.body).includes(stored.tokenHash)); assert.equal(events, 0); assert.equal(deliveries, 0);
});
test("actual PostgreSQL: valid retry preserves ownership; tampered/missing/expired capabilities deny", async () => {
  const a = await start(); const retry = await start(a.id, a.cookie, "Owned update");
  assert.equal(retry.response.status, 200); assert.equal(retry.body.leadId, a.body.leadId);
  for (const cookie of ["", `${attemptCookieName(a.id)}=invalid`, `${attemptCookieName(a.id)}=${"A".repeat(43)}`]) {
    assert.equal((await confirm(confirmation(a, a.body.leadId, cookie))).status, 403);
  }
  await db.bookingAttempt.update({ where: { id: a.id }, data: { expiresAt: new Date(0) } });
  assert.equal((await confirm(confirmation(a))).status, 403);
  assert.equal((await start(a.id, a.cookie, "Unauthorized expired update")).response.status, 403);
  assert.equal((await db.lead.findUniqueOrThrow({ where: { id: a.body.leadId } })).name, "Owned update");
});
test("actual PostgreSQL: first-submission races create one capability/lead", async () => {
  const id = randomUUID(); const responses = await Promise.all(Array.from({ length: 4 }, () => start(id)));
  assert.deepEqual(responses.map(r => r.response.status).sort(), [201, 403, 403, 403]);
  assert.equal(await db.bookingAttempt.count(), 1); assert.equal(await db.lead.count({ where: { id: { not: "previous-lead" } } }), 1);
});
test("actual PostgreSQL: concurrent confirmation and replay create only one reservation", async () => {
  const a = await start(); const responses = await Promise.all(Array.from({ length: 4 }, () => confirm(confirmation(a))));
  assert(responses.some(r => r.status === 201), "No request confirmed");
  assert(responses.every(r => [200, 201, 409].includes(r.status)), "Unexpected concurrency error");
  const booking = await db.booking.findFirstOrThrow({ where: { leadId: a.body.leadId } });
  assert.equal(booking.status, "CONFIRMED"); assert.equal(await db.booking.count({ where: { leadId: a.body.leadId } }), 1);
  assert.equal(events, 1); assert.equal(deliveries, 1);
  const response = await confirm(confirmation(a)); assert.equal(response.status, 200);
  const replay = await response.json(); assert.equal(replay.booking.id, booking.id); assert.equal(replay.confirmationEmailSent, true);
  assert.equal(events, 1); assert.equal(deliveries, 1);
});
test("actual PostgreSQL: different attempts racing for same slot preserve uniqueness", async () => {
  const [a, b] = await Promise.all([start(), start()]);
  const responses = await Promise.all([confirm(confirmation(a)), confirm(confirmation(b))]);
  assert.deepEqual(responses.map(r => r.status).sort(), [201, 409]); assert.equal(events, 1);
  assert.equal(await db.booking.count({ where: { id: { not: "previous-booking" } } }), 1);
});
test("actual PostgreSQL: counter state persists across clients, resets, saturates, and returns Retry-After", async () => {
  await consumeLimit("fixture-persistence", "fixture", 2, 60, db);
  await consumeLimit("fixture-persistence", "fixture", 2, 60, second);
  await assert.rejects(consumeLimit("fixture-persistence", "fixture", 2, 60, second), (e: unknown) => e instanceof SecurityError && e.status === 429 && !!e.retryAfter && e.retryAfter <= 60);
  const key = rateKey("fixture-persistence", "fixture");
  assert.equal((await db.securityRateLimit.findUniqueOrThrow({ where: { key } })).hits, 3);
  await db.securityRateLimit.update({ where: { key }, data: { expiresAt: new Date(0) } });
  await consumeLimit("fixture-persistence", "fixture", 2, 60, second);
  assert.equal((await db.securityRateLimit.findUniqueOrThrow({ where: { key } })).hits, 1);
});
function worker(): Promise<{ allowed: number; limited: number }> {
  return new Promise((done, reject) => {
    const child = spawn(process.execPath, ["node_modules/tsx/dist/cli.mjs", "tests/security-rate-worker.ts"], { env: process.env, stdio: ["ignore", "pipe", "pipe"] });
    let output = ""; child.stdout.on("data", data => { output += String(data); });
    child.stderr.on("data", () => {});
    child.on("error", () => reject(new Error("Rate worker failed")));
    child.on("exit", code => { if (code !== 0) reject(new Error("Rate worker failed")); else { try { done(JSON.parse(output.trim())); } catch { reject(new Error("Rate worker output invalid")); } } });
  });
}
test("actual PostgreSQL: independent application processes enforce one shared concurrent quota", async () => {
  const workers = await Promise.all([worker(), worker()]);
  assert.equal(workers.reduce((n, w) => n + w.allowed, 0), 7); assert.equal(workers.reduce((n, w) => n + w.limited, 0), 13);
  const key = rateKey("acceptance-process-race", "fixture"); assert.equal((await db.securityRateLimit.findUniqueOrThrow({ where: { key } })).hits, 8);
});
test("actual PostgreSQL: contact/login/intake enforce HTTP quotas despite spoofed proxy headers", async () => {
  for (let i = 0; i < 6; i++) {
    const response = await contact(request("/api/contact", { companyWebsite: "fixture honeypot" }, undefined, { "x-forwarded-for": `10.0.0.${i}` }));
    assert.equal(response.status, i < 5 ? 200 : 429); if (i === 5) assert(response.headers.get("retry-after"));
  }
  for (let i = 0; i < 6; i++) {
    const response = await login(new NextRequest(origin + "/api/admin/login", { method: "POST", headers: { origin, "content-type": "application/x-www-form-urlencoded", "x-real-ip": `10.0.1.${i}` }, body: "password=incorrect" }));
    assert.equal(response.status, i < 5 ? 303 : 429); if (i === 5) assert(response.headers.get("retry-after"));
  }
  for (let i = 0; i < 6; i++) {
    const response = (await start()).response; assert.equal(response.status, i < 5 ? 201 : 429);
  }
  assert.equal(deliveries, 0);
});
test("actual PostgreSQL: availability/manage/cancel/reschedule/confirm guards use durable quotas", async () => {
  for (const [policy, handler, path] of [
    ["manage", manage, "/api/booking/manage"], ["cancel", cancel, "/api/booking/cancel"], ["reschedule", reschedule, "/api/booking/reschedule"], ["confirm", confirm, "/api/booking/confirm"],
  ] as const) {
    const key = rateKey(`${policy}:network`, "untrusted-network");
    await db.securityRateLimit.create({ data: { key, hits: policy === "manage" ? 30 : 10, expiresAt: new Date(Date.now() + 60000) } });
    const response = await handler(request(path, {})); assert.equal(response.status, 429); assert(response.headers.get("retry-after"));
  }
  await db.securityRateLimit.create({ data: { key: rateKey("availability:network", "untrusted-network"), hits: 60, expiresAt: new Date(Date.now() + 60000) } });
  assert.equal((await availability(new NextRequest(origin + "/api/booking/availability"))).status, 429);
});
test("actual PostgreSQL: cleanup rejects unauthorized access, removes only expired security records", async () => {
  assert.equal((await cleanup(new NextRequest(origin + "/api/cron/security-cleanup"))).status, 401);
  const a = await start(), b = await start();
  await db.bookingAttempt.update({ where: { id: a.id }, data: { expiresAt: new Date(0) } });
  await db.securityRateLimit.create({ data: { key: "expired-fixture", hits: 10, expiresAt: new Date(0) } });
  const response = await cleanup(new NextRequest(origin + "/api/cron/security-cleanup", { headers: { authorization: `Bearer ${process.env.CRON_SECRET}` } }));
  assert.equal(response.status, 200); assert.equal((await response.json()).attempts, 1);
  assert.equal(await db.bookingAttempt.findUnique({ where: { id: a.id } }), null);
  assert(await db.bookingAttempt.findUnique({ where: { id: b.id } })); assert(await db.lead.findUnique({ where: { id: a.body.leadId } }));
  assert.equal(await db.securityRateLimit.findUnique({ where: { key: "expired-fixture" } }), null);
  assert(await db.lead.findUnique({ where: { id: "previous-lead" } })); assert(await db.booking.findUnique({ where: { id: "previous-booking" } }));
});
test("actual PostgreSQL: foreign origins and missing configuration fail closed without writes", async () => {
  const response = await intake(request("/api/booking/intake", { ...details, attemptId: randomUUID() }, undefined, { origin: "https://foreign.test" }));
  assert.equal(response.status, 403); assert.equal(await db.bookingAttempt.count(), 0);
  const secret = process.env.SECURITY_RATE_LIMIT_SECRET; delete process.env.SECURITY_RATE_LIMIT_SECRET;
  try { assert.equal((await intake(request("/api/booking/intake", { ...details, attemptId: randomUUID() }))).status, 503); }
  finally { process.env.SECURITY_RATE_LIMIT_SECRET = secret; }
});
test("actual PostgreSQL: foreign keys, capability uniqueness and transaction rollback hold", async () => {
  const a = await start(); const attempt = await db.bookingAttempt.findUniqueOrThrow({ where: { id: a.id } });
  await assert.rejects(db.bookingAttempt.create({ data: { id: randomUUID(), leadId: "missing-lead", tokenHash: "b".repeat(64), expiresAt: new Date(Date.now() + 60000) } }));
  await assert.rejects(db.bookingAttempt.create({ data: { id: randomUUID(), leadId: "previous-lead", tokenHash: attempt.tokenHash, expiresAt: new Date(Date.now() + 60000) } }));
  await assert.rejects(db.$transaction(async tx => { await tx.lead.update({ where: { id: a.body.leadId }, data: { name: "Rollback fixture" } }); throw new Error("Controlled rollback"); }));
  assert.equal((await db.lead.findUniqueOrThrow({ where: { id: a.body.leadId } })).name, details.name);
});

test("actual PostgreSQL: invalid database authentication fails closed without leaking credentials", async () => {
  const url = new URL(process.env.A2_TEST_DATABASE_URL!); url.password = "invalid-fixture-password";
  const bad = new PrismaClient({ adapter: new PrismaPg({ connectionString: url.toString(), connectionTimeoutMillis: 1000 }) });
  const logs: unknown[][] = []; mock.method(console, "error", (...args: unknown[]) => { logs.push(args); });
  globals.__danielVlkoPrisma = bad;
  try {
    const response = await intake(request("/api/booking/intake", { ...details, attemptId: randomUUID() }));
    assert.equal(response.status, 503); assert.equal(await db.bookingAttempt.count(), 0);
    assert.equal(events, 0); assert.equal(deliveries, 0);
    const text = JSON.stringify(logs) + await response.text();
    assert(!text.includes(url.password)); assert(!text.includes(new URL(process.env.A2_TEST_DATABASE_URL!).password));
  } finally { globals.__danielVlkoPrisma = db; await bad.$disconnect(); }
});

test("actual PostgreSQL: cleanup waiting on a concurrent counter reset preserves the live quota", async () => {
  const key = "cleanup-race-fixture";
  await db.securityRateLimit.create({ data: { key, hits: 5, expiresAt: new Date(0) } });
  let pendingCleanup: ReturnType<typeof cleanup> | undefined;
  await db.$transaction(async tx => {
    await tx.$queryRaw`SELECT "key" FROM "SecurityRateLimit" WHERE "key" = ${key} FOR UPDATE`;
    await tx.securityRateLimit.update({ where: { key }, data: { hits: 1, expiresAt: new Date(Date.now() + 60000) } });
    pendingCleanup = cleanup(new NextRequest(origin + "/api/cron/security-cleanup", { headers: { authorization: `Bearer ${process.env.CRON_SECRET}` } }));
    let waiting = false;
    for (let tries = 0; tries < 100; tries++) {
      const rows = await second.$queryRaw<{ waiting: number }[]>`
        SELECT count(*)::integer AS waiting FROM pg_stat_activity
        WHERE datname = current_database() AND wait_event_type = 'Lock' AND query LIKE '%DELETE FROM "SecurityRateLimit"%'
      `;
      if (rows[0].waiting > 0) { waiting = true; break; }
      await new Promise(done => setTimeout(done, 10));
    }
    assert(waiting, "Cleanup did not reach the actual row-lock wait");
  });
  assert(pendingCleanup); assert.equal((await pendingCleanup).status, 200);
  const current = await db.securityRateLimit.findUniqueOrThrow({ where: { key } });
  assert.equal(current.hits, 1); assert(current.expiresAt > new Date());
});

test("actual PostgreSQL: pre-migration management records still authorize existing tokens", async () => {
  const response = await manage(request("/api/booking/manage", { bookingId: "previous-booking", token: "previous-fixture-management-token" }));
  assert.equal(response.status, 200); assert.equal((await response.json()).booking.id, "previous-booking");
});
