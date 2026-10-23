import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mock } from "node:test";
import pg from "pg";
import { NextRequest } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { GoogleCalendarProvider } from "@/lib/booking/calendar/google";
import { GET as availability } from "@/app/api/booking/availability/route";
import { POST as intake } from "@/app/api/booking/intake/route";
import { POST as confirm } from "@/app/api/booking/confirm/route";
import { POST as manage } from "@/app/api/booking/manage/route";
import { POST as cancel } from "@/app/api/booking/cancel/route";
import { POST as reschedule } from "@/app/api/booking/reschedule/route";
import { POST as login } from "@/app/api/admin/login/route";

async function main() {
  const connectionString = process.env.A2_TEST_DATABASE_URL!;
  const url = new URL(connectionString);
  assert.equal(url.hostname, "127.0.0.1");
  assert.equal(url.pathname, "/dv_a2_acceptance_test");
  assert.equal(connectionString, process.env.DATABASE_URL);
  assert(process.env.A2_TEST_RUN_NONCE);
  const identity = new pg.Client({ connectionString });
  await identity.connect();
  assert.equal((await identity.query('SELECT nonce::text FROM "_A2AcceptanceGuard"')).rows[0].nonce, process.env.A2_TEST_RUN_NONCE);
  await identity.end();
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  (globalThis as typeof globalThis & { __danielVlkoPrisma?: PrismaClient }).__danielVlkoPrisma = db;
  const events: unknown[] = [];
  const emails: { html?: string; text?: string; to?: string[] }[] = [];
  let calendarFailure = false;
  let emailFailure = false;
  mock.method(GoogleCalendarProvider.prototype, "getBusyPeriods", async () => []);
  mock.method(GoogleCalendarProvider.prototype, "getBusyPeriodsExcludingEvent", async () => []);
  mock.method(GoogleCalendarProvider.prototype, "createEvent", async (input: Parameters<GoogleCalendarProvider["createEvent"]>[0]) => {
    if (calendarFailure) throw new Error("Synthetic calendar failure");
    events.push(input);
    return { externalEventId: `fixture-${events.length}`, meetingUrl: "https://example.test/fixture-meeting" };
  });
  mock.method(GoogleCalendarProvider.prototype, "updateEvent", async () => ({ externalEventId: "fixture-updated" }));
  mock.method(GoogleCalendarProvider.prototype, "cancelEvent", async () => undefined);
  // All outbound fetches in this process are stopped here. Only synthetic email payloads are accepted.
  mock.method(globalThis, "fetch", async (input: string | URL | Request, init?: RequestInit) => {
    assert(String(input).startsWith("https://api.resend.com/"), "Unexpected outbound HTTP blocked");
    if (emailFailure) return new Response('{"message":"Synthetic email failure"}', { status: 503 });
    emails.push(JSON.parse(String(init?.body)));
    return new Response('{"id":"fixture-email"}', { headers: { "content-type": "application/json" } });
  });
  const handlers: Record<string, (r: NextRequest) => Promise<Response>> = {
    "GET /api/booking/availability": availability,
    "POST /api/booking/intake": intake,
    "POST /api/booking/confirm": confirm,
    "POST /api/booking/manage": manage,
    "POST /api/booking/cancel": cancel,
    "POST /api/booking/reschedule": reschedule,
    "POST /api/admin/login": login,
  };
  const server = createServer(async (req, res) => {
    try {
      if (req.headers["x-fixture-nonce"] !== process.env.A2_TEST_RUN_NONCE) { res.writeHead(403).end(); return; }
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = Buffer.concat(chunks).toString();
      const path = new URL(req.url!, "http://localhost");
      if (path.pathname === "/__fixture/reset") {
        await db.bookingAttempt.deleteMany();
        await db.booking.deleteMany({ where: { id: { not: "previous-booking" } } });
        await db.lead.deleteMany({ where: { id: { not: "previous-lead" } } });
        await db.securityRateLimit.deleteMany();
        await db.availabilityOverride.deleteMany();
        await db.availabilityRule.deleteMany();
        await db.availabilityRule.createMany({ data: Array.from({ length: 7 }, (_, weekday) => ({ weekday, startMinute: 540, endMinute: 1020 })) });
        events.length = 0; emails.length = 0; calendarFailure = false; emailFailure = false;
        res.writeHead(200).end('{}'); return;
      }
      if (path.pathname === "/__fixture/mode") {
        const mode = JSON.parse(body);
        calendarFailure = Boolean(mode.calendarFailure); emailFailure = Boolean(mode.emailFailure);
        if (mode.expire) await db.bookingAttempt.updateMany({ data: { expiresAt: new Date(0) } });
        res.writeHead(200).end('{}'); return;
      }
      if (path.pathname === "/__fixture/state") {
        const rows = await db.booking.findMany({ where: { id: { not: "previous-booking" } }, include: { lead: true } });
        res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify({ events, emails, rows })); return;
      }
      const handler = handlers[`${req.method} ${path.pathname}`];
      if (!handler) { res.writeHead(404).end(); return; }
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) if (value && key !== "host" && key !== "x-fixture-nonce") headers.set(key, String(value));
      const request = new NextRequest(process.env.A3_APP_URL + req.url!, { method: req.method, headers, ...(body ? { body } : {}) });
      const response = await handler(request);
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(Buffer.from(await response.arrayBuffer()));
    } catch {
      res.writeHead(500).end('{"ok":false,"message":"Isolated fixture failed"}');
    }
  });
  server.listen(Number(process.env.A3_FIXTURE_PORT), "127.0.0.1", () => console.log("Owned browser fixture ready; provider traffic blocked."));
}
void main().catch(() => { console.error("Browser fixture refused unknown database or configuration."); process.exit(1); });
