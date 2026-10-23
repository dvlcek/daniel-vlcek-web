# Release checklist - Phase A5 - 23 October 2026

**Production verdict: NOT READY.** This is a reviewable runbook, not authorization
for a deployment, migration, push, provider write or legal publication.

PASS = observed in current local evidence. PARTIAL = source or mock coverage with
operational work outstanding. BLOCKED = a required input/access/approval is missing.
NOT VERIFIED = no acceptance evidence. Historical A4 results are explicitly labeled.

## Release owner and evidence

Before execution assign named owners for release/rollback, database, provider
reconciliation, legal approval and accessibility. Record candidate SHA, environment,
timestamp, result and reviewer against each checkbox. Do not put credentials, raw
customer payloads, management links or OAuth tokens in tickets/logs/screenshots.

| Area | A5 status | Evidence / outstanding acceptance |
|---|---|---|
| Local code quality | PASS | a5-quality-gates.json, a5-build.json; reminder evidence below |
| Production dependency audit | PASS | a5-dependency-production.json: zero findings |
| Full dependency audit | PARTIAL / open failure | a5-dependency-full.json: five high dev-only entries |
| Neon migration execution | BLOCKED | No explicitly isolated Neon test target; no DB contacted |
| Vercel preview/environment | NOT VERIFIED | No external deployment/settings inspection or change |
| Native booking | PARTIAL | 19 security + 5 calendar + 5 reminder mock tests pass |
| Live Google/Resend acceptance | BLOCKED | Dedicated targets and explicit write authorization needed |
| Legal approval | BLOCKED | Drafts, missing decisions and no human sign-off |
| A5 browser/manual accessibility | BLOCKED | No enabled browser; A4 evidence retained as historical |
| Recovery drill | NOT VERIFIED | Git checkpoint exists; deployed app/DB restore untested |

Evidence paths below are relative to docs; detailed findings are in
[a5-release-review.md](audits/a5-release-review.md).

## 1. Pre-deployment and Git backup

- [ ] Verify `git branch --show-current` is `integration/website-launch-sync`;
  original HEAD is `c409c186537a7e2a51649d7c7d562b27dc2d588a`. Do not change main.
- [ ] Inspect `git status --short`, `git diff --check`, `git log origin/main..HEAD`
  and the exact candidate tree. Cached origin/main was two commits behind HEAD;
  no fetch was performed, so current GitHub synchronization is NOT VERIFIED.
- [ ] Review [exact backup file list](audits/a5-backup-files.txt). It contains the
  preserved A1-A4 changes and A5 additions. `.env.example` is a nonsecret template;
  `.env.local`, `.vercel`, credentials and generated `next-env.d.ts` are excluded.
- [ ] Local recovery branches: `backup/a1-a4-pre-a5-20261023` and
  `backup/integration-a5-20261023`. Inspect with `git show --stat <branch>` and
  `git diff HEAD <branch> --`. Recover into a new worktree rather than resetting
  the existing dirty integration worktree. The tracked pre-A5 patch in
  `.git/a5-recovery/pre-a5-tracked.patch` also preserves the template/generated diff.
- [ ] Run an approved secret scanner over the candidate tree AND commits to be
  pushed. The A5 bounded pattern scan is supplementary, not a complete scanner.
  Inspect binaries/screenshots and URLs for accidental sensitive material too.
- [ ] After explicit push approval only, push the reviewed backup ref explicitly:
  `git push origin backup/integration-a5-20261023:backup/integration-a5-20261023`.
  This command was NOT executed. Recheck SHA/file list first; no force push.
- [ ] Agree ownership/acceptance for the open dev-tool advisory (see review), or
  install a compatible upstream fix once published and rerun gates. Do not suppress
  the full audit or use `npm audit fix --force`.
- [ ] Obtain legal approval, isolated DB rehearsal, accessibility acceptance,
  provider/recovery evidence and staging configuration review before production GO.

## 2. Isolated Neon migration rehearsal

**BLOCKED until an explicitly identified non-production target is supplied.**
Do not infer isolation from a URL hostname or database name. Confirm in Neon the
organization/project/branch/endpoint/database/role, region, owner, access restrictions,
expiration, and that it is schema-only/empty or contains synthetic fixtures only.
A normal branch can include production data; use schema-only or a synthetic parent.
Do not reuse local application DATABASE_URL/DIRECT_URL as proof of isolation.

Migration order (lexicographic timestamps; five migrations):

1. `20260913222615_booking_foundation`: enums, Lead/Booking/availability, indexes/FK.
2. `20260913224449_booking_active_slot_guard`: nullable unique activeSlotKey.
3. `20260914072756_booking_calendar_metadata`: nullable calendar URL and Meet URL.
4. `20260914092935_add_booking_schedule_changed_at`: nonnull schedule timestamp
   defaulted to migration time for old rows; not reconstructed historical time.
5. `20261012210000_booking_ownership_and_rate_limits`: new BookingAttempt and
   SecurityRateLimit tables, unique token/lead keys, expiry indexes and FKs.

- [ ] Record schema baseline, migration history/checksums, counts and synthetic
  legacy records before rehearsal. Do not edit an already applied migration.
- [ ] Rehearse both an empty database (all five) and a synthetic legacy database
  with the first four migrations and existing lead/booking records (apply fifth).
  A schema-only clone of a fully current schema does not test the upgrade path.
- [ ] Inject BOTH DATABASE_URL and DIRECT_URL for the approved isolated target in
  a short-lived process. DIRECT_URL must be direct; runtime DATABASE_URL pooled.
  `prisma.config.ts` loads local dotenv but existing process variables take priority;
  never leave DIRECT_URL unset and accidentally select a local/production value.
  Avoid command-line URL literals, shell history and connection-string logging.
- [ ] Run, from the reviewed checkout, with that environment:

```powershell
node node_modules/prisma/build/index.js validate
node node_modules/prisma/build/index.js migrate status
node node_modules/prisma/build/index.js migrate deploy
node node_modules/prisma/build/index.js migrate status
```

- [ ] Require all five applied with no failed/unfinished history. Confirm old
  synthetic records/relations survive, new indexes/constraints exist, and runtime
  Prisma 7.10.1 queries succeed through the pooled endpoint.
- [ ] Exercise ownership, forbidden cross-browser/expired attempts, atomic quotas,
  same-attempt retry, slot races, reschedule conflicts and bounded cleanup against
  this isolated database. Preserve sanitized results and migration duration.
- [ ] Current `test:security:postgres` / `test:acceptance` are Docker-only and
  `tests/prisma-acceptance.config.ts` explicitly rejects remote targets. Do NOT run
  them for A5, bypass their safety checks or claim they tested Neon. A reviewed
  Neon-specific guarded harness or supervised staging journeys is required.
- [ ] Clean up only tagged synthetic fixtures and authorized isolated branch resources.
  Do not use `scripts/reset-booking-data.ts` on a shared or unidentified database.

Schema limitations: nullable slot keys permit multiple NULLs; the index is not a
Postgres interval exclusion constraint. Application overlap checks/transactions and
Google availability remain essential. Legacy rows may have NULL activeSlotKey;
inspect active bookings before launch rather than inventing a backfill. No DB CHECK
constraints enforce all business-hour/duration rules. The A2 migration adds tables
without deleting Lead/Booking; deleting a Lead cascades to bookings/attempts and
must follow an approved retention process. Expired ownership cleanup does not erase
leads, correspondence, calendar events, emails or backups.

Useful read-only checks, run only after target authorization/identity verification:

```sql
SELECT current_database(), current_user;
SELECT migration_name, finished_at, rolled_back_at
FROM "_prisma_migrations" ORDER BY started_at;
SELECT tablename, indexname FROM pg_indexes
WHERE schemaname = 'public' ORDER BY tablename, indexname;
SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint
WHERE conrelid IN ('"BookingAttempt"'::regclass, '"Booking"'::regclass);
SELECT count(*) FROM "Booking" WHERE status IN ('PENDING','CONFIRMED')
AND "activeSlotKey" IS NULL;
```

## 3. Production database sequence (future authorized operation only)

- [ ] Pin approved application and migration SHAs. Obtain explicit migration and
  release approval; identify production independently of staging and local files.
- [ ] Confirm restore window, recovery point, encrypted backup access and a tested
  restore into an isolated target. Record RPO/RTO and responsible operator.
- [ ] Inspect actual production migration status/checksums and schema drift.
  If a schema exists without valid Prisma history, stop for a reviewed baseline;
  do not run foundation CREATE TABLE blindly or mark migrations applied blindly.
- [ ] Temporarily restrict booking/contact writes with actual deployment protection
  or a reviewed maintenance mechanism. COMING_SOON_ENABLED is NOT a write gate:
  /contact, booking management, admin and APIs remain accessible in holding mode.
  Pause reminder invocations during migration/reconciliation.
- [ ] Apply additive migrations using the direct production endpoint only after
  the identical isolated rehearsal passes. Use the commands in section 2 under
  separately approved production credentials. Never use migrate dev/reset/db push.
- [ ] Check schema/history/records/constraints, deploy the approved app with pooled
  runtime access, verify ownership/rate-limit queries and then reopen writes.
- [ ] On failure stop writes and investigate migration history. Prisma has no
  automatic down migration. Do not drop security tables, reset the DB or mark a
  failed migration resolved without a reviewed recovery plan.
- [ ] Prefer a compatible application rollback while retaining additive schema;
  verify the older app's ownership/security behavior before selecting it. A1/A2
  safeguards must not be bypassed by rolling back to an unsafe pre-A2 app.
  Database restore loses/replays writes after the recovery point and does not undo
  Calendar/Resend actions: reconcile external events and messages separately.

## 4. Vercel staging configuration

Use a protected Preview deployment or a separately isolated staging project. Confirm
Git auto-deploy behavior before an approved backup push: pushing can itself trigger
an external deployment. No Vercel settings or deployment were changed by A5.

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

VERCEL is a platform runtime marker, not an application secret. NEXT_PUBLIC_CAL_LINK
is stale local configuration, unused by current source; no Cal.com variables are
required. VERCEL_OIDC_TOKEN is local tooling state, not an app requirement. No values
were printed. Local .env.local lacks SECURITY_RATE_LIMIT_SECRET and
SECURITY_ALLOWED_ORIGINS; presence of other names is not validation of their values
or remote availability. Local environment file hash is unchanged.

- [ ] Confirm Next.js framework, supported Node version matching the tested local
  Node/npm versions in evidence, install lockfile with npm ci, build `npm run build`,
  server routes on Node runtime, project root, function limits and region near DB.
- [ ] Confirm Preview secrets cannot select production DB/provider accounts. Do not
  inherit production integration credentials into arbitrary branch previews.
- [ ] Exact preview origin changes require updating the allowlist and rebuilding/
  redeploying where needed. Do not weaken guards with broad wildcard origins.
- [ ] Verify ingress by forging forwarded headers against authorized staging only;
  prove Vercel overwrites the trusted header. Do not trust arbitrary XFF/Real-IP.
- [ ] Pool is bounded at max 5 per runtime, 5s connect/10s statement timeout/30s idle;
  aggregate instances still multiply connections. Load-test Neon quotas/cold start
  and verify lifecycle on the selected Vercel compute; no pool attachment change
  was made without evidence of its need.
- [ ] Protect ALL preview paths from public indexing/access at the hosting layer.
  siteConfig.url/canonical/robots remain production URLs by design. Draft legal
  noindex does not protect the whole preview, and noindex is not authorization.
- [ ] Review domain ownership, apex/www canonical redirects, HTTPS certificate,
  DNS records/TTL, existing mail MX/SPF/DKIM/DMARC and OAuth callback settings.
  Preserve mail DNS. Do not switch DNS during rehearsal.

## 5. Cron acceptance and recovery

There is no committed vercel.json/cron schedule. Handlers alone do not establish
scheduling. Vercel cron requests target production deployments, so a normal Preview
needs an approved manual request or an isolated staging project scheduler. Confirm
plan frequency/duration limits before configuring. Proposal for review (not applied):
booking-reminders every five minutes UTC; security-cleanup hourly UTC. A daily-only
schedule cannot meet the 30-minute reminder requirement.

- [ ] Configure scheduler authorization, monitoring, timeout and one active worker.
  Verify missing/wrong auth rejection on staging; never expose secrets in URLs/logs.
- [ ] Cleanup deletes at most 5,000 expired attempts and 5,000 rate rows per run;
  rate rows must be expired for more than a day. Monitor backlog; drain additional
  bounded batches as needed. It does not implement business-data retention.
- [ ] 24h reminder requires schedule set at least 48h ahead and a 24h-to-20h window.
  30m reminder requires Meet and retries until the meeting starts. Inspect error
  counts, missingMeetingUrl and email IDs, not just HTTP 200 from the cron route.
- [ ] Five A5 mocked reminder cases verify boundaries, failure retry, missing Meet,
  cancelled/past suppression and sequential replay. Overlap emits two requests
  with the SAME existing Resend idempotency key and only one DB marker wins;
  actual provider deduplication/expiry is NOT VERIFIED. Serialize invocations and
  test real provider behavior before relying on exactly-once delivery.
- [ ] Alert on missed intervals and email/calendar failures. Define manual recovery
  for unsent confirmation: booking replay does not resend the missing email.
  Reconcile pending reservations and uncertain calendar outcomes BEFORE retrying;
  avoid creating a second event or sending contradictory notices.
- [ ] A crash after provider send but before DB write, or a reschedule/cancellation
  between worker read and send, needs controlled staging testing. Conditional DB
  update prevents stale markers, but cannot recall an already sent email.

## 6. Controlled native booking/provider acceptance

Before any external write, record explicit authorization for the staging project,
Google test account/calendar ID, Resend test setup, recipient allowlist, test window,
quota/cost cap and cleanup owner. Use organization-controlled test mailboxes only.
No customer email/attendee/calendar or real customer data may enter this run.

| Scenario | Expected evidence / current local scope |
|---|---|
| Availability / outage / malformed provider result | Valid slots; busy periods excluded; errors fail closed; mocked calendar PASS |
| Timezone / DST | UTC instants and Europe/Vienna across 25 Oct 2026 transition; contract PASS; real calendar display pending |
| Double booking | Two browsers compete for one slot; one reservation/event; in-memory PASS, historical A4 PG PASS; Neon rerun pending |
| Confirmation | One booking + internal event + branded safe-recipient email + ICS + fragment management link + admin row; mocked PASS, live pending |
| Calendar failure / timeout after possible success | No false success; compare DB reservation with remote event before retry; operator reconciliation required |
| Email failure | Confirmed booking survives; flag failure; operator repairs email/management access; replay does not auto-resend |
| Reminders / overlap / missed run | Boundary policies, correct Meet link, provider dedup, counters and retry evidence; five mocked cases PASS, scheduler/live pending |
| Cancellation | Correct owner token, freed slot, event removed and one safe notice; historical mocked browser evidence only |
| Reschedule | Conflict protection, updated DB/event/ICS, reminder occurrence reset and old-slot release; historical mocked browser evidence only |
| Expired sessions / independent tabs | 403 fails closed, new attempt recoverable; no ownership leakage; in-memory PASS/historical browser PASS |
| Refresh / retry | No duplicate booking/event; unsent-email recovery handled separately; in-memory PASS/historical browser PASS |
| Provider recovery | Google/Resend outages then recovery; verify remote/DB state, recipient receipts, pending-booking runbook and no duplicates |
| Admin | Authenticated dashboard matches staging DB; no access without login; status/availability controls and logout checked |
| Quotas / database outage | 429 + Retry-After, atomic persistent limits across instances; 503 without DB/secret; no provider work on rejection |

Collect sanitized IDs/counters/timestamps and delivery receipts, not raw tokens or
customer content. After the authorized test: cancel tagged synthetic events, remove
synthetic DB records under supervision, clear test OAuth/session credentials if
appropriate, and confirm no test reminder remains scheduled. Mock acceptance is
not live provider proof.

## 7. Accessibility acceptance

A4 historical evidence: 14 Chromium cases, six widths, keyboard menu focus/Escape,
confirmation focus/error state, motion preferences, consent and axe scans; zero
confirmed automated violations on tested public states. A5 could not open a browser:
CUA inventory had no browser surfaces and iab creation returned unavailable.

- [ ] Record Chromium/Edge/other installed supported browsers and versions; keyboard
  only: skip link, navigation, mobile menu Tab/Shift+Tab, Escape and focus return.
- [ ] Actual browser 200% zoom and text resizing: public/legal/contact/booking/admin
  reflow and scroll, visible buttons/errors, no obscured focus; also check 320 CSS px.
- [ ] Booking required/email errors announced, focus on invalid field, calendar date
  navigation, async loading/error/retry announcements and confirmation heading focus.
- [ ] Booking/holding dialogs: initial focus, wrapping, Escape, closing return focus,
  scroll restoration, viewport resize and focus visibility above privacy panel.
- [ ] Privacy accept/reject/withdraw/reload/cross-tab/blocked storage; keyboard-open
  settings focuses panel and Escape returns focus. Panel is nonmodal; do not require
  an artificial focus trap unless changing its interaction design after review.
- [ ] OS reduced motion: Earth/parallax/stat transitions and smooth scroll; physical
  touch; image/gradient text contrast and visible focus in all interactive states.
- [ ] Human NVDA/VoiceOver or equivalent acceptance with reviewer/version/notes.
  No A5 manual browser, screen-reader or WCAG conformance claim is made.

## 8. Application release and post-deployment

Execute only after every blocking item is signed off and separately authorized.

- [ ] Confirm staging accepted the exact candidate and approved legal content.
  Only a human-approved later change may set legalDetails.reviewed=true/remove
  draft notices and update legal indexing. A5 leaves them unchanged.
- [ ] Pin the known-good previous deployment AND compatible schema; verify rollback
  access. Separate app rollback, DB restore, secret rotation and provider cleanup.
- [ ] Apply approved schema sequence, deploy app, check function logs without PII,
  origins/ownership/cookies, admin auth, native booking, provider delivery and cron.
- [ ] Set COMING_SOON_ENABLED=false only as the approved public launch step;
  verify /contact/APIs separately because holding mode never disabled those.
- [ ] Check HTTPS, apex/www, /contact, /legal, /privacy, /cookies, redirects, 404,
  robots.txt, sitemap.xml, favicon/Open Graph and route-specific metadata. Private
  routes/API remain noindex. Verify legal indexing matches actual approval state.
- [ ] Inspect live cookies/storage/network before choice, reject, accept and withdraw;
  no telemetry on admin/management and no query/fragment/token leakage or Cal.com.
- [ ] Non-customer smoke booking only within the explicitly authorized provider test
  scope. Verify Calendar/admin/Resend consistency and follow test cleanup plan.
- [ ] Monitor first hour and next reminder cycle: 5xx, 403/429 anomalies, DB latency/
  connections, pending bookings, calendar errors, delivery/bounce/suppression,
  cron missed runs/errors and unexpected telemetry. Assign an on-call owner.
- [ ] Roll back/close intake immediately for ownership bypass, secret exposure,
  duplicate/conflicting bookings, unexplained calendar state, systematic missing
  confirmations/Meet reminders or sustained endpoint/DB failures. Define agreed
  latency/error thresholds before GO. Pause workers and preserve sanitized evidence.
- [ ] Reconcile writes/providers after rollback and repeat smoke tests. No automatic
  destructive database rollback or assumption that an app rollback undoes emails.

## Approval record required before GO

| Approval | Required record | Current state |
|---|---|---|
| Business/legal | Company/tax/contact, processing/retention/transfer decisions, approved text + reviewer/date | BLOCKED |
| Database owner | Isolated Neon rehearsal, production target/history, restore drill and RPO/RTO | BLOCKED |
| Platform owner | Preview isolation, ingress/secrets, domains, cron/plan and rollback verification | NOT VERIFIED |
| Provider owner | Named test accounts, allowed recipients, explicit writes, live acceptance + cleanup | BLOCKED |
| Accessibility reviewer | Browser/zoom/contrast/assistive notes and accepted residual issues | BLOCKED |
| Security/release owner | Secret scan and open dev advisory disposition, exact SHA and GO | PARTIAL |

No approval is implied by this checklist. Recommended next action: supply a verified
schema-only/synthetic Neon test target and the named staging/provider test scope;
then separately authorize the concrete staging deployment/provider writes. Keep
production held until legal, operational and accessibility acceptance are complete.

Sources checked 23 October 2026:
[Neon pooling](https://neon.com/docs/connect/connection-pooling.md),
[Neon branch data/isolation](https://neon.com/docs/introduction/branching.md),
[Vercel cron production targets](https://vercel.com/docs/cron-jobs).
