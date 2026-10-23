import { test, expect, type Page, type BrowserContext, type APIRequestContext } from "@playwright/test";

const origin = process.env.A3_APP_URL!;
const fixture = process.env.A3_FIXTURE_URL!;
const nonceHeaders = { "x-fixture-nonce": process.env.A2_TEST_RUN_NONCE! };

async function control(request: APIRequestContext, path: string, data?: unknown) {
  const response = await request.post(fixture + "/__fixture/" + path, { headers: nonceHeaders, data });
  expect(response.ok()).toBeTruthy();
  return response.json();
}
async function wire(context: BrowserContext) {
  // The local TLS proxy serves the production UI and isolated handlers.
  // Browser requests to every other origin are blocked (except explicit local page fixtures).
  await context.route("**/*", async route => {
    if (new URL(route.request().url()).origin !== origin) await route.abort();
    else await route.continue();
  });
}
async function dismissConsent(page: Page) {
  const reject = page.getByRole("button", { name: "Reject optional" });
  if (await reject.isVisible()) await reject.click();
}
async function chooseSlot(page: Page) {
  await page.getByRole("button", { name: /^\d{2}:\d{2}$/ }).first().click();
  await expect(page.getByPlaceholder("Your name")).toBeVisible();
}
async function details(page: Page) {
  await page.getByPlaceholder("Your name").fill("Browser Fixture");
  await page.getByPlaceholder("you@company.com").fill("browser@test.local");
  await page.locator("textarea").fill("Synthetic acceptance fixture for native booking.");
}
async function submit(page: Page) {
  await page.getByRole("button", { name: "Confirm discovery call" }).click();
}
async function api(page: Page, path: string, body: unknown) {
  return page.evaluate(async ({ path, body }) => {
    const res = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    return { status: res.status, body: await res.json() };
  }, { path, body });
}

test.beforeEach(async ({ context, request }) => {
  await control(request, "reset");
  await wire(context);
});
test.afterEach(async ({ context }) => { await context.unrouteAll({ behavior: "wait" }); });

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`public routes, navigation, consent and overflow at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const path of ["/", "/contact", "/legal", "/privacy", "/cookies"]) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
      if (path === "/") {
        await expect(page.getByRole("button", { name: "Reject optional" })).toBeVisible();
        await dismissConsent(page);
      }
      if (path === "/contact") await expect(page.getByRole("button", { name: /^\d{2}:\d{2}$/ }).first()).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
      await page.screenshot({ path: testInfo.outputPath(`${path.slice(1) || "home"}-${width}.png`), fullPage: true });
      if (path === "/") await page.screenshot({ path: testInfo.outputPath(`header-${width}.png`) });
    }
    await page.goto("/");
    if (width < 1024) {
      const toggle = page.getByRole("button", { name: "Menu", exact: true });
      await toggle.focus(); await page.keyboard.press("Enter");
      const dialog = page.getByRole("dialog", { name: "Mobile navigation" });
      await expect(dialog).toBeVisible();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(dialog.getByRole("link", { name: "Work", exact: true })).toBeFocused();
      expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
      for (let i = 0; i < 9; i++) {
        await page.keyboard.press("Tab");
        expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBeTruthy();
      }
      for (let i = 0; i < 9; i++) {
        await page.keyboard.press("Shift+Tab");
        expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBeTruthy();
      }
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await expect(toggle).toBeFocused();
      expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
      await toggle.click();
      await page.screenshot({ path: testInfo.outputPath(`menu-${width}.png`) });
      await dialog.getByRole("link", { name: "Work", exact: true }).click();
      await expect(page).toHaveURL(/\/#work$/);
      await expect(page.locator("#work")).toBeInViewport();
      await expect(dialog).not.toBeVisible();
      await toggle.click();
      await page.setViewportSize({ width: 1024, height: 900 });
      await expect(dialog).not.toBeVisible();
      expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
    } else {
      await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Menu", exact: true })).not.toBeVisible();
    }
    expect(errors).toEqual([]);
  });
}

test("owned booking, HTTPS cookie flags, refresh, replay, email, management and admin", async ({ page, context, request }) => {
  await page.goto("/contact"); await dismissConsent(page);
  await chooseSlot(page); await details(page); await submit(page);
  await expect(page.getByRole("heading", { name: "Everything's set." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Everything's set." })).toBeFocused();
  const cookies = (await context.cookies(origin)).filter(cookie => cookie.name.startsWith("__Host-dv_booking_"));
  expect(cookies.length).toBe(1);
  expect(cookies[0].httpOnly && cookies[0].secure && cookies[0].sameSite === "Strict" && cookies[0].path === "/").toBeTruthy();
  expect(cookies[0].expires - Date.now() / 1000).toBeGreaterThan(3500);
  expect(await page.evaluate(() => document.cookie.includes("dv_booking"))).toBeFalsy();
  const foreign = await context.newPage();
  await foreign.route("https://foreign.test/", route => route.fulfill({ contentType: "text/html", body: `<a href="${origin}/contact">Open booking site</a>` }));
  await foreign.goto("https://foreign.test/");
  const navigation = foreign.waitForRequest(req => req.isNavigationRequest() && req.url() === origin + "/contact");
  await foreign.getByRole("link", { name: "Open booking site" }).click();
  expect((await (await navigation).allHeaders()).cookie?.includes("dv_booking") ?? false).toBeFalsy();
  await foreign.close();
  let state = await control(request, "state");
  expect(state.events).toHaveLength(1); expect(state.emails).toHaveLength(1); expect(state.rows).toHaveLength(1);
  const row = state.rows[0];
  expect(row.status).toBe("CONFIRMED"); expect(row.lead.status).toBe("BOOKED");
  expect(row.timezone).toBe("Europe/Vienna");
  expect(state.events[0].startsAt).toBe(row.startsAt);
  expect(state.events[0].timezone).toBe("Europe/Vienna");
  expect(new Date(row.endsAt).getTime() - new Date(row.startsAt).getTime()).toBe(30 * 60_000);
  const email = state.emails[0];
  expect(email.to).toEqual(["browser@test.local"]);
  expect(email.text).toContain("Europe/Vienna");
  const manageUrl = email.text.split("\n").find((line: string) => line.startsWith(origin + "/booking/manage#"));
  expect(typeof manageUrl).toBe("string");
  expect(email.html).toContain(manageUrl.replaceAll("&", "&amp;"));
  expect(email.text).not.toContain("fixture-meeting");
  const attempt = await page.evaluate(() => JSON.parse(sessionStorage.getItem("dv-booking-attempt")!));
  await page.reload();
  expect(await page.evaluate(id => JSON.parse(sessionStorage.getItem("dv-booking-attempt")!).id === id, attempt.id)).toBeTruthy();
  const replay = await api(page, "/api/booking/confirm", { attemptId: attempt.id, leadId: row.leadId, startsAt: row.startsAt });
  expect(replay.status).toBe(200); expect(replay.body.booking.id).toBe(row.id);
  state = await control(request, "state"); expect(state.events).toHaveLength(1); expect(state.emails).toHaveLength(1);
  await page.goto(manageUrl);
  await expect(page.getByRole("button", { name: /reschedule/i }).first()).toBeVisible();
  await expect(page).toHaveURL(origin + "/booking/manage");
  await page.reload();
  await expect(page.getByRole("button", { name: /reschedule/i }).first()).toBeVisible();
  await page.getByRole("button", { name: "Reschedule", exact: true }).click();
  await page.getByRole("button", { name: /^\d{2}:\d{2}$/ }).first().click();
  await page.getByRole("button", { name: "Confirm new time" }).click();
  await expect(page.getByRole("button", { name: "Reschedule", exact: true })).toBeVisible();
  state = await control(request, "state");
  expect(state.rows[0].status).toBe("CONFIRMED");
  expect(state.rows[0].startsAt).not.toBe(row.startsAt);
  expect(state.emails.length).toBe(2);
  // Log in through the real guard/session handler; the dashboard reads the same disposable database.
  await page.goto("/admin/login");
  await page.locator('input[name="password"]').fill("fixture-password");
  await page.getByRole("button", { name: "Enter dashboard" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByText("browser@test.local").first()).toBeVisible();
  await page.goto(manageUrl);
  await page.getByRole("button", { name: "Cancel booking", exact: true }).click();
  await page.getByRole("button", { name: "Cancel booking", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Booking cancelled." })).toBeVisible();
  state = await control(request, "state");
  expect(state.rows[0].status).toBe("CANCELLED");
  expect(state.rows[0].activeSlotKey).toBeNull();
});

test("independent tabs and cookie jars, lost cookies, expired intake and confirmation recovery", async ({ page, context, browser, request }) => {
  await page.goto("/contact"); await dismissConsent(page);
  const firstId = crypto.randomUUID();
  const body = { attemptId: firstId, name: "Tab fixture", email: "same@test.local", timezone: "Europe/Vienna" };
  const a = await api(page, "/api/booking/intake", body); expect(a.status).toBe(201);
  await page.reload(); expect((await api(page, "/api/booking/intake", body)).status).toBe(200);
  const tab = await context.newPage(); await tab.goto("/contact");
  const b = await api(tab, "/api/booking/intake", { ...body, attemptId: crypto.randomUUID() });
  expect(b.status).toBe(201); expect(b.body.leadId).not.toBe(a.body.leadId);
  const separate = await browser.newContext({ ignoreHTTPSErrors: true }); await wire(separate);
  const stranger = await separate.newPage(); await stranger.goto("/contact");
  expect((await api(stranger, "/api/booking/intake", body)).status).toBe(403);
  await separate.unrouteAll({ behavior: "wait" }); await separate.close();
  await control(request, "mode", { expire: true });
  await page.evaluate(id => sessionStorage.setItem("dv-booking-attempt", JSON.stringify({ id, createdAt: Date.now() })), firstId);
  await chooseSlot(page); await details(page); await submit(page);
  await expect(page.getByText(/session is invalid or expired/i).first()).toBeVisible();
  expect(await page.evaluate(() => sessionStorage.getItem("dv-booking-attempt"))).toBeNull();
  // Force expiry in the narrow window after a successful intake.
  await page.route("**/api/booking/confirm", async route => {
    await control(request, "mode", { expire: true });
    await route.fallback();
  });
  await submit(page);
  await expect(page.getByText(/session is invalid or expired/i).first()).toBeVisible();
  expect(await page.evaluate(() => sessionStorage.getItem("dv-booking-attempt"))).toBeNull();
  await page.unroute("**/api/booking/confirm");
  await submit(page); await expect(page.getByRole("heading", { name: "Everything's set." })).toBeVisible();
});

test("slot conflict returns to availability; failed calendar retries safely; failed email preserves booking", async ({ page, request }) => {
  await page.goto("/contact"); await dismissConsent(page); await chooseSlot(page); await details(page);
  await page.route("**/api/booking/confirm", route => route.fulfill({ status: 409, json: { ok: false, message: "That time was just booked. Please choose another." } }));
  await submit(page);
  await expect(page.getByText("That time was just booked. Please choose another.")).toBeVisible();
  await chooseSlot(page); // Form details remain available after selecting another slot.
  await page.unroute("**/api/booking/confirm");
  await control(request, "mode", { calendarFailure: true });
  await submit(page);
  await expect(page.getByText(/could not be added to the calendar/i)).toBeVisible();
  let state = await control(request, "state");
  expect(state.events).toHaveLength(0); expect(state.emails).toHaveLength(0);
  expect(state.rows.every((row: { status: string }) => row.status === "CANCELLED")).toBeTruthy();
  await control(request, "mode", { emailFailure: true });
  await submit(page); await expect(page.getByRole("heading", { name: "Everything's set." })).toBeVisible();
  state = await control(request, "state"); expect(state.events).toHaveLength(1); expect(state.emails).toHaveLength(0);
  expect(state.rows.filter((row: { status: string }) => row.status === "CONFIRMED")).toHaveLength(1);
});

test("privacy controls, reduced motion, management with blocked storage, and internal links", async ({ page }) => {
  const measurement: string[] = [];
  page.on("request", request => { if (/insights|analytics|vitals/.test(request.url())) measurement.push(request.url()); });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Reject optional" })).toBeVisible();
  expect(measurement).toEqual([]);
  await dismissConsent(page);
  await page.getByRole("button", { name: "Privacy settings" }).click();
  await expect(page.getByRole("button", { name: "Allow analytics" })).toBeVisible();
  await page.getByRole("button", { name: "Allow analytics" }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("dv_privacy_choice_v1")!).analytics)).toBeTruthy();
  await page.getByRole("button", { name: "Privacy settings" }).click();
  await dismissConsent(page);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("dv_privacy_choice_v1")!).analytics)).toBeFalsy();
  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBeTruthy();
  // Every visible internal destination and section target on the homepage exists.
  const links = await page.locator('a[href^="/"]').evaluateAll(nodes => [...new Set(nodes.map(node => node.getAttribute("href")!))]);
  for (const href of links) {
    const url = new URL(href, origin);
    const res = await page.goto(url.href);
    if (res) expect(res.ok()).toBeTruthy(); // Same-document anchor navigation has no HTTP response.
    if (url.hash) expect(await page.locator(url.hash).count()).toBe(1);
  }
  await page.addInitScript(() => Object.defineProperty(window, "sessionStorage", { get() { throw new Error("Synthetic blocked storage"); } }));
  await page.goto("/booking/manage#booking=previous-booking&token=previous-fixture-management-token");
  await expect(page.getByRole("button", { name: /reschedule/i }).first()).toBeVisible();
});

test("standard motion hydration, availability retry, calendar controls and empty slots", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/"); await dismissConsent(page);
  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.route("**/api/booking/availability?*", route => route.fulfill({ status: 503, json: { ok: false, message: "Synthetic availability outage." } }));
  await page.goto("/contact");
  await expect(page.getByText("Synthetic availability outage.")).toBeVisible();
  await page.unroute("**/api/booking/availability?*");
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("button", { name: /^\d{2}:\d{2}$/ }).first()).toBeVisible();
  await page.getByRole("button", { name: "View calendar" }).click();
  await page.getByRole("button", { name: "Next month", exact: true }).click();
  await page.getByRole("button", { name: "Previous month", exact: true }).click();
  await page.getByRole("button", { name: "Quick dates" }).click();
  await expect(page.getByRole("button", { name: /^\d{2}:\d{2}$/ }).first()).toBeVisible();
  await page.route("**/api/booking/availability?*", route => route.fulfill({ json: { ok: true, timezone: "Europe/Vienna", slotDurationMinutes: 30, days: [] } }));
  await page.reload();
  await expect(page.getByText("No times available.", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "hello@danielvlko.com" }).first()).toBeVisible();
  expect(errors).toEqual([]);
});
