# Launch readiness ? 23 October 2026

## Phase A5 - staging preparation and release rehearsal - 23 October 2026

**Production verdict: NOT READY. A5 is PARTIAL; operational acceptance is BLOCKED.**
A1-A4 is preserved. Integration branch remains at c409c18 with the working changes
uncommitted. Local recovery branches preserve the reviewed snapshots; no main change,
push, Docker, external deployment/settings mutation, database connection/migration,
real email/Calendar event or legal publication was performed. `.env.local` is unchanged.

- **PASS:** fresh TypeScript, ESLint, Next 16.4.2 production build, Prisma validation,
  lock install-plan check, privacy/tracking checks, 19 security + 5 calendar + 5 new
  reminder mock tests (29 total). See [A5 gates](audits/a5-quality-gates.json),
  [build](audits/a5-build.json) and [reminders](audits/a5-reminder-tests.json).
- **PASS / PARTIAL:** fresh production audit zero findings; full audit remains
  FAIL/open with five high development-only braces-chain entries and no upstream
  patched version. No dependency change or force fix. Owner risk disposition pending.
- **BLOCKED:** no explicitly isolated Neon target; static migration/schema review
  is PARTIAL and no database execution occurred. Existing Docker-only acceptance
  runners were not used. A4 PostgreSQL/browser evidence remains historical.
- **BLOCKED:** legal human approval, missing processing/retention/transfer/contact
  decisions; reviewed=false, notices and noindex retained. Targeted fresh official
  registry checks pass; tax/VAT/full postal/court details were not freshly reverified.
- **NOT VERIFIED:** Vercel Preview secrets/ingress, DB/provider isolation, domains,
  runtime limits and rollback. No committed cron schedule exists. Holding mode
  keeps contact/APIs accessible and cannot serve as a booking write freeze.
- **PARTIAL / BLOCKED:** native booking and reminder mocks pass; live providers,
  scheduling, outage reconciliation and failed-confirmation recovery await controlled
  staging acceptance. Existing email idempotency keys are tested, not live proof.
- **BLOCKED:** A5 manual accessibility: browser inventory empty and iab unavailable.
  Human screen-reader, real zoom/reflow and manual contrast remain unverified.

Read the [release checklist](RELEASE_CHECKLIST.md) for the exact environment matrix,
Neon migration sequence/rollback limits, protected staging instructions, controlled
provider cases, manual accessibility journeys, approval records and post-release
checks. [A5 review](audits/a5-release-review.md) contains the precise legal approval
checklist, dependency reachability/risk and all remaining production blockers.
[Backup file list](audits/a5-backup-files.txt) is the exact candidate change list;
[a5-preflight.json](audits/a5-preflight.json) records initial Git/checkpoint evidence.

Recommended next action: review the candidate and supply an explicitly isolated
synthetic/schema-only Neon target plus named safe staging/provider test scope.
Production GO requires legal, operational, security and accessibility sign-off;
none is inferred here. A4 and earlier reports below remain historical.


## Phase A4 - final technical launch hardening - 23 October 2026

**Production verdict: NOT READY.** A4 fixes are implemented and locally checked; production/staging operational acceptance, legal review and documented accessibility/development-tool risks remain open. Branch `integration/website-launch-sync` and commit `c409c18` are unchanged. All A1/A2/A3 work is preserved, including the unrelated safe `.env.example` modification. No secret/environment file was edited, no Git content was staged, and no deployment, push, production migration, real email or calendar event occurred.

### Dependency audit and remediation

The fresh **full** audit began with 14 affected dependency entries: 1 critical, 12 high, 1 moderate. The prior eight-entry figure excluded development dependencies. After compatible updates, the full audit reports **5 high development-only entries, 0 critical and 0 moderate**; the production-only audit reports **0 findings**. Full audit remains OPEN/FAIL because those five findings are not suppressed.

- Next and matching ESLint config: 16.3.4 -> 16.4.2. Prisma CLI/client/PG adapter: 7.10.0 -> 7.10.1, with regenerated matching runtime version/engine metadata; schema/migrations unchanged.
- Transitive fixes: sharp 0.35.5, deepmerge-ts 8.0.2 via the patched Prisma parent, mysql2 3.24.4 via Prisma, fast-uri 3.1.9, source-map-js 1.2.2 and brace-expansion 1.1.21/5.0.12. No forced override, major application/Prisma upgrade, removal of important dependencies or whole-stack reinstall.
- The remaining chain is `eslint-config-next -> @next/eslint-plugin-next -> fast-glob -> micromatch -> braces@3.0.3`. The current advisory lists no patched braces release. npm's suggestion to downgrade the lint toolchain to 14.2.35 was rejected as incompatible with this Next 16 candidate. These packages process repository/config patterns in development/CI; no visitor HTTP import was found. Keep untrusted contributions/build patterns isolated and track a compatible upstream fix. No exploitation was demonstrated.
- `npm ls --json` and `npm ci --dry-run --ignore-scripts --no-audit` exit 0. The latter checks the lock/install plan without reinstalling. [Dependency review](audits/a4-dependency-review.md) records every affected entry/advisory, installed and remediation versions, direct/transitive relationships, production/tooling exposure and source-level reachability limits. Raw before/after and production-only JSON evidence are alongside it.

### SEO and icons

A shared metadata helper now supplies unique branded titles/descriptions, self-canonicals and matching Open Graph/Twitter URLs for completed public routes, draft legal pages, holding, management and admin. Absolute titles avoid nested-layout template loss or duplicated branding. Private admin/management routes have explicit noindex/nofollow metadata and `X-Robots-Tag` headers; API responses receive the same indexing header through Next configuration. These directives are indexing controls, not authorization.

The sitemap contains only `/` and `/contact` while legal `reviewed` is false. Draft legal pages remain noindex and are excluded; no review status, legal body, operator data or approval claim was changed. Work remains a redirect to real homepage content, and holding/private routes are omitted. Robots keeps the existing API exclusion and permits crawlers to read page-level noindex; it is not used to hide a noindex directive behind a crawl ban. The live launch gate/Search Console state still needs authorized deployment acceptance.

New file-based `/favicon.ico`, `/icon.svg` and `/apple-icon.png` use a small DV monogram in the existing dark/white/orange palette. The wordmark, brand colors and social imagery are unchanged. Local route evidence is in [A4 route checks](audits/a4-route-checks.json); indexing state on the real domain is not claimed.

### Accessibility and 320px correction

The rendered baseline found orange-fill/white-label contrast of 3.11:1, faint booking labels, light-section accent/step text and a **-14px** gap (overlap) between the hero secondary CTA and platform label at 320px. Confirmed corrections retain the established layout, cards, Earth image, Geist typography and orange fills:

- Orange CTAs now use a dark foreground; audited muted dark-surface text is raised to a readable floor, and light-surface orange/gray text uses darker variants. Explicit focus-visible outlines remain visible on light and dark surfaces.
- A keyboard-visible skip link targets a focusable main landmark. Homepage/contact headers sit before that landmark so skipping actually bypasses navigation. Existing mobile dialog keyboard wrapping/Escape/focus/scroll behavior is preserved.
- Booking errors use a live alert and form description. Native required/email validation remains enabled, announces the first invalid field and retains focus there. Confirmation focuses its heading after the animated view actually mounts. No API validation, ownership, origin or quota guard was weakened.
- A MotionConfig respects user reduced-motion preferences; Earth parallax and smooth scrolling stop for reduced motion. Animated statistics expose one static screen-reader value while visual counting remains hidden from assistive technology, avoiding a prohibited label on a generic span.
- Only screens below 360px receive 40px extra hero bottom clearance. The measured 320x568 gap changes from -14px to **26px**. The 1440x900 gap stays **188.96875px** before/after. Hero geometry/overflow is checked at 320/375/768/1024/1440/1920 and at 320px heights 400/568/900.

[Baseline](audits/a4-accessibility-before.json) and [after checks](audits/a4-accessibility-after.json) record the WCAG-tagged axe scans and geometry. Automated scans report zero confirmed violations on homepage/contact at 320px and 1440px; the form-error state is separately scanned. **This is not a WCAG conformance certification.** Image/gradient contrast still produces manual-review items; the collapsed native dialog's referenced ID is tool-incomplete but its actual expanded target and focus behavior are browser tested. Full NVDA/VoiceOver, physical touch devices, actual browser zoom/200% text resizing and broader performance acceptance remain NOT VERIFIED. [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) define the checks' limits/exceptions.

Final browser evidence: [A4 Chromium summary](audits/a4-browser-acceptance.json). The final unfiltered run passes all 14 browser cases; with 19 security, 5 calendar and 15 real PostgreSQL cases, **53 tests pass and zero final test failures remain**. The full dependency audit remains separately OPEN/FAIL for five development-only findings. Local snapshots: [320px hero](audits/screenshots/a4-hero-320x568.png) and [desktop hero](audits/screenshots/a4-hero-1440x900.png).

### A4 final gates

| Gate | Result |
|---|---|
| Full audit / production-only audit | OPEN: 5 high dev-only entries / PASS: 0 production findings |
| npm ls / lock dry-run | PASS / PASS |
| TypeScript / full ESLint | PASS / PASS, zero lint errors or warnings |
| Production build / Prisma validation | PASS / PASS |
| Security / calendar contracts | PASS: 19/19 and 5/5 |
| Disposable PostgreSQL acceptance | PASS: 15/15, including migration history/records/concurrency/quotas |
| Privacy / contact tracking scripts | PASS / PASS |
| A4 complete unfiltered browser run | PASS: 14/14, no skips/flakes; original booking suite plus SEO/accessibility/hero checks |
| Production, legal approval, deployed providers/ingress | NOT VERIFIED / not performed |

The browser harness still uses nonce-owned disposable PostgreSQL, synthetic fixtures, a real loopback HTTPS connection with a disposable certificate, stubbed Google/Resend and blocked outside browser requests. No customer data/provider delivery was used. The original A3 summary remains historical; the expanded full suite emits `docs/audits/a4-browser-acceptance.json`. Reproduce with `npm run build`, then `npm run test:acceptance` using the existing Docker/Chromium/OpenSSL prerequisites. Earlier A4 failures were a test syntax/locator issue, canonical root-slash normalization and a genuine nested admin title-template omission; those are corrected, and only the final complete run counts as acceptance.

### Remaining blockers and recommended Phase A5

1. Review the five unpatched dev-tool findings and CI isolation/risk ownership; adopt a compatible patched upstream chain when available. The full audit is not green.
2. Complete manual image/gradient contrast, assistive-technology, zoom/reflow, touch and performance acceptance. Automated zero findings are not complete accessibility approval.
3. Complete operator/provider/region/retention/transfer details and legal review. Keep draft notices/noindex until actually reviewed.
4. Rehearse the authorized staging/release workflow: exact origins and trusted ingress, server-only secrets, launch gate, backup/recovery and additive A2 migration. No production schema/configuration was changed here.
5. Complete controlled staging provider wiring, reminders and reconciliation/resend handling for failed email, interrupted finalization and uncertain calendar outcomes. Verify deployed cookies/indexing/telemetry and monitored non-customer smoke checks before a separately authorized production release.

### A4 file inventory

- Dependency/tooling: `package.json`, `package-lock.json`, `src/generated/prisma/internal/class.ts`, `src/generated/prisma/internal/prismaNamespace.ts` (version/engine metadata), plus the new test-only axe dependency.
- SEO: `src/lib/metadata.ts`, `next.config.ts`, root/page/contact/legal/privacy/cookies/coming-soon/booking-management metadata and sitemap, `src/app/admin/layout.tsx`, admin login metadata, and the three icon files.
- Accessibility/layout: `src/app/globals.css`, `src/app/layout.tsx`, main landmarks in public/admin wrappers, `BookingWizard`, `PrivacyProvider`, `Hero`, `HeroBackground`, `AnimatedStat`, and confirmed text/CTA colors in Problem, Process, About, Work and FinalCTA.
- Tests/evidence: `tests/browser/hardening.spec.ts`, the confirmation-focus assertion in `tests/browser/acceptance.spec.ts`, current artifact destinations in both acceptance runners, A4 audit/route/accessibility/browser JSON and dependency review, this report and the main readiness audit. Existing A1/A2/A3 edits remain uncommitted alongside A4; no unrelated work was discarded.

The A3/integration history below is preserved. A4 results above supersede its dependency, SEO, contrast and 320px status; its operational and legal blockers remain applicable.


## A3 launch-readiness batch - 23 October 2026 (historical)

**Production verdict: NOT READY. A3 remains PARTIAL overall.** The implementation and isolated acceptance have advanced; production acceptance is not implied. The branch remains `integration/website-launch-sync` at `c409c18`, with this batch left uncommitted. No pull, merge, reset, rebase, push, deployment, production migration, external email or calendar event was performed. The pre-existing `.env.example` diff contains only safe server variable names/comments and an approved-origin example; it was not changed, staged or discarded.

### Current quality gates

| Check | Current result |
|---|---|
| Full ESLint | PASS: zero errors and warnings; no rule suppressions |
| Standalone TypeScript | PASS |
| Production build | PASS |
| Prisma validation | PASS: schema validation only |
| Security regressions | PASS: 19/19 |
| Disposable PostgreSQL | PASS: 15/15; additive migration, previous records, constraints, races, quotas and cleanup |
| Booking/calendar contracts | PASS: 5/5; provider errors, DST/UTC, event payload, fragment management URLs and ICS |
| Privacy and contact tracking | PASS: both existing scripts |
| Final Chromium acceptance | PASS: 11/11 over loopback HTTPS; six widths, keyboard, cookies, full synthetic booking/management/admin, consent and both motion modes |
| Production provider delivery, ingress, configuration and migration | NOT VERIFIED / not performed |

Final browser evidence: [sanitized Chromium summary](audits/a3-browser-acceptance.json). All 11 tests pass with no skips. Six width cases cover homepage, contact and all three legal routes, overflow, screenshots, mobile keyboard/focus/scroll/resize behavior and homepage anchors. Other cases cover successful booking, Secure/HttpOnly/Strict cookies (including cross-site navigation), refresh/replay without duplicate event/email, independent tabs/jars, forced expiry at intake and confirmation, 409 UI recovery, calendar/email failures, email management URLs, rescheduling/cancellation and authenticated dashboard data. Consent allow/reject/withdrawal, management with blocked storage, every homepage internal destination, availability outage/retry/empty states, calendar controls, normal/reduced motion and hydration are also exercised. Local screenshots were inspected; the existing 320px hero crowding remains a visual-review item below.

Earlier harness runs failed during fixture development (wrong header/login selectors, asynchronous request teardown, a missing browser-evaluate argument and loopback-host normalization). Those are corrected; the final complete unfiltered run is green. Browser tests also caught the new menu focus escape and the initial stat hydration mismatch; both implementation defects were corrected before that final run. No failing run is counted as acceptance.

### Changes and native booking evidence

- Native `/contact` -> BookingWizard -> ownership-protected APIs -> PostgreSQL -> stubbed Google/Resend -> admin architecture is preserved. Cal.com remains removed. No ownership, exact-origin, quota or token guard was weakened.
- Confirmation-time HTTP 403 now clears the stale per-tab attempt just as intake-time expiry does, enabling a fresh retry. Invalid/expired sessions still fail closed. Availability initialization updates from the asynchronous result with unmount cancellation; retry loading remains explicit. Calendar month selection and admin time-input synchronization no longer cascade through effects.
- Management initialization catches blocked browser storage; a valid fragment works for that page session, and refresh recovery still requires storage. The fragment is removed from the address bar. Removed the blank personalized greeting rather than adding personal fields to the deliberately minimal management API. Internal home navigation uses Next Link.
- Calendar HTTP 200 responses with missing/per-calendar errors or malformed busy periods now fail closed. A truncated reschedule event list (more than the existing 2,500-item page) also fails closed instead of approving from incomplete data; full pagination is not implemented. Five isolated SDK contract tests exercise this boundary, UTC instants across Vienna's October DST transition, the internal event payload/no customer attendees, token fragments and ICS timing.
- Email/template review: client confirmation has the selected date, time and `Europe/Vienna`, an absolute native management URL with credentials in its fragment, and an ICS attachment. Google owns Daniel's internal event and Meet URL; no customer attendee is added. The initial email/UI intentionally withhold Meet until the existing 30-minute reminder. There is no separate owner booking-confirmation receipt in the current flow; owner visibility is through Calendar/admin. Reminder scheduling/delivery remains an operational acceptance task.
- Known failure recovery limit: email failure preserves a confirmed booking but leaves the customer without the management email; replay does not resend it. Provider timeouts with an uncertain remote outcome and interrupted finalization still require reconciliation/operator recovery. Successful stubs do not close those operational risks.

### Mobile navigation and lint

The homepage header now offers a minimal modal menu below `lg` (1,024px), using the existing branding, type and orange focus treatment. It contains the existing `/#work`, `/#services`, `/#about`, `/#process` links and contact CTA. Native dialog semantics plus explicit Tab/Shift+Tab wrapping, initial focus, Escape/close focus return, scroll restoration and desktop-resize closure are implemented. The menu adds no motion; reduced-motion statistics use a hydration-safe external preference store. Desktop header positioning/layout is retained; only narrow-screen CTA padding/arrow visibility changes to fit 320px. The contact page retains its existing dedicated header/back-to-website link.

The seven baseline lint errors were corrected in ManageBookingClient, AdminTimeSelect, BookingWizard and AnimatedStat. The Hero warning now uses Next Image with explicit dimensions and unoptimized local SVG delivery. No blanket suppression or unrelated component refactor was added.

### Reproducible isolated browser workflow

`npm run test:acceptance` extends the existing guarded Docker runner. It never selects an existing database: a uniquely labeled/nonce-verified, loopback-only, tmpfs PostgreSQL container receives the prior migrations, synthetic records and the additive A2 migration. TCP readiness now waits for the mapped endpoint rather than the image's temporary initialization socket.

The production Next UI and authenticated admin read that disposable DB. A loopback HTTPS proxy with a one-day, task-generated self-signed certificate bridges booking requests to the actual API handlers in a nonce-guarded fixture server. Chromium ignores trust errors only for this local test certificate. Google methods and every outbound fixture fetch are stubbed/blocked; browser requests outside the local origin are aborted. All local environment-file keys are explicitly shadowed with blank or synthetic values for test processes. The runner disposes its owned processes, connections, certificate/key directory and database container; unrelated Docker containers are untouched.

This is real browser rendering/cookie transport over local TLS and real handler/SQL execution, with a custom HTTP fixture bridge. It is **not** deployed Next API/edge routing, trusted production TLS, Vercel ingress, live Google/Resend or customer acceptance. One-hour expiry is checked through cookie TTL and forced DB expiration, not a one-hour wall-clock wait. Refresh restores ownership; form contents/success UI are not persisted. Multiple browser engines, touch hardware, measured contrast, 200% reflow, screen-reader and performance acceptance remain outside these automated checks.

Prerequisites: installed project dependencies, Playwright Chromium (`npx playwright install chromium`), running Docker with cached `postgres:16-alpine`, and OpenSSL (this Windows runner uses Git's `C:/Program Files/Git/usr/bin/openssl.exe`; other platforms use PATH). Run `npm run build` before `npm run test:acceptance`. Unit contracts: `npm run test:booking`; original suites/scripts remain available. Screenshots and detailed test output are under ignored `test-results/`. Sanitized summaries: `docs/audits/a3-browser-acceptance.json` and `docs/audits/a2-postgres-acceptance.json`.

### Remaining release blockers and recommended final tasks

1. Review the dependency advisory report before release: `npm audit --omit=dev --json` reports eight affected production dependency entries (one critical, six high, one moderate), including Next.js. See [sanitized advisory summary](audits/dependency-audit-summary.json). No audit-fix or unrelated upgrade was executed. Triage applicability, patch deliberately and rerun acceptance.
2. Complete approved staging acceptance for actual deployment routing, trusted HTTPS/cookies, Vercel forwarding behavior/origin handling and provider credentials, with external delivery controlled. Establish reconciliation/resend procedures for uncertain calendar outcomes, interrupted finalization and failed email; verify reminder scheduling. The local fixture bridge is not production wiring evidence.
3. Preserve legal drafts, `reviewed: false` and `noindex` until operator/provider/region/retention/transfer details receive appropriate review. Production consent/measurement behavior still needs deployed verification.
4. Complete the existing private-route metadata/sitemap/favicon work and remaining editorial/accessibility/performance review. Screenshot review found existing hero logo-label/secondary-CTA crowding at 320px; the logo layer is pointer-events-none and no horizontal overflow was found. This batch preserves that composition; final visual approval remains pending.
5. Confirm production secrets, exact origins, proxy trust, cleanup/reminder cron authentication and the intended `COMING_SOON_ENABLED` state. Rehearse backup/recovery and the additive migration on staging. Production migration/configuration remain unverified. Apply only through the separately authorized release sequence below, with schema/configuration ready before traffic cutover.

### Files in this batch

- App: `src/components/layout/Header.tsx`, `src/components/booking/BookingWizard.tsx`, `src/app/booking/manage/ManageBookingClient.tsx`, `src/components/admin/AdminTimeSelect.tsx`, `src/components/sections/problem/AnimatedStat.tsx`, `src/components/sections/hero/Hero.tsx`, `src/lib/booking/calendar/google.ts`.
- Test/tooling: `tests/booking-calendar.test.ts`, `tests/browser/acceptance.spec.ts`, `tests/browser/fixture-server.ts`, `playwright.config.ts`, `scripts/run-browser-acceptance.mjs`, `scripts/test-security-postgres.mjs`, `package.json`, `package-lock.json`, `.gitignore`.
- Documentation/evidence: this report, `docs/audits/website-readiness-audit.md`, the sanitized A2/A3 acceptance summaries and `docs/audits/dependency-audit-summary.json`. `next-env.d.ts` was regenerated by the production build to reference production types.
- `.env.example` remains the original unrelated unstaged modification; `.env.local` is untouched.

The following sections retain the earlier integration record. Current batch results above supersede its lint/mobile/browser status; its production release safeguards and unresolved legal/configuration prerequisites still apply.


**NOT READY for production.** Local integration is implemented and locally validated; browser, operational configuration, legal review and existing quality gates remain outstanding. No push, deployment, production migration, customer email or real calendar appointment was performed.

## Git integration and recovery

| Item | Value |
|---|---|
| Original branch | `main` (left unchanged) |
| Original local HEAD | `da1a90217fcad9ff5b8df1e0789b70f09c116c56` |
| Fetched remote | `952bc8faea1ea02ec9ca78acc8ec133025e1ddc1` ? Edits before pull |
| Reviewed local checkpoint | `8223157483938c7fa148c319586a4b19881449db` |
| Original HEAD safety branch | `safety/original-head-20261023-092146` |
| Checkpoint safety branch | `safety/pre-sync-20261023-092146` |
| Integration branch | `integration/website-launch-sync` |
| Merge method | Non-fast-forward merge of `origin/main`, reviewed file by file, no blanket resolution |

The merge commit containing this document has the checkpoint and fetched remote as its two parents. Resolve its SHA with `git rev-parse integration/website-launch-sync`; embedding its own hash here would change that hash.

Before staging, reviewed project files were scanned against configured sensitive environment values and credential/private-key patterns; no findings. The remote tree contains no secret environment files. Safe tracked and relevant untracked A1/A2 files were checkpointed. A byte-for-byte recovery copy also exists outside the repository at `C:/Users/danko/.codex/integration-checkpoints/20261023-092146`.

Per the instruction not to stage environment files, `.env.example` was copied to that recovery directory and deliberately left modified/uncommitted. Its A2 variable-name template is preserved locally; this document records those requirements in the committed candidate. No secret environment file was changed or staged. Expected final working tree: only that pre-existing `.env.example` modification. No existing local commit was removed; `main` remains at the original SHA.

## Conflict decisions

| File | Resolution |
|---|---|
| `src/app/api/booking/availability/route.ts` | Retained A2 guards and sanitized logger rather than remote raw message logging. |
| `src/app/work/page.tsx` | Retained A1 redirect to `/#work`; did not restore the remote empty work shell/footer. |
| `src/components/layout/Footer.tsx` | Retained remote typography/layout, business/legal details, consent settings, valid anchors and email. Remote already removes fake socials; no social placeholders restored. |
| `src/components/sections/hero/Hero.tsx` | Retained remote visual/button treatment with A1 `/#work` destination. |
| `src/components/sections/work/SelectedWork.tsx` | Retained remote Container, typography, spacing, imagery, responsive card layouts and motion. Removed reintroduced intro statistics and case-study button/number-animation code; preserved A1 data removals and existing qualitative descriptors. |

Header and BookingWizard auto-merges were separately reviewed: Header retains A1 destinations/active logic and remote button/tracking treatment; BookingWizard retains A2 attempt ID/cookie contract plus remote consent-controlled events and privacy notice.

## Preserved features and integration changes

- Homepage section order is exactly the remote composition: Hero, Problem, System, Services, Work, Process, About, Final CTA, followed by one shared Footer. Shared CSS, font, tokens, Process/About/System work and images were retained; no additional redesign.
- Remote admin dashboard, navigation, availability controls, filters, detail drawers, lead/booking UI and OAuth helper are preserved unchanged from `origin/main`.
- A1: Work/Services/About/Process reach real homepage anchors from any route. Contact reaches `/contact`. No Insights destination, empty work index, self-link labeled case study, placeholder social URLs or unsupported numerical project outcomes remain.
- A2: random one-hour ownership capabilities are stored only as hashes, transported in Secure/HttpOnly/SameSite Strict production cookies, checked with database expiry and transaction locks. UUID alone never authorizes access. Email is not ownership. Retry/slot uniqueness and prior management-token contracts remain.
- Durable PostgreSQL quotas, restrictive untrusted proxy handling, HMAC identifiers, exact-origin validation, bounded request bodies, sanitized logging, timeout protections and authenticated bounded security cleanup are retained.
- Legal/privacy/cookies draft pages, `reviewed: false`, draft notices and `noindex` remain. A2 booking ownership cookie and per-tab nonsecret identifier are now disclosed in the cookie draft. No legal claims were approved by this work.
- Vercel Analytics/Speed Insights and contact/time/confirmation events remain consent controlled. Public-path allowlist and sensitive query/fragment stripping are preserved. Measurement failure does not block booking.
- Import/reference checks found CalBooking, CalBookingEmbed and CalWarmup unused outside their own implementation chain. Removed all three, the Cal dependency and its three lockfile entries. No unrelated dependency upgrade.
- Removed the remaining enquiry-email dependence on `NEXT_PUBLIC_CAL_LINK`; confirmation HTML and text now point to the absolute native contact URL. Mock email assertions cover that URL even if a stale Cal setting exists.
- `SiteModals` and standalone ContactForm are retained as unmounted existing components; neither creates a second active public booking flow. Their cleanup is not required for this merge.

## Contact and booking architecture

Visitor ? `/contact` ? one BookingWizard ? native availability/intake/confirm APIs ? PostgreSQL (Neon in the intended deployment) ? Google Calendar ? Resend confirmations ? Admin Dashboard.

An explicit email alternative remains. Holding-page CTAs also reach `/contact`. Availability reads, owned intake/confirmation and management APIs share A2 abuse controls. Manage/cancel/reschedule retain their separate bearer-token boundary. Browser session refresh/retries and separate-tab behavior are covered at handler/SQL level but still require real-browser acceptance.

## Database and environment requirements

Migration `20261012210000_booking_ownership_and_rate_limits` is additive: BookingAttempt and SecurityRateLimit tables, six indexes including primary keys, and two foreign keys. No duplicate migration was introduced. The integrated Prisma schema/client remain consistent. The migration has **not** been applied to production.

Required configuration names (no credential values):

- Database: `DATABASE_URL`, `DIRECT_URL`.
- Security: `SECURITY_RATE_LIMIT_SECRET`, `SECURITY_ALLOWED_ORIGINS`, `CRON_SECRET`.
- Proxy trust only where proven: `SECURITY_TRUST_PROXY`, platform-managed `VERCEL`.
- Administration: `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`.
- Calendar: `GOOGLE_CALENDAR_CLIENT_ID`, `GOOGLE_CALENDAR_CLIENT_SECRET`, `GOOGLE_CALENDAR_REFRESH_TOKEN`, optional `GOOGLE_CALENDAR_ID`; OAuth helper: `GOOGLE_CALENDAR_REDIRECT_URI`.
- Email: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`; booking sender/reply/organizer: `BOOKING_FROM_EMAIL`, `BOOKING_REPLY_TO_EMAIL`, `BOOKING_ORGANIZER_EMAIL` (existing fallbacks remain).
- URLs and launch gate: `SITE_URL`, optional existing `NEXT_PUBLIC_SITE_URL` fallback, `COMING_SOON_ENABLED`.

Security limiter and cron secrets must meet their existing minimum length; allowed origins must be exact approved HTTPS origins in production, including approved previews. Never expose server secrets via public variables. Trust Vercel ingress only after checking the overwritten forwarding header; otherwise clients deliberately share the restrictive network quota. Missing required A2 storage/configuration fails closed. The obsolete Cal variable is not needed; existing secret files were not edited to remove it.

Use the existing Prisma config with the direct connection for authorized release migrations. Take a recoverable database backup/branch, confirm target identity and previous migration history, and verify schema/indexes/foreign keys before enabling traffic. The current local database URL is not designated disposable and was never used for tests.

## Integration baseline validation evidence

| Check | Result |
|---|---|
| `npx tsc --noEmit` | PASS |
| `npm run build` | PASS ? optimized Next.js production build and route generation |
| `npx prisma validate` | PASS ? schema only, no remote database operation |
| `npm run test:security` | PASS ? 19 tests, including native enquiry-email link assertions |
| `npm run test:security:postgres` | PASS ? 15 actual PostgreSQL acceptance tests |
| `npx tsx scripts/check-contact-tracking.ts` | PASS ? routing, consent, event labels, excluded paths and telemetry failure |
| `npx tsx scripts/check-privacy.ts` | PASS ? parsing/expiry/withdrawal/blocked storage and URL exclusion |
| Targeted integration/security ESLint | PASS |
| `npm run lint` | FAIL ? seven existing errors and one warning listed below |
| Conflict markers / whitespace / removed destinations and metrics | PASS ? source inspection and Git checks |
| Production HTTP routes and internal links | PASS for expected routes/redirects, anchors and single-footer assertions; known favicon failure recorded below |
| Browser at 320/375/768/1024/1440/1920 | NOT VERIFIED ? browser/app inventory empty |
| Browser refresh, cookie transport, retries, tabs | NOT VERIFIED ? handler/SQL tests do not establish browser behavior |
| Real provider delivery, authenticated dashboard, production ingress/performance | NOT VERIFIED |

SQL acceptance used the **existing** Docker test workflow because no approved isolated Neon test URL is configured. Docker Desktop was started; the runner created only its own nonce-labeled tmpfs PostgreSQL 16.15 container on a random localhost port, checked database/user/empty-schema identity, applied prior migrations, inserted fake representative records, then applied A2. Records were unchanged; all expected indexes/FKs and migration status passed. Tests cover same-email separation, capability expiry/tampering, initialization/confirmation/slot races, independent-process quotas, spoofed headers, missing configuration/storage, rollback, cleanup lock race and legacy management tokens. Providers/fetch were stubbed; no real messages/events were sent. The container was disposed; unrelated existing containers were left alone.

Machine-readable evidence: [SQL acceptance](audits/a2-postgres-acceptance.json) and [HTTP checks](audits/integration-route-checks.json). HTTP smoke server used process-only dummy database/provider configuration, not the configured remote database. It was stopped after checking public routes, redirects and every homepage/contact internal link/anchor. HTTP/source inspection does not verify hydration, screenshots or layout.

Baseline lint findings (resolved by the current batch):

- `ManageBookingClient.tsx:327`: synchronous effect state; `:1704`: internal home anchor instead of Next Link.
- `AdminTimeSelect.tsx:294,537`: synchronous effect state.
- `BookingWizard.tsx:1091,2807`: synchronous effect state/availability initialization.
- `AnimatedStat.tsx:38`: synchronous effect state.
- Warning: `Hero.tsx:251`, raw image element.

These locations were present before integration; no blanket suppression or unrelated behavior refactor was used to make the gate green.

## Integration baseline blockers (superseded above)

1. Complete native contact acceptance on approved isolated staging fixtures: browser cookie transport/refresh/retry/multiple tabs, unavailable-slot/error recovery, timezone, confirm/cancel/reschedule, owner/client receipts and authenticated admin behavior. Verify actual Google/Resend configuration and Vercel ingress without using production customer data.
2. Supply accessible mobile section navigation (still hidden below `lg`), resolve the seven existing lint errors, then perform six-width, keyboard, focus, 200% reflow, contrast and reduced-motion QA. Remote visual improvements do not substitute for rendered evidence. Capture console/hydration and performance evidence.
3. Finish operator/provider/region/retention/transfer details and appropriate legal review. Keep drafts/noindex until actually reviewed. Check consent withdrawal and telemetry requests in the deployed browser.
4. Finish metadata/private-route indexing and sitemap coverage: admin/login currently inherit indexable homepage metadata, management/holding titles duplicate the brand, inherited canonicals/OG need review, sitemap currently lists only `/`. `/favicon.ico` still returns 404. Recheck existing research attribution and remaining audit content/accessibility issues; no new verified business results are claimed.
5. Confirm release secrets/origins/proxy configuration and cleanup scheduling; apply the A2 migration only in an explicitly authorized production release after backup and staging rehearsal. Verify `COMING_SOON_ENABLED` deliberately exposes the intended homepage. Production migration/configuration and live gate status remain unverified.

Recommended immediate implementation batch: finish the existing native A3 acceptance fixtures and mobile/lint/accessibility fixes, with browser evidence. Defer new pages and redesign work. The full [existing audit](audits/website-readiness-audit.md) remains authoritative for still-open items; integration does not close them automatically.

## Required production release sequence ? not executed

1. Review this local integration branch and diff; finish the blockers above and rerun relevant gates against the reviewed candidate. Merge/push only through a separately authorized review workflow.
2. Provision/configure isolated staging, verify environment names and ingress trust, rehearse additive migration and backup/restore, then complete native browser/provider acceptance and legal/content review.
3. Before production traffic uses A2, take a recoverable database backup/branch, verify production identity and migration history, and apply the versioned additive migration with the direct connection in an authorized controlled release window. Account for old instances sharing the database during rollout; the old app does not provide A2 protections.
4. Verify production secrets, exact origins, URL/calendar/email configuration and cron authentication/scheduling; deploy the reviewed build only when authorized. Ensure no unprotected old instance serves booking traffic during cutover. Treat the additive schema as retained if rolling back app code; an old app rollback reopens old authorization behavior.
5. Check authorized non-customer smoke fixtures, cookie behavior, one event/email per confirmation, retries, management links, quota responses, privacy/no-PII telemetry, admin access, public metadata/assets and performance. Enable the intended homepage gate only after acceptance; monitor sanitized failures. Do not automatically undo additive schema or delete existing customer records on failure.
