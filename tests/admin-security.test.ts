import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import type { PrismaClient } from "@/generated/prisma/client";
import { ADMIN_COOKIE_NAME, createAdminSessionToken, revokeAdminSession, verifyAdminSessionToken } from "@/lib/admin/auth";
import { POST as login } from "@/app/api/admin/login/route";
import { POST as logout } from "@/app/api/admin/logout/route";
import { POST as leads } from "@/app/api/admin/leads/status/route";
import { POST as bookings } from "@/app/api/admin/bookings/status/route";
import { POST as rules } from "@/app/api/admin/availability/rules/route";
import { POST as overrides } from "@/app/api/admin/availability/overrides/route";
import { POST as deleteOverride } from "@/app/api/admin/availability/overrides/delete/route";
import { GET as reminders } from "@/app/api/cron/booking-reminders/route";
import { logSecurityFailure, safeErrorCode } from "@/lib/security/log";

const origin = "https://example.test";
const globals = globalThis as typeof globalThis & { __danielVlkoPrisma?: PrismaClient };
type Session = { tokenHash: string; credentialVersion: string; expiresAt: Date; revokedAt: Date | null };
let sessions: Map<string, Session>;
let writes: string[];
let logs: unknown[][];
let token: string;
let db: PrismaClient;
const savedEnv = { ...process.env };
const cases = [
  ["leads/status", leads, { leadId: "lead-fixture", status: "QUALIFIED" }],
  ["bookings/status", bookings, { bookingId: "booking-fixture", status: "COMPLETED" }],
  ["availability/rules", rules, { weekday: "0", start: "09:00", end: "17:00", enabled: "on" }],
  ["availability/overrides", overrides, { dateKey: "2026-10-25", type: "BLOCK", wholeDay: "on" }],
  ["availability/overrides/delete", deleteOverride, { overrideId: "override-fixture" }],
] as const;

beforeEach(async () => {
  sessions = new Map(); writes = []; logs = [];
  Object.assign(process.env, { NODE_ENV: "test", SECURITY_ALLOWED_ORIGINS: origin,
    ADMIN_PASSWORD: "fixture-password", ADMIN_SESSION_SECRET: "fixture-session-secret-at-least-32-characters",
    SECURITY_RATE_LIMIT_SECRET: "fixture-rate-secret-at-least-32-characters" });
  const mutation = (kind: string) => async () => { writes.push(kind); return { id: randomUUID(), count: 1 }; };
  db = {
    adminSession: {
      create: async ({ data }: { data: Omit<Session, "revokedAt"> }) => { const row = { ...data, revokedAt: null }; sessions.set(data.tokenHash, row); return row; },
      findUnique: async ({ where }: { where: { tokenHash: string } }) => sessions.get(where.tokenHash) ?? null,
      updateMany: async ({ where, data }: { where: { tokenHash: string }; data: { revokedAt: Date } }) => {
        const row = sessions.get(where.tokenHash); if (row) row.revokedAt = data.revokedAt; return { count: row ? 1 : 0 };
      },
    },
    lead: { update: mutation("lead") },
    booking: { findUnique: async () => ({ id: "booking-fixture", leadId: "lead-fixture", lead: { status: "BOOKED" } }), update: mutation("booking") },
    availabilityRule: { create: mutation("rule"), update: mutation("rule"), deleteMany: mutation("rule-delete") },
    availabilityOverride: { create: mutation("override"), deleteMany: mutation("override-delete") },
    $queryRaw: async () => [{ hits: 1, retryAfter: 60 }],
    $transaction: async (fn: (tx: PrismaClient) => Promise<unknown>) => fn(db),
  } as unknown as PrismaClient;
  globals.__danielVlkoPrisma = db;
  token = await createAdminSessionToken();
  mock.method(console, "error", (...args: unknown[]) => { logs.push(args); });
  mock.method(globalThis, "fetch", async () => { throw new Error("Unexpected network I/O"); });
});
afterEach(() => {
  mock.restoreAll(); delete globals.__danielVlkoPrisma;
  for (const key of Object.keys(process.env)) if (!(key in savedEnv)) delete process.env[key];
  Object.assign(process.env, savedEnv);
});

function request(path: string, body?: string, headers: Record<string, string> = {}) {
  return new NextRequest(origin + "/api/admin/" + path, { method: "POST", headers: {
    origin, cookie: `${ADMIN_COOKIE_NAME}=${token}`, "content-type": "application/x-www-form-urlencoded", ...headers,
  }, ...(body === undefined ? {} : { body }) });
}

for (const [path, handler, data] of cases) {
  test(`${path}: valid browser form and JSON preserve mutations`, async () => {
    assert.equal((await handler(request(path, new URLSearchParams(data).toString()))).status, 303);
    assert.equal(writes.length, 1);
    assert.equal((await handler(request(path, JSON.stringify(data), { "content-type": "application/json" }))).status, 303);
    assert.equal(writes.length, 2);
  });
  test(`${path}: rejects unauthorized, forged origins, malformed and oversized inputs before writes`, async () => {
    const body = new URLSearchParams(data).toString();
    for (const cookie of ["", `${ADMIN_COOKIE_NAME}=invalid`]) assert.equal((await handler(request(path, body, { cookie }))).status, 401);
    for (const bad of ["", "null", "https://evil.test", "https://sibling.example.test", origin + ".evil.test", origin + "/"]) {
      assert.equal((await handler(request(path, body, { origin: bad }))).status, 403);
    }
    assert.equal((await handler(request(path, body, { "sec-fetch-site": "cross-site" }))).status, 403);
    assert.equal((await handler(request(path, "{", { "content-type": "application/json" }))).status, 400);
    for (const invalid of ["[]", "null", "{}", JSON.stringify({ ...data, extra: "no" })]) {
      assert.equal((await handler(request(path, invalid, { "content-type": "application/json" }))).status, 400);
    }
    assert.equal((await handler(request(path, body + "&" + body))).status, 400);
    assert.equal((await handler(request(path, "x".repeat(8193)))).status, 413);
    assert.equal((await handler(request(path, body, { "content-length": "8193" }))).status, 413);
    assert.equal((await handler(request(path, body, { "content-type": "text/plain" }))).status, 415);
    assert.equal(writes.length, 0);
  });
}

test("multipart forms remain accepted; files and invalid field values fail", async () => {
  const form = new FormData(); form.set("leadId", "lead-fixture"); form.set("status", "WON");
  const make = (body: FormData) => new NextRequest(origin + "/api/admin/leads/status", { method: "POST", headers: { origin, cookie: `${ADMIN_COOKIE_NAME}=${token}` }, body });
  assert.equal((await leads(make(form))).status, 303);
  form.set("leadId", new Blob(["file"]), "file.txt");
  assert.equal((await leads(make(form))).status, 400);
  for (const body of [{ leadId: "x".repeat(129), status: "WON" }, { leadId: "lead-fixture", status: "INVALID" }]) {
    assert.equal((await leads(request("leads/status", JSON.stringify(body), { "content-type": "application/json" }))).status, 400);
  }
  assert.equal((await rules(request("availability/rules", "weekday=1garbage&start=09%3A00&end=17%3A00"))).status, 400);
  assert.equal(writes.length, 1);
});

test("sessions are random, hash-only, durable across client instances, bounded and credential-bound", async () => {
  const second = await createAdminSessionToken(); assert.notEqual(second, token);
  assert(!JSON.stringify([...sessions.values()]).includes(token));
  globals.__danielVlkoPrisma = { ...db, adminSession: { ...db.adminSession } } as PrismaClient;
  assert(await verifyAdminSessionToken(token));
  assert(!await verifyAdminSessionToken("v1.9999999999.legacy-signature"));
  assert(!await verifyAdminSessionToken("A".repeat(43)));
  process.env.ADMIN_PASSWORD = "replacement-password"; assert(!await verifyAdminSessionToken(token));
  process.env.ADMIN_PASSWORD = "fixture-password"; process.env.ADMIN_SESSION_SECRET = "replacement-session-secret-at-least-32-characters";
  assert(!await verifyAdminSessionToken(token));
});

test("expired/revoked sessions deny all mutations; DB outages fail closed", async () => {
  const row = [...sessions.values()][0]; row.expiresAt = new Date(0);
  assert(!await verifyAdminSessionToken(token));
  for (const [path, handler, data] of cases) assert.equal((await handler(request(path, new URLSearchParams(data).toString()))).status, 401);
  row.expiresAt = new Date(Date.now() + 10000); await revokeAdminSession(token);
  assert(!await verifyAdminSessionToken(token));
  for (const [path, handler, data] of cases) assert.equal((await handler(request(path, new URLSearchParams(data).toString()))).status, 401);
  mock.method(db.adminSession, "findUnique", async () => { throw new Error("secret connection string"); });
  assert(!await verifyAdminSessionToken(token)); assert.equal(writes.length, 0);
});

test("login keeps secure HttpOnly cookies; logout makes copied cookie unusable across instances", async () => {
  Object.assign(process.env, { NODE_ENV: "production" });
  const response = await login(request("login", "password=fixture-password"));
  assert.equal(response.status, 303);
  const cookie = response.headers.get("set-cookie")!;
  for (const attribute of ["HttpOnly", "Secure", "SameSite=lax", "Max-Age=28800"]) assert(cookie.includes(attribute));
  token = cookie.split(";")[0].split("=")[1];
  assert(await verifyAdminSessionToken(token));
  assert.equal((await logout(request("logout", undefined, { origin: "https://evil.test" }))).status, 403);
  assert(await verifyAdminSessionToken(token));
  const out = await logout(request("logout")); assert.equal(out.status, 303); assert(out.headers.get("set-cookie")!.includes("Max-Age=0"));
  globals.__danielVlkoPrisma = { ...db, adminSession: { ...db.adminSession } } as PrismaClient;
  assert(!await verifyAdminSessionToken(token));
  assert.equal((await leads(request("leads/status", "leadId=lead-fixture&status=WON"))).status, 401);
  assert.equal((await logout(request("logout"))).status, 303);
  assert.equal((await logout(request("logout", undefined, { cookie: "" }))).status, 303);
});

test("logout does not claim success if durable revocation fails", async () => {
  mock.method(db.adminSession, "updateMany", async () => { throw new Error("credential-cookie-token"); });
  const response = await logout(request("logout"));
  assert.equal(response.status, 503); assert.equal(response.headers.get("set-cookie"), null);
  assert(!JSON.stringify(logs).includes("credential-cookie-token"));
});

test("provider/database errors retain safe codes without secrets in logs or cron responses", async () => {
  const secret = "token=cookie=credential customer@example.test";
  const error = Object.assign(new Error(secret), { code: "P2002", meta: { secret }, response: { data: secret } });
  logSecurityFailure("fixture", error); assert.equal(safeErrorCode(error), "P2002");
  assert.equal(safeErrorCode({ code: secret }), "unavailable");
  assert.equal(safeErrorCode({ code: "ETIMEDOUT" }), "ETIMEDOUT");
  mock.method(db.lead, "update", async () => { throw error; });
  await leads(request("leads/status", "leadId=lead-fixture&status=WON"));
  process.env.CRON_SECRET = "fixture-cron-secret";
  Object.assign(db.booking, { findMany: async () => { throw error; } });
  const response = await reminders(new NextRequest(origin + "/api/cron/booking-reminders", { headers: { authorization: "Bearer fixture-cron-secret" } }));
  assert.equal(response.status, 500);
  assert(!JSON.stringify(logs).includes(secret)); assert(!JSON.stringify(await response.json()).includes(secret));
  assert(JSON.stringify(logs).includes("P2002"));
});


test("admin quotas stop mutations before writes", async () => {
  Object.assign(db, { $queryRaw: async () => [{ hits: 601, retryAfter: 60 }] });
  const response = await leads(request("leads/status", "leadId=lead-fixture&status=WON"));
  assert.equal(response.status, 429); assert.equal(response.headers.get("retry-after"), "60");
  assert.equal(writes.length, 0);
});

test("rule delete/update and partial-day overrides preserve existing form contracts", async () => {
  for (const action of ["save", "delete"]) {
    const body = new URLSearchParams({ action, ruleId: "rule-fixture", weekday: "1", start: "09:00", end: "17:00" }).toString();
    assert.equal((await rules(request("availability/rules", body))).status, 303);
  }
  assert.equal((await overrides(request("availability/overrides", "dateKey=2026-10-25&type=AVAILABLE&start=09%3A00&end=17%3A00&note=Fixture"))).status, 303);
  assert.deepEqual(writes, ["rule", "rule-delete", "override"]);
  assert.equal((await overrides(request("availability/overrides", "dateKey=2026-02-30&type=BLOCK&wholeDay=on"))).status, 400);
});


test("logout bounds its body and rejects malformed JSON without revoking", async () => {
  assert.equal((await logout(request("logout", "{", { "content-type": "application/json" }))).status, 400);
  assert.equal((await logout(request("logout", "x".repeat(4097)))).status, 413);
  assert(await verifyAdminSessionToken(token));
  assert.equal((await logout(request("logout", "{}", { "content-type": "application/json" }))).status, 303);
  assert(!await verifyAdminSessionToken(token));
});
