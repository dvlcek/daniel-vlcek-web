# Release candidate RC1 - 23 October 2026

**DONE: one local reproducible release branch. NOT READY for production.**

- Branch: `release/danielvlko-rc1`.
- Worktree: `C:/Users/danko/Desktop/daniel-vlcek-web/danielvlko-rc1`.
- Exact tested application snapshot: `1f4a4f4812becf3f9ab07c4223643d35c72e8d29`.
  A6.1 retains every application/test/migration blob from this A5 snapshot; the
  only additions/changes are release documentation/evidence, scan policy,
  staging-only Prisma CLI config and Next-generated production type imports.
- Final release commit: use `git rev-parse release/danielvlko-rc1` (also recorded
  in the delivery handoff). Its own SHA cannot be embedded in a file it commits.
  Before any approved push/deploy, pin that exact SHA rather than the moving name.
- Fresh remote main check: `952bc8faea1ea02ec9ca78acc8ec133025e1ddc1` using
  `git ls-remote origin refs/heads/main`; no push/fetch/main mutation.
- Integration preserved at `c409c186537a7e2a51649d7c7d562b27dc2d588a`.
- Backups preserved: `backup/integration-a5-20261023` at the tested snapshot above,
  and `backup/a1-a4-pre-a5-20261023` at `0386fe7540da34bee96ea14dc9c46e1f3d32b5cd`.
- [Source evidence](audits/a61-source-verification.json),
  [complete remote-main-to-RC changed path list](audits/a61-release-files.txt).
  The A5 list contains exactly 82 changed paths; all matched working-tree Git
  blob hashes before RC creation. Integration HEAD alone was not the latest source.

Original work remains recoverable; no branch overwritten, no reset/rebase/force push,
no production database contact, no Docker, no deployment/settings mutation or real
provider action occurred. `.env.local` is unchanged and absent from RC. The safe
`.env.example` template is included. Original index is unstaged. RC was tested with
its own clean npm ci and without copying local environment files or node_modules.

## Secret scan - PASS

Gitleaks v8.30.1 was downloaded from its official release with release-asset SHA-256
verified. Default rules scanned the full candidate tree, release history since
origin/main and full reachable candidate history. Initial finding: generic-api-key
at src/lib/privacy.ts line 1, reviewed as a public localStorage preference key.
`.gitleaks.toml` permits only that exact value AND file path AND rule; default rules
remain enabled. All three reviewed scans exit 0 with zero findings. Supplemental
exact matching of 10 locally held credential values against 435 historical blobs
found no matches; values were never printed or put into evidence.

The final tree/history is rescanned after A6.1 additions. See
[secret evidence](audits/a61-secret-scan.json) and finalization evidence. Signature
scanning cannot prove no private content exists. Review found synthetic test
addresses/data, no customer dump/credential environment file in RC; existing public
business contacts remain public. No real secret was identified, no rotation or
history rewrite was performed. Recheck if any candidate content/history changes.

Reproduce with the same pinned scanner version from official checksum-verified assets:

```powershell
gitleaks dir . --config .gitleaks.toml --redact=100 --no-banner
gitleaks git . --log-opts="origin/main..release/danielvlko-rc1" --config .gitleaks.toml --redact=100 --no-banner
gitleaks git . --log-opts="release/danielvlko-rc1" --config .gitleaks.toml --redact=100 --no-banner
```

Run directory scans in a clean exported tree without ignored .env/node_modules/
.next files. Never publish unredacted scanner reports. Existing local secrets are
not release content. If any real secret is found later, block push, identify only
path/rule safely, rotate the affected provider/DB/admin/security credential and
review history handling with the owner; do not automatically rewrite history.

## Reproduction and quality result

Node v24.18.0 / npm 11.16.0. Run from a clean RC checkout/worktree, with no application
or provider credentials loaded. Build before standalone TypeScript so generated
Next route declarations exist. Prisma validation uses an offline dummy connection;
it is not a migration or connectivity proof.

| Command | Final result |
|---|---|
| npm ci --no-audit | PASS: actual clean install, lockfile unchanged |
| npm run lint | PASS: full ESLint; staging config also checked |
| npm run build | PASS: Next 16.4.2 production build |
| node node_modules/typescript/bin/tsc --noEmit | PASS |
| node node_modules/prisma/build/index.js validate | PASS: offline dummy DATABASE_URL/DIRECT_URL |
| npm run test:security | PASS 19/19; clean-env rerun below |
| npm run test:booking | PASS 5/5 |
| node --import tsx --test tests/booking-reminders.test.ts | PASS 5/5 |
| node --import tsx scripts/check-privacy.ts | PASS |
| node --import tsx scripts/check-contact-tracking.ts | PASS |
| Local production HTTP route/link check | PASS: 12 routes and 22 internal destinations/fragments |
| npm audit --omit=dev --json | PASS: 0 findings |
| npm audit --json | FAIL/open: 5 high development-only braces-chain entries |
| npm run test:security:postgres | NOT VERIFIED: no isolated Neon target; existing Docker fixture prohibited |
| npm run test:acceptance | NOT VERIFIED: browser surfaces/isolated fixture unavailable |
| Offline staging config safety checks | PASS 4/4: missing opt-in, invalid URL, pooled refusal, schema validation |

The initial security run set inherited BOOKING_FROM_EMAIL to an empty string,
disabling its nullish fallback; two email-count assertions failed. This was an
orchestration error. Removing inherited app variables in the isolated worktree
restored the intended fixture; all 19 pass without product/test changes. Initial
and final evidence are preserved; no failing attempt is counted as final acceptance.

[Quality evidence](audits/a61-quality-gates.json),
[final security evidence](audits/a61-security-final.json),
[route evidence](audits/a61-route-checks.json),
[staging config evidence](audits/a61-staging-config-tests.json).

Native BookingWizard/A2 protections/mobile menu/A4 focus, contrast and motion changes
are preserved byte-for-byte from A5. No Cal.com reintroduction or fabricated metric
was added. Existing featured metrics are qualitative; independent outcome/permission
substantiation remains an owner publication task. Rendered internal links/fragments
pass, but HTTP checks are not interaction tests. A4 Chromium screenshots/14-case
results are historical, not new RC1 acceptance. Actual keyboard/200% zoom/consent/
booking expiry/tabs/admin/management regression and human screen-reader approval
remain NOT VERIFIED because browser access is unavailable.

The five-high dev advisory remains open with the A5 documented compensating
controls. A named security/release owner must accept the risk or adopt a compatible
upstream patch and rerun gates. No forced fixes, upgrades or suppressed audit result.

## Eight release execution gates

Gates are sequential. A later gate is never implied by a prior local PASS.

| Gate | Required approval/evidence | Current status |
|---|---|---|
| 1 | Reviewed release snapshot/inventory + secret scan PASS | PASS local; final SHA in handoff |
| 2 | Empty/synthetic isolated Neon staging verified + migration/DB acceptance | BLOCKED: owner target missing |
| 3 | Vercel Preview isolation/secrets/origins/ingress/protection verified | BLOCKED: owner setup/evidence missing |
| 4 | Explicit staging deployment approval for pinned SHA/project/effects | BLOCKED: not authorized |
| 5 | Authorized live Google/Resend/cron tests PASS with cleanup | NOT VERIFIED; blocked by Gates 2-4/test-write approval |
| 6 | Human legal and manual accessibility approvals | BLOCKED |
| 7 | Production configuration, backup/restore and migration plan approved | BLOCKED |
| 8 | Explicit production cutover approval | BLOCKED; no production execution in A6.1 |

Detailed executable [staging instructions](STAGING_SETUP.md) cover the exact
variable names, Neon opt-in migration commands, provider setup/acceptance/cleanup,
Preview auto-deployment hazards, cron isolation and recovery. Existing production
sequence/rollback limitations remain in [release checklist](RELEASE_CHECKLIST.md).

## Concise legal handoff

**A. Technically verified facts**

- [x] Legal drafts/noindex/reviewed=false retained; source still uses native booking.
- [x] Source data map: booking -> PostgreSQL -> Google event description/Meet ->
  Resend confirmations/reminders, admin; contact email and guarded optional telemetry.
- [x] Ownership expiry, rate storage, consent/withdrawal code and mocked controls
  verified. These are not processor contracts or live deployment proof.

**B. Operator information requiring confirmation**

- [ ] Current full company address/court/register/tax/VAT details; phone disclosure
  decision and monitored contact; no invented phone or Austrian registration.
- [ ] Actual provider entities/accounts/regions, DPAs/subprocessors, mailbox and
  transfers; real retention/deletion/log/backup practices and rights-handling owner.
- [ ] B2B/consumer availability, target countries/languages and case-study permissions.

**C. Legal decisions requiring human approval**

- [ ] Approve purposes/bases/legitimate interests, consent/storage disclosures,
  transfer safeguards and retention/rights procedures against actual operations.
- [ ] Resolve Slovak phone/contact duty and Austrian targeting/consumer/media/ADR
  applicability; approve any terms/pre-contract information and final exact notices.
- [ ] Record reviewer/date/text revision; only a separately approved later change
  may set reviewed=true/remove draft warnings/noindex. Automated checks do not
  establish legal compliance. Full existing checklist: audits/a5-release-review.md.

## Recovery and next action

Inspect preserved refs with git show; recover into a new worktree. Do not reset the
original dirty integration tree. RC1 is reproducible from its pinned commit using
npm ci. Before pushing, confirm auto-deployment is safely isolated and all approvals
for that action are explicit. A future approved push must name only this release ref,
never main, and never force. No push command has been executed.

Cloud recovery requires the isolated restore drill in STAGING_SETUP.md, measured
RPO/RTO and a known compatible app/schema pair. An application rollback does not
undo DB writes, emails or Calendar events; reconcile providers and pending bookings.
Holding mode does not freeze booking writes. Preserve A2 security on rollback.

**Next owner actions:** create the isolated empty Neon project/database/role; supply
its verified identity securely; configure protected Vercel Preview without production
secrets/auto-deploy hazards; designate staging Google/Resend accounts and safe
recipients; return evidence for Gates 2-3, then authorize a concrete Gate 4 deployment.
Legal/manual accessibility/advisory decisions remain separate required approvals.
