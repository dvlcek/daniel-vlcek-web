# Service pages: visual, functional and conversion QA

24 October 2026. Local review only. **Verdict: all four service routes are ready for owner review within the tested Chrome environment.** This is not production/provider acceptance, a conversion-lift claim or full WCAG certification.

## Scope and preflight

Worktree: `danielvlko-dev`, branch `develop/website-v2`, HEAD `2df30e8f0fa567298220233e52698ee42bf527a8`. Existing uncommitted service implementation was preserved. The original `feature/work-portfolio` worktree and its `next-env.d.ts` change were untouched. Read AGENTS, V2 plan, development workflow, service implementation report and publication dossier before work.

Used the existing `@playwright/test`, `@axe-core/playwright` and installed Chrome `155.0.8059.85`, without installing project dependencies. Initial capture used the local development server on port 3102. Final captures used the rebuilt local production server on `127.0.0.1:3103`. Only process-scoped presentation settings and a synthetic unreachable localhost database URL were used. Browser requests to external hosts and `/api/` were intercepted/blocked; contact navigation did not create a real booking, email or calendar event.

## Numbered review steps and verdicts

1. **Service selection — `/services`: PASS.** Growth/efficiency positioning and three service routes are understandable. Header, service links, FAQs, final call and email option are usable in the tested states.
2. **Web development — `/services/web-development`: PASS.** Customer-facing scope is distinct, deliverables are concrete, and the first CTA stays in the initial 900px-high viewport at every tested width. Added a scope discussion link after deliverables.
3. **Custom software — `/services/custom-software`: PASS.** Internal platforms, workflow tools and portals are distinguished from integration work. Responsive process columns and deliverable rows remain readable. Added the same scope discussion link.
4. **Automation/AI — `/services/automation-ai`: PASS.** Connected tools and bounded workflows are clear; human review, data permissions and failure handling are explicit. Heading wraps without overflow at 320px. Added the same scope discussion link.
5. **Keyboard and conversion journey: PASS in browser-driven checks.** Skip link, visible focus, menu trap/Escape/focus return, native FAQ keys, privacy-panel dismissal, service navigation and existing contact destination were exercised.
6. **Evidence/publication and production security: gates remain OPEN.** No case study was published, and current deployed security was not inferred from local QA.

## Viewport matrix and screenshots

Normal-motion final screenshots use a 900px viewport height, device scale factor 1. Initial reduced-motion captures are retained separately. Widths are CSS pixels.

| Route | 320 | 390 | 768 | 1024 | 1440 | 1920 |
|---|---|---|---|---|---|---|
| `/services` | PASS | PASS | PASS | PASS | PASS | PASS |
| `/services/web-development` | PASS | PASS | PASS | PASS | PASS | PASS |
| `/services/custom-software` | PASS | PASS | PASS | PASS | PASS | PASS |
| `/services/automation-ai` | PASS | PASS | PASS | PASS | PASS | PASS |

Ignored local evidence directory: `test-results/service-qa/`.

- [Screenshot gallery](../test-results/service-qa/index.html): all 24 final full-page captures and 24 hero captures, plus detailed sections and focus states.
- [Final measurements / axe output](../test-results/service-qa/final/matrix.json).
- [Keyboard/navigation results](../test-results/service-qa/interaction-results.json).
- [CTA / reduced-motion checks](../test-results/service-qa/final/postchecks.json).
- `final/overview-{width}.png`: six side-by-side hero comparison sheets, ordered hub, web development, custom software, automation/AI.
- Homepage hero/service-section captures at 390 and 1440px provide the comparison context. Only captures from this QA run were used.

Screenshot names use `services[-service-slug]-{width}.png` for full pages, with `-hero`, `-deliverables`, `-process`, `-final-cta`, `-footer` and `-keyboard-focus` suffixes for the corresponding state. Evidence is intentionally ignored and local; it is not uploaded or added to public assets.

### Visual observations

- Header clears breadcrumbs and hero content at all six widths. Mobile menu is shown below 1024px; desktop navigation is shown at and above 1024px.
- H1s wrap without clipping; Geist, shared type scale, Container widths, orange accents and dark/light section rhythm match the existing site. No homepage section reorder or new visual system was needed.
- Document width equals viewport width in all 24 cases; DOM inspection found no visible header/main/footer elements crossing the right edge.
- Deliverable rows stack on narrow screens and split at 768px. Process steps use one, two and four columns according to the existing service CSS breakpoints.
- Primary CTAs have 52px minimum height and remain inside the content width. Final and middle-page actions have visible keyboard focus.
- Footer columns stack/reflow without clipped company/contact/legal content. The footer/privacy composition is unchanged.
- Service pages contain no image assets or loading placeholders, so no service-image loading failure was observed. Existing homepage comparison assets loaded locally. Real network/device performance was not benchmarked.
- No clipping, overlap or excessive blank-region defect justified a CSS/layout redesign. Long mobile pages reflect stacked deliverables/process content; practical FAQs stay collapsed by default.

## Findings corrected

| Finding | Evidence | Targeted correction |
|---|---|---|
| Long gap between detail hero and final conversion action | Initial full-page captures; detail pages are roughly 7,000–7,800px tall at narrow widths, with the next primary action near the end | Added one understated “Discuss your project scope” link after the deliverables/boundaries; all three use the existing `/contact` path and fixed `services` label |
| Email alternative described an extra navigation step | Initial final-CTA copy said email was available on the contact page, although the visible primary action was booking-oriented | Direct email link now reuses `legalContactEmail`; no address duplicated and no email sent during QA |
| Global smooth scrolling was not acknowledged for Next 16 route transitions | Development browser warning; installed Next upgrade guide documents the required root attribute | Added `data-scroll-behavior="smooth"` to the existing root `<html>` only. Verified that middle-page contact navigation returns to the top; reduced-motion CSS still computes `scroll-behavior: auto` |

No palette, spacing, animation, homepage composition or booking backend change was required.

## Buyer and CRO assessment

| Question | Assessment across the four routes |
|---|---|
| Immediately understandable? | Hub identifies three offers. Each detail names its service in the hero and explains it in the supporting sentence. Web is customer-facing, software is operational, automation connects tools. |
| Target customer clear? | Hub supports companies choosing a starting point. Web addresses customer journeys; software addresses teams constrained by spreadsheets/tools; automation addresses manual handoffs and repetitive operations. |
| Business outcome compelling? | Growth and efficiency are concrete directions, supported by specific examples. No financial or conversion uplift is claimed without measurement. |
| Deliverables specific? | Each detail lists four realistic deliverable types and explicitly distinguishes possible scope from included scope. |
| Unnecessarily long? | Initial visible main content was approximately 321 words on the hub and 557–581 on details with FAQs closed. Stacked mobile layouts are long but scannable; removing useful scope/process information was not justified. |
| Repetition/generic sections? | Shared process/cooperation headings give consistent orientation; descriptions differ by service. Responsibilities and support boundaries remain intentionally explicit. No decorative/redundant section was added. |
| CTA at logical moments? | Hero and final actions exist on all pages. Details now also offer a route immediately after the visitor evaluates deliverables. The hub's service links already provide useful intermediate decisions. |
| Builds confidence? | Scope boundaries, realistic handover and AI oversight are strengths. Approved project proof is still missing; no generic card was substituted for evidence. |
| Next step clear? | Free 30-minute discovery call, no obligation, discussion of priorities; direct email alternative. Booking cost/timing/delivery promises were not invented. |
| Premium and credible? | Restrained editorial rows, shared typography/palette and consistent responsive behavior support the established identity. Credibility still depends on clearing the separate portfolio evidence gate. |

## Accessibility and interaction results

- Eight axe scans, covering each route at 320 and 1440px, reported **zero violations** for the selected WCAG A/AA rule tags. This includes automated contrast evaluation; it is not a guarantee of complete conformance or every possible state.
- Browser keyboard events verified Tab to skip link, Enter to focus `main`, then Tab to a visibly outlined breadcrumb link on every route.
- Enter opens mobile navigation; focus moves to the first navigation link. Shift+Tab/Tab exercises the actual dialog controls and wraps; Escape closes it and restores Menu focus.
- Resizing the open mobile menu to 1024px closes the dialog and restores body scrolling. Selecting Services in the mobile menu closes it and reaches `/services`.
- Native FAQ summaries open with Enter and close with Space. Privacy settings open from the footer; Escape dismisses the panel and restores its trigger focus.
- Every service CTA's destination is `/contact`. Hero links were followed on all routes; middle-page links were followed on all detail routes. Hub-to-detail, desktop-header Services and footer-to-home About anchor were verified. Existing footer destinations and fragments also passed the HTTP smoke check.
- Main headings/landmarks, unique IDs, link names and logical heading levels were checked through DOM/axe and rendered HTML. No new focus traps or client-state framework were added.
- Reduced-motion presentation was exercised on all four routes. Shared button transition duration computes to `0.00001s`; root scroll behavior computes to `auto` under the preference.
- These are browser-driven keyboard checks, not human screen-reader or physical-device testing. Firefox, WebKit/Safari, assistive-technology announcements, high-contrast OS modes and real provider delivery remain unverified.

## Exact conversion-tracking gap and minimal proposal

Current `src/lib/privacy.ts` allows telemetry only on `/`, `/contact`, `/work`, `/coming-soon`, `/legal`, `/privacy` and `/cookies`. All four service paths are missing.

Consequences on service routes, even after prior analytics consent:

1. `PrivacyProvider` does not mount Vercel Analytics or SpeedInsights: service page views and performance measurements are absent.
2. Its delegated contact listener finds `header`, `services` and `footer` CTA labels, but `trackContactEvent` rejects the service pathname: those origin clicks are absent.
3. A direct service-page landing does not show the initial choice panel, because that panel uses the same allowlist. Optional measurement remains off; footer Privacy settings still works.
4. After navigation to `/contact`, existing consent-aware contact/booking events can resume, but they do not recover the missing service-origin click. New direct email links add no event collection.

**Proposal for a separately approved task:** add exactly the four completed service paths to the existing allowlist, retaining the current consent gate and URL query/hash stripping. Reuse existing event names/properties (`contact_click`: public `path` + fixed `source`; booking events: public `path` only). No query parameters, referrer persistence, personal data, custom email tracking or new SDK is needed. Test direct landing, reject, allow, withdrawal, service-to-contact navigation and continued exclusion of private/API paths. Review direct-landing choice-panel presentation as part of that change. **Not implemented in this QA.**

## Case-study recommendation and approvals

Read the updated [publication dossier](FIRST_PROJECT_PUBLICATION_DOSSIER.md) for the seven-criterion comparison and source references. A separate local FinanceOS repository is accessible and contains substantive invoice, PDF, dashboard and readiness implementations. Source and selected tests were read; the application and its tests were not run.

Recommend **FinanceOS first as a featured internal-product story**, once ownership, actual contribution, bounded demonstrable scope, sanitized media and final wording are approved. It better supports the connected-business-systems offer. The Daniel VLKO website remains a useful web-development example and fallback if it clears approval sooner. Do not imply client commissioning, tax certification, bank connectivity, adoption or measured outcomes that were not established.

Owner gates: identity/classification and IP rights; exact role/collaborators; selected real workflow and delivery status; controlled synthetic demonstration; 3–5 authorized sanitized screenshots/captions/alt text; approved outcomes/limits; final wording and public links. No case study or new work route was published.

## Production-security status

Existing master-audit SEC-01 records an older deployment at `952bc8f…` predating booking-ownership/login protections. Later B1/B2 entries establish local source fixes and explicitly leave deployed-source/operational acceptance unresolved. The deferred launch checklist still calls for separate urgent verification. **These documents do not provide reliable proof of current production remediation.**

Create a **P0-priority verification task** for the release owner: establish the actual live revision/artifact and exposure, confirm applicable migrations/configuration and accepted protections, and arrange a separate containment/hotfix if needed. P0 describes the verification priority; it does not reclassify the historical P1 finding or assert current exploitation. No production requests, destructive tests, provider writes or configuration changes were performed here.

## Validation and remaining observations

| Check | Actual result |
|---|---|
| `npm run build` | PASS; final application source, 23 static entries, all four service routes |
| Standalone TypeScript after build | PASS, exit 0 |
| Full `npm run lint` | PASS after converting disposable local QA helpers from CommonJS to ESM; initial helper-only lint errors are not application failures |
| Explicit five-file offline regression suite | PASS, 78/78, 0 failed/skipped |
| Privacy script | PASS |
| Contact-tracking script | PASS |
| HTTP metadata, sitemap, links, headings and existing work redirect | PASS against the final local build |
| Visual/DOM viewport checks | All 24 cases captured and reviewed; no horizontal overflow or header/content overlap |
| axe scans | 8/8 scans with zero violations |
| Browser keyboard/navigation, middle CTA, direct email href and reduced motion | PASS in the tested states; email sending and actual booking completion not attempted |
| `git diff --check` | PASS |

Non-blocking observations: final production-browser console includes Next-generated CSS preload-not-used warnings, with no service-page runtime errors. Initial development homepage comparison under reduced motion produced a React hydration-attribute warning involving existing Motion styles and image-sizing warnings. Homepage animation code was not changed; investigate that separate homepage issue before claiming whole-site reduced-motion acceptance. Service-page reduced-motion checks passed.

## Exact changes in this QA task

Application:

- `src/components/services/ServicePage.tsx`: mid-page scope links and direct email alternative.
- `src/app/layout.tsx`: documented root scroll-behavior attribute.

Documentation:

- `docs/SERVICE_PAGES_QA.md`: this report.
- `docs/SERVICE_PAGES_IMPLEMENTATION.md`: links this completed QA and updates current preview/verification context.
- `docs/FIRST_PROJECT_PUBLICATION_DOSSIER.md`: evidence-based FinanceOS comparison, conditional recommendation and approval gates.

Screenshots, JSON, gallery and disposable QA runners are under ignored `test-results/`. The Next dev server briefly generated an AGENTS block and development type imports; its own incidental changes were removed/restored by final build without retaining instruction/generated-source changes. No environment, schema, migration, API, auth, provider, consent, telemetry, dependency or production configuration changes. No commit, push, PR, merge or deployment.
