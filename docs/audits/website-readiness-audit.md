# Daniel VLKO — Website Readiness Audit

Date: 12 October 2026 (Europe/Vienna). Target: danielvlko.com. Scope: current repository, homepage first; audit and planning only.

## 1. Executive Summary

### Phase A2 acceptance update - 12 October 2026

**AUD-07: PARTIAL. AUD-25: PARTIAL.** Real PostgreSQL migration, ownership, concurrency and durable quota acceptance now pass. Browser transport/session behavior and actual Vercel ingress remain NOT VERIFIED, so neither issue is closed. The implementation notes below are historical; this acceptance update supersedes their database availability and SQL-verification limits.

| Acceptance area | Result | Current evidence |
|---|---|---|
| Database migration | PASS | PostgreSQL 16.15; four original migrations -> representative pre-A2 records -> prepared A2 migration; final Prisma migration status up to date |
| Schema integrity | PASS | Both new tables, all six security indexes, both foreign keys, unique capability hash constraint and ORM persistence exercised |
| Booking concurrency | PASS | Real advisory/row locks; simultaneous first intake creates one capability/lead; four confirmations yield one booking/event; two attempts racing for one slot yield 201/409 |
| Durable rate limiting | PASS in isolated PostgreSQL | Actual counters, expiry/reset, saturation, 429 and Retry-After; two independent Node processes share one quota (7 accepted / 13 limited from 20 simultaneous calls) |
| Browser/session transport | NOT VERIFIED | Browser inventory exposes no surfaces; cookie attributes have code/header tests, but no browser HttpOnly/Secure/SameSite, refresh or tab acceptance |
| Vercel ingress/WAF | NOT VERIFIED | No Vercel production settings were queried or changed; environment simulation is not ingress evidence |
| Isolated security regressions | PASS | Original 19/19 tests plus 15/15 PostgreSQL acceptance tests |
| TypeScript / Prisma / build | PASS | Standalone TypeScript, Prisma validation and production build |
| Lint | Targeted PASS; full repository FAIL (existing) | Acceptance/security files pass relevant lint; original 9 errors and 1 Hero SVG warning remain, with no new findings |

#### Environment safety and actual migration

Docker Desktop was installed but stopped. It was started locally; its daemon became available (29.4.2). The cached official `postgres:16-alpine` image was used, without downloads or new dependencies. An unrelated existing PostgreSQL container on port 5432 was explicitly not used. `.env.local` DATABASE_URL/DIRECT_URL are remote and not identified as disposable; they were refused for these tests. No explicit existing test database was configured.

The new `npm run test:security:postgres` runner creates a uniquely named container with an ownership nonce/label, localhost-only dynamically allocated port, 256MB memory limit and tmpfs database storage. Before migration it verifies Docker ownership/image/binding, current database/user and an empty schema. All migration subprocesses receive the same explicit disposable URL through a dedicated Prisma config that does not load `.env.local` or fall back to existing credentials. A database nonce marker is verified again before test writes and by independent rate-limit workers. Fixture passwords are generated only for this disposable container and redacted from child output; no production secret was generated or printed.

The four previous migrations were applied with `prisma migrate deploy`, followed by synthetic lead/confirmed-booking records. The prepared `20261012210000_booking_ownership_and_rate_limits` migration was then applied with `migrate deploy`. Full representative rows were compared before/after and remained unchanged. Security indexes/FKs were queried from PostgreSQL, and the final migration status was up to date. The runner stops/removes only its verified labeled container; tmpfs data and task-owned temporary migration copies are disposed. No task test container remains. Docker itself is left running so unrelated containers are not stopped.

The first harness run correctly failed Prisma's empty-schema prerequisite because the test nonce marker had been created too early. The harness now creates that marker after baseline migration. Subsequent migration and test runs pass; this was a test setup correction, not an application defect.

#### Real database tests and evidence limits

`tests/security.postgres.test.ts` runs actual Next API handlers against real Prisma/PostgreSQL. HTTP statuses are handler responses to NextRequest objects; a network listener/browser is not substituted or claimed. Google methods and fetch are intercepted locally. The custom confirmation flow executes real availability/lead/attempt/booking SQL, with fake provider results and fake mail responses; **no external emails/events were sent or created**.

15 passing tests cover:

1. Independent sessions using exactly `example@test.local`; no shared lead, private response fields, cross-session mutation or confirmation; capability hash persists through an independent DB client.
2. Owned intake retry/update; missing, invalid, tampered and expired capability rejection; expired attempts cannot update their lead.
3. Four simultaneous first submissions create exactly one attempt/lead; other requests fail closed until the issued cookie is available.
4. Four simultaneous same-attempt confirmations reserve once; completed replay returns the same confirmed booking and delivery status without repeating fake provider/email calls.
5. Different owned attempts racing for the same slot preserve uniqueness (one 201, one 409).
6. Real quota persistence through independent Prisma pools; 429/Retry-After, capped counters and immediate reuse after DB-clock expiration.
7. Two independent application processes enforce one shared atomic quota under simultaneous requests.
8. Contact/admin-login/intake normal responses and excess-request HTTP 429 despite changing untrusted proxy headers; no delivery during the rejection checks.
9. Availability/manage/cancel/reschedule/confirmation guards use persistent quotas and produce 429 before expensive work.
10. Cleanup authorization, expired security-record removal, preservation of active attempts and all lead/booking records.
11. Foreign-origin and missing-secret fail-closed responses without writes.
12. FK/hash uniqueness constraints and a deliberately aborted ORM transaction rolling back the lead update.
13. Actual PostgreSQL password authentication failure returns generic 503 without writes, provider calls or fixture credential disclosure in diagnostics.
14. Cleanup blocks on an actual row lock while a counter is reset; after commit, the live counter survives with its updated quota. This verifies the outer expiry predicate against a real race.
15. Pre-migration confirmed-booking records still authorize their original synthetic management token.

Reproducible command: `npm run test:security:postgres` (requires running local Docker and the cached `postgres:16-alpine` image). It creates its own database; never set a production URL for it. Summary artifact: `docs/audits/a2-postgres-acceptance.json` (no credentials/capabilities). Original mocks remain available via `npm run test:security` and are reported separately.

**No application security defect was observed requiring a code change.** Acceptance additions are the Docker runner, dedicated migration config, PostgreSQL tests, independent rate worker, package command, evidence artifact and this report. Existing application/A1 changes, Cal.com, visual design, booking business logic and the prepared migration are preserved.

#### Configuration acceptance and outstanding blockers

- `SECURITY_RATE_LIMIT_SECRET`: required in every mode, at least 32 characters; use a random server-only deployment secret. It is absent from the current local configuration; the runner supplies disposable test-only values without editing `.env.local`.
- `SECURITY_ALLOWED_ORIGINS`: required in production; exact HTTPS origins without paths/trailing slashes. Development can derive the local destination origin when unset. It is absent locally. The caller's Origin must match both the configured list and actual request URL, so reverse-proxy origin behavior must be validated before release.
- `SECURITY_TRUST_PROXY`: optional. Unset means the restrictive shared network bucket (verified against spoofed XFF/X-Real-IP). `vercel` trusts a single valid edge-overwritten header only with platform VERCEL=1; actual edge overwriting remains NOT VERIFIED. Do not claim that tests setting VERCEL prove production behavior or WAF activation.
- `CRON_SECRET`: required for cleanup, at least 32 characters. Existing local value meets the length requirement; its production value/scheduler are not verified. The disposable test secret verifies both unauthorized denial and successful bounded cleanup.
- Real browser checks remain pending: HttpOnly JavaScript inaccessibility, Secure transport, SameSite handling, one-hour expiry/recovery, refresh, isolated cookie jars, concurrent tabs and error navigation. Existing code/header evidence is not browser acceptance.
- Global/shared-network quotas may deny legitimate users together. Database behavior is now verified, but production traffic tuning/monitoring and edge volumetric protection remain operational work. Real provider delivery and recovery from uncertain remote outcomes remain Phase A3, outside these provider-stub acceptance tests.

#### Exact safe release sequence (manual plan; not executed)

1. Complete browser and real ingress acceptance on an isolated staging deployment with synthetic data and blocked/stubbed external delivery. Identify the approved release artifact, current deployed version, target DB identity and migration history; obtain the normal DB backup/recovery point. Do not let CLI configuration silently fall back to an unknown `.env.local` target.
2. Prepare server-only rate secret, exact production/preview origins and an adequate cleanup secret. Set proxy trust only after edge verification; leave shared quota mode otherwise. Prepare the staged release with matching generated Prisma client. This configuration must be present **before** the new API version becomes public.
3. Have the release operator explicitly bind DATABASE_URL to the intended runtime DB and DIRECT_URL to its verified direct migration connection. Run `npx --no-install prisma migrate status`; proceed only when the four earlier migrations are applied and the A2 migration is the sole expected pending migration. Abort on unexpected drift or pending migrations.
4. Run `npx --no-install prisma migrate deploy` through the normal authorized release process. Verify both new tables, six indexes, FKs and final migration status **before routing traffic to the A2 application**. The additive tables are compatible with the prior schema/records; the old application can continue during schema preparation.
5. Route traffic to the already-tested A2 release with the prepared config and generated client. Use read-only/negative-path production smoke checks and monitoring; no real customer booking/email/calendar actions are needed for this acceptance report. Old intake/confirm clients without attemptId must restart with the updated UI; never recover access through email matching.
6. Schedule hourly authenticated `GET /api/cron/security-cleanup`, passing the existing 32+ character CRON_SECRET as a bearer header. Monitor batch lag/429/503 rates and adjust frequency or verified quotas from real traffic. Secrets belong in the deployment secret store, not URLs, logs or source.
7. On failure, stop the cutover and retain the additive tables. Inspect `_prisma_migrations` and partially created objects before an operator-directed roll-forward/recovery; never blindly rerun, reset, db-push or drop tables under the new code. Do not revert to email-only ownership. If the application must be paused, block the affected API endpoints safely: the coming-soon gate alone does not disable APIs. No production rollback/migration was attempted here.

Deploying the new APIs before their tables causes storage failures; deploying them without the rate secret/origins also rejects valid requests. Those orders create booking/contact downtime. Apply schema first, configure before exposure, then cut over the matched application/client together. Browser/ingress evidence is the remaining A2 acceptance gate, not a new implementation requirement.

**Phase A3 may begin in isolated development/staging**, with synthetic fixtures and provider stubs. A2 remains PARTIAL and production release remains gated on browser/ingress/configuration verification. The homepage launch verdict remains NOT READY.


### Phase A2 security implementation update - 12 October 2026

**AUD-07: PARTIAL. AUD-25: PARTIAL.** The application protections and isolated regression tests are implemented. They are not certified in a real PostgreSQL deployment or browser yet; production acceptance remains open. No production migration, data mutation, real email, calendar action or deployment was performed. Existing A1 changes are preserved.

#### Lifecycle and ownership boundary (AUD-25)

Root cause: pending lead reuse trusted supplied email, and confirmation trusted a supplied lead ID. The new path is visitor -> non-secret per-tab attempt UUID -> intake creates a distinct lead and hashed capability -> HttpOnly attempt cookie -> owned lead retry -> owned slot reservation -> existing confirmation/calendar/email -> existing token-protected management.

- `src/lib/booking/session.ts`: server generates 32 random bytes; SHA-256 hash only is stored in BookingAttempt. A client-supplied cookie never becomes the new capability. Existing attempt IDs with missing/incorrect/expired cookies are rejected generically; no email lookup grants ownership. Different attempts using the same email create distinct leads.
- Production cookie is named `__Host-dv_booking_<attempt UUID>`, HttpOnly, Secure, SameSite Strict, Path=/, Max-Age=3600. Non-production omits the host prefix/Secure for local HTTP. Secrets never enter API JSON, URLs, sessionStorage or application diagnostics. Cookies are host-bound and separately named per attempt so multiple attempts cannot overwrite one another's capability.
- The non-secret attempt UUID is persisted in per-tab sessionStorage for one hour by BookingWizard. An in-component reference supports retry if storage is unavailable; refresh recovery then requires normal storage/cookie support. A 403 clears the attempted identifier for the next user retry. No styling, animation, form layout or Cal embed changes.
- Intake serializes first creation with a PostgreSQL transaction advisory lock, and authenticated reuse locks the attempt row. Confirmation checks ownership **before** availability/provider work and rechecks it under `FOR UPDATE` inside the reservation transaction. Supplied leadId must match the capability's lead. A pending/completed reservation prevents further lead edits or another reservation; completed same-slot replay returns the existing booking without repeating calendar/email actions. Delivery status is recorded on the attempt for honest replay responses. Existing unique slot protection remains.
- Capabilities expire after one hour; authorization uses database time to enforce expiry. Expired security records are removed in bounded batches by `/api/cron/security-cleanup`; leads/bookings are retained. Neither request identifiers nor expired capabilities are used to silently recover ownership. Lost cookies/legacy unfinished leads must start a fresh owned attempt. A simultaneous first request without the newly issued cookie receives a generic denial; retry after the winning cookie response is supported.
- Confirmed booking management remains a separate bearer-token boundary (`src/lib/booking/tokens.ts` is unchanged). Manage/cancel/reschedule still verify existing random/derived tokens; invalid token and unknown booking both return the same generic 403. Existing confirmed links and admin session signatures are preserved. New ownership does not authorize a browser to manage another booked appointment.

Files: `src/lib/booking/session.ts`, `src/lib/booking/intake.ts`, `src/lib/booking/confirm.ts`, intake/confirm API routes, `src/components/booking/BookingWizard.tsx`, `prisma/schema.prisma`, the new versioned migration and regenerated Prisma client files.

#### Durable abuse protection (AUD-07)

Root cause: no application throttles, unbounded body parsing, no authenticated intake ownership, and raw provider/database exception logging. Repository configuration supplies no evidence that a Vercel WAF policy is active. Platform account configuration remains NOT VERIFIED; it is not assumed.

- `src/lib/security/rate-limit.ts` uses a PostgreSQL atomic UPSERT counter, bounded/saturating increments and database-clock fixed windows. All application instances share the same rows; there is no in-memory production limiter. Missing secret/storage/schema fails closed before emails, lead writes, password verification or provider work. Global budget is checked before network and identity budgets, bounding the number of distinct keys and costly operations per route. Login also has a global single-admin budget; no password is used as a key.
- HMAC-SHA256 keys use `SECURITY_RATE_LIMIT_SECRET` (32+ random characters), so raw IP/email/attempt identifiers are not persisted in rate-limit keys. Contact/intake also limit normalized email, and confirmation limits the authenticated attempt.
- Network identity trusts only `x-vercel-forwarded-for` when **both** `SECURITY_TRUST_PROXY=vercel` and the runtime's `VERCEL=1` are present. It must be a single valid IP; IPv6 is grouped by /64. Generic X-Forwarded-For/X-Real-IP and header lists are never trusted. Unknown ingress uses one restrictive shared network quota rather than a spoofable fallback. This is safe but can limit multiple legitimate visitors together; ingress validation is a release requirement. Vercel documents edge header behavior in [Request headers](https://vercel.com/docs/headers/request-headers); no enterprise Trusted Proxy or WAF setup was purchased or assumed.
- All affected POSTs require an exact configured Origin matching the destination origin and reject cross-site Fetch Metadata. Production origin configuration must use complete HTTPS origins (no paths/trailing slashes). This prevents cookie CSRF and unapproved Host/destination use; Origin is not treated as authentication against non-browser attackers.
- Shared `readJson`/`readBody` limit actual UTF-8 bytes, validate media type/JSON object shape and enforce a 10-second body-read deadline. Responses use 400/403/408/413/415 as appropriate; throttles return 429 with Retry-After and no-store. Admin accepts bounded URL-encoded/multipart forms and preserves its normal 303 success/invalid-password redirects and cookie format.
- Availability rejects fractional/excessive day ranges and impossible dates before provider work; the existing business horizon also bounds computation. Google calls have a 10-second transport timeout with automatic retries disabled; email uses the existing SDK via a 10-second abort signal; DB connection/query timeouts are 5/10 seconds. Rate guards and handlers share one cached Prisma client with a maximum of five connections per runtime (including production), avoiding a new pool per guard. Templates and provider responsibilities remain intact.
- `src/lib/security/log.ts` emits static operation names and only allowlisted Prisma codes, never exception messages/provider payloads. Contact success logging of name/email is removed. No raw capability diagnostics were added.

| Route | Per-network budget | Global budget | Window / extra identity quota |
|---|---|---|---|
| Contact | 5 | 100 | 15 minutes; 5/email/hour |
| Admin login | 5 | 30 | 15 minutes; global budget covers the single admin account |
| Booking intake | 10 | 200 | 15 minutes; 5/email/hour |
| Booking confirm | 10 | 100 | 15 minutes; 10/owned attempt/hour |
| Availability | 60 | 600 | 1 minute |
| Manage | 30 | 300 | 15 minutes |
| Cancel / reschedule (each) | 10 | 100 | 15 minutes |

Files: `src/lib/security/{http,rate-limit,log}.ts`, contact/admin-login and six booking API routes, `src/lib/db.ts`, `src/lib/booking/calendar/google.ts`, `src/lib/email/client.ts`, confirmation/cancellation email SDK imports, `/api/cron/security-cleanup`, `.env.example`, schema/migration/generated client and `package.json` security-test command. No external account, paid service or new npm dependency was introduced.

#### Tests and acceptance evidence

`npm run test:security` runs `tests/security.test.ts` using existing tsx/Node test tools. **19/19 pass.** The suite invokes actual route handlers with an in-memory ORM/transaction fixture, fake Google methods and an intercepted fetch boundary. No dotenv/live credentials are loaded and no outbound network connection is permitted by the fixture. These are regression tests, **not production proof**.

Demonstrated: separate same-email sessions; no B access to A's lead ID/state/update/confirmation; missing/invalid/tampered/expired capabilities; expired intake rejection; owned retry/refresh identifier reuse; normal confirmation; replay without duplicate event/email; concurrent first attempts and confirmations in the transaction model; fixation rejection and production cookie attributes; ordinary/burst/reset limiter behavior; 429/Retry-After; login throttling despite spoofed IP headers; preserved admin signing/login contract; malformed/null/array and oversized UTF-8 bodies; contact validation/mock delivery; invalid availability parameters; missing configuration/storage fail-closed behavior; sanitized logs; preserved management token access and uniform unauthorized/not-found responses.

- **PASS:** standalone TypeScript; production build; Prisma generate and schema validation; offline schema-to-schema migration diff review; source access-path review; application diff/secret review. Build/check-generated `next-env.d.ts` change is restored before handoff.
- **FAIL (pre-existing):** repository lint still has 9 errors and 1 Hero SVG warning, at the A1 locations (BookingWizard's line numbers may shift after the handshake addition). No new lint findings in the A2 security code. No unrelated lint fixes/suppressions.
- **NOT VERIFIED:** SQL execution against real PostgreSQL, transaction lock/UPSERT races across real connections, migration application, trusted ingress header overwriting, production WAF/quotas, browser cookie/refresh/concurrent-tab behavior and real provider completion. Docker CLI is present but its local daemon is unavailable; no local PostgreSQL runtime was found. No current database was used as a substitute.
- Cal.com/contact components and existing admin auth-signing utilities are unchanged; A1 navigation/design changes remain untouched. Cancellation/rescheduling business logic is preserved; their new guards are regression-tested for denial, not a full successful remote provider exercise.

#### Migration and manual deployment requirements

Migration: `prisma/migrations/20261012210000_booking_ownership_and_rate_limits/migration.sql`. Adds BookingAttempt and SecurityRateLimit, indexes and lead/booking foreign keys; it changes no existing lead/booking data. The Prisma-generated offline diff has equivalent tables, defaults, indexes and foreign-key semantics. It has **not** been applied to any database. Generated client includes the new models; `prisma db push`, reset and seed were not run.

1. Prepare a dedicated disposable PostgreSQL test database, separate from `.env.local` and production. Apply existing migrations plus this migration there using `prisma migrate deploy` with a test-only direct connection. Validate table/index/FK definitions and use parallel connections to prove atomic quotas, creation locks and same-attempt reservation serialization. Do not mark the items PASS on the basis of the in-memory model alone.
2. Generate and configure a random 32+ character `SECURITY_RATE_LIMIT_SECRET`. Configure comma-separated `SECURITY_ALLOWED_ORIGINS` with each exact approved HTTPS production/preview origin. Do not expose either secret or session capabilities in NEXT_PUBLIC variables. Existing DATABASE_URL/DIRECT_URL, email/calendar/admin/management secrets remain required; no new booking-signing secret is needed because capabilities are random and stored hashed.
3. On verified Vercel ingress set `SECURITY_TRUST_PROXY=vercel`; check that VERCEL=1 is platform-set and that user-supplied header spoofing does not survive edge overwriting. Otherwise keep the shared restrictive quota and design a verified self-hosted ingress strategy before public release. Validate the actual request URL origin behind the proxy; requests fail closed if it does not match configured Origin.
4. Arrange the additive production migration and application rollout through the normal release process, using the direct migration connection and existing backups/review. Run `prisma generate`, TypeScript/security tests and production build as release checks. This report documents required actions; this session does not apply the migration or deploy. **Protected APIs will reject requests until the schema and required security environment are installed.** Old intake/confirm requests lacking attemptId are deliberately rejected rather than silently preserving email-based authorization.
5. Schedule authenticated `GET /api/cron/security-cleanup` hourly with `Authorization: Bearer <CRON_SECRET>`; use the existing secret only if it is at least 32 random characters. Each run deletes at most 5,000 expired attempt rows and 5,000 limiter rows expired more than a day. A live counter reset is protected by an outer expiry condition. Monitor lag and increase run frequency if needed. No leads/bookings are deleted, and expiration authorization works even if cleanup is delayed.
6. Before general release, browser-test successful intake/confirmation, refresh/retry, two tabs, expired cookie recovery, same-email isolation, management links and admin login on staging using approved fake recipients/calendar. Verify 429/Retry-After and provider/database failure recovery, cookie attributes, no sensitive logs and the existing Cal.com public flow. Tune thresholds from legitimate traffic while keeping durable protection.

Residual risks: application quotas still incur a bounded database operation per attempted request and are not volumetric/DDoS protection; a verified edge WAF is complementary. Global/shared-network budgets can temporarily deny legitimate traffic and need monitoring. PostgreSQL outage intentionally blocks protected APIs. An interrupted first response cannot recover an unreceived HttpOnly capability by email; a fresh attempt is required. Provider timeouts/process termination can have uncertain remote outcomes or leave existing PENDING reservations; the pre-existing cross-provider compensation architecture is retained and needs reconciliation monitoring, not an unsafe timeout fallback that silently releases uncertain slots. Business lead retention and protection of authenticated admin mutations beyond login remain separate review areas. Browser/DB deployment acceptance is outstanding.

**Final status remains PARTIAL for both AUD-07 and AUD-25.** Keep them open until real database/ingress/browser acceptance passes. Next batch: complete that isolated/staging verification, then Phase A3 contact/booking functional verification (AUD-06/16/17/19) without merging Cal.com and the custom flow.


### Phase A1 implementation update ? 12 October 2026

**Resolved in source and local production HTTP checks: AUD-01, AUD-02, AUD-03, AUD-15.** The original audit observations below are retained as the baseline; this update and resolved register statuses describe the current implementation. Homepage remains **NOT READY** because the remaining launch gates are outside A1.

- Header now uses `/#work`, `/#services`, `/#about`, `/#process`; Insights is removed and `/contact` remains. Section observation tracks all current intersections, clears inactive sections and exposes `aria-current="location"` only on the homepage. Footer already had correct cross-route anchors.
- Hero work CTA now uses `/#work`. Existing `/work` redirects temporarily (307) to `/#work`, avoiding the empty shell without creating a page. All three self-linking detail buttons and their destination data are removed. The featured tag reads ?Featured Project,? not ?Featured Case Study.? Existing cards, imagery, typography, minimum heights and grids are retained.
- Six presentation result figures and their TODOs are removed. The numerical intro row (including the template-first claim) and its now-unused animation code are also removed; no new claims replace it. Featured qualitative descriptors remain unchanged; they are not presented as measured results. Real project provenance and evidence remain future content work.
- Placeholder LinkedIn/GitHub icons are removed because no verified profile URLs were available. Email remains.
- Files changed: `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/sections/hero/Hero.tsx`, `src/components/sections/work/SelectedWork.tsx`, `src/components/sections/work/selectedWork.data.ts`, `src/app/work/page.tsx`, and this report. Homepage composition in `src/app/page.tsx` is unchanged. No booking, admin, database, font, palette or global spacing code changed.
- **PASS:** standalone TypeScript (`npx --no-install tsc --noEmit --incremental false`), production build, source link/metric checks, unchanged homepage composition and `git diff --check`. Local production GET checks prove homepage/contact 200, `/work` 307 to `/#work`, homepage anchor IDs exist, contact footer links point back to them, and unsupported figures/detail CTAs/placeholders are absent from homepage HTML.
- **FAIL (pre-existing):** lint remains 9 errors / 1 warning. Effect-state errors remain in ManageBookingClient:327, AdminTimeSelect:294/537, BookingWizard:1089/2804, ComingSoonModals:112 and AnimatedStat:38; internal-link errors remain in ManageBookingClient:1704 and Footer:76. Hero:320 retains the SVG img warning. No new lint violations were introduced; these unrelated repairs are deferred to AUD-14.
- **NOT VERIFIED:** browser desktop/mobile appearance, scroll-to-anchor behavior, interactive active state and keyboard operation. Current browser inventory again returned no surfaces. HTTP/source checks do not substitute for browser QA.
- Remaining open items: **P0 0 / P1 6 / P2 11 / P3 4 = 21**. Next implementation batch: Phase A2, AUD-07/AUD-25 (booking ownership and abuse protections), with primary booking-path decision and controlled integration verification afterward. Mobile navigation, contrast, reduced motion, metadata/disclosures and browser acceptance remain required before launch.


**Homepage verdict: NOT READY.** The homepage has a substantial implementation and a credible business narrative. It does not need a new identity or a wholesale redesign. Launch is blocked by incomplete navigation/proof destinations, explicitly unverified project metrics, accessibility defects and unresolved integration verification.

**Original issue register: P0 0 / P1 9 / P2 12 / P3 4 = 25 items; 4 resolved in A1 (current open counts above).** These are grouped actionable items, not individual occurrences or lint messages. Counts include release-verification tasks and recommendations, explicitly labeled in section 7. No critical production outage or compromise was established; lack of evidence is not a pass.

Production-quality foundations evidenced in code: strict TypeScript; a successful production build; modular homepage sections; one H1; a consistent Geist font; explicit image sizing; meaningful service descriptions; a semantic system diagram; working homepage anchor targets; and a real backend rather than mocked booking UI. These foundations are strong. Rendered visual quality cannot be certified in this run.

Highest business risks: users can leave through four nonexistent header pages or a practically empty work page; purported case-study metrics are presentation placeholders; case-study buttons do not open case studies; small white text on orange fails normal-text contrast. The public contact path uses Cal.com, while the coming-soon path uses a separate custom booking system.

### Evidence and limits

- Inspected repository source, routing, CSS, documentation, assets and generated production HTML. Initial tracked working tree was clean. No applicable project AGENTS.md was found in the repository or parent workspace; the Next.js dependency's AGENTS.md is not project guidance.
- Read `README.md`, `reference/README.md`, `design-qa.md`, package/configuration files and the relevant application modules. README and environment template describe an earlier foundation, not today's capabilities. Previous QA notes were treated as history, not current visual evidence.
- Browser inventory returned no surfaces; selecting `iab` returned “Browser is not available: iab.” **No screenshots or browser interaction evidence were obtained.** The screenshot-based visual portion is blocked; this report is a source/HTTP audit with an explicit visual verification plan.
- 320, 375, 768, 1024, 1440 and 1920px: **NOT VERIFIED in a rendered browser**, individually. CSS behavior was inspected; wrapping, cropping, scrolling, overflow, CLS, focus appearance, keyboard operation, mobile menu behavior, console/hydration errors and actual animation smoothness remain unverified.
- Built and started the local production app on port 3100 with `COMING_SOON_ENABLED=false` set for that process only. GET requests tested routes; three deliberately invalid contact POSTs tested rejection paths. No valid lead, booking, email, cancellation, reschedule or external calendar mutation was submitted.
- Local Cal link, email variables and database variable are present (values omitted). This does not establish credentials, provider health or deployed configuration. Production deployment, DNS, email deliverability, consent requirements and field performance were not verified.
- Only this report is intentionally added. Build artifacts are generated by checks; the build-generated `next-env.d.ts` change is restored to its initial contents before handoff. No dependencies installed, application fixes, commits, pushes or issue creation.

## 2. Current Website Inventory

### Stack and structure

Next.js App Router; build identifies Next 16.3.4. React 19, strict TypeScript, Tailwind 4, Motion, Lucide, Prisma/PostgreSQL, Google APIs, Resend, Cal.com embed, Vercel Analytics and Speed Insights. Actual dependency ranges and commands are in `package.json`; installed versions/build evidence take precedence over README.

| Area | Implemented source | Observed coverage |
|---|---|---|
| Homepage | `src/app/page.tsx` | Header → Hero → Problem → System → What I Build → Selected Work → Process → Why Daniel → Final CTA → Footer |
| Shared layout | `src/components/layout/{Header,Footer}.tsx`; `src/components/ui/Container.tsx` | Explicit imports per page, not a universal site shell |
| Styling | `src/app/globals.css`; work/system CSS modules; utility classes | Geist variable `--font-primary`; orange `#FF5A1F`; dark and warm light surfaces |
| Content | Service/problem/process/about arrays in sections; `selectedWork.data.ts` | Work data separated; other content colocated |
| Contact | `src/app/contact/page.tsx`; `ContactPage.tsx`; `CalBooking.tsx` | Real page and Cal.com embed; general enquiry mailto; no mounted standalone ContactForm |
| Coming soon | `src/app/coming-soon/page.tsx`; launch components | Modal contact form and custom BookingWizard |
| Backend | `src/app/api/contact`; booking/admin/cron APIs; `src/lib/booking`, `src/lib/email` | Validation, persistence, scheduling and email implementation; not certified end to end |
| Persistence | `prisma/schema.prisma`; `src/lib/db.ts`; generated client | Leads, bookings, availability rules/overrides |
| SEO | Root metadata; robots/sitemap; OG/Twitter image routes; `site.ts` | Basic metadata exists; StructuredData component exists but is not mounted |
| Documentation | README, reference folder, design QA; `.env.example` | Foundation-era docs; no automated test script in package.json |

### Routes and destinations

| Route | Implementation / local HTTP evidence | Launch assessment |
|---|---|---|
| `/` | 200; full homepage | Present; not complete |
| `/work` | 200; only “Selected Work” H1 in `src/app/work/page.tsx` | Placeholder, despite hero/header links |
| `/contact` | 200; substantial booking page | Provider flow NOT VERIFIED |
| `/services`, `/about`, `/process`, `/insights` | All 404 with gate disabled; no page files | Header points to absent destinations |
| `/work/[slug]` | No dynamic page file | Case-study detail coverage absent |
| `/coming-soon` | Implemented; noindex | Separate prelaunch surface |
| `/booking/manage` | Implemented; noindex and no-referrer | Customer utility; token flow NOT VERIFIED |
| `/admin`, `/admin/login` | Dynamic; server-side auth checks | Private operational routes, not marketing pages |
| `/robots.txt`, `/sitemap.xml` | Both 200 | Sitemap only contains homepage |
| `/opengraph-image`, `/twitter-image` | Production build includes both | Implemented; social preview rendering NOT VERIFIED |
| `/favicon.ico` | 404 | No favicon/app icon file found |

`src/proxy.ts` rewrites public routes to coming soon unless the environment value is exactly `false`. APIs, admin and booking management stay accessible. This is a rewrite, despite comments calling it a redirect. Missing routes may therefore look like coming soon while gated; disable the gate during release verification to expose actual 404s. Local flag is false; deployed flag is unknown.

Homepage targets `#work`, `#services`, `#process`, `#about`, `#contact`, `#business-platform`, `#ai-operations`, `#client-platform` and `#case-studies` exist. Their existence does not mean each link fulfills its label: project detail CTAs link to their own card IDs.

## 3. Homepage Section-by-Section Audit

All visual statements below describe implementation intent, not observed rendered appearance. Desktop/mobile fit is NOT VERIFIED for every section.

### 1. Header

Source: `src/components/layout/Header.tsx:8`.

- Clear brand, named navigation and a direct `/contact` CTA. Absolute 82px header intentionally belongs to the hero; it is not sticky.
- Four destinations are confirmed 404s. Work opens an empty shell. Active-section observer tracks homepage intersections while links navigate to pages: two conflicting navigation models, not simply different styling.
- `hidden ... lg:flex` at line 81 removes the navigation below 1024px; no menu toggle/panel exists. Mobile retains brand and contact only. Restore useful section navigation before expanding pages (AUD-01/04).
- Brand is 13px with wide tracking, CTA 13px/40px high. At 320px the shared inner width is 280px; exact brand/CTA fit requires a screenshot. Native focus outlines are not disabled, but no intentional focus-visible system exists here (AUD-13).

### 2. Hero and platform strip

Sources: `sections/hero/Hero.tsx`, `HeroBackground.tsx`.

- One semantic H1; 42/60/72/82px scale, normal weight, tight tracking; supporting copy 15–16px with a 600px maximum width. Geist is retained. Broad headline is explained by concrete websites/software/automation copy.
- Primary contact action and secondary work action have a sensible hierarchy, but `/work` fails the proof promise (AUD-02). Small white CTA text on orange is 3.12:1 (AUD-05).
- Technology marks are accurately labeled “Platforms I build with”; they are not client logos. Keep that distinction. Logo SVGs have name alt text; decorative Earth has empty alt and an aria-hidden wrapper.
- Hero uses `100dvh`, viewport-dependent top padding and 190–200px bottom padding; absolute platform strip wraps on mobile. Narrow/short-screen overlap and excess height are risks to test, not established defects (AUD-20).
- Background uses scroll-driven scale, translation and blur without a reduced-motion branch. Both CSS-switched Earth images are priority, and below-fold work image is also priority; network contention is a performance risk, not a measured LCP failure (AUD-12/20).

### 3. Problem and research statistics

Sources: `sections/problem/{Problem,ProblemSignal,AnimatedStat}.tsx`.

- Five specific business problems connect acquisition, operations and follow-up. Stronger and more useful than generic feature language. H2 38–60px; H3 15–16px; body 14px/1.72 line height.
- Cards use 1/2/3/5 columns at base/sm/lg/xl, 18px radius, consistent padding and minimum height. Five columns at 1440px need readability confirmation; the incomplete last row at intermediate widths is not automatically a design defect.
- Google 53% statistic links to a page that supports the historical 2016 data. Salesforce's linked page supports 55%, but is a 2024 announcement rather than the displayed 2023 report. Asana link exposes no report body in this retrieval, so 58% cannot be verified from that destination (AUD-18).
- Statistics describe external research, not Daniel's client results. Preserve explicit source/date labeling; avoid implying contemporary forecasts or promised outcomes.
- AnimatedStat starts at zero until visibility; its reduced-motion effect triggers an ESLint error. Accessibility-tree handling of an aria-label on a generic span needs testing; SelectedWork's static sr-only number is a stronger existing pattern. Do not claim current screen-reader output is verified.

### 4. Connected System

Sources: `sections/system/{System,SystemDiagram}.tsx`, `SystemDiagram.module.css`.

- Explains a connected workflow through customers, operations, automation, insights and website/CRM. Named figure/caption and text-based nodes provide semantic value. Its diagram is explanatory rather than a decorative interactive dashboard.
- Dark-to-light curve belongs to this section; extra top padding is intentional clearance. H2 38/50/56/54/62px: decreasing at xl may support the desktop split, so retain unless rendered evidence shows a hierarchy problem.
- Two-column diagram below 768px, three-column cross above it; minimum nodes and hidden flow labels make a deliberate mobile alternative. Test label wrapping and connections, especially at 320px.
- CTA `/contact`, secondary `#work` and explanatory next-step copy form a useful progression. Dark primary button supports contrast. CSS and JS both accommodate reduced motion here; reuse this discipline elsewhere.

### 5. What I Build / Services

Source: `sections/build/WhatIBuild.tsx`.

- Three clear offers: Custom Software, Automation & AI, Websites & Web Apps. Examples cover CRMs, internal platforms, bookings/inventory, documents, portals and e-commerce without needing seven overlapping service pages.
- Concrete first-person copy explains fit and includes human oversight for AI. Preserve it. H2 38–62px, H3 23–26px, description 14px/1.7 and generous limits give a coherent text hierarchy in source.
- Single column below lg, three above; flex structure keeps CTAs at card bottoms. Image slots reserve 3:2 space and provide responsive sizes and meaningful alt text.
- Each “See a … project” anchor reaches a corresponding work card. This is structurally sound, but credibility is undermined by the work content/metrics; do not solve that by redesigning services.
- Bottom statement offers either a focused solution or a connected workflow: useful objection handling against an all-or-nothing engagement.

### 6. Selected Work

Sources: `sections/work/SelectedWork.tsx`, `selectedWork.data.ts`, `SelectedWork.module.css`.

- Intro, featured project and two secondary cards are real implemented structure. Accessible CTA names include project titles; static sr-only numeric values avoid announcing every animation frame. Reduced-motion and focus-visible handling are explicit.
- Three generic project categories do not provide client context, actual scope, Daniel's role, delivery dates or evidence. Treat as unsubstantiated project presentations until real artifacts and permission establish otherwise.
- Six numerical outcomes carry TODO comments explicitly stating they are presentation metrics: -50%, 2×, +40%, +68%, -35%, 10h. Remove or substantiate before launch (AUD-03). “3 disciplines / 1 connected delivery / 0 template-first builds” is positioning, not proof; do not treat the animated 6→0 value as a real historical result.
- Every “View case study” points back to the card itself. There is no modal or detail route (AUD-02). “Explore selected work” does correctly reach the case-studies group.
- Current source uses a **1640px** outer cap, 300px intro at 1280 and 340px at 1440, 20px card gaps and background images under overlay copy. This differs from historical design-qa notes claiming a 1520px master and split panels. Current source is authoritative; visual approval remains missing.
- At 1440px the available right column and secondary half-cards compress three metrics with nonbreaking value strings. Featured image is scaled 1.5, object positioning changes at md. Overflow/crop are high-priority screenshot targets, not confirmed failures (AUD-20).

### 7. Process

Source: `sections/process/Process.tsx`.

- Understand → Architect → Build → Scale is understandable and respects diagnosis before development. Collaborative “we” describes working with the client; it does not imply an agency team, given the explicit “I develop” wording.
- Owns the work-to-light curve. 165–210px top clearance plus heading margin is substantial but cannot be called excessive without rendering.
- H2 44–72px, semibold, .96 line-height and -.06em tracking is more emphatic than preceding normal-weight sections. Four steps adapt to one/two/four columns; this is a rational change in density.
- Useful strategy explanation, but scope approval, handover, support and timeline expectations are not spelled out. Add a short factual FAQ in an existing section/page when those policies are settled; a separate process page is unnecessary now.
- `/contact` CTA is real; focus styling and CSS hover motion need the shared treatment (AUD-12/13).

### 8. Why Work With Daniel

Source: `sections/about/WhyWorkWithDaniel.tsx`.

- Personal portrait, direct-access promise, diagnostic approach and clear communication support a founder-led practice. First-person voice is consistent with services/process; preserve it.
- H2 43–68px, semibold; intro 16–18px; four reason H3s and descriptions. Reason copy overlaps some process/value messaging, but the direct relationship differentiator earns its place.
- Portrait comes first in DOM/mobile and has a 520px minimum height. On a 320px screen it may delay the useful copy; review reading flow before changing the order or height (AUD-20).
- Named portrait alt; decorative overlays hidden. No career milestones, qualifications, sample deliverables or verified endorsements support the general “measurable impact” promise yet. Collect evidence rather than inventing testimonials.
- `/contact` and `#process` provide useful next steps. Portrait hover scaling lacks explicit reduced-motion treatment.

### 9. Final CTA

Source: `sections/contact/FinalCTA.tsx`.

- Dark closing scene and recurring orange provide deliberate continuity with hero. H2 40–58px, body 14–15px and 560px limit retain hierarchy; extra decorative gradients serve text protection, not a reason to remove the established Earth direction.
- “Let's Talk” opens mailto whereas header/about use the same wording for `/contact`. The end-of-page primary action unexpectedly switches conversion channels (AUD-19). Preserve email as an explicitly labeled alternative.
- Repeated “faster / scale / less friction” adds little decision information. Short factual call expectations would support conversion better than a fresh slogan; no broad rewrite needed.
- Initial motion and reveal branches generally respect reduced motion, but ClosingBackground's scale animation and CSS hover transforms do not (AUD-12). Button normal text has the same contrast defect (AUD-05).

### 10. Footer

Source: `src/components/layout/Footer.tsx`.

- Section navigation has valid cross-page homepage anchors; real email and contact route exist. Mobile wrapping is deliberately implemented.
- LinkedIn and GitHub are `href="#"` placeholders (AUD-15). No privacy/business-details destinations (AUD-08).
- Supporting text is 8–10px with white opacity .20–.40; .25 on `#02070B` yields about 2.09:1, .30 about 2.53:1, .40 about 3.72:1. Relevant small text fails normal-text AA; small size itself is a readability issue, not a standalone WCAG minimum-size violation (AUD-05).
- ContactPage also contains its own footer before the shared footer is appended: duplicate footer/copyright and repeated contact actions. This is a cross-route density inconsistency, included in AUD-19.

## 4. Design System Consistency

| Element | Evidence | Assessment / minimal direction |
|---|---|---|
| Identity | Geist, orange, dark/light contrast, Earth imagery | Preserve colors, font, imagery direction and section narrative |
| Font/semantics | Root Geist; one homepage H1; section H2 and item H3 | PASS in source; rendered wrapping unverified |
| Containers | Container max 1480; Problem custom gutters; Work max 1640 | Intentional feature width possible; confirm alignment, do not normalize automatically (AUD-21) |
| Heading hierarchy | Normal-weight upper sections, semibold Process/About, medium Work/CTA | Difference may be intentional; evaluate actual visual hierarchy before editing (AUD-22) |
| Spacing | 64–112px common section spacing; larger curve clearance | Reasonable base; no evidence of a broken global spacing scale |
| Radius | 16px service images, 18px problem cards, 20px work, 22px portrait, pills | Different object roles justify differences; not defects by themselves |
| Buttons | Orange on dark, dark on light, outline secondary; heights 40–52px | Contextual hierarchy is sound; fix contrast and shared focus/motion first |
| Tokens | CSS variables coexist with many hardcoded near-identical colors/radii | Maintenance issue, not justification to refactor before launch (AUD-23) |
| Motion | Shared easing often .22/1/.36/1; .45–.8s reveals, longer background effects | Timing differences can be purposeful; reduced-motion coverage is inconsistent |

The site has a recognizable system in source. It cannot yet be said to feel like one polished rendered experience. Current risks are evidence/functional gaps more than a need for new visual design.

## 5. Copywriting & Conversion Findings

| Visitor question | Current answer | Assessment |
|---|---|---|
| What do you do? | Hero and three specific service categories | Clear; retain |
| Who is it for? | Companies wanting growth, founders/operators, teams with fragmented tools | Understandable but broad; add a factual best-fit statement if qualification is poor |
| Which problems? | Slow sites, busywork, disconnected tools, cold leads, weak visibility | Concrete and business relevant |
| Why Daniel? | Direct access, diagnosis, software plus automation | Credible differentiator as a proposition, lacking demonstrative proof |
| Evidence? | Platform marks, industry research, project cards | Technology familiarity and external research are not client success evidence; placeholder metrics must go |
| Collaboration? | Four steps; direct communication | Clear high-level path; support/ownership/scope boundaries unresolved |
| Next action? | Contact/booking/email/work | Contact exists; work proof and inconsistent final action weaken the journey |

Copy is strongest in Problem and Services, where real tasks replace abstract claims. “A strategic partner … impact,” “scalable systems,” “less friction” and similar endings are broad; improve only where a factual detail can replace them. Do not label text AI-generated without evidence. “Operate clearer” in FinalCTA is awkward English; address during a short editorial pass under AUD-19, not a brand rewrite. “I” versus collaborative “we” is coherent in context.

Collect for each real project: client/industry (or approved anonymized context), problem and baseline, Daniel's responsibility, constraints, delivered scope, dated screenshots, real integrations, measurement method/time window, client permission and a verified outcome. If no measurement exists, use an honest qualitative result. A consented testimonial is useful but not mandatory. “High-converting” should be supported by a method and real example rather than a guarantee. Do not delay honest project descriptions merely to obtain percentages.

## 6. Technical & SEO Findings

### Check results

| Check | Status | Evidence and limit |
|---|---|---|
| TypeScript | PASS | `npx --no-install tsc --noEmit --incremental false`, exit 0 |
| Production build | PASS | `npm run build`, exit 0; compiled, typechecked, generated 13 static pages and finalized routes |
| ESLint | FAIL | `npm run lint`, exit 1; 9 errors and 1 warning. JSON follow-up confirms same locations |
| Automated test suite | NOT VERIFIED | No test script configured; integration scripts are not a safe isolated unit suite |
| Homepage/contact/work HTTP | PASS | Local production GET 200; work content still fails completion |
| Header route destinations | FAIL | Four local GET 404s with coming-soon disabled |
| Contact invalid-input handling | PASS (limited) | Malformed JSON, missing fields and invalid email each return 400 with error message |
| Valid contact delivery | NOT VERIFIED | No real submission; Resend/mailbox receipt not checked |
| Booking UI/provider completion | NOT VERIFIED | No browser, no external reservation made |
| Mobile navigation implementation | FAIL | Main navigation hidden below lg without replacement |
| Contrast | FAIL (source calculation) | White/orange 3.12:1 for normal text; muted footer text below 4.5:1 |
| Keyboard/focus/screen reader | NOT VERIFIED | Some explicit focus rings; no complete rendered test |
| Reduced motion | FAIL (coverage) | Hero parallax and several CSS/background animations bypass preference |
| Route canonical/title | FAIL | Built contact title repeats brand; contact/work canonical equals homepage |
| Robots/sitemap endpoints | PASS (availability) / FAIL (coverage) | Valid local responses; only `/` in sitemap; private login inherits indexable root metadata |
| Structured data | FAIL (claimed coverage) | Existing component has no imports/mounts; built homepage has no JSON-LD. Schema itself is an enhancement, not mandatory for indexing |
| Image/asset implementation | PASS (limited) | Referenced homepage raster/logo files exist; Next images have reserved slots and sizes; favicon absent |
| Console/hydration/performance | NOT VERIFIED | Build is not browser runtime proof; no Lighthouse/field CWV measurements |
| Deployment gate/infrastructure | NOT VERIFIED | Local settings present; deployed gate, provider credentials and cron scheduling unknown |

Lint error locations: `ManageBookingClient.tsx:327,1704`; `AdminTimeSelect.tsx:294,537`; `BookingWizard.tsx:1089,2804`; `ComingSoonModals.tsx:112`; `Footer.tsx:77`; `AnimatedStat.tsx:38`. Seven `react-hooks/set-state-in-effect` errors and two `@next/next/no-html-link-for-pages` errors. Hero line 320 has the lone `no-img-element` warning for SVG marks; no raster-conversion refactor is warranted just to silence it.

### Integrations and security scope

`ContactPage` mounts `CalBooking`, not `components/contact/ContactForm`. `ComingSoonModals` defines a different ContactForm and mounts BookingWizard. CalWarmup is used in coming soon. A component's presence is not proof of active contact-page behavior.

Contact API validates required values, email and lengths, escapes email HTML and has honeypot handling. Internal email failure returns 502; confirmation-email failure is logged while the submission remains successful. No contact database write exists in this handler. It also logs name/email on success; retention/access policy should cover operational logs. Null JSON is not guarded as an object before property access and would fall into generic 500 handling; tighten payload shape in the validation task.

The prelaunch form accepts a 10-character message while API minimum is 20. The standalone unused form uses 20/2000, API maximum is 2500. Short messages accepted client-side can be rejected server-side. Error/status paragraphs have no live-region mechanism; browser/screen-reader announcement remains unverified.

Cal embed has a placeholder fallback and no app-owned loading failure/retry UI. A configured link was found locally, so **do not claim local placeholder use**. Email uses the same link but `normalizeWebsite` prepends `https://` rather than a `cal.com` base: a typical Cal embed path would produce the wrong URL in confirmation email. Actual delivery remains untested.

Custom booking code includes Zod intake validation, live slot revalidation, unique active slot keys, hashed management tokens and cancellation/reschedule/email modules. Admin mutations check auth; admin cookies are HTTP-only, secure in production and SameSite lax. Reminder endpoint checks a configured secret. These are useful controls, not a comprehensive security certification.

However, intake reuses an unfinished lead solely by supplied email, updates its fields and returns its ID. Confirm uses supplied leadId without a booking-session ownership capability. This creates a source-confirmed ownership gap for unfinished attempts; no exploitation or real-data mutation was attempted (AUD-25). APIs remain exposed while the marketing gate is on. Application rate limits are absent on contact/login/booking intake; deployment WAF controls are unknown (AUD-07).

Do not run `scripts/test-booking-reminders.ts` against current credentials: it sends reminder emails. Do not run reset/seed scripts as audit checks. Calendar script/provider validation needs an isolated fixture and inspection before execution. Cron availability in source does not prove a scheduled job exists.

### SEO and performance

Root metadata has a real domain, role, description, English language, OG/Twitter routes and dark viewport settings. Built HTML confirms `/contact` title `Free Discovery Call | Daniel VLKO | Daniel VLKO`; both `/contact` and `/work` canonicalize to `https://danielvlko.com`. Work inherits generic title/description. Add route-specific canonical/OG URL and unique metadata as pages become publishable.

Admin/login have no noindex metadata; robots excludes APIs only. Booking management already sets noindex/no-referrer and should remain outside sitemap. Robots restrictions are not authentication. Coming soon noindex is deliberate; verify the actual served homepage after release instead of indexing the holding page.

Largest source images include ~1.5MB work/service/portrait PNGs, ~1.76MB earth.png and unused >2MB WebPs. Next image optimization means source size is **not transferred byte size**. Measure generated image requests and LCP first. Priority work imagery competes with hero requests; blur/filter and layered shadows need low-end-device testing. Unused public files do not automatically slow initial page load. Font uses display swap; actual font availability/CLS remains unmeasured. OG uses Arial rather than Geist; this is an intentional separate image implementation, not a homepage font defect.

### Research citation checks (current retrieval)

- [Google Speed Scorecard article](https://blog.google/products-and-platforms/products/ads/speed-scorecard-impact-calculator/) explicitly supports the 53% statistic from 2016 data; article published in 2018. Historical label is appropriate.
- [Linked Asana destination](https://asana.com/press/releases/pr/asana-anatomy-of-work-global-index-2023-smart-collaboration-and-clear-goals-integral-to-creating-positive-business-opportunities/5957f2bd-2a85-4ea1-93ed-6c507b478954) returned navigation/footer without study text. 58% remains NOT VERIFIED here; do not classify it as invented solely from this retrieval.
- [Salesforce Foundations announcement](https://www.salesforce.com/news/stories/foundations-announcement/) supports 55% but is dated September 2024. Replace with the actual cited research source or correct attribution/context. Original 2023 report methodology was not independently retrieved.

## 7. Prioritized Issue Register

Status key: **Confirmed** = source, calculation, generated HTML or local HTTP evidence; **Gate** = required verification with current evidence missing; **Recommendation** = improvement/risk control, not an observed rendered defect. S = localized task, M = several components or integration work, L = substantial content/page or workflow work. Estimates exclude provider/content waiting time.

| ID | Priority/status | Section and exact reference | Problem / evidence | Recommended solution; expected impact | Effort | Verification |
|---|---|---|---|---|---|---|
| AUD-01 | P1 RESOLVED (A1) | Header; `src/components/layout/Header.tsx:8` | `/services`, `/about`, `/process`, `/insights` return 404; observer tracks sections but links pages | Header uses cross-route homepage anchors; Insights removed; active logic follows observed homepage sections. Source/production HTML verified; browser behavior pending. | S | Crawl/click every header/footer destination with gate off |
| AUD-02 | P1 RESOLVED (A1) | Work; `src/app/work/page.tsx`; `sections/work/SelectedWork.tsx:343`; `selectedWork.data.ts:66,104,136` | `/work` only H1; every case-study CTA self-links | Hero links to /#work; /work returns 307 to /#work; self-linking detail CTAs and href data removed; featured label is Featured Project. Source/HTTP verified; browser appearance pending. | M/L | CTA opens meaningful detail or accurately labeled destination; never same-card “detail” |
| AUD-03 | P1 RESOLVED (A1) | Work; `selectedWork.data.ts:106,138` | Six performance claims explicitly awaiting verified results | All six presentation metrics removed; intro numerical claims and obsolete animation code removed; no invented replacements. Source/production HTML verified. | S, evidence M | Every quantitative project claim has baseline, method, window and approval |
| AUD-04 | P1 Confirmed | Header; `Header.tsx:81` | Navigation disappears below 1024 without menu | Add accessible compact section navigation/menu using same identity. Improve mobile discovery | M | 320/375/768: links available, keyboard/Escape/focus behavior correct |
| AUD-05 | P1 Confirmed | Hero/Work/FinalCTA/Footer; respective `.tsx` button classes; `Footer.tsx` muted text | White normal text on #FF5A1F = 3.12:1; footer .25/.30/.40 opacity below 4.5:1 | Preserve accent; use a contrast-compliant foreground on orange, strengthen essential muted text and readable microcopy. Improve AA readability | M | Computed contrast ≥4.5 normal text / ≥3 large text; screenshot all states |
| AUD-06 | P1 Gate | Contact/prelaunch; `CalBooking.tsx:39`, `ComingSoonModals.tsx`, `BookingWizard.tsx`, `src/proxy.ts` | Two booking paths; neither end to end verified; deployed flag unknown; embed has no owned failure fallback | Select primary public booking path; configure real provider, fallback/retry and release gate; exercise success/failure on isolated fixtures. Establish functional readiness | M | Browser confirmation, owner/client receipts, timezone, unavailable slot, cancel/reschedule; deployed `/` is real homepage |
| AUD-07 | P1 PARTIAL (A2) | Public APIs; `api/contact/route.ts`, `api/admin/login/route.ts`, `api/booking/intake/route.ts` | No app rate limiting; honeypot alone doesn't limit submissions; APIs bypass gate | Durable quota/expiry/reset/cleanup and fail-closed checks PASS on disposable PostgreSQL; two independent processes share one quota; 19 isolated + 15 DB tests pass. Browser and actual Vercel ingress/config remain NOT VERIFIED; retain PARTIAL. | M | Controlled bursts get 429/bounded cost; normal requests work; verify deployed WAF rather than assume absence |
| AUD-08 | P1 Confirmed gap / recommendation | Footer/contact; `Footer.tsx`, `ContactPage.tsx`, `src/app` routes | Personal data collection and third-party embeds with no privacy/business-details page or link | Publish accurate privacy/data handling and business identity disclosures; link beside intake/footer. Establish transparency; jurisdiction-specific legal review separately | M | Disclosures match actual Cal/Google/Resend/Vercel use and retention; links available before submission |
| AUD-09 | P2 Confirmed | Metadata; `src/app/layout.tsx`, `contact/page.tsx`, `work/page.tsx`, admin pages | Contact duplicates brand; contact/work canonical `/`; admin login inherits indexable metadata | Unique publishable-page metadata/canonical/OG URLs; noindex operational login. Improve accurate indexing/sharing | S | Inspect generated/live head for each route, including noindex utilities |
| AUD-10 | P2 Confirmed | `src/app/sitemap.ts` | Only homepage listed; date generated from current time, not meaningful content revision | Include only complete indexable pages and reliable update dates; omit placeholders/private routes. Improve crawl coverage | S | XML URLs return canonical 200 content and contain no gated/private pages |
| AUD-11 | P2 Recommendation | `src/components/seo/StructuredData.tsx`; `src/app/page.tsx` | Unused Person/WebSite/WebPage implementation; built homepage has no JSON-LD | Mount truthful schema after reviewing data; add service/case context only when supported. Clarify entity semantics | S | Generated JSON-LD parses and validates; no invented sameAs, rating or clients |
| AUD-12 | P2 Confirmed | `globals.css`; `HeroBackground.tsx`; `FinalCTA.tsx` ClosingBackground; About/Footer hover classes | Smooth scrolling always enabled; hero parallax/background scale and hover transforms bypass preference | Apply preference consistently to scroll and decorative motion, keeping stable visual layout. Reduce motion discomfort | M | Emulate reduced motion: no parallax/zoom/smooth scroll; readable content stays visible |
| AUD-13 | P2 Recommendation | Header/Hero/Process/About/Footer; `src/app/page.tsx`; modal form status in `ComingSoonModals.tsx` | No skip link/shared authored focus styling; form error not a live region. Browser default visibility unknown | Add skip-to-content, coherent focus-visible states, and announced submission errors/success; use existing Work/Services treatment. Improve keyboard/AT access | M | Keyboard-only full journey, visible focus, screen-reader status announcements; do not suppress native fallback |
| AUD-14 | P2 Confirmed | Nine lint locations listed in section 6 | ESLint exits 1 despite successful build | Resolve seven effect-state and two internal-link violations without blanket suppressions. Restore code-quality gate | M | `npm run lint` exit 0; behavior retained; warning evaluated |
| AUD-15 | P2 RESOLVED (A1) | Footer; `Footer.tsx` LinkedIn/GitHub SocialLink calls | `href="#"` placeholders return to top rather than profile | Placeholder LinkedIn/GitHub icons removed; email retained. Source/production HTML verified. | S | Each social action reaches intended profile; accessible name and safe external behavior |
| AUD-16 | P2 Confirmed conditional path | Email; `api/contact/route.ts:269`; `CalBooking.tsx:39` | Embed path format is treated as a website host by email normalization | Build a canonical Cal booking URL from supported format; keep embed path and URL formats explicit. Fix booking link in confirmations | S | Path-format and full-URL fixtures produce intended cal.com link; received email link verified |
| AUD-17 | P2 Confirmed | Prelaunch form; `ComingSoonModals.tsx:888`; `api/contact/route.ts` | UI accepts 10–19 characters, API rejects; JSON null falls through as 500 | Align validation and reject non-object JSON cleanly; share supported limits. Reduce avoidable submission failures | S | 10/19/20/2500/2501 characters and null/array JSON return intended result without sending during negative tests |
| AUD-18 | P2 Confirmed citation mismatch / unverified source | Problem; `Problem.tsx:61,72` | Salesforce URL is 2024 announcement vs 2023 label; Asana destination yields no evidence body | Repair links/attribution or remove unverifiable statistic; retain historical Google label. Improve trust and maintainability | S | Each link opens exact supporting source; date/population match wording |
| AUD-19 | P2 Confirmed | `FinalCTA.tsx` primary mailto; `contact/page.tsx`; `ContactPage.tsx` footer | “Let's Talk” has different destinations; contact renders two footers; awkward “operate clearer” | Standardize primary contact journey and label email alternative; keep one appropriate footer; brief factual editorial pass. Reduce surprise/density | S | Final CTA reaches stated action; contact has one footer; call terminology consistently describes one offer |
| AUD-20 | P2 Gate | Homepage six-width review; Hero/Work/About images/layout | No current rendered QA, console capture, overflow or performance evidence | Capture all requested widths, keyboard/motion and representative short heights; measure optimized image network and CWV. Resolve only observed regressions | M | Screenshots 320/375/768/1024/1440/1920; no horizontal overflow/overlap, usable metrics, clean console; Lighthouse/field data documented |
| AUD-21 | P3 Recommendation | `Container.tsx`, `Problem.tsx`, `SelectedWork.tsx:29` | 1480/1640 caps and divergent gutters can shift alignment; not a proven visual defect | Compare key edges at 1440/1920; retain intentional wide work canvas, adjust only accidental drift. Improve rhythm | S | Side-by-side rendered section edges match approved intent |
| AUD-22 | P3 Recommendation | Process/About/System/Work H2 classes | Several heading weights/scales; some nonmonotonic breakpoints | Review rendered hierarchy and line breaks; preserve Geist and intentional section emphasis. Polish rhythm only if needed | S | Approved six-width heading hierarchy, no isolated awkward wraps |
| AUD-23 | P3 Confirmed maintenance gap | README, `.env.example`, `design-qa.md`; unused ContactForm; CSS tokens | Docs still claim foundation/no env; historical Work specs differ; unused standalone form and token drift | Later refresh docs/config inventory and consolidate genuinely duplicate primitives only as touched. Reduce deployment/maintenance mistakes | S/M | Documentation reflects actual routes/providers/env names without secrets; import graph verified before cleanup |
| AUD-24 | P3 Confirmed | `public` / app icon routes | `/favicon.ico` 404; no icon artifact | Add approved brand favicon/app icons. Complete browser/share identity | S | Browser/favicon requests return appropriate assets; rendered tab checked |
| AUD-25 | P1 PARTIAL (A2) | `api/booking/intake/route.ts` reuse/update block; `api/booking/confirm/route.ts:301`; `lib/booking/confirm.ts` | Email-only reuse returns existing unfinished lead ID and allows update; confirm accepts leadId without ownership capability | Real PostgreSQL ownership, retries, expiry, advisory/row-lock races, uniqueness and legacy-record compatibility PASS. Browser cookie/refresh/tab acceptance remains NOT VERIFIED; retain PARTIAL. | M | Isolated two-session test: second session with same email cannot read ID/update/confirm first session; normal retry works |

Confirmed items do not prove full production exploitability or measured user impact. AUD-06/20 are unresolved evidence gates. AUD-07/11/13/21/22 are recommendations; AUD-08 combines an observed disclosure gap with a recommendation whose legal scope remains unverified.

## 8. Homepage Launch Verdict

**NOT READY**, even though the implementation is substantially stronger than the foundation-era documentation suggests.

| Category | Decision |
|---|---|
| Visual consistency | NOT VERIFIED; coherent source direction, browser evidence required |
| Typography | Source hierarchy/font PASS; rendered fit and small-text readability unresolved |
| Content/positioning | Core offer strong; FAIL for unverified outcome claims |
| Conversion UX | FAIL: incomplete proof and inconsistent routes/actions |
| Mobile responsiveness | FAIL for missing navigation; all six rendered widths NOT VERIFIED |
| Accessibility | FAIL for contrast/reduced-motion coverage; full audit NOT VERIFIED |
| Technical quality | Build/TS PASS; lint FAIL |
| SEO fundamentals | Partial PASS; canonical/title/coverage corrections required |
| Functional readiness | NOT VERIFIED for valid booking/contact; FAIL for destination coverage |

**Must fix/verify before launch:** AUD-01–09, AUD-12–17, AUD-19–20 and AUD-25; remove unsafe/unsubstantiated proof immediately. Sitemap coverage (AUD-10) must match the final publishable page set. These do not require implementing all planned routes: truthful homepage anchors and honest project previews are acceptable temporary choices.

**Shortly after:** corrected research attribution/source maintenance (AUD-18), truthful structured data (AUD-11), richer measured case evidence and one clear support/scope FAQ. Resolve a citation before launch if retaining it as a prominent proof point.

**Optional polish:** AUD-21–24. Do not make launch depend on new heading/radius/container abstractions or a blog.

**Keep:** name/positioning, Geist primary font, orange accent, dark identity with intentional light chapters, Earth visual direction, problem-to-solution narrative, three-service taxonomy, connected-system diagram, four process steps, direct-partner story, real email alternative, Next image slots and meaningful alt text. Change only the contrast application and proven defects, not the brand.

## 9. Recommended Sitemap

Lean complete marketing presence:

```text
/
/work                         complete existing shell
/work/[slug]                  only real, documented projects
/services                     one consolidated decision page
/about                        factual personal credibility
/contact                      complete existing conversion flow
/privacy                      accurate data handling
/legal                        business details / applicable disclosures
```

Keep Process as `/#process` initially. No `/insights` at launch. Navigation after page completion: Work, Services, About, Process (homepage anchor), plus prominent Contact CTA. Footer: same destinations, Privacy, Legal, verified social profiles. Before new pages are ready, use the existing homepage sections and do not link to future pages.

Operational routes `/booking/manage`, `/admin`, `/admin/login`, APIs and coming-soon are outside the marketing sitemap. Service landing pages and insights are conditional expansion, not prerequisites for a premium business presence.

## 10. Next Page Recommendations

Priorities below describe expansion order/business value, separately from defect severity. Search intents are proposed editorial targets, not validated keyword volume or ranking promises.

| Page / priority / own page? | Purpose, audience and search intent | Sections and conversion/CTA strategy | Dependencies |
|---|---|---|---|
| `/work/[slug]` + `/work` — first business expansion; yes | Demonstrate real delivery for owners evaluating risk; project/industry/problem-specific evidence and branded portfolio intent | Detail: context → problem/baseline → role/constraints → solution → screenshots/integrations → verified result → next step. Index: short intro, honest project summaries, detail links. CTA “Discuss a similar challenge” → contact | Approved project artifacts, confidentiality permissions, actual scope and results. One strong detail is better than three invented studies |
| `/privacy` — launch necessity; yes | Transparency for anyone submitting details/using booking; trust rather than acquisition SEO | Business identity/contact, data categories, purposes, providers, retention, rights/request path, update date; link beside intake and in footer, no sales CTA | Actual data map, controller/business details, provider configuration and appropriate legal review; no invented jurisdictional obligations |
| `/legal` — launch disclosure assessment; yes if applicable | Identify the contracting business; branded verification intent | Legal business name/contact and applicable registration/disclosures; footer link, contact for questions | Business/jurisdiction facts and review. Do not copy generic terms or invent registration numbers |
| `/contact` — finish existing page, not a new build | Qualified owners ready to talk; branded contact/developer consultation intent | Best-fit summary, free 30-minute expectations, primary booking, explicit email alternative, load/error/fallback states, privacy link and one footer. CTA completes appointment or enquiry | Chosen tested provider, live availability, receipts, truthful response expectation and accessible embed/fallback |
| `/services` — next after proof/contact; yes | Help SMEs select a solution; custom software, business automation, website/web app service intent | Three service families, fit/problems, concrete deliverables, boundaries, related proof, collaboration/support FAQ, contact CTA per family | Real offerings, scope exclusions, support model and matching examples; unique title/canonical and links to relevant work |
| `/about` — after service clarity; yes when factual content ready | Build personal trust for buyers choosing an independent technical partner; branded/person intent | Short story, experience, skills supported by examples, working principles, portrait, verified profiles, direct collaboration and CTA | Accurate biography, dates/experience, approved portrait, real profiles. Do not duplicate homepage reason cards as entire page |
| Individual service pages — later/conditional; not initially | Distinct buyer/search problems such as custom business software, automation/AI, websites/e-commerce | Specific pains, deliverables, proof, integrations, constraints/FAQ, relevant contact CTA | Distinct content and proof for each, search/customer evidence and maintenance capacity. Avoid seven thin overlapping pages; e-commerce stays under web until demand/proof justify detail |
| `/process` — defer; homepage section now | Explain engagement mechanics to cautious buyers; mainly sales reassurance | Keep four steps, add approved scope/handover/support FAQ on services/contact. Separate page only if methodology/downloadable deliverables become substantial | Factual engagement policies and evidence of sales need; remove absent route link meanwhile |
| `/insights` and articles — defer; no launch page | Build authority via useful technical/business lessons for operators researching problems | Only when sustainable: authored practical articles, examples, date, related services/work and restrained CTA | Editorial owner, real expertise, original examples and updating schedule. Do not publish an empty index or generic SEO filler |

No additional pricing, testimonial-only, tools or industry pages are warranted by current evidence. Pricing guidance can live in services FAQ if a real policy is established. One informative privacy page can cover cookies/provider use if appropriate; do not create a cookie page or banner solely from assumptions about this deployment.

## 11. Implementation Roadmap

### Phase A — Finish Homepage

A1 is implemented; A2 protections are implemented with deployment acceptance pending as recorded above; A3-A8 remain future work. The original audit did not implement fixes.

| Order | Task and dependencies | Acceptance criteria |
|---|---|---|
| A1 ? COMPLETE (source/HTTP; browser pending) | Correct proof/navigation immediately (AUD-01–03/15). Does not depend on new design | No unsupported numerical outcomes; no visible link reaches 404, placeholder or self-link labeled as detail; sections remain discoverable |
| A2 - DB ACCEPTANCE PASS; browser/ingress pending | Resolve custom booking ownership/abuse risks (AUD-07/25); choose public booking strategy | Session-bound lead operations; tested throttling; no reliance on email-only ownership; clear responsibility for Cal vs custom records/reminders |
| A3 | Complete contact/provider verification (AUD-06/16/17/19), dependent on A2 for custom flow | Actual confirmation and receipts, correct timezone/URL, recoverable errors, consistent message limits, fallback contact path; one footer; no real fixture pollution |
| A4 | Accessibility and mobile navigation (AUD-04/05/12/13) | Accessible navigation at small widths; normal text ≥4.5:1; visible focus and useful status announcements; reduced motion yields static experience; keyboard journey complete |
| A5 | Metadata and disclosure foundations (AUD-08–10); depends on business facts and final page set | Privacy/disclosure links present; correct unique canonical/title/OG URL; private utilities noindex; sitemap contains only useful published pages |
| A6 | Restore lint gate (AUD-14) and check content/citations (AUD-18/19) | Lint/TS/build pass; retained stats link to exact evidence; call naming and factual copy consistent |
| A7 | Browser acceptance at six widths (AUD-20), after A1–6 | Capture full homepage and focused Hero/Work/System/About/Contact states; no clipped controls, horizontal scroll, overlapping copy/logos, unreadable metrics or console/hydration errors. Test 200% zoom/reflow, keyboard and reduced motion; fix only evidenced problems |
| A8 | Production launch verification, after A7 | Explicit deployed gate false; root serves full intended content and indexable metadata; live contact/booking smoke test uses approved fixture; assets/OG/robots/sitemap return correct responses; performance evidence recorded |

Viewport verification checklist (all pending):

- [ ] 320px: header fit/navigation, H1 breaks, platform strip, work metric widths, portrait reading order, contact/embed reflow.
- [ ] 375px: complete mobile scroll and contact journey; button wrapping, cards and diagram.
- [ ] 768px: diagram switches layout, portrait minimum-height behavior, section spacing and tablet booking.
- [ ] 1024px: desktop nav appears, Services becomes three columns; verify header/content fit and Work stack.
- [ ] 1440px: Work side intro and secondary split; overlay contrast, metrics and image crop; five problem cards.
- [ ] 1920px: capped containers/gutters, image quality, section edge rhythm and whitespace.

Use representative heights (e.g. 640–900px mobile/desktop and 1024px tablet) plus a short landscape viewport; widths alone do not establish responsive quality. Measure LCP/INP/CLS on the deployed site, distinguishing lab from field data. A good build is not a performance score.

### Phase B — Build Complete Website

| Order | Page / inputs | Acceptance criteria |
|---|---|---|
| B1 | One real `/work/[slug]`, then finish `/work`; approved evidence from section 5 | Detail offers factual role/problem/solution/results with accessible screenshots; index cards open real details; no placeholders; unique metadata/canonical, relevant CTA and sitemap coverage |
| B2 | `/services`; actual deliverables, boundaries and support answers | Three coherent service families with specific fit/examples, relevant work, FAQs and contact path; useful content beyond homepage duplication |
| B3 | `/about`; truthful biography, experience, portrait and profiles | Specific personal evidence and direct-work expectations; real profile destinations; no unsupported credentials; clear next action |
| B4 | Consolidate cross-page navigation/content conventions as pages land | Shared header/footer/Container, approved buttons/focus rules, same typeface/tokens; route-aware active state; no empty destinations; all layouts verified across six widths |
| B5 | Conditional service landing pages or insights only after customer/search evidence | Each page serves a distinct intent, has original useful content/proof, an owner/update plan and internal links; no thin pages added merely for size |

Privacy/legal and contact completion belong to Phase A as launch prerequisites, not work postponed behind optional content. Reuse Container, established layout/CTA patterns, service taxonomy, accessible ProjectTag/metric patterns, figure semantics and factual process steps. Extract reusable page intro, project summary, proof/FAQ and metadata helpers only where multiple pages actually need them; do not start with a speculative design-system rewrite.

SEO foundation per new page: unique title/description, self-canonical and correct OG URL; appropriate index/noindex; meaningful H1/H2 structure; accessible/optimized assets; internal links from relevant service/work content; sitemap inclusion only after completion; truthful structured data where useful. Search-market/language strategy remains a business input; current implementation is English-only and does not establish regional keyword demand.

## 12. Final Recommended Next Action

Phase A1 is complete in source/HTTP verification: dead/placeholder destinations and unsupported metrics are resolved. Real PostgreSQL A2 acceptance now passes. Complete browser/ingress acceptance and begin isolated Phase A3 contact/booking verification; production release remains gated. Keep the established visual direction. Capture rendered evidence before changing layout details.

**Next page to build: one evidence-backed `/work/[slug]` case study, followed immediately by completing the existing `/work` index.** This fills the largest missing sales asset and makes the current proof CTAs meaningful. Privacy/business disclosure and existing contact functionality are launch prerequisites, not optional expansion. If no real project evidence is available, publish honest clearly labeled demonstrators without client claims and defer case-study labeling until substantiated.
