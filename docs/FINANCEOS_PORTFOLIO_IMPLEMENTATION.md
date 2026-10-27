# FinanceOS portfolio: draft implementation and handoff

24 October 2026. **Prepared for local owner review; not published.** FinanceOS classification as an internal software product was explicitly supplied by the owner. Exact development role, final claims and media rights remain unapproved.

## Preflight and preservation

Read AGENTS, V2 plan, workflow, publication dossier and service QA. Work continued in the dedicated `danielvlko-dev` worktree on `develop/website-v2`, HEAD `2df30e8f0fa567298220233e52698ee42bf527a8`. All existing service-page, homepage CTA, navigation and root-layout changes were preserved. No branches/worktrees were reset or replaced; no commit, push, PR, merge or deployment.

SEC-01 was examined before portfolio implementation. [Read-only verification report](SEC01_PRODUCTION_VERIFICATION.md): **P0 UNVERIFIED** after both alias metadata requests returned 403. No current production SHA or remediation claim was inferred.

## Source-reviewed FinanceOS evidence

The accessible local FinanceOS repository was located by directory discovery, not assumed from the website. Reviewed source state: HEAD `29bbc6c92e0ef5e6afdabc649834c88622314f00`. Read the repository guide, relevant source and selected existing synthetic presentation fixtures. No FinanceOS environment file, private storage, customer record, database or running authenticated session was opened. No FinanceOS files were edited.

| Capability | Source evidence in FinanceOS | Verified scope |
|---|---|---|
| Finance dashboard | `src/features/dashboard/dashboard-financial-hero.tsx`, `dashboard-view.tsx`, `dashboard-view-model.ts` | Implemented presentation and financial-value contracts; selected real components rendered with synthetic props |
| Invoice management | `src/features/invoices/service.ts`, `issuance.ts` | Draft/update, issuance, duplication and lifecycle operations exist in source |
| Expense tracking | `src/features/expenses/service.ts` | Scoped expense creation/update and purchase-document states exist in source |
| Client management | `src/features/clients/service.ts` | Create/update/archive/restore operations with workspace context and audit writing exist |
| Payment/status tracking | `src/features/invoices/service.ts: recordInvoicePayment` and lifecycle helpers | Explicit eligible states, payment records and version checks; not live bank synchronization |
| Financial reporting | Dashboard cash-flow/view-model modules and `src/features/readiness/engine.ts` | Operational cash-flow views and readiness evaluation; no claim of complete statutory reporting or certified accounting |
| PDF generation | `src/server/pdf/invoice-pdf-service.ts`, snapshot/render helpers | Implemented generation/private-access path based on issued data; generation/delivery not executed here |
| Authentication/settings | `src/server/auth/auth.ts`, business-profile source and repository guide | Better Auth sessions, workspace membership and business-profile settings exist; no configured live-auth acceptance claim |
| Technologies | Current package manifest and imports | Next.js, React, TypeScript, PostgreSQL/Prisma, Better Auth and React PDF |

Source verification means implementation was inspected. It does not mean all FinanceOS workflows, tests, providers or production operations were executed successfully. No customer count, revenue, time saving, conversion lift, SaaS launch, public availability or deployment claim was introduced.

## Application implementation

- `src/content/projects.ts`: typed project/media model, FinanceOS draft wording, explicit approval gates, public lookups and a publication predicate. Private source/approval evidence is kept in documentation, not project props.
- `src/components/work/ProjectCaseStudy.tsx`: server-rendered editorial case study with product visual, overview, challenge, capabilities, showcase, architecture, source-described workflow, outcomes/current limits, related completed services and existing contact CTA.
- `src/components/work/WorkIndex.tsx`: server-rendered portfolio index prepared for the first approved project.
- `src/components/work/Portfolio.module.css`: scoped existing palette, Container/type/rhythm tokens, responsive rows and controlled continuation spacing. No new UI library, CMS, database model or animation dependency.
- `src/app/work/[slug]/page.tsx`: published-only metadata/page resolution and static params; `dynamicParams=false`, `notFound()` for unavailable projects.
- `src/app/work/page.tsx`: retains redirect while the public project collection is empty; renders the prepared index only after a complete approved item exists.
- `src/app/sitemap.ts`: includes work index/details only when the publication predicate admits a project.
- `src/proxy.ts`: a narrowly scoped marketing check lets draft/unknown `/work/*` requests reach Next's real 404 handler in both coming-soon modes. Approved project routes still respect the existing coming-soon gate. Booking/admin/API guards and behavior are untouched.
- `tests/portfolio-publication.test.ts`: protects draft exclusion, every approval gate, nonempty role, authorized media requirements and the presentation-proxy behavior.

### Publication gate

FinanceOS currently has `status: "draft"`, classification approved, role/claims/media approvals false, `role: null` and no public media. Publication additionally requires a nonempty approved role and at least three authorized images with dimensions, alt text and captions under the intended public work-image path. Setting `status` alone cannot publish it.

| Surface | Current behavior |
|---|---|
| `/work`, full-site presentation mode | Redirect to `/#work` |
| `/work`, coming-soon mode | Existing coming-soon presentation behavior retained |
| `/work/financeos` | 404 / noindex in both presentation modes |
| Unknown project slugs | 404; no fallback to draft content |
| `generateStaticParams` | Empty: no draft slug generated |
| Sitemap | No work index or FinanceOS entry while the public collection is empty |
| Homepage / public navigation | Existing Selected Work design and anchors unchanged; no FinanceOS link activated |
| Production public assets/client props | No FinanceOS capture copied to production `public/`; no draft project rendered into public HTML/RSC |

## Authentic visuals and isolated local review

The capture harness imports the real FinanceOS `DashboardFinancialHero`, `DashboardCashflow`, `DashboardClientRevenue` and `DashboardPriorityGrid` components and their CSS. A synthetic fixture is derived from the existing dashboard presentation test, with explicit demo company labels and a small synthetic series. It is not a fabricated dashboard image or an authenticated-app screenshot.

The bundle's dependency review found 17 presentation/helper inputs and **no server, database, query, server-action or dotenv module**. The actual components are rendered to local HTML and captured using installed Chrome/Playwright. These captures demonstrate presentation only, not an end-to-end invoicing or payment workflow. Numerical values are synthetic records, never project outcomes.

Local, unapproved captures:

- Dashboard components: 1440 × 882.
- Cash-flow/client-revenue components: 1376 × 416.
- Operational priority components: 1376 × 97.

PNG originals and optimized WebP copies stay under ignored `test-results/portfolio-qa/product-capture/media/`. No production public image directory was changed. Screenshot/media publication still requires explicit rights and wording approval; additional approved invoice/workflow captures would strengthen the eventual story.

The separate Next review harness is entirely under ignored `test-results/portfolio-qa/preview/`. It imports the actual portfolio components, root layout, Header, Footer, tokens and metadata patterns. Only its local fixture injects the unapproved media into the draft. It has no production environment flag, draft query parameter, secret bypass or route in `src/app`. All preview metadata is noindex/nofollow.

Preview is loopback-only at `http://127.0.0.1:3105/work` and `/work/financeos`. Its contact, completed service and legal destinations redirect to the existing local site at port 3103 for navigation verification, using a fixed allowlist. Browser QA intercepts APIs and external hosts; no booking is submitted. Optional analytics consent is rejected in fixtures, and telemetry/consent code is unchanged.

Its generated Next output is placed under its own `node_modules/.cache/portfolio-preview` so it does not enter root TypeScript/ESLint checks. An earlier cache was preserved under `node_modules/.cache/previous-portfolio-preview`; an attempted cleanup deletion was blocked by tool policy, and no deletion was performed. This cache has no role in production routing.

### Local fixture lifecycle

No fixture is part of production routes, static params, sitemap, public navigation or root public assets. To retire local review, stop the owned loopback preview/capture processes and remove or archive only the ignored `test-results/portfolio-qa/` artifacts after confirming their absolute paths. Do not copy the harness, synthetic fixture or its cached build into a release. After approval, copy only the explicitly approved media into the intended production asset directory, update the real catalog and rerun all publication checks.

## Visual and accessibility QA

Saved evidence: ignored `test-results/portfolio-qa/screenshots/`, with full-page and hero images named `work[-financeos]-{width}.png`. `visual-results.json` records measurements, decoded image sizes, headings, noindex metadata and axe results. An HTML gallery is supplied alongside these artifacts.

| Local review surface | 320 | 390 | 768 | 1024 | 1440 | 1920 |
|---|---|---|---|---|---|---|
| Portfolio index | PASS | PASS | PASS | PASS | PASS | PASS |
| FinanceOS case study | PASS | PASS | PASS | PASS | PASS | PASS |

QA found hero top padding being overridden by section padding, placing breadcrumbs beneath the header. Corrected scoped CSS order and vertical breadcrumb alignment; strengthened DOM checks to include breadcrumb clearance, rather than H1 clearance alone. Same-surface continuation spacing was kept controlled. Product images retain their intrinsic ratio, use responsive Next Image sizes and expose full-size links for narrow screens. Lazy showcase images are scrolled into view and decoded before full-page captures; initial incomplete captures were rejected.

Browser keyboard/reduced-motion/navigation findings and actual command results are recorded in the final validation section below. Chrome-only local presentation checks do not certify WCAG, screen-reader announcements, other browser engines or provider behavior.

## Publication sequence

1. Approve the exact development-role wording and attribution. Classification is already confirmed; do not ask for it again as missing information.
2. Review and approve the complete case-study claims, current status and stated limits, grounded in the source matrix above.
3. Approve at least three sanitized visuals, their rights, final captions and alt text. Decide whether dashboard component captures are sufficient or an isolated invoice/workflow demonstration is required.
4. Add only those approved assets to production media and the real project catalog; enter the approved role and approval flags, then deliberately set `status: "published"`.
5. Verify detail/index together, unique metadata/canonicals, sitemap, unknown-slug 404s, images, keyboard access and all six viewport widths.
6. Only then activate Homepage Selected Work → FinanceOS and Work-index links, preserving existing anchors and verifying Header/observer behavior. Add service-to-project evidence links only after the detail is public-ready. No such homepage link was activated by this task.
7. Production deployment remains a separate authorized release, subject to the unresolved SEC-01/operator acceptance gates. Publication readiness is not deployment authorization.

Recommended next content phase: **About page**, with owner-approved background, actual expertise, approach and portrait rights. Keep it separate from SEC-01 remediation and avoid invented credentials or experience claims.

## Files changed in this task

Created: `src/content/projects.ts`; `src/components/work/ProjectCaseStudy.tsx`; `src/components/work/WorkIndex.tsx`; `src/components/work/Portfolio.module.css`; `src/app/work/[slug]/page.tsx`; `tests/portfolio-publication.test.ts`; `docs/FINANCEOS_PORTFOLIO_IMPLEMENTATION.md`; `docs/SEC01_PRODUCTION_VERIFICATION.md`.

Modified: `src/app/work/page.tsx`; `src/app/sitemap.ts`; `src/proxy.ts`; `docs/FIRST_PROJECT_PUBLICATION_DOSSIER.md`; `docs/WEBSITE_V2_PLAN.md`. Previously uncommitted service/homepage/layout work remains preserved and is not attributed to this task. Ignored local capture/review artifacts are not application deliverables.

## Final validation

| Check | Actual final result |
|---|---|
| `npm run build` | PASS, exit 0; 23 static entries and the generic SSG project route, with no FinanceOS static path |
| `node node_modules/typescript/bin/tsc --noEmit` | PASS after the final build, exit 0 |
| `npm run lint` | PASS, exit 0, no warnings after cleaning disposable helper imports/exports |
| Explicit six-file test command (five workflow regressions + portfolio publication tests) | PASS, 82/82; 78 existing tests plus 4 publication-gate tests, no skipped tests |
| Privacy / contact scripts | PASS; consent, URL exclusions and existing presentation/contact behavior preserved |
| Two local production-server modes | PASS; FinanceOS/unknown project URLs return 404/noindex with coming-soon true and false; `/work` redirect preserved in full mode |
| Static/public exposure checks | PASS; no draft static path, sitemap/navigation entry, draft payload in public 404 responses, FinanceOS literal in production client JavaScript or production `/qa-media` asset |
| Local review visual matrix | PASS, 12/12 page/width combinations at 320/390/768/1024/1440/1920px; breadcrumb/header clearance, no horizontal overflow and decoded images checked |
| axe | Four scans (both review pages at 320/1440px), zero violations for selected WCAG A/AA tags |
| Browser keyboard / navigation | PASS; skip link/main focus, visible focus, mobile dialog trap/Escape/return, index → detail, full-size image opened by Enter, related service → actual completed service page, final CTA → existing contact |
| Reduced motion | PASS in browser emulation; root scroll computes `auto`, shared button transition `0.00001s` |
| Screenshot gallery links | Local gallery and comparison sheets created under ignored `test-results/portfolio-qa/` |
| `git diff --check` | PASS |
| Current production remediation | P0 UNVERIFIED; both authenticated metadata lookups denied with HTTP 403 |

The initial image-focus helper used programmatic focus immediately after a pointer action, which correctly did not establish keyboard focus-visible modality. Replaced it with actual Tab traversal from the skip link, then verified the image link and Enter-open behavior in the browser. No product focus workaround was introduced. Initial lint warnings were confined to temporary helper code and were cleaned; final full ESLint is clean.

The reviewed final image/heading output is unchanged by moving the remaining domain headings into the typed project record; content and presentation are now separated for the full case narrative. Runtime database/provider acceptance, exact production revision, final role, claims approval and media rights remain separate gates regardless of local test outcomes. No cross-engine, screen-reader, live FinanceOS workflow or deployed-runtime acceptance claim is made.
