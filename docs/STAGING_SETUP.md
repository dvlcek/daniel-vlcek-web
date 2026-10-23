# Controlled staging setup - RC1 - 23 October 2026

**NEEDS OWNER ACTION. No cloud deployment or provider write is authorized by this
file.** Use `release/danielvlko-rc1` in the separate `danielvlko-rc1` worktree.
Pin its final SHA using `git rev-parse release/danielvlko-rc1` and the complete
[release record](RELEASE_CANDIDATE.md). Never deploy integration HEAD c409c18.

## Owner execution order

1. Create a **separate empty Neon staging project**, dedicated database
   `dv_rc1_staging` and role `dv_rc1_staging_owner`, independent passwords, an
   appropriate EEA region, restricted team access and an expiration/cleanup owner.
   Do not import a production dump. If branching instead, verify schema-only or
   a synthetic parent; a normal production branch may copy personal records.
2. Record project/branch/endpoint/database/role/region and owner in a private
   operations record. Confirm in Neon UI that the direct and pooled endpoints
   belong to that staging project. Do not infer isolation from endpoint naming.
   Confirm it contains zero customer data and zero existing application tables
   before the empty-database rehearsal. Do not contact any existing local app URL.
3. Follow the migration commands below, capture sanitized history/index checks,
   initialize synthetic availability only, and rehearse restore into another
   isolated target. No staging target is currently supplied or verified.
4. Create an isolated Vercel staging project or protected Preview configuration.
   **Before any branch push**, inspect/disable production-secret inheritance,
   Neon integration defaults and auto-deploy side effects. Confirm no Preview can
   reach the production DB, calendar, email account or admin credentials.
5. Create dedicated staging Google Calendar/OAuth and Resend setup plus an explicit
   safe recipient allowlist. Keep schedulers disabled until their tests are approved.
6. Complete Gates 1-3 in RELEASE_CANDIDATE.md. Request explicit staging deployment
   approval naming the final SHA, project and permitted effects. Only then push/
   deploy the pinned candidate. A push may automatically create a deployment.
7. After deployment, verify protection/noindex, exact HTTPS origins, cookies,
   ingress, admin and route smoke checks. Obtain explicit controlled provider-write
   approval; run the acceptance matrix and cleanup. Do not advance production gates.

## Safe Prisma connection and migration commands

A6.1 supplies `prisma.staging.config.ts`. It never loads dotenv, never falls back to
DATABASE_URL/DIRECT_URL, requires explicit owner isolation confirmation and an exact
verified direct Neon host, and rejects pooled endpoints, wrong role/database and
missing TLS. **These guards cannot prove a cloud resource is non-production.** The
owner must independently verify identity/data isolation before confirming it.

From the RC worktree, after that verification only, enter credentials interactively
in a short-lived PowerShell process (no URL in shell history or documentation):

```powershell
$env:A61_STAGING_DIRECT_URL = [Net.NetworkCredential]::new('', (Read-Host 'Verified staging DIRECT URL' -AsSecureString)).Password
$env:A61_STAGING_DIRECT_HOST = Read-Host 'Verified direct endpoint hostname only'
$env:A61_STAGING_ISOLATION_CONFIRMED = 'yes'
node node_modules/prisma/build/index.js validate --config prisma.staging.config.ts
node node_modules/prisma/build/index.js migrate status --config prisma.staging.config.ts
# An empty target has pending migrations; verify that expected state before deploy.
node node_modules/prisma/build/index.js migrate deploy --config prisma.staging.config.ts
node node_modules/prisma/build/index.js migrate status --config prisma.staging.config.ts
```

Check every exit code and stop on unexpected results. Never use migrate dev/reset,
db push, the default prisma.config.ts or production application URLs for this drill.
After completion remove A61_STAGING_DIRECT_URL, A61_STAGING_DIRECT_HOST and
A61_STAGING_ISOLATION_CONFIRMED from this process with Remove-Item Env:<name>, then
close it. Never use `Get-ChildItem Env:` or print connection values in evidence.

Expected order:

1. 20260913222615_booking_foundation
2. 20260913224449_booking_active_slot_guard
3. 20260914072756_booking_calendar_metadata
4. 20260914092935_add_booking_schedule_changed_at
5. 20261012210000_booking_ownership_and_rate_limits

Repeat separately on a synthetic legacy baseline containing migrations 1-4 and
synthetic records before applying 5; do not pretend an already-current schema tests
an upgrade. Do not edit applied migration files. Record counts/relations before and
after. A2 is additive, creates attempts and persistent rate limits, and does not
purge Lead/Booking. Existing schedule timestamps/NULL slot keys need the legacy
checks described in RELEASE_CHECKLIST.md. Runtime uses the pooled staging URL.

Use the authenticated staging SQL console after identity verification to run the
read-only schema/history/index/constraint checks in RELEASE_CHECKLIST.md section 2.
Require all five migration rows finished, correct foreign keys/unique token/lead/
slot indexes and expiry indexes. Verify a synthetic row survives the upgrade.

## Isolated acceptance instructions

The current PostgreSQL and Chromium suites require a runner-owned loopback Docker
fixture and explicitly reject remote Neon. No Docker or target-guard bypass is
permitted here. They were NOT run; A4 results are historical. A Neon-specific harness
must preserve those safeguards, or use supervised protected staging journeys below.
Do not point A2_TEST_DATABASE_URL at a remote URL and claim existing-suite acceptance.

After a separately authorized staging deployment/provider test scope:

| Test | Exact journey and required evidence |
|---|---|
| Ownership | Browser A enters synthetic intake; independent browser B tries A's attempt/lead with B cookie jar; require 403, no row/provider mutation. Missing/tampered/expired cookie also 403 |
| Concurrency | Two independent browsers choose the same available slot and confirm together; one success, one conflict, exactly one active reservation/event. Repeat same-attempt concurrent confirm and refresh; no second event/email |
| Persistence | Send availability requests above configured per-network limit (60/min) from approved test clients; require 429 + Retry-After. Verify counts across two app instances, forged XFF does not reset identity, and reset after window |
| Other quotas | Exercise intake/confirm/manage/contact/admin login thresholds from RATE_POLICIES in src/lib/security/rate-limit.ts, using only synthetic addresses and approved quota. Rejections must precede outbound provider work |
| Expiry/retry | Advance only synthetic attempt expiry in isolated DB or wait one hour; intake/confirm rejects old ownership, fresh attempt succeeds; two tabs remain independent |
| Storage failure | Disable only the isolated staging DB endpoint under explicit drill approval; APIs fail closed and do not call providers. Restore endpoint and confirm recovery |
| Schema/cleanup | Before/after counts for Lead/Booking; expired synthetic attempts/rate rows removed in bounded batches by authenticated cleanup; live attempts remain |

These are acceptance requirements, not executed results. Capture timestamps, counts,
status codes, synthetic record IDs and reviewer; exclude capabilities/customer data.
Reset only the dedicated disposable target or delete the exact tagged synthetic
IDs after reviewing cascade effects. `scripts/reset-booking-data.ts` is not a safe
general cleanup command. Never truncate shared tables or reset production.

Recovery drill: record a staging recovery point, create a tagged synthetic booking,
restore into another isolated endpoint, compare schema/history/record counts, and
measure RPO/RTO. Verify the prior compatible app can use the retained additive schema.
App rollback does not undo sent emails/calendar events. Reconcile tagged events,
cancel them through the staging account and prevent leftover reminders. Prefer a
reviewed forward repair to destructive down-migrations. Keep both original Git
backups and integration branch intact.

## Preview environment names and requirements

| Variable name | Actual requirement |
|---|---|
| DATABASE_URL | Required for booking, admin data and persistent security limits (including contact/login); pooled Neon runtime URL with TLS |
| DIRECT_URL | Preferred for Prisma CLI; optional if DATABASE_URL is direct. Not needed by app runtime; explicitly bind during migrations |
| SECURITY_RATE_LIMIT_SECRET | Required by protected endpoints; at least 32 characters, environment-specific random secret |
| SECURITY_ALLOWED_ORIGINS | Required in production mode, including Preview; comma-separated exact HTTPS origins, no paths/wildcards/trailing slash |
| SECURITY_TRUST_PROXY | Optional. `vercel` works only with VERCEL=1 and trusted overwritten x-vercel-forwarded-for; blank falls back to a shared restrictive network quota |
| CRON_SECRET | Required for scheduled workers; choose 32+ characters (cleanup enforces length). Scheduler sends Bearer header |
| RESEND_API_KEY | Required for contact/booking emails; staging-only credentials and approved test recipients |
| CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL | Both required for enquiry API; verified sender, isolated owner recipient |
| BOOKING_FROM_EMAIL | Booking sender; falls back to CONTACT_FROM_EMAIL only when unset (empty string is not equivalent) |
| BOOKING_REPLY_TO_EMAIL | Optional for reminders; confirmation organizer fallback if BOOKING_ORGANIZER_EMAIL unset |
| BOOKING_ORGANIZER_EMAIL | Confirmation ICS requires this OR BOOKING_REPLY_TO_EMAIL |
| BOOKING_MANAGE_SECRET | Required for management signing/reminders; 32+ characters; rotation invalidates signed access |
| GOOGLE_CALENDAR_CLIENT_ID / GOOGLE_CALENDAR_CLIENT_SECRET / GOOGLE_CALENDAR_REFRESH_TOKEN | Required for integrated Google booking; staging account/token only |
| GOOGLE_CALENDAR_ID | Defaults to primary if unset; explicitly select a dedicated isolated calendar in staging |
| GOOGLE_CALENDAR_REDIRECT_URI | Used by manual OAuth bootstrap script, not runtime refresh; do not execute auth script unattended |
| ADMIN_PASSWORD / ADMIN_SESSION_SECRET | Required for admin login; session secret at least 32 characters; strong unique staging password |
| SITE_URL | Recommended absolute canonical base for generated management links; set staging base on staging to avoid production management links |
| NEXT_PUBLIC_SITE_URL | Optional fallback for management links only; never store secrets in public-prefixed variables |
| COMING_SOON_ENABLED | Full site only for literal `false`; absent/other values enable holding gate. Set separately per deployment |


Additional **local staging CLI only** names: A61_STAGING_DIRECT_URL,
A61_STAGING_DIRECT_HOST, A61_STAGING_ISOLATION_CONFIRMED. Never put their connection
value into NEXT_PUBLIC variables or commit it. VERCEL is supplied by the platform;
VERCEL_ENV should identify the selected deployment environment. NEXT_PUBLIC_CAL_LINK
and VERCEL_OIDC_TOKEN are not application requirements. No Cal.com configuration.

- Scope each secret to the isolated project/Preview environment; never inherit
  production DATABASE_URL/DIRECT_URL/Google/Resend/admin/security/management secrets.
- Set SITE_URL to the protected staging origin. Exact same-origin guards also
  require Origin to equal the request destination; a custom alias and the Vercel
  deployment hostname each need their own approved HTTPS allowlist entry.
- Set SECURITY_TRUST_PROXY=vercel only after verified Vercel overwriting of
  x-vercel-forwarded-for; verify platform VERCEL=1. Otherwise the restrictive shared
  quota is intentional. Spoofing XFF/Real-IP must not bypass limits.
- Production-mode ownership cookies are Secure/HttpOnly/SameSite Strict with
  __Host- names and one-hour TTL. Test real HTTPS, independent jars, refresh and expiry.
- Use strong separate admin credentials; protect preview at hosting layer, restrict
  dashboard access and confirm logout/session expiry. Do not copy production cookies.
- Keep analytics projects/data separate; reject optional measurement during staging
  unless explicitly testing it. Inspect no requests before consent/after withdrawal
  and none on admin/management. Do not contaminate production analytics.
- Require hosting protection for **all** preview routes plus X-Robots-Tag: noindex
  on HTML responses, verify /robots.txt and sitemap behavior. Application canonical/
  sitemap URLs intentionally still name production; do not change approved public
  SEO just to secure preview. Draft legal noindex is retained but does not protect
  the rest of staging. Authentication, not robots rules, protects staging data.
- COMING_SOON_ENABLED=false exposes full staging UI; true/missing still permits
  contact/APIs/admin/management. It is not a deployment protection/write-freeze switch.
- Verify Node 24/npm 11 compatibility, Next.js root/build command, region, function
  duration, database pool limits and rollback access. Match actual versions in RC
  evidence; do not enable a production migration as an implicit build hook.

## Dedicated provider and cron acceptance

Required approval record: pinned deployment SHA/URL, Google account/calendar,
Resend test setup/sender, recipient allowlist, permitted writes, time window, quota,
cleanup owner and outage simulation method. Production credentials forbidden.

1. Read staging availability; verify UTC/Vienna DST and conflict exclusion against
   tagged events. Create one synthetic call: one internal Calendar event/Meet,
   no customer attendee, one DB booking and safe-recipient confirmation with ICS
   and fragment management URL. Confirm template dates/timezone and admin visibility.
2. Compete for a slot, cancel and reschedule; verify old/new slots, event update/
   deletion, corresponding emails, new reminder occurrence and ownership checks.
3. Simulate a rejected Calendar request in the dedicated setup, then recovery.
   For an uncertain timeout, reconcile remote event and DB before retrying. Do not
   create another event blindly. Document interrupted-finalization recovery.
4. Simulate Resend failure, require confirmed booking retained and an explicit
   failed-email indication. Confirmation replay does not auto-resend; rehearse the
   approved operator resend/management-access recovery before declaring PASS.
5. Verify sequential and overlapping reminder invocations with existing deterministic
   Resend idempotency keys; actual receipt count must be one within provider policy.
   Test timeout-after-acceptance and provider idempotency expiry/retention policy.
6. Cron authentication: no/wrong Bearer secret rejected; approved secret accepted.
   Inspect result error counters, not HTTP 200 alone. Verify 24h eligibility/window,
   30m Meet delivery, missing-Meet repair, safe retry, stale schedule suppression,
   and no sends after cancellation/start. A worker can send before a concurrent
   schedule change is noticed; test and approve the operational response.
7. Keep Preview cron off by default. There is no committed schedule. Vercel cron
   targets production deployment of its project, not a regular Preview; if needed,
   use an isolated staging project or approved manual calls. Proposed cadence for
   review: reminders every five minutes, cleanup hourly, UTC, single active worker;
   verify plan support. No scheduler may reference production data/credentials.
8. Capture sanitized receipts/event IDs/counters, then cancel tagged staging events,
   remove only synthetic DB records, clear test sessions and confirm no reminder
   remains due. Keep approval/evidence records without raw tokens or personal data.

Manual browser/zoom/screen-reader acceptance and the A/B/C legal handoff are in
RELEASE_CANDIDATE.md and RELEASE_CHECKLIST.md. No cloud operation in this runbook
has been executed. Gate failures stop progression; they are not waived by local tests.
