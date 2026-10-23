# Launch readiness ? 23 October 2026

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

## Validation evidence

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

Existing lint errors:

- `ManageBookingClient.tsx:327`: synchronous effect state; `:1704`: internal home anchor instead of Next Link.
- `AdminTimeSelect.tsx:294,537`: synchronous effect state.
- `BookingWizard.tsx:1091,2807`: synchronous effect state/availability initialization.
- `AnimatedStat.tsx:38`: synchronous effect state.
- Warning: `Hero.tsx:251`, raw image element.

These locations were present before integration; no blanket suppression or unrelated behavior refactor was used to make the gate green.

## Remaining launch blockers and smallest next batch

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
