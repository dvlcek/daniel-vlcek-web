import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import { createServer } from "node:net";
import { createServer as createHttpsServer } from "node:https";
import { request as upstreamRequest } from "node:http";
import { existsSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname, basename } from "node:path";
import { parse } from "dotenv";

async function freePort() {
  const server = createServer();
  await new Promise(done => server.listen(0, "127.0.0.1", done));
  const port = server.address().port;
  await new Promise(done => server.close(done));
  return port;
}

export async function runBrowserAcceptance(databaseEnv) {
  assert(databaseEnv.A2_TEST_RUN_NONCE && databaseEnv.A2_TEST_DATABASE_URL);
  const appPort = await freePort(), fixturePort = await freePort(), tlsPort = await freePort();
  const publicOrigin = `https://localhost:${tlsPort}`;
  const tlsDirectory = mkdtempSync(join(tmpdir(), "dv-a3-tls-"));
  const openssl = process.platform === "win32" ? "C:/Program Files/Git/usr/bin/openssl.exe" : "openssl";
  execFileSync(openssl, ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "1", "-subj", "/CN=localhost", "-addext", "subjectAltName=IP:127.0.0.1,DNS:localhost", "-keyout", join(tlsDirectory, "key.pem"), "-out", join(tlsDirectory, "cert.pem")], { stdio: "ignore", env: { ...process.env, MSYS_NO_PATHCONV: "1" } });
  // Explicitly shadow every local env key so Next cannot load real credentials.
  const blankLocal = {};
  for (const file of [".env", ".env.local", ".env.production", ".env.production.local"]) {
    if (existsSync(file)) for (const key of Object.keys(parse(readFileSync(file)))) blankLocal[key] = "";
  }
  const env = { ...process.env, ...blankLocal, ...databaseEnv, NODE_ENV: "production",
    A3_APP_URL: publicOrigin, A3_FIXTURE_URL: `http://127.0.0.1:${fixturePort}`, A3_FIXTURE_PORT: String(fixturePort),
    SECURITY_ALLOWED_ORIGINS: publicOrigin, SITE_URL: publicOrigin, NEXT_PUBLIC_SITE_URL: "",
    COMING_SOON_ENABLED: "false", NEXT_TELEMETRY_DISABLED: "1",
    GOOGLE_CALENDAR_CLIENT_ID: "fixture", GOOGLE_CALENDAR_CLIENT_SECRET: "fixture", GOOGLE_CALENDAR_REFRESH_TOKEN: "fixture", GOOGLE_CALENDAR_ID: "primary",
    RESEND_API_KEY: "re_fixture", CONTACT_TO_EMAIL: "owner@test.local", CONTACT_FROM_EMAIL: "fixture@test.local",
    BOOKING_FROM_EMAIL: "fixture@test.local", BOOKING_REPLY_TO_EMAIL: "reply@test.local", BOOKING_ORGANIZER_EMAIL: "organizer@test.local",
    ADMIN_PASSWORD: "fixture-password", ADMIN_SESSION_SECRET: "fixture-admin-signature-secret-more-than-32-characters" };
  const children = [];
  const proxy = createHttpsServer({ key: readFileSync(join(tlsDirectory, "key.pem")), cert: readFileSync(join(tlsDirectory, "cert.pem")) }, (req, res) => {
    const api = req.url.startsWith("/api/");
    const upstream = new URL(req.url, api ? env.A3_FIXTURE_URL : `http://localhost:${appPort}`);
    const forwarded = upstreamRequest(upstream, {
      method: req.method,
      headers: { ...req.headers, ...(api ? { "x-fixture-nonce": env.A2_TEST_RUN_NONCE } : {}), "x-forwarded-proto": "https" },
    }, response => { res.writeHead(response.statusCode, response.headers); response.pipe(res); });
    forwarded.on("error", () => { if (!res.headersSent) res.writeHead(502); res.end(); });
    res.on("close", () => forwarded.destroy());
    req.pipe(forwarded);
  });
  function start(args, ready) {
    return new Promise((resolve, reject) => {
      const child = spawn(process.execPath, args, { env, stdio: ["ignore", "pipe", "pipe"] });
      children.push(child);
      const timeout = setTimeout(() => reject(new Error("Acceptance server startup timed out")), 45_000);
      child.stdout.on("data", data => { if (String(data).includes(ready)) { clearTimeout(timeout); resolve(child); } });
      child.stderr.on("data", () => {}); // No unknown config or payloads enter committed evidence.
      child.on("error", () => { clearTimeout(timeout); reject(new Error("Acceptance process failed to start")); });
      child.on("exit", () => { clearTimeout(timeout); reject(new Error("Acceptance server exited")); });
    });
  }
  try {
    await start(["--import", "tsx", "tests/browser/fixture-server.ts"], "Owned browser fixture ready");
    await start(["node_modules/next/dist/bin/next", "start", "--hostname", "localhost", "--port", String(appPort)], "Ready in");
    await new Promise((done, reject) => { proxy.once("error", reject); proxy.listen(tlsPort, "localhost", done); });
    await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, ["node_modules/@playwright/test/cli.js", "test", ...(process.env.A3_TEST_GREP ? ["--grep", process.env.A3_TEST_GREP] : [])], { env, stdio: "inherit" });
      child.on("error", reject);
      child.on("exit", code => code === 0 ? resolve() : reject(new Error("Browser acceptance failed")));
    });
    if (process.env.A3_TEST_GREP) return; // A filtered debug run cannot publish full acceptance evidence.
    const report = JSON.parse(readFileSync("test-results/acceptance.json", "utf8"));
    writeFileSync("docs/audits/a4-browser-acceptance.json", JSON.stringify({
      date: new Date().toISOString(), browser: "Playwright Chromium", widths: [320, 375, 768, 1024, 1440, 1920],
      stats: report.stats, environment: "Local production UI build over real loopback HTTPS; API handlers via guarded HTTP fixture bridge; owned disposable PostgreSQL; Google and Resend stubbed",
      productionCookies: "Secure/HttpOnly/SameSite Strict tested over local TLS with an ephemeral self-signed certificate; not evidence of deployed TLS or ingress",
      productionAcceptance: "NOT VERIFIED", externalDelivery: false,
    }, null, 2) + "\n");
  } finally {
    proxy.closeAllConnections();
    if (proxy.listening) await new Promise(done => proxy.close(done));
    for (const child of children.reverse()) {
      if (child.exitCode !== null) continue;
      const closed = new Promise(done => child.once("exit", done));
      child.kill();
      await closed;
    }
    const resolved = resolve(tlsDirectory);
    if (dirname(resolved) === resolve(tmpdir()) && basename(resolved).startsWith("dv-a3-tls-")) rmSync(resolved, { recursive: true });
  }
}
