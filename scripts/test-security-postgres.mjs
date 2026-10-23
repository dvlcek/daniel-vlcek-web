import assert from "node:assert/strict";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { execFileSync, spawn } from "node:child_process";
import { mkdtempSync, readdirSync, cpSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join, basename, dirname } from "node:path";
import pg from "pg";

// Only a container CREATED by this runner can be migrated or tested.
// Never loads .env.local; never reuses DATABASE_URL/DIRECT_URL or existing containers.
const nonce = randomUUID();
const name = `dv-a2-acceptance-${nonce}`;
const database = "dv_a2_acceptance_test";
const username = "dv_a2_test";
const password = randomBytes(32).toString("hex");
const temporary = mkdtempSync(join(tmpdir(), "dv-a2-acceptance-"));
let container;
let client;
const childEnv = { ...process.env, POSTGRES_PASSWORD: password };
delete childEnv.DATABASE_URL; delete childEnv.DIRECT_URL;
function docker(args) { return execFileSync("docker", args, { encoding: "utf8", env: childEnv, stdio: ["ignore", "pipe", "pipe"] }).trim(); }
function inspectOwned() {
  const info = JSON.parse(docker(["inspect", name]))[0];
  assert.equal(info.Id, container);
  assert.equal(info.Config.Labels["daniel-vlko.a2-nonce"], nonce);
  assert.equal(info.Config.Labels["daniel-vlko.a2-disposable"], "true");
  assert.equal(info.Config.Image, "postgres:16-alpine");
  const port = info.NetworkSettings.Ports["5432/tcp"][0];
  assert.equal(port.HostIp, "127.0.0.1");
  return Number(port.HostPort);
}
async function runNode(args, env) {
  await new Promise((done, reject) => {
    const child = spawn(process.execPath, args, { env, stdio: ["ignore", "pipe", "pipe"] });
    // Redact even fixture credentials; no provider/customer payloads are intentionally emitted.
    const emit = data => process.stdout.write(String(data).replaceAll(password, "[REDACTED]"));
    child.stdout.on("data", emit); child.stderr.on("data", emit);
    child.on("error", () => reject(new Error("Acceptance subprocess could not start.")));
    child.on("exit", code => code === 0 ? done() : reject(new Error("Acceptance subprocess failed.")));
  });
}
try {
  docker(["info", "--format", "{{.ServerVersion}}"]);
  docker(["image", "inspect", "postgres:16-alpine"]); // No implicit image download.
  container = docker(["run", "--rm", "-d", "--name", name,
    "--label", `daniel-vlko.a2-nonce=${nonce}`, "--label", "daniel-vlko.a2-disposable=true",
    "-p", "127.0.0.1::5432", "--tmpfs", "/var/lib/postgresql/data:rw", "--memory", "256m",
    "-e", `POSTGRES_USER=${username}`, "-e", `POSTGRES_DB=${database}`, "-e", "POSTGRES_PASSWORD", "postgres:16-alpine"]);
  const port = inspectOwned();
  assert(port > 0 && port !== 5432, "Refuse default/existing database port.");
  const connectionString = `postgresql://${username}:${password}@127.0.0.1:${port}/${database}`;
  // The image briefly accepts Unix-socket connections during initialization.
  // Wait for the owned mapped TCP endpoint used by Prisma, not pg_isready's socket.
  for (let tries = 0; tries < 30; tries++) {
    client = new pg.Client({ connectionString, connectionTimeoutMillis: 3000 });
    try { await client.connect(); break; }
    catch {
      await client.end(); client = undefined;
      if (tries === 29) throw new Error("Disposable PostgreSQL TCP endpoint was not ready.");
      await new Promise(done => setTimeout(done, 500));
    }
  }
  const identity = (await client.query("SELECT current_database() AS db, current_user AS role, version() AS version")).rows[0];
  assert.equal(identity.db, database); assert.equal(identity.role, username);
  assert.equal((await client.query("SELECT count(*)::integer AS count FROM information_schema.tables WHERE table_schema='public'")).rows[0].count, 0);
  console.log("Verified: new labeled disposable container, localhost-only port, expected test database/user, empty schema.");
  console.log(identity.version.split(" on ")[0]);
  const env = { ...childEnv, A2_TEST_DATABASE_URL: connectionString, DATABASE_URL: connectionString, DIRECT_URL: connectionString,
    SECURITY_RATE_LIMIT_SECRET: randomBytes(32).toString("hex"), CRON_SECRET: randomBytes(32).toString("hex"),
    SECURITY_ALLOWED_ORIGINS: "https://example.test", SECURITY_TRUST_PROXY: "", VERCEL: "", NODE_ENV: "test", A2_TEST_RUN_NONCE: nonce };
  const migrationRoot = resolve("prisma/migrations");
  const previous = join(temporary, "previous-migrations");
  for (const entry of readdirSync(migrationRoot)) {
    if (entry === "20261012210000_booking_ownership_and_rate_limits") continue;
    cpSync(join(migrationRoot, entry), join(previous, entry), { recursive: true });
  }
  const prisma = resolve("node_modules/prisma/build/index.js");
  await runNode([prisma, "migrate", "deploy", "--config", "tests/prisma-acceptance.config.ts"], { ...env, A2_TEST_MIGRATIONS: previous });
  await client.query('CREATE TABLE "_A2AcceptanceGuard" (nonce UUID PRIMARY KEY)');
  await client.query('INSERT INTO "_A2AcceptanceGuard" VALUES ($1)', [nonce]);
  await client.query(`INSERT INTO "Lead" (id,name,email,"emailNormalized",source,status,"updatedAt")
    VALUES ('previous-lead','Previous fixture','previous@test.local','previous@test.local','WEBSITE_BOOKING','BOOKED',CURRENT_TIMESTAMP)`);
  await client.query(`INSERT INTO "Booking" (id,"leadId","startsAt","endsAt",timezone,status,"cancelTokenHash","updatedAt")
    VALUES ('previous-booking','previous-lead','2030-01-01T12:00:00Z','2030-01-01T12:30:00Z','Europe/Vienna','CONFIRMED',$1,CURRENT_TIMESTAMP)`, [createHash("sha256").update("previous-fixture-management-token").digest("hex")]);
  const before = (await client.query('SELECT row_to_json(l) AS lead, row_to_json(b) AS booking FROM "Lead" l JOIN "Booking" b ON b."leadId"=l.id')).rows;
  inspectOwned(); // Identity recheck immediately before the new migration.
  await runNode([prisma, "migrate", "deploy", "--config", "tests/prisma-acceptance.config.ts"], env);
  assert.deepEqual((await client.query('SELECT row_to_json(l) AS lead, row_to_json(b) AS booking FROM "Lead" l JOIN "Booking" b ON b."leadId"=l.id')).rows, before);
  const indexes = (await client.query("SELECT indexname FROM pg_indexes WHERE tablename IN ('BookingAttempt','SecurityRateLimit')")).rows.map(row => row.indexname);
  for (const index of ["BookingAttempt_pkey", "BookingAttempt_tokenHash_key", "BookingAttempt_leadId_key", "BookingAttempt_expiresAt_idx", "SecurityRateLimit_pkey", "SecurityRateLimit_expiresAt_idx"]) assert(indexes.includes(index));
  const constraints = (await client.query("SELECT conname FROM pg_constraint WHERE conname IN ('BookingAttempt_leadId_fkey','BookingAttempt_bookingId_fkey')")).rows;
  assert.equal(constraints.length, 2);
  console.log("PASS: previous schema migrated; representative records unchanged; six security indexes and both foreign keys present.");
  await runNode(["node_modules/tsx/dist/cli.mjs", "--test", "tests/security.postgres.test.ts"], env);
  await runNode([prisma, "migrate", "status", "--config", "tests/prisma-acceptance.config.ts"], env);
  if (process.argv.includes("--browser")) {
    const { runBrowserAcceptance } = await import("./run-browser-acceptance.mjs");
    await runBrowserAcceptance(env);
  }
  writeFileSync("docs/audits/a2-postgres-acceptance.json", JSON.stringify({
    date: new Date().toISOString(), database: database, host: "127.0.0.1", disposable: true,
    postgres: identity.version.split(" on ")[0], migration: "PASS", previousRecords: "PASS", indexesAndForeignKeys: "PASS", integrationTests: "PASS",
    browser: process.argv.includes("--browser") && !process.env.A3_TEST_GREP ? "Isolated Chromium PASS; see a4-browser-acceptance.json. Production NOT VERIFIED." : "NOT VERIFIED", vercelIngress: "NOT VERIFIED", productionTouched: false,
  }, null, 2) + "\n");
} catch {
  console.error("PostgreSQL acceptance failed or unavailable; credentials and provider payloads omitted.");
  process.exitCode = 1;
} finally {
  if (client) await client.end();
  if (container) {
    try { inspectOwned(); docker(["stop", name]); console.log("Disposed only this runner's labeled test container and tmpfs data."); }
    catch { console.error("Owned test-container cleanup requires inspection; no unrelated container was touched."); process.exitCode = 1; }
  }
  const resolved = resolve(temporary);
  if (dirname(resolved) === resolve(tmpdir()) && basename(resolved).startsWith("dv-a2-acceptance-")) rmSync(resolved, { recursive: true });
}
