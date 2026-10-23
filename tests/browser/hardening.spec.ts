import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { writeFileSync } from "node:fs";

const origin = process.env.A3_APP_URL!;
const baseline = process.env.A4_BASELINE === "1";

test.beforeEach(async ({ context, request }) => {
  const reset = await request.post(process.env.A3_FIXTURE_URL + "/__fixture/reset", { headers: { "x-fixture-nonce": process.env.A2_TEST_RUN_NONCE! } });
  expect(reset.ok()).toBeTruthy();
  await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
});

test("A4 SEO, private indexing, icons, skip links and booking validation", async ({ page }) => {
  const titles = new Set<string>();
  const routeEvidence = [];
  for (const [path, index] of [["/", true], ["/contact", true], ["/legal", false], ["/privacy", false], ["/cookies", false], ["/coming-soon", false], ["/booking/manage", false], ["/admin/login", false]] as const) {
    const response = await page.goto(path);
    expect(response?.ok()).toBeTruthy();
    expect(new URL((await page.locator('link[rel="canonical"]').getAttribute("href"))!).href).toBe(new URL(path, "https://danielvlko.com").href);
    expect(await page.locator('meta[name="description"]').getAttribute("content")).toBeTruthy();
    expect(new URL((await page.locator('meta[property="og:url"]').getAttribute("content"))!).href).toBe(new URL(path, "https://danielvlko.com").href);
    expect(await page.locator('meta[name="twitter:title"]').getAttribute("content")).toContain("Daniel VLKO");
    const title = await page.title(); expect(titles.has(title)).toBeFalsy(); titles.add(title);
    expect(title.match(/Daniel VLKO/g)?.length).toBe(1);
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots).toMatch(index ? /(^|,\s*)index(,|$)/ : /noindex/);
    if (path.startsWith("/admin") || path.startsWith("/booking")) expect(response?.headers()["x-robots-tag"]).toContain("noindex");
    routeEvidence.push({ path, title, canonical: await page.locator('link[rel="canonical"]').getAttribute("href"), robots, indexingHeader: response?.headers()["x-robots-tag"] ?? null });
  }
  const sitemap = await (await page.request.get(origin + "/sitemap.xml")).text();
  expect(sitemap).toContain("https://danielvlko.com/contact");
  for (const unfinished of ["/admin", "/booking", "/legal", "/privacy", "/cookies", "/work", "/coming-soon"]) expect(sitemap).not.toContain("https://danielvlko.com" + unfinished);
  for (const icon of ["/favicon.ico", "/icon.svg", "/apple-icon.png"]) {
    const response = await page.request.get(origin + icon); expect(response.status()).toBe(200); expect(response.headers()["content-type"]).toMatch(/image\//);
  }
  writeFileSync("docs/audits/a4-route-checks.json", JSON.stringify({ date: new Date().toISOString(), result: "PASS for metadata/indexing/sitemap/icons", routes: routeEvidence, sitemap, icons: ["/favicon.ico", "/icon.svg", "/apple-icon.png"], productionTouched: false }, null, 2) + "\n");
  for (const path of ["/", "/contact"]) {
    await page.goto(path);
    const reject = page.getByRole("button", { name: "Reject optional" });
    if (!await page.evaluate(() => localStorage.getItem("dv_privacy_choice_v1"))) { await expect(reject).toBeVisible(); await reject.click(); }
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
    await page.keyboard.press("Enter"); await expect(page.locator("#main-content")).toBeFocused();
  }
  await page.getByRole("button", { name: /^\d{2}:\d{2}$/ }).first().click();
  await page.getByRole("button", { name: "Confirm discovery call" }).click();
  await expect(page.locator("#booking-form-error")).toHaveAttribute("role", "alert");
  await expect(page.locator("#booking-form-error")).toContainText("Name");
  await expect(page.getByPlaceholder("Your name")).toBeFocused();
  const detailsScan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(detailsScan.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
});

test("A4 accessibility and narrow hero acceptance", async ({ page }, info) => {
  test.setTimeout(180_000);
  const results = [];
  const geometry = [];
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: width === 320 ? 568 : 900 });
    for (const path of ["/", "/contact"]) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      const reject = page.getByRole("button", { name: "Reject optional" });
      if (!await page.evaluate(() => localStorage.getItem("dv_privacy_choice_v1"))) {
        await expect(reject).toBeVisible(); await reject.click();
      }
      if (path === "/contact") await expect(page.getByRole("button", { name: /^\d{2}:\d{2}$/ }).first()).toBeVisible();
      for (const section of await page.locator("main section").all()) await section.scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.screenshot({ path: info.outputPath(`${baseline ? "before" : "after"}-${path.slice(1) || "home"}-${width}.png`), fullPage: true });
      if (path === "/") {
        geometry.push(await page.evaluate(() => {
          const cta = document.querySelector('a[href="/#work"].button-secondary')!.getBoundingClientRect();
          const logos = [...document.querySelectorAll("p")].find(p => p.textContent?.trim() === "Platforms I build with")!.getBoundingClientRect();
          return { width: innerWidth, height: innerHeight, ctaBottom: cta.bottom, logosTop: logos.top, clearance: logos.top - cta.bottom };
        }));
      }
      const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      results.push({ width, path, violations: scan.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, helpUrl: v.helpUrl, nodes: v.nodes.map(n => ({ target: n.target, html: n.html, summary: n.failureSummary })) })), incomplete: scan.incomplete.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, html: n.html, summary: n.failureSummary })) })) });
    }
  }
  writeFileSync(`docs/audits/a4-accessibility-${baseline ? "before" : "after"}.json`, JSON.stringify({ date: new Date().toISOString(), baseline, results, geometry, scope: "Automated Chromium WCAG-tagged rules; manual screen-reader/assistive-device acceptance not established." }, null, 2) + "\n");
  if (!baseline) {
    const violations = results.flatMap(r => r.violations.map(v => ({ width: r.width, path: r.path, id: v.id, targets: v.nodes.map(n => n.target) })));
    expect(violations).toEqual([]);
    expect(geometry.every(g => g.clearance >= 16)).toBeTruthy();
  }
});

test("A4 hero clearance at six widths and short viewport heights", async ({ page }, info) => {
  for (const [width, height] of [[320, 400], [320, 568], [320, 900], [375, 900], [768, 900], [1024, 900], [1440, 900], [1920, 900]]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    if (!await page.evaluate(() => localStorage.getItem("dv_privacy_choice_v1"))) await page.getByRole("button", { name: "Reject optional" }).click();
    const layout = await page.evaluate(() => {
      const cta = document.querySelector('a[href="/#work"].button-secondary')!.getBoundingClientRect();
      const label = [...document.querySelectorAll("p")].find(p => p.textContent?.trim() === "Platforms I build with")!.getBoundingClientRect();
      const h1 = document.querySelector("h1")!.getBoundingClientRect();
      const header = document.querySelector("header")!.getBoundingClientRect();
      return { gap: label.top - cta.bottom, headerClearance: h1.top - header.bottom, overflow: document.documentElement.scrollWidth > innerWidth };
    });
    expect(layout.gap).toBeGreaterThanOrEqual(16); expect(layout.headerClearance).toBeGreaterThan(0); expect(layout.overflow).toBeFalsy();
    await page.locator("main section").first().screenshot({ path: info.outputPath(`hero-${width}x${height}.png`) });
  }
});
