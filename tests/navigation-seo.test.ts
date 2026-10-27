import assert from "node:assert/strict";
import { test } from "node:test";
import { NextRequest } from "next/server";
import sitemap from "../src/app/sitemap";
import { proxy } from "../src/proxy";

test("sitemap follows the runtime launch mode and never advertises drafts or private pages", () => {
  const previous = process.env.COMING_SOON_ENABLED;
  try {
    for (const setting of [undefined, "true", "false"]) {
      if (setting === undefined) delete process.env.COMING_SOON_ENABLED;
      else process.env.COMING_SOON_ENABLED = setting;
      const paths = sitemap().map(entry => {
        const url = new URL(entry.url);
        assert.equal(url.origin, "https://danielvlko.com");
        return url.pathname;
      });
      assert.deepEqual(paths, setting === "false"
        ? ["/", "/services", "/services/web-development", "/services/custom-software", "/services/automation-ai", "/about", "/contact"]
        : ["/contact"]);
      assert.equal(new Set(paths).size, paths.length);
    }
  } finally {
    if (previous === undefined) delete process.env.COMING_SOON_ENABLED;
    else process.env.COMING_SOON_ENABLED = previous;
  }
});

test("social image routes bypass the presentation gate in both modes", () => {
  const previous = process.env.COMING_SOON_ENABLED;
  try {
    for (const setting of ["true", "false"]) {
      process.env.COMING_SOON_ENABLED = setting;
      for (const path of ["/opengraph-image", "/twitter-image"]) {
        const response = proxy(new NextRequest(`https://danielvlko.com${path}`));
        assert.equal(response.headers.get("x-middleware-next"), "1");
        assert.equal(response.headers.has("x-middleware-rewrite"), false);
      }
    }
  } finally {
    if (previous === undefined) delete process.env.COMING_SOON_ENABLED;
    else process.env.COMING_SOON_ENABLED = previous;
  }
});
