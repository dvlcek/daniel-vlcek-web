# Navigation, routing and technical SEO audit — 24 October 2026

Implemented in `C:/Users/danko/Desktop/daniel-vlcek-web/danielvlko-dev`, branch `develop/website-v2`, HEAD `2df30e8f0fa567298220233e52698ee42bf527a8`. All earlier uncommitted work was preserved. This report describes this audit's changes, not the complete diff from HEAD.

Complete interactive preview: **http://127.0.0.1:3105/**. Restart instructions remain in [the connected-site handoff](CONNECTED_WEBSITE_IMPLEMENTATION.md).

## Confirmed findings and fixes

| Finding | Evidence and implemented correction |
|---|---|
| Mobile Process current state missing | The initial browser run reached `/#process` but the mobile Process link had no `aria-current`. Desktop and mobile now use one current-state calculation. Page links identify their page/parent route; homepage anchor links identify the visible section. |
| Mobile active color overridden | About had `aria-current="page"` but computed white text. The existing unlayered anchor reset overrides Tailwind color utilities. A scoped active color now makes the current mobile destination visible without a global reset/design change. |
| Inconsistent internal navigation | Homepage CTAs/cards and several legal, consent and booking privacy links used native anchors for ordinary internal page routing. They now use Next.js Link; animated anchors use `motion.create(Link)` to preserve motion. External sources, mail links, full-size media and the native skip link retain their appropriate semantics. |
| Social card URLs returned HTML in coming-soon mode | Production candidate `/opengraph-image` and `/twitter-image` returned the noindex coming-soon HTML. These two public image paths now bypass only the presentation rewrite and serve images in both modes. Private/API routing is unchanged. |
| Sitemap advertised hidden pages | Both launch modes previously returned the same seven URLs, including pages rewritten to coming-soon/noindex. The sitemap now evaluates the existing launch flag per request. It lists seven complete public pages in full-site mode and Contact alone in coming-soon mode, with the existing legal/project approval gates retained. No host environment setting was changed. |
| Homepage Markdown declared as alternate on every route | The root layout's `/index.md` alternate described the homepage, including on unrelated subpages. It now belongs only to homepage metadata; the canonical/OG/Twitter architecture is retained. |
| Cookie table could not receive keyboard focus | The mobile horizontally scrolling storage table failed axe's scrollable-region check. Its wrapper now has `tabIndex=0`, a region role, a heading label and visible focus. Keyboard horizontal scrolling is checked directly. |
| Coming-soon contrast | The original orange CTA used white text at 3.11:1 and several small labels/descriptions were too dim. The CTA uses the existing dark-on-orange accent style; affected dim text uses 60% white. Composition, imagery and animation are preserved. |
| Logo hit area | The shared logo now has a 44px minimum interaction height within the existing 82px header; its text size and appearance are retained. |

## Journeys and evidence

The browser audit uses current-run Chrome/Playwright captures, saved under ignored `test-results/navigation-seo-audit/`. Screenshots were opened and inspected; initial and final mobile states demonstrate the active-color correction. Browser scripts abort external requests and stub booking APIs; no booking, login, email or calendar mutation is performed.

| Step | Journey | Health |
|---|---|---|
| 1 | Home → Services → each service detail → Contact | PASS; actual header/card/CTA clicks and all related-service destinations |
| 2 | Home → Work → FinanceOS → Contact | PASS locally; draft media opens safely in a new tab |
| 3 | Home → About → Contact | PASS; page links and active navigation are consistent |
| 4 | Service detail → another service → Contact | PASS for all three details; no dead end |
| 5 | FinanceOS → Work → Home | PASS; breadcrumbs, logo, Back and Forward retain browser semantics |
| 6 | Cross-page Process and homepage Services/Work/About anchors | PASS; targets exist, scroll into view and retain history; Process is not obscured by the absolute header |

Current-run screenshots:

![Initial mobile navigation](../test-results/navigation-seo-audit/02-mobile-menu-before.png)

![Corrected active mobile navigation](../test-results/navigation-seo-audit/03-mobile-menu-after.png)

![Process destination](../test-results/navigation-seo-audit/04-process-destination.png)

The saved final screenshot set also includes all nine page layouts at six widths, legal/coming-soon layouts, the focused cookie table and clean production coming-soon captures (`06-coming-soon-production-*.png`). Grouped hero sheets are under `screenshots/heroes-*.jpg`.

## Verification

| Check | Final result |
|---|---|
| Production build | PASS; 23 static entries, runtime sitemap, no generated FinanceOS slug |
| TypeScript | PASS after final build |
| Full ESLint | PASS, no warnings |
| Offline regressions | 84/84 PASS: existing security/booking suites, publication gates and two new SEO/routing cases |
| Privacy/contact scripts | PASS |
| Marketing responsive matrix | 54/54 PASS, nine routes ? all six requested widths; no overflow, broken visible images or browser page errors |
| Legal/coming-soon matrix | 24/24 PASS at all six widths |
| Axe | 26 scans PASS (18 marketing + 8 legal/coming-soon) after corrections |
| Header and main links | PASS: 90 desktop/mobile navbar destination checks, 71 main-content links, logos, related services, breadcrumbs, media popups, Back/Forward and four anchors |
| Footer/legal/consent | PASS: 108 footer link checks across 12 pages, legal body links, settings focus/Escape and consent-panel Cookies link |
| Mobile menu | 27 additional layout/hit-area cases PASS, plus keyboard trap, Escape, close-on-navigation, active state and focus return |
| Generated production HTML | PASS: ten public/legal documents, 24 distinct internal destinations/anchors, sitemap/robots and private/draft restrictions in both launch modes |
| Production coming-soon motion | PASS with normal and reduced motion; no browser or console errors in either fresh production context |
| Publication isolation | PASS: draft/unknown project and local capture URLs return 404 in both modes, no draft sitemap/static/client-JS payload |
| `git diff --check` | PASS |

Chrome version: 155.0.8059.85. The six marketing console errors are expected disconnected-preview booking 503 responses. The fresh production coming-soon captures contain no development overlay; development screenshots with a transient Next issue badge were rejected as final evidence.

Production candidate checks use loopback ports 3103 (full site) and 3107 (coming-soon), not a live deployment. Generated HTML verifies unique titles/descriptions/canonicals, OG and Twitter metadata, one H1, heading order, image alt attributes, unique IDs, real anchor targets and safe internal destinations. All sitemap URLs are checked against the HTML actually served in that mode. Canonical root URLs with/without a trailing slash are treated as the same origin root.

Legal routes are accessible but **remain draft/noindex** because their existing review flag is false. Booking management retains noindex/nofollow and no-referrer. Admin remains noindex/nofollow, and unauthenticated `/admin` redirects to `/admin/login`. These private paths, legal drafts and FinanceOS are absent from both sitemaps. Robots permits crawlers to observe page-level noindex while retaining the existing API disallow rules. This follows Google's guidance on [noindex versus robots.txt](https://developers.google.com/search/docs/crawling-indexing/block-indexing) and [consistent canonical signals](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

Production Work intentionally retains `/#work` as its navigation destination and `/work` redirects there until approval. FinanceOS and unknown project URLs return real 404/noindex in both launch modes. Preview captures are absent from root public assets and production client JavaScript contains no draft FinanceOS payload. The local review harness remains noindex and isolated from publication.

## Exact files changed in this audit

- `src/components/layout/HeaderNavigation.tsx` — shared current-state logic, visible mobile state and logo hit area.
- `src/components/sections/build/WhatIBuild.tsx`
- `src/components/sections/process/Process.tsx`
- `src/components/sections/contact/FinalCTA.tsx`
- `src/components/sections/about/WhyWorkWithDaniel.tsx`
- `src/components/sections/work/SelectedWork.tsx`
- `src/components/sections/system/System.tsx` — the six section files above retain markup/styles/motion while using Next links.
- `src/components/contact/ContactForm.tsx`
- `src/components/booking/BookingWizard.tsx`
- `src/components/booking/SiteModals.tsx`
- `src/components/site/PrivacyProvider.tsx` — internal disclosure links only; form, booking and consent logic untouched.
- `src/components/launch/ComingSoon.tsx` — animated Next links and targeted contrast corrections.
- `src/app/legal/page.tsx`
- `src/app/privacy/page.tsx`
- `src/app/cookies/page.tsx` — legal internal links; Cookies additionally gains a focusable labelled table region.
- `src/app/layout.tsx`
- `src/app/page.tsx` — scope the Markdown alternate to Home.
- `src/app/sitemap.ts` — runtime launch-aware sitemap.
- `src/proxy.ts` — public social-image exceptions only, preserving its prior draft/private/API behavior.
- `tests/navigation-seo.test.ts` — launch-mode sitemap and social-image regression cases.
- `docs/NAVIGATION_SEO_AUDIT.md`
- `docs/CONNECTED_WEBSITE_IMPLEMENTATION.md` — audit handoff link and updated sitemap behavior.

Ignored local scripts, JSON results and screenshots are evidence, not public application artifacts. The preview harness adds an isolated source-rendered coming-soon route for local presentation QA.

## Remaining release blockers and limits

FinanceOS needs the previously documented role/attribution, factual narrative and authorized media approvals. Legal notices retain their existing review gate. **SEC-01 deployed security verification/containment remains a separate urgent task**; no current deployed revision or remediation is established here. See [the existing evidence](SEC01_PRODUCTION_VERIFICATION.md).

The native preview booking error/retry state is intentional because providers are disconnected. No successful live booking, database concurrency, email/calendar delivery, external-link availability, search-engine indexing or exhaustive accessibility certification is claimed. No environment, database, authentication, provider configuration or business logic was changed. No commit, push, merge or deployment was performed.
