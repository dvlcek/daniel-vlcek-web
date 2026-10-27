# Service pages implementation and review

24 October 2026. Scope: four service pages, existing-site links and a first-project publication dossier. No redesign or launch authorization.

**Follow-up QA completed:** [service-page QA report](SERVICE_PAGES_QA.md) records the 24-case viewport matrix, screenshots, browser keyboard checks, eight axe scans and subsequent scoped improvements. That report supersedes the initial browser-verification limitation below. The current local production preview is `127.0.0.1:3103`; the initial port 3101 preview was stopped. Service-page tracking remains unchanged and excluded pending separate approval.

## Repository preflight

- Initial folder: `daniel-vlcek-web-phase-1`, branch `feature/work-portfolio`, HEAD `2df30e8f0fa567298220233e52698ee42bf527a8`.
- Existing unrelated change: `next-env.d.ts`, preserved in the original worktree.
- `develop/website-v2` points to the same commit. RC2 `736dc09` is an ancestor.
- The documented dedicated directory was absent. Restored `../danielvlko-dev` with `git worktree add ../danielvlko-dev develop/website-v2`; no existing branch replaced.
- Read AGENTS, development workflow and V2 plan. Current user scope explicitly authorizes service work independently of the blocked project publication gate.
- Installed the unchanged lockfile into the dedicated worktree with `npm ci --ignore-scripts --no-audit --no-fund`. No environment files copied or created. Prisma client generation used a process-only synthetic localhost URL; incidental generated-source changes were discarded before verification.

## Homepage and conversion review

Source review only. No rendered layout, mobile usability, contrast or conversion-rate claim follows from this review.

| Existing section | Finding and scoped action |
|---|---|
| Hero | Keeps positioning and existing primary contact path. Replaced “strategy call” with “discovery call” to match the actual contact experience. No design change. |
| Problem | Existing problem-first narrative retained; no unsupported additional fear or metrics introduced. |
| System | Connected-systems distinction retained. Updated call terminology only. |
| What I Build | Distinct offers existed, but links led to generic project anchors. Now links to the relevant completed service detail. Existing section anchor and composition retained. |
| Selected Work | Generic entries lack publication approval. Preserved as requested; no new proof claims or service-page evidence links created. Requires a separate owner content review before treating these as delivery evidence. |
| Process | Existing process remains in place. New pages give service-specific scope, review and handover steps without fixed timelines or support promises. |
| Why Work With Daniel | Existing introduction retained. No invented credentials, biography or new About route. |
| Final CTA | Existing contact path retained. New pages explain the same free 30-minute discovery call. |

Homepage section order, Earth background, animations and section IDs are unchanged. Header Services now opens `/services`; its existing observer still tracks the homepage `services` section. Work, About and Process retain their homepage anchors. Service routes have an active navigation state. Footer Services also opens the hub.

## Content hierarchy and purchase intent

| Route | Purpose / status |
|---|---|
| `/` | Existing introduction; unchanged order |
| `/services` | Completed service selection: growth and efficiency, scope boundaries and next step |
| `/services/web-development` | Completed: websites, commerce and customer-facing journeys |
| `/services/custom-software` | Completed: internal platforms, operational tools and portals |
| `/services/automation-ai` | Completed: integrations, bounded automation and human-reviewed AI |
| `/work` | Existing redirect preserved; publication gate pending |
| `/work/[slug]` | Not created; requires approved dossier |
| `/about` | Deferred; requires approved owner background |
| `/contact` | Existing shared conversion destination; booking flow untouched |

Each detail page explains buyer problems, possible deliverables, adjacent-service boundaries, process, cooperation options, practical FAQs and the contact step. No approved case study exists, so evidence sections are omitted rather than filled with generic proof or empty cards. No fixed packages, prices, warranties, SLAs, delivery dates or ongoing support commitments are introduced.

New content is typed local TypeScript. The three repeated detail compositions share a Server Component and a scoped CSS module; the overview is a separate Server Component. FAQs use native `details`/`summary` with no client state. Header/Footer are composed per page, not moved into the root layout. Styling reuses Container, type/rhythm tokens, dark/light surfaces, orange accent and button motion classes. No new dependencies, database models or image assets.

## SEO and measurement

Four explicit routes have unique titles, descriptions, canonical and social metadata via `pageMetadata`, one H1 each, semantic sections and breadcrumbs, related-service links and sitemap entries. No unapproved work, draft project or About route is added to the sitemap. Existing English configuration and coming-soon gate are preserved. Indexability here describes page metadata; it does not establish that production serves or indexes these pages.

Contact links use `/contact`, no query parameters, and the existing fixed `services` source label. Privacy/telemetry logic is untouched. Its existing public-path allowlist does not include service routes, so service-page custom conversion events are not claimed as enabled; homepage/header/footer behavior on existing allowed routes is preserved. A separately scoped measurement change can add reviewed public paths later.

## Initial implementation verification

All checks below ran in the dedicated development worktree. Automated HTML checks do not establish responsive rendering or keyboard behavior.

| Check | Actual result |
|---|---|
| Final `npm run build` | PASS; 23 static entries, including the four service routes |
| Final `node node_modules/typescript/bin/tsc --noEmit` | PASS, exit 0 after final build |
| Final `npm run lint` | PASS, full ESLint, exit 0 |
| Explicit five-file offline regression suite from the workflow | PASS, 78/78; no failures or skipped tests |
| `node --import tsx scripts/check-privacy.ts` | PASS |
| `node --import tsx scripts/check-contact-tracking.ts` | PASS |
| HTTP smoke check against local production server | PASS; all four pages return 200, unique titles/descriptions/canonicals and matching social metadata, index metadata, one H1/main, unique IDs, native FAQ markup, contact CTA destinations, related links, sitemap and homepage fragment targets |
| Homepage / work preservation | PASS by source and HTTP checks; original section order and anchors remain, all three service links resolve, no “strategy call” wording, `/work` retains redirect to `/#work` |
| `git diff --check` | PASS |
| Protected/unrelated source review | Only the six existing marketing/SEO files listed below changed; nine new scoped files. No retained generated-client/package/schema/config changes; original worktree still has only its pre-existing `next-env.d.ts` change |
| Rendered widths 320/390/768/1024/1440+, overflow, header clearance, contrast, keyboard/focus, mobile menu, reduced motion | UNVERIFIED; prior Computer Use browser access was blocked because the current browser URL could not be verified. No visual PASS claimed |
| Live booking, real PostgreSQL concurrency, migrations, Google/Resend delivery and deployment state | UNVERIFIED; no production connections or real provider writes performed |

The first smoke check caught a stale built System CTA from an edit made while the initial build was running. Rebuilt after all application edits, restarted the local server and reran the smoke check successfully. Final automated results above refer to that rebuilt source.

The initial production preview used `127.0.0.1:3101`; follow-up QA now uses `127.0.0.1:3103`, with process-only `COMING_SOON_ENABLED=false` and an offline synthetic localhost database URL. No `.env` or `.env.local` exists in this dedicated worktree. This is a presentation preview, not a configured live booking environment. The HTTP smoke helper is kept under ignored `test-results/check-service-pages.py`.

## Exact file inventory

Created:

- `src/app/services/page.tsx`
- `src/app/services/web-development/page.tsx`
- `src/app/services/custom-software/page.tsx`
- `src/app/services/automation-ai/page.tsx`
- `src/components/services/ServicePage.tsx`
- `src/components/services/ServicePage.module.css`
- `src/content/services.ts`
- `docs/FIRST_PROJECT_PUBLICATION_DOSSIER.md`
- `docs/SERVICE_PAGES_IMPLEMENTATION.md`
- `docs/SERVICE_PAGES_QA.md` (follow-up QA)

Modified:

- `src/app/layout.tsx` (follow-up QA: scroll-behavior attribute only)
- `src/app/sitemap.ts`
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/sections/build/WhatIBuild.tsx`
- `src/components/sections/hero/Hero.tsx`
- `src/components/sections/system/System.tsx`

Verification-only files under ignored `test-results/` are not application source. Existing generated Prisma files, package manifests and lockfile have no retained changes.

## Remaining gates and next step

Approve the [first-project dossier](FIRST_PROJECT_PUBLICATION_DOSSIER.md), now including the conditional FinanceOS recommendation, obtain sanitized authorized media and then implement `/work` with its first complete detail. Service-route browser acceptance is recorded in [the QA report](SERVICE_PAGES_QA.md); screen-reader/cross-engine checks, the separately observed homepage Motion warning and live integration/production acceptance remain outside those results.

Current deployment security is not established by local development. Existing SEC-01 documentation flags older deployed booking/admin exposure: treat verification and any needed containment/hotfix as a separate urgent task, independent of content launch. No production services, configuration, migrations, provider writes, push, commit, PR or deployment are authorized or performed here.
