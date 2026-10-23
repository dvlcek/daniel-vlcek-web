# Deferred final integration and launch checklist

Planning only. **No step below is executed or approved by development setup.** Finish approved pages/content first; authorize production/provider/database work separately. Local V2 readiness is not permission to expose unrestricted booking/admin processing.

## Immediate separate hotfix flag

Existing master-audit SEC-01 evidence identifies an older deployed commit lacking RC ownership/login protections. RC2 local fixes do not prove live protection; no fresh production inspection was performed in setup. Have the release owner promptly verify the deployed revision/write exposure and handle any still-exposed confirmed critical issue as a **separate urgent hotfix or containment task**, rather than waiting for Website V2 launch. Coming-soon presentation does not disable APIs. Do not quietly deploy all unfinished V2 content as the hotfix.

## A. Freeze and integration

- [ ] Freeze a candidate from the latest approved development branch; record exact branch, commit and artifact digest.
- [ ] Review all changes since RC2 `736dc09539919180c4c2ec6ab29978adf1795149`; confirm intended scope and preserved A1-A5/B1/B2 behavior.
- [ ] Remove unfinished placeholders/draft routes from public navigation and sitemap. Approve real content, project permissions, screenshots and claims.
- [ ] Record outstanding blockers, owners, evidence and approval; retain known-good artifacts and branches.

## B. Quality assurance

- [ ] Run complete applicable tests, standalone TypeScript, full ESLint and production build against the frozen candidate.
- [ ] Run booking/admin/security/ownership/recovery regressions; use synthetic data for controlled integration acceptance.
- [ ] Complete browser/responsive/zoom/keyboard/accessibility checks; verify navigation, links, images and conversions.
- [ ] Verify SEO/canonicals/OG/sitemap, published-only indexing and private/draft noindex. Verify consent behavior and absence of private data in analytics.
- [ ] Perform fresh dependency and redacted secret scans against the actual candidate/history; resolve findings before publication.

## C. Infrastructure and operational acceptance

- [ ] Choose and approve the final hosting architecture. The existing Vercel deployment may remain in place during development, subject to separately verified account/operational suitability; this is not a new hosting approval.
- [ ] Preserve the intended future direction: supervised Linux VPS Next.js application, separate supervised background worker and Neon. Validate actual host/runtime/proxy/cookie/origin behavior before any cutover; do not add platform coupling casually.
- [ ] Verify database target/history, backups, restore/recovery evidence, least privilege and rollback compatibility in an approved isolated environment.
- [ ] Review unchanged A2/B1 migration prerequisites and additive B2 migration. Rehearse schema-first deployment/rollback; drain older booking/admin writers and workers before RC2-or-later cutover. Production migration is a separately approved operator action.
- [ ] Verify one authenticated scheduler, reminders/cleanup/recovery, monitoring/alerts and per-item failures. Verify providers with approved synthetic recipients/events.
- [ ] Reconcile any legacy PENDING/failed-email records, remote version conflicts or exhausted retry windows through a reviewed data-safe process. Do not infer production data state from mocks.

## D. Legal/security and go/no-go

- [ ] Approve exact privacy/legal/cookie disclosures and actual operator/processor/retention/hosting facts.
- [ ] Validate admin authentication, server-side session revocation and booking ownership/request protections in the accepted environment.
- [ ] Validate Google Calendar/Meet and Resend credentials/configuration and controlled failure/retry behavior; do not expose secrets in evidence.
- [ ] Confirm correct migrations, secure configuration, operational owners and accepted residual risk. Obtain explicit public-release approval.

## E. Authorized launch and observation

- [ ] Establish rollback artifact, write-control/drain procedure, monitoring thresholds and rollback owner before deployment.
- [ ] Deploy only the reviewed release commit; verify domain, HTTPS, origin/proxy rules and all approved public/private routes.
- [ ] Run approved controlled booking smoke tests; confirm email/calendar/Meet, cron/recovery and admin/session behavior.
- [ ] Monitor production errors, job heartbeats and provider outcomes; execute rollback only under the agreed procedure if acceptance fails.

Keep the final record short: candidate SHA/artifact, environment/domain, operator, content/legal approval, migration/recovery evidence, test/provider outcomes, unresolved risks and rollback reference. Historical release/audit records remain evidence; their old PASS/FAIL entries do not replace fresh final acceptance.
