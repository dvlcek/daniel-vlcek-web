# Execution roadmap

> B1 implementation update, 23 October 2026: the original RC1 audit below is historical evidence. The B1 section at the end supersedes its admin request/session/logging findings only. Production was not changed.


23 October 2026. Documentation-only roadmap. No task below has been implemented by this audit. Source baseline RC1 `66fde05…`; live Vercel is `952bc8f…`. Existing release worktree and dirty integration workspace remain preserved. IDs refer to [master audit](../audits/MASTER_SECURITY_ARCHITECTURE_AUDIT.md); architecture details are in [VPS blueprint](../architecture/VPS_MIGRATION_BLUEPRINT.md), content details in [expansion plan](WEBSITE_EXPANSION_PLAN.md).

## Decisions that govern sequencing

Security/reliability before launch, operational acceptance before host cutover, proof before marketing pages. Keep Neon and the existing application. The recommended target is C: VPS Next plus separately supervised same-codebase worker. Existing Google authorization recovery is historical completed work; do not repeat the superseded `invalid_grant` blocker without fresh evidence. Fresh dependency audit is zero; do not make resolving the old five-high advisory an implementation task.

No P0 exposure was established. P1 findings affect actual production or acceptance; P2 improvements can usually follow. S/M/L indicate relative engineering complexity, not a promised schedule: S focused change, M related paths/tests, L cross-system/recovery work. Calendar duration depends on owner/provider/legal access and approval; those dependencies cannot be estimated as coding time.

## Phase 1 — security and booking reliability

**Priority P1. Complexity M overall, L for durable reconciliation. MUST-HAVE.**

Scope: SEC-01–04, REL-01–06; preserve A2 and current UI/API contracts. Immediately prepare a reviewable operational restriction for older deployed booking/admin exposure if accepted release cannot follow promptly. Applying it needs separate authorization; holding mode does not disable APIs.

Deliverables:

- Small first implementation batch: common admin Origin/body/error guards; session termination design and implementation with MFA path; specific synthetic regression tests. Preserve secure redirects/cookies and server auth.
- Booking operation ownership and conditional state transitions; atomic buffered reservation checks across attempts; stable provider event identity and recovery/reconciliation policy.
- Confirmation/cancellation/reschedule retry mechanism, derived management-link recovery, missing-Meet retrieval/escalation and occurrence-aware reminder safety.
- New reviewed release SHA and evidence; never modify files then claim original RC1 is unchanged deployed code.

Dependencies: accepted auth/session policy, isolated PostgreSQL fixture or owner-approved schema-only/synthetic target, documented provider failure behavior. New schema for sessions/outbox/operations, if justified, requires its own separate design/rehearsal; it is not silently bundled into host migration.

Acceptance criteria: cross-attempt denial and all existing tests pass; wrong/missing Origin and excessive admin payloads denied before writes; logged synthetic secrets never appear; copied session fails after logout/revocation; same-booking race has one winner and no cancelled→confirmed resurrection; two independent attempts cannot violate buffered availability; crash-after-provider-write converges or creates actionable reconciliation state; failed emails/Meet are recovered or alerted without duplicate booking. Real DB/provider cases must be explicitly recorded as run or unverified.

NICE-TO-HAVE: broader component extraction and prettier admin errors. Do not postpone security for a large UI refactor.

## Phase 2 — production readiness and observability

**Priority P1. Complexity M; owner-dependent. MUST-HAVE before unrestricted processing.**

Scope: OPS-01–03/05/06, PRIV-01, SEC-05/06 and accepted Phase 1 behavior. Prepare complete environment contract, operational ownership and truthful release record.

Deliverables: protected acceptance environment using approved synthetic data/providers; current DB target/history/recovery evidence and isolated migration acceptance; baseline headers and staged CSP; redacted correlation/error logging; external uptime/job heartbeat alerts; legal processor/retention/deletion facts and exact-text review; explicit management-link cutoff policy; CI gates with no production secrets on PRs; actual browser/keyboard/zoom/assistive acceptance.

Dependencies: business/legal owner supplies real facts; database owner verifies production and recovery; safe-recipient/provider-write scope explicitly approved; browser surface and reviewer available; commercial hosting/preview terms resolved. Preview is not currently accepted or fully configured. No new cloud project is required by default.

Acceptance criteria: exact candidate/environment names recorded without values; Preview cannot send to arbitrary real recipients or read production customer data; recovery drill meets agreed RPO/RTO; providers and reminders demonstrate authorized non-customer acceptance; per-item cron failures alert even with HTTP 200; no telemetry before choice/after rejection/on private routes; live legal text approved; keyboard/mobile/real zoom and screen-reader notes recorded with remaining risks. All newly added documentation/code scans pass before publication.

NICE-TO-HAVE: OpenTelemetry traces and full dashboards. Basic correlation, redaction and reliable alerts come first.

## Phase 3 — VPS preparation and reversible migration

**Priority P1 for chosen cutover; P3 if launch remains on an accepted managed host. Complexity M–L. MUST-HAVE only for VPS deployment.**

Scope: OPS-04 and blueprint. No codebase split, no database replacement, no automatic paid Vercel upgrade.

Deliverables: verified host/workload/isolation inventory; Linux build artifact and runtime acceptance; trusted proxy-IP handling and tests; HTTPS/firewall/key-only SSH/non-root service configuration; separately supervised worker and disabled schedule; resource/log limits; off-host monitoring/config recovery; atomic deployment and rollback runbook; approved hosting disclosures.

Dependencies: Phases 1–2 relevant gates; identified server/access/panel and domain control; named patch/incident owner; separate host if unrelated sensitive workloads cannot be safely isolated. All actual server/DNS/deployment actions remain separately authorized.

Acceptance criteria: Node app is not publicly reachable except through approved proxy; forged forwarding headers cannot alter rate identity; unrelated visitors have distinct legitimate quotas; Secure cookies/exact Origin/canonical HTTPS work; reboot/restart/worker timeout tested; one reminder scheduler only; current DB binding unchanged; health/alerts/backup and rollback evidence accepted; no provider writes during setup; approved smoke recipients only later. DNS split traffic cannot create competing unsafe write authorities. Hosting cutover needs zero new schema changes; pre-existing A2/schema prerequisites are separately accepted.

NICE-TO-HAVE: standalone packaging, containers if useful, Cloudflare, second web host. `next start` with a sound release process is acceptable; measure before adding infrastructure.

## Phase 4 — real project and case-study pages

**Priority P2. Complexity M template + content. MUST-HAVE for credible portfolio expansion, not a booking-security release blocker.**

Scope: `/work` and one complete `/work/[slug]`, typed local TS model. Preserve homepage design and existing real work until replacement content is accepted.

Deliverables: one permission-approved project dossier, reusable content schema and server-rendered case-study template, public index with real cards, responsive sanitized images, self-canonical metadata/breadcrumbs, related service/contact links and publication validation.

Dependencies: real project facts, project kind/client permission, actual role, sanitized screenshots and verified results. An internal/demo product must be explicitly labeled. Services not yet published must not be linked as live destinations.

Acceptance criteria: no placeholders/private content/fabricated metrics; every public statement has supporting approval/evidence; screenshot alt/dimensions and mobile layout accepted; index/detail links and metadata correct; draft content excluded from sitemap/build routing. One excellent story is sufficient to start; multiple speculative case studies are not required.

NICE-TO-HAVE: filters, animation, many project categories, CMS and complex editorial workflow.

## Phase 5 — About, services and offers

**Priority P2. Complexity M. MUST-HAVE for positioning depth; deploy incrementally with complete content.**

Scope: authentic `/about`, `/services` and three differentiated service pages. Package information stays within services; process is shared content first.

Deliverables: factual biography/portrait, three scoped offer briefs, discovery/build/integration/care engagement structure, acceptance/handover/support expectations, relevant genuine evidence and internal links. No fixed prices or support availability invented.

Dependencies: owner story, actual capability/offer boundaries, case-study evidence and realistic operating capacity. Service-specific claims and recurring support need defined ownership/inclusions/exclusions.

Acceptance criteria: visitors can distinguish custom web/webshop, internal software and automation/AI work; each page answers audience/problem/deliverables/process/proof and has one primary CTA; maintenance is a defined offer rather than vague “support”; claims truthful and content unique; no empty sibling links or copied doorway pages.

NICE-TO-HAVE: separate `/process`, `/packages`, `/solutions`. Publish only when distinct content/validated offers justify them.

## Phase 6 — SEO, content and measured growth

**Priority P2 foundation, P3 recurring expansion. Complexity S–M per iteration.**

Scope: SEO-01/02, PERF-01, UX-01 and publishing system. Metadata/consent protections needed for release remain earlier gates; this phase is ongoing growth.

Deliverables: truthful rendered structured data, published-page sitemap/internal linking, search-intent map, mobile performance measurement and targeted fixes, consented funnel reports, author-maintained insights only when capacity exists. Review static llms/index descriptions alongside actual site content.

Dependencies: accepted live domain/indexing, real content and enough traffic for meaningful field measurements; actual translation and support resources before localization.

Acceptance criteria: correct live canonical/noindex behavior, no draft/private sitemap URLs, JSON-LD matches visible facts, page-specific intent without duplicate broad copy, measured performance report distinguishes lab/field results, analytics rejects PII/query/token data, documented editorial update owner. Add hreflang only to complete translated equivalents. No ranking or conversion guarantee.

NICE-TO-HAVE: large content calendar, extra languages, advanced attribution and Grafana. Do not use analytics features to delay reliable booking or genuine proof.

## Top 10 prioritized next actions

| Order | Action | Owner / dependency | Completion evidence |
|---|---|---|---|
| 1 | Review exposure of old deployed booking/admin writes; prepare an explicit containment change if needed | Release/platform owner; SEC-01 | Reviewed surface restriction or accepted secure replacement; no assumption that holding freezes APIs |
| 2 | Fix admin request bounds/origin/redaction and session termination/MFA path | Engineer + owner auth policy | Synthetic guards/replay tests and small reviewed change |
| 3 | Prove/fix management and buffered reservation races | Engineer + isolated PostgreSQL | Distinct-attempt and cancel/reschedule barriers with one valid outcome |
| 4 | Add provider reconciliation and reliable email/Meet recovery | Engineer + provider scope | Failure-injection evidence and accepted safe-recipient lifecycle |
| 5 | Complete legal/retention/deletion facts and approve exact notices | Business/legal owner | Reviewer/date/version, actual hosting/processors, deletion procedure |
| 6 | Verify DB identity, pending migration and recoverability on approved target | DB/release owner | Current migration checksums, isolated rehearsal, restore drill; production changes separate |
| 7 | Establish external uptime, sanitized errors and serialized job monitoring | Operator | Alert delivery test, missed-run and partial-failure evidence |
| 8 | Prepare VPS ingress/isolation/artifact/rollback and complete manual browser acceptance | Operator + engineer + reviewer | Host inventory, spoof tests, HTTPS/cookie/cache checks, recorded browser/accessibility acceptance |
| 9 | Assemble one real, permission-approved project story and implement its reusable pages later | Owner + engineer | Complete public-safe dossier and accepted index/detail |
| 10 | Expand About/services, then SEO/performance from real evidence | Owner + engineer | Unique approved content and measured technical/conversion checks |

## Recommended first implementation batch

Keep it narrow and reviewable: shared admin POST origin/body/schema guards, sanitized admin/worker logging, and revocable privileged-session behavior with synthetic regression tests. Include explicit design decisions for password/session reset and MFA; do not quietly replace identity systems. Prepare the deployed-exposure containment separately for owner review, with exact affected routes and rollback behavior.

Booking race/recovery work is the **next required batch**, not optional debt waived by the smaller first batch. Do not combine page creation, CSS redesign, dependency churn, VPS access or production migration into either implementation review. Finish with a new pinned candidate, actual test evidence and explicit remaining release blockers.

## Release approval record to collect later

One record should name: exact SHA/artifact digest; environment/domain; operator; unresolved findings and accepted residual risk; database target/migration/recovery; provider safe-recipient outcomes; worker/monitoring evidence; browser/accessibility notes; final legal text/reviewer/date; rollback artifact and write-control plan. “Build passed” alone is not GO. None of these operational approvals is inferred from this documentation audit.


## B1 completion update ? 23 October 2026

Targeted implementation on `security/b1-admin`, isolated from clean RC1 `66fde05?` and the preserved dirty integration workspace. Admin origin/body/schema/quota guards (SEC-03), durable logout revocation/eight-hour session expiry and credential-change invalidation (SEC-02 subset), and sanitized admin/reminder/cron diagnostics (SEC-04) are implemented. MFA/idle/concurrent-session policy remains separate; no auth provider replacement or UI/refactor work was included.

Changed files and migration/rollback details are in the [B1 audit update](../audits/MASTER_SECURITY_ARCHITECTURE_AUDIT.md#b1-targeted-admin-implementation--23-october-2026). One additive `AdminSession` table/index requires isolated Neon migration rehearsal and schema-first deployment; no real database was connected to or migrated. Source changes are prepared for release integration, with runtime deployment still subject to those gates. Old cookies require a new login.

Final checks: full ESLint PASS; standalone TypeScript PASS; production build PASS; Prisma validation PASS; exact offline forward/reverse migration diff PASS; **49/49** admin/security/calendar/reminder regression tests PASS; privacy/contact checks PASS; diff whitespace check PASS. See the audit update for exact commands and test limitations. Fixture tests cannot replace real Neon or provider acceptance.

**B1 source integration: READY. Next roadmap phase / unrestricted release: NOT READY.** Remaining booking and operational gates below are not waived.

Next required batch remains booking state/concurrency/reconciliation/email/Meet work (REL-01?06), followed by operational/legal/provider acceptance. No speculative booking fixes, new pages, styling, host setup, Docker, infrastructure or production operations were performed in B1. Keep the existing roadmap ordering; B1 completion alone is not unrestricted-release approval. Project/service page development and release readiness should not be conflated.


## RC2 / B2 completion update - 23 October 2026

`release/danielvlko-rc2` was created from verified RC1 `66fde05...` and fast-forwarded through B1 `2d272df...`; all prior worktrees/backup branches and dirty work remain preserved. B1 security behavior and its migration/tests remain integrated.

B2 implements the confirmed recovery/admin-transition gaps REL-03-06 and the requested concurrent-operation/reservation safeguards for REL-01/02: atomic buffered reservations, revision-guarded state transitions, durable calendar intent and stable provider identity, ETag fencing, recoverable lifecycle email with bounded idempotent retries, and actual Google Meet retrieval/repair. Existing reminder endpoint runs bounded recovery; no new scheduler/platform/UI was added. See the [B2 audit update](../audits/MASTER_SECURITY_ARCHITECTURE_AUDIT.md#rc2--b2-targeted-booking-completion---23-october-2026) for files, commands and limitations.

Local focused tests: **78/78 PASS**, including B1/A2 regression. Full ESLint, TypeScript, production build and Prisma validation: **PASS**; real Neon locking/migration/rollback and provider acceptance remain **NOT VERIFIED**. One additive B2 migration adds nine nullable Booking fields after unchanged A2/B1 migrations; no migrations were run. Deployment must be schema-first with older writers drained. Keep recovery intent during rollback and reconcile pending work before resuming older code.

The earlier B1 statement that booking implementation is the next coding batch is superseded by this completion record. **Project subpage development may begin locally on RC2.** Production readiness remains a separate unfinished gate: SEC-01 deployed-source gap, OPS-01 scheduling, operational/legal acceptance, and safe reconciliation of any legacy stranded records or provider conflicts. No release, VPS or production approval is inferred from local test success. Phase 2 operational work and any real DB/provider actions require their own scoped execution; do not turn them into another general audit or redesign.
