# First project publication dossier

Prepared 24 October 2026. **Draft for owner review; not publication approval.** This document contains only repository-level facts and open questions. Keep private approval evidence, customer information and credentials outside the repository and public bundles.

## Current selection: FinanceOS

The owner has now explicitly selected FinanceOS and confirmed its classification as an **internal software product**. A typed draft and isolated local portfolio UI are prepared. This supersedes the earlier candidate ranking below; it does not approve developer-role wording, all claims or media publication.

| Dossier field | Current state |
|---|---|
| Project identity / classification | FinanceOS, internal software product; classification confirmed by the current owner request |
| Actual development role / attribution | Unknown; `role: null` in the draft. No “sole developer”, “lead architect” or collaborator claim invented |
| Problem / solution | Draft wording describes connected invoicing, clients, expenses, payment information and operational visibility, supported by inspected source and the original project brief |
| Implemented capabilities / technology | Source evidence matrix in [portfolio implementation](FINANCEOS_PORTFOLIO_IMPLEMENTATION.md); distinguish code inspection from full workflow acceptance |
| Demonstrated locally | Real FinanceOS dashboard presentation components rendered with synthetic props and captured in Chrome, without loading auth/database/actions or private records |
| Business outcomes | No verified revenue, adoption, efficiency or conversion measurements supplied; only bounded implementation outcomes drafted |
| Media / rights | Three local synthetic component captures exist in ignored review artifacts. No public assets copied; publication permission and final asset selection still pending |
| Publication | DRAFT, unavailable on public routes, absent from static params/sitemap/navigation |

**Missing owner approvals:** actual role and collaborators; final claims/current-status wording; selected media, rights, captions and alt text. Classification is already confirmed. The local workflow presentation is source-described; a full synthetic invoicing/PDF/payment demonstration has not been executed here.

## Candidate selection

The initial review identified **Daniel VLKO Website V2 itself**, provisionally an internal business website project, as the strongest candidate within this website repository. The subsequent service-page QA located a separate local **FinanceOS** repository and reviewed selected documentation and source without running its application or accessing private records. The updated recommendation below supersedes the initial candidate ranking; neither project is publication-approved.

The current Selected Work entries, **Business Platform**, **AI Operations System** and **Client Platform**, are generic summaries in `src/components/sections/work/selectedWork.data.ts`. Their names, prose and image paths do not establish a real client relationship, development role, delivery status, results or media rights. Do not promote them into case studies without separate verification.

## Earlier candidate dossier: Website V2 (retained for reference)

| Field | Current evidence / proposed scope | Publication gate |
|---|---|---|
| Identity | Daniel VLKO Website V2; current repository | Owner approves public project title and scope |
| Classification | Proposed internal business website / service platform | Confirm internal status; do not call it a client commission |
| Client/internal/demo status | No external client relationship established | Confirm owner and intended classification |
| Actual development role | Source is inspectable; individual authorship and contributions are not established by this review | Owner supplies exact role, collaborators and contribution boundaries |
| Business problem | Stated project objective: help companies understand the offer, assess delivery capability and book a discovery call | Approve as the project's brief, not as a measured finding about past visitors |
| Constraints | Preserve established brand/design, server-render public content, keep the native booking flow and consent boundaries, avoid unnecessary dependencies | Approve which constraints are useful and safe to describe publicly |
| Delivered solution | Local source contains marketing sections, contact/booking UI and provider integration implementations; this task adds four service routes | Distinguish implemented local behavior from deployed and operationally accepted behavior |
| Technologies | Next.js App Router, React, TypeScript, CSS/Tailwind, Prisma/PostgreSQL; Google Calendar and Resend integration code exists | Approve public technology list; do not imply vendor partnerships or independently verified live delivery |
| Verified outcomes | Code-level artifacts can be inspected; verification results for this task belong in `SERVICE_PAGES_IMPLEMENTATION.md` | No established conversion, revenue, time-saving or customer-adoption results. No numerical marketing claims |
| Screenshots | No approved media set supplied. Existing assets are not evidence of permission | Approve 3–5 sanitized captures, rights, alt text and captions; use synthetic data and exclude private/admin/customer details |
| Media permissions | Unknown for project screenshots and third-party material | Confirm ownership/licences and publication scope explicitly |
| Delivery status | Local development; current production state not verified | Owner confirms dates and what is actually live before using “launched” or “delivered” wording |

## Proposed story for approval

Subject to the gates above: “An internal business website connecting service information with a discovery-call booking journey.” Explain the audience, information architecture, service differentiation, implementation decisions and truthful limits. Discuss design intent as intent, and verified implementation as implementation. Do not claim improved conversion or commercial success without measurement.

## Owner approval checklist

- [ ] Select this internal project or provide a more relevant documented project.
- [ ] Confirm identity, project type, current status and permissible public dates.
- [ ] Supply the actual role, contribution boundaries and collaborator attribution.
- [ ] Approve the business problem, constraints, delivered scope and technology wording.
- [ ] Approve only outcomes supported by evidence; qualitative outcomes are acceptable.
- [ ] Supply/approve 3–5 sanitized images, rights, captions and alt text.
- [ ] Confirm that assets and wording reveal no private information or credentials.
- [ ] Approve the final public narrative and any external links explicitly.

**Publication decision: BLOCKED pending role, claims and media approval.** A FinanceOS draft now exists in typed application content, with a published-only detail route and an isolated local UI preview. `/work` continues to redirect to `/#work` while no item is approved; public `/work/financeos` requests return 404. Publish a complete index and first approved detail together after the gate is met.

## Updated candidate comparison after service-page QA

Evidence reviewed on 24 October 2026: FinanceOS repository HEAD `29bbc6c` (local state, not a deployed-release claim), its current `AGENTS.md`, `package.json`, and selected implementation/test source. Its README explicitly identifies earlier setup text as historical, so it was not used to assert current authentication or production readiness.

| Criterion | Daniel VLKO Website V2 | FinanceOS |
|---|---|---|
| Business relevance | Direct demonstration of customer-facing website and booking architecture | Stronger potential fit for the custom-software and connected-operations offer: invoices, dashboard information and finance-readiness workflows |
| Technical complexity | Marketing routes, consent-aware presentation and booking/provider recovery source | Broader domain-model and workflow evidence: issuance, immutable document snapshots, PDF handling, dashboard aggregation and readiness rules |
| Demonstrable functionality | Service-page presentation/navigation verified locally in this QA; provider delivery remains unverified | Source implementations and colocated test files exist; the app, tests, real workflows and integrations were not executed in this review |
| Visual potential | Website screenshots captured in service QA; public-use approval remains outstanding | Dashboard, invoice and workflow interfaces offer potential demo material; no approved sanitized captures inspected here |
| Client credibility | Useful supporting example for web-development buyers; label as internal/self-owned only after confirmation | Better candidate to explain business rules, tradeoffs and connected systems; must be labelled as an internal/self-owned product after ownership confirmation, never an invented client engagement |
| Available publication evidence | Current website source and local browser QA; no approved case-study wording or outcome measurements | Current product guide plus inspected source; authorship, outcome measurements, demo assets and publication approval still unknown |
| Rights and risks | Confirm asset licences, contribution attribution and screenshot approval | Confirm product/IP ownership, collaborators and third-party assets; use synthetic records. Do not imply certified accounting/tax compliance, live bank synchronization, customer adoption or commercial results |

### Source-level FinanceOS evidence

These references establish inspectable implementation, not independent end-to-end acceptance or publication rights:

- `src/features/invoices/issuance.ts`: `issueInvoice`, workspace-scoped invoice issuance, snapshot and accounting-policy dependencies.
- `src/server/pdf/invoice-pdf-service.ts`: `generateInvoicePdf` and `loadPrivateInvoicePdf`, with workspace/storage and snapshot-validation dependencies.
- `src/features/dashboard/dashboard-cashflow-buckets.ts`: `buildCashflowChartPoints`, including paid/received and expected-series fields.
- `src/features/readiness/engine.ts`: `evaluateFinanceReadiness`, state derivation and issue reconciliation.
- `src/features/ai-assistant/finance-ai-runtime.test.ts`: tests describe remote-provider failures and validation boundaries. These tests were read, not run. No claim of a functioning configured AI provider follows.

**Recommendation:** prepare **FinanceOS as the first featured case study**, conditional on the approvals and a controlled synthetic demonstration. It better supports the business-systems positioning. Use the Daniel VLKO website as the subsequent web-development example, or as the fallback first publication if FinanceOS cannot clear its gates. Technical breadth alone is not a reason to delay publishing an otherwise complete, approved story.

### FinanceOS approval gate

- [x] Confirm FinanceOS identity and internal-product classification (explicit in the current owner request).
- [ ] Confirm IP/publication rights, actual development role and collaborator attribution.
- [ ] Select a bounded story, such as invoice creation through document output and operational visibility; confirm which features are current and demonstrable.
- [ ] Approve the problem, constraints, solution, architecture wording and explicit limitations.
- [ ] Demonstrate the selected flow using synthetic data in an approved isolated environment; record what was actually verified.
- [ ] Approve 3–5 sanitized screenshots and their rights, captions and alt text. No real invoices, customer identities, account details or private documents.
- [ ] Approve only evidenced outcomes; leave commercial impact, adoption and time-saving claims out until verified.
- [ ] Approve final public wording and links. Keep detailed private proof outside the website bundle/repository.

No FinanceOS files were edited, no FinanceOS environment files were read, and neither project was published by this work. Cached deployment authentication was used only in memory for the separate read-only platform metadata check; no credentials were exposed.
