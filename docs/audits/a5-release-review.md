# A5 release review - 23 October 2026

**NOT READY for production.** Safe local preparation complete within available
access; Neon execution, deployment, provider writes and human acceptance are not
implied. No Docker, production connection/migration, external deployment, Git push,
email delivery or Calendar write was performed. No visual redesign, dependency
upgrade, legal publication or main-branch change was made.

## Preservation and scope

Working branch: integration/website-launch-sync at c409c186537a7e2a51649d7c7d562b27dc2d588a.
Cached origin/main: 952bc8faea1ea02ec9ca78acc8ec133025e1ddc1; 0 behind / 2 ahead.
No fetch: remote freshness is NOT VERIFIED. No applicable AGENTS.md was found in
the repository or its ancestor directories. The A1-A4 dirty files were preserved.
Pre-A5 checkpoint: backup/a1-a4-pre-a5-20261023 at
0386fe7540da34bee96ea14dc9c46e1f3d32b5cd (temporary Git index; actual index untouched).
It excludes the nonsecret .env.example/generated next-env.d.ts diff, which remains
recoverable in .git/a5-recovery/pre-a5-tracked.patch and the working tree. Final
backup/integration-a5-20261023 includes the safe .env.example template and all
reviewed A1-A5 changes; inspect its exact files in a5-backup-files.txt. Generated
next-env.d.ts remains local. No secrets/local environment files are included.
A5 leaves .env.local byte-identical; recorded hash comparison PASS.

A5 changes: release/legal/launch/audit documentation, sanitized evidence, and five
mocked reminder tests. Existing feature/UI code and legalDetails.reviewed=false
are untouched. All actual-page draft notices/noindex remain.

## Development dependency disposition

Fresh registry audit and installed tree (a5-dependency-full.json,
a5-dependency-production.json, a5-dependency-paths.json): full audit exits 1 with
five high affected-package entries; production audit exits 0 with zero findings.
Exact installed path:

`eslint-config-next@16.4.2 -> @next/eslint-plugin-next@16.4.2 -> fast-glob@3.3.1 -> micromatch@4.0.8 -> braces@3.0.3`.

One root advisory propagates to five entries; this is not five demonstrated
exploits. [GitHub Reviewed GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
currently lists <=3.0.3 affected and no patched version. No upgrade/override/force
fix was attempted. npm's proposed downgrade to ESLint config 14.2.35 is not a
compatible patch for the Next 16 candidate.

Installed source evidence: @next/eslint-plugin-next/dist/utils/get-root-dirs.js
imports fast-glob and calls globSync for settings.next.rootDir. The no-html-link-
for-pages rule calls that helper. This repo's eslint.config.mjs supplies no custom
rootDir, so that helper takes context.cwd without processing a supplied root glob.
Fast-glob/micromatch/braces are still installed and may be reached by other tooling
or future configuration. No application src import of this chain was found.
No visitor-controlled input path to braces was identified. Lint runs via npm run
lint locally and in any CI that invokes it; no committed CI workflow was found.
Next's build script is next build, not a lint wrapper. This is source inspection,
not proof of universal unreachability or a production bundle security attestation.

Compensating controls for release-owner sign-off: keep repo/config/glob patterns
trusted; review dependency/config changes; run untrusted contribution lint/build
in disposable jobs without production/provider secrets, with time/memory limits
and read-only credentials. Do not run PR-controlled code in a privileged CI context.
These are proposed controls, not verified remote CI settings. Risk is local/CI
availability from malicious patterns, not an identified production HTTP exploit.
Keep full audit failure visible; do not falsely call dependencies fully resolved.
Owner: release/security reviewer (name pending). Recheck before each release and
when braces/micromatch/fast-glob/Next ESLint releases or the advisory change. Adopt
a compatible patched chain then rerun audit, lint, TypeScript/build and regressions.
Production GO requires a recorded owner decision on this remaining development risk.

## Legal implementation comparison

| Subject | Actual implementation | Approval gap/status |
|---|---|---|
| Identity/controller | VLKO Ventures s. r. o., public Daniel VLKO; /legal and /privacy display company/address and hello@danielvlko.com | PARTIAL: registry checks below; tax/contact decision pending |
| Enquiry | Contact API processes name/email/website/message/source; sends owner/client emails with Resend; no Lead creation found in contact route | Approve exact fields/recipient/mailbox retention and notices |
| Booking intake | Name/email/company/website/message, optional phone accepted by intake schema; per-attempt owned Lead in PostgreSQL, selected UTC schedule/Vienna zone/status | Notice should explicitly address accepted optional phone and ownership/security metadata |
| Calendar | Internal event description includes name/email and supplied company/website/message; Meet created, customer not added as attendee | Approve Google disclosure, account/processor and transfer details; no attendee does not mean no customer data leaves DB |
| Email | Confirmation/ICS/management link via Resend; 24h/30m reminders, Meet in 30m message, cancellation/reschedule messages | Approve delivery providers, recipients, security and retention |
| Hosting/database | Code uses Prisma PG adapter/pg; intended Neon + Vercel, actual remote region/accounts not inspected | hostingAndDatabase is null; contracted entities/DPA/regions/subprocessors pending |
| Legal bases | Draft proposes Art 6(1)(b) individual enquiries, 6(1)(f) company contacts/security, 6(1)(a) optional telemetry | Owner/legal approval and legitimate-interest assessment still required; booking basis must be explicit and consistent |
| Security data | Hashed ownership tokens, expiry, HMAC rate keys/counters, admin cookie/auth; request connection metadata | Explain categories/purposes, actual log retention and safeguards accurately |
| Retention | 1h attempts; bounded expired attempt/rate cleanup; 180d local privacy preference; session storage; admin up to 7d | Lead/booking/email/calendar/log/backup retentionPolicy null; scheduler not proven; do not conflate TTL with business retention |
| Analytics | PrivacyProvider defers Analytics/SpeedInsights until consent; sanitizes URL query/fragment, public-path allowlist; event guards recheck choice | Source and mock checks PASS; actual deployed requests/provider behavior NOT VERIFIED |
| Withdrawal/storage | Footer settings can reject again; storage expiry/cross-tab/blocked storage code, Escape/focus return | Human/deployed acceptance pending; essential booking independent of measurement |
| Transfers | transferSafeguards null with explicit draft placeholder | Account-specific entities, regions, onward transfers and safeguards must be confirmed |
| Rights | Contact email, conditional rights/objection/withdrawal and SK/AT authority links | Assign rights-handling owner, identity verification and response/deletion workflow |
| Draft/indexing | reviewed=false, review notice, legal pages noindex/omitted sitemap | PASS preserved; noindex does not make an incomplete notice legally sufficient |

Fresh ORSR request returned HTTP 200 via Python after the browsing tool could not
open it. Targeted checks matched company name, ICO 57790647, entry 202436/B,
Karpatsk address stem and 11.08.2026 incorporation date. See a5-registry-check.json.
Full postal spelling, court, tax ID 2123125521, VAT ID SK2123125521 and VAT section
7a/effective date were not independently reverified in A5. Retain the documented
3 October sources and require current owner/official evidence; no new verification
date was inserted into legal-details.ts. No director/shareholder residential data
was extracted. SOI supervisory jurisdiction/address also needs current approval.

A stale statement that Cal.com embeds load after consent in docs/legal-readiness.md
was corrected to native booking. No Cal.com components/provider were reintroduced.

### Precise owner/legal approval checklist (all unchecked)

- [ ] Obtain current official extract and verify legal name/form, entire seat,
  ICO, court/section/entry, tax/VAT IDs, section 7a status/date and lawful VAT wording.
- [ ] Resolve omitted phone: owner preference alone does not settle disclosure.
  Slovak Act 22/2004 section 4(1)(c) lists email and phone; reviewer must confirm
  current applicability and an approved compliant contact solution. Do not invent
  or publish a number without owner instruction.
- [ ] Confirm controller email is monitored, identify rights/contact owner and
  competent supervisory authority; verify SOI disclosure where applicable.
- [ ] Decide B2B-only versus consumer service availability, how contracts conclude,
  required pre-contract/withdrawal/ADR information and applicable terms; check
  claims/case-study permission and substantiation. No obsolete EU ODR link.
- [ ] Review Austrian targeting, languages, establishment, relevant media/ECG and
  consumer rules with counsel. Do not insert Austrian chamber/GISA/Firmenbuch
  identifiers into a Slovak company notice without a factual basis.
- [ ] Approve field-level data map including optional phone, calendar descriptions,
  email/ICS/Meet, ownership/rate metadata and hosting/provider logs. Identify
  required/optional data and consequences of not providing it at collection.
- [ ] Approve each purpose/basis, pre-contract scope, business-contact legitimate
  interests and balancing, security interests and measurement consent language.
- [ ] Confirm Vercel/Neon/Google/Resend/mailbox legal entities, account ownership,
  contracted roles, DPAs, regions, subprocessors, access and transfer safeguards;
  review SCC/adequacy/other mechanism and actual applicability with reviewer.
- [ ] Set documented retention/review/deletion periods or criteria for enquiries,
  bookings, unsuccessful attempts, emails, calendars, logs, rate metadata and
  backups; implement an owned deletion workflow consistent with legal holds.
- [ ] Confirm cookie/storage inventory against deployment, consent/rejection/
  withdrawal and rights workflow. Approve the 180-day preference policy as an
  operational choice rather than a statutory assertion.
- [ ] Approve final exact notices, collection links, lawful localizations and any
  applicable consumer terms with reviewer name/date and text revision/commit.
  Only then authorize a separate reviewed change to reviewed/indexing/draft state.

Primary references checked: [ORSR extract](https://www.orsr.sk/vypis.asp?ID=771082&SID=2&P=0),
[Slov-Lex Act 22/2004 current portal](https://www.slov-lex.sk/ezbierky/pravne-predpisy/SK/ZZ/2004/22/),
[official static section 4 text](https://static.slov-lex.sk/static/SK/ZZ/2004/22/20240701.print.html),
[Commission transparency guidance](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/obligations_en),
[WKO scope by legal form/content](https://www.wko.at/internetrecht/website-impressum).
The static law text is dated; the portal search indicates a newer effective version.
Reviewer must check the currently binding text. EUR-Lex direct access hit an
anti-bot check; do not label its entire text newly verified by this session.
This is a technical readiness review and approval checklist, not legal sign-off.

## Database, staging and operational result

Static SQL/schema review PARTIAL; Prisma validation PASS. Five additive migrations
are ordered; A2 ownership/limiter tables include expected expiry indexes and unique/
FK constraints. Row preservation/DDL application/performance on Neon NOT VERIFIED.
No authorized isolated target was found among local or process variable names.
Existing application URLs were deliberately not used as test targets. No connection,
Neon provisioning or production-data clone was attempted. Detailed migration order,
legacy risks, commands, checks and restore limitations: RELEASE_CHECKLIST.md.

Vercel staging NOT VERIFIED. Local .vercel link exists, but no external settings
were queried/mutated. No vercel.json exists; live cron scheduling cannot be inferred.
Local security secret/origin variable names are missing. Ingress overwrite, remote
secrets, runtime plan/region, preview isolation, domain/DNS and recovery drill need
operator evidence. Holding mode still exposes contact/booking APIs: it is not a
booking shutdown switch. Configuring a gate is not sufficient to secure staging.

Native booking PARTIAL: current mocked security/calendar/reminder checks pass.
Five new reminder cases cover 24h eligibility/lateness, 30m Meet, missing-Meet repair,
email outage recovery, cancelled/past suppression and sequential/overlap replay.
Overlap has two provider requests with identical existing idempotency keys; provider
deduplication is not simulated or live-proven. Crashes, stale email after concurrent
reschedule and uncertain calendar outcomes still need staging/operator recovery.
Confirmation-email failure preserves booking; replay does not resend it. No live
provider result is claimed. See controlled-account matrix in RELEASE_CHECKLIST.md.

## Accessibility and quality evidence

A5 manual browser BLOCKED: CUA inventory was empty and iab unavailable. No alternate
browser acceptance, actual zoom, screenshots or human screen reader was performed.
A4 Chromium/axe screenshots/results remain unchanged, historical and narrower than
manual WCAG acceptance. Follow the explicit keyboard/zoom/contrast/reduced-motion/
privacy/assistive checklist before launch.

Fresh gates: TypeScript PASS; full ESLint PASS; isolated-config Next 16.4.2 build
PASS; Prisma 7.10.1 validation PASS; npm ci dry-run PASS; installed dependency path
PASS; security 19/19, calendar 5/5 and reminders 5/5 PASS; privacy/contact tracking
scripts PASS. Production audit PASS zero; full audit FAIL/open five high dev entries.
No Docker-backed PostgreSQL or browser acceptance rerun was executed in A5. Prior
A4 15 PostgreSQL/14 browser tests are historical, not included in A5's 29 test count.
Full evidence: a5-quality-gates.json, a5-build.json, a5-reminder-tests.json,
a5-dependency-*.json, a5-environment-review.json and a5-preflight.json.

## Exact blocking production criteria still open

1. Human legal approval and missing company/contact/provider/retention/transfer decisions.
2. Explicit isolated synthetic/schema-only Neon target and successful migration/DB rehearsal.
3. Verified protected staging: separate secrets/providers/DB, origins/ingress and runtime limits.
4. Explicit controlled provider-write scope plus live Calendar/Resend/reminder/admin acceptance,
   failed-confirmation recovery and uncertain-provider reconciliation procedure/drill.
5. Actual cron configuration/frequency/auth, monitoring and worker/retry acceptance.
6. Manual browser/zoom/contrast/assistive/device review and accepted accessibility findings.
7. App/DB restore rehearsal, provider reconciliation, named owners and rollback thresholds.
8. Complete candidate/history secret scan, dev-advisory risk-owner disposition and exact GO SHA.

Next action: approve the prepared backup/staging scope only after review; provide
an explicitly isolated Neon target and designated safe test accounts/recipients.
Do not release production while any blocking item remains open.
