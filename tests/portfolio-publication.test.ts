import assert from "node:assert/strict";
import { test } from "node:test";
import { financeos, getPublishedProject, getPublishedProjects, isPublishedProject, type Project } from "../src/content/projects";
import sitemap from "../src/app/sitemap";
import { NextRequest } from "next/server";
import { proxy } from "../src/proxy";
import { getPortfolioNavigation } from "../src/lib/portfolio-navigation";

function approvedProject(): Project {
  return {
    ...structuredClone(financeos),
    status: "published",
    approvals: { classification: true, role: true, claims: true, media: true },
    role: "Synthetic approved role used only in this test",
    media: ["overview", "workflow", "detail"].map(name => ({ src: `/images/work/synthetic/${name}.webp`, alt: "Synthetic interface", caption: "Synthetic fixture", width: 1440, height: 900, approved: true })),
  };
}

test("FinanceOS remains draft, absent from published lookups and sitemap", () => {
  assert.equal(financeos.status, "draft");
  assert.equal(isPublishedProject(financeos), false);
  assert.equal(getPublishedProject("financeos"), undefined);
  assert.equal(getPublishedProject("unknown-project"), undefined);
  assert.deepEqual(getPublishedProjects(), []);
  assert.deepEqual(getPortfolioNavigation(), { workHref: "/#work", financeosHref: undefined });
  assert.equal(sitemap().some(entry => new URL(entry.url).pathname.startsWith("/work")), false);
});

test("publication requires every owner gate even if status is changed", () => {
  assert.equal(isPublishedProject({ ...financeos, status: "published" }), false);
  const ready = approvedProject();
  assert.equal(isPublishedProject(ready), true);
  for (const key of ["classification", "role", "claims", "media"] as const) {
    const project = structuredClone(ready);
    project.approvals[key] = false;
    assert.equal(isPublishedProject(project), false, key);
  }
  assert.equal(isPublishedProject({ ...ready, status: "draft" }), false);
  assert.equal(isPublishedProject({ ...ready, role: null }), false);
  assert.equal(isPublishedProject({ ...ready, role: " " }), false);
});

test("unapproved, incomplete or local-only media cannot activate publication", () => {
  const ready = approvedProject();
  assert.equal(isPublishedProject({ ...ready, media: ready.media.slice(0, 2) }), false);
  for (const patch of [{ approved: false }, { src: "/__qa-media/dashboard.webp" }, { src: "/images/work/../private.webp" }, { width: 0 }, { alt: " " }, { caption: " " }]) {
    const project = structuredClone(ready);
    Object.assign(project.media[0], patch);
    assert.equal(isPublishedProject(project), false, JSON.stringify(patch));
  }
});

test("draft/unknown project URLs reach Next's 404 handler in both launch modes", () => {
  const previous = process.env.COMING_SOON_ENABLED;
  try {
    for (const setting of ["true", "false"]) {
      process.env.COMING_SOON_ENABLED = setting;
      for (const path of ["/work/financeos", "/work/unknown-project"]) {
        const response = proxy(new NextRequest(`https://danielvlko.com${path}`));
        assert.equal(response.headers.get("x-middleware-next"), "1");
        assert.equal(response.headers.has("x-middleware-rewrite"), false);
      }
    }
    process.env.COMING_SOON_ENABLED = "true";
    assert.equal(proxy(new NextRequest("https://danielvlko.com/work")).headers.get("x-middleware-rewrite"), "https://danielvlko.com/coming-soon");
  } finally {
    if (previous === undefined) delete process.env.COMING_SOON_ENABLED;
    else process.env.COMING_SOON_ENABLED = previous;
  }
});
