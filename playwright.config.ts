import { defineConfig } from "@playwright/test";

// The guarded Docker runner must supply BOTH URLs. Never reuse a running site.
if (!process.env.A3_APP_URL || !process.env.A3_FIXTURE_URL || !process.env.A2_TEST_RUN_NONCE) {
  throw new Error("Use npm run test:acceptance; an owned disposable database is required.");
}

export default defineConfig({
  testDir: "tests/browser",
  workers: 1,
  fullyParallel: false,
  timeout: 60_000,
  use: { baseURL: process.env.A3_APP_URL, browserName: "chromium", ignoreHTTPSErrors: true, timezoneId: "Europe/Vienna", reducedMotion: "reduce", trace: "off" },
  reporter: [["list"], ["json", { outputFile: "test-results/acceptance.json" }]],
});
