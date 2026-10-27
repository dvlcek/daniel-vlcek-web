# Connected Website V2 — local review handoff

Implemented 24 October 2026 in the existing dirty `develop/website-v2` worktree, based on HEAD `2df30e8`. Existing service, portfolio, publication and security work was preserved. No commit, push, merge, deployment or production configuration change was performed.

## Browse the complete site

The complete, loopback-only review site is running at **http://127.0.0.1:3105/**. All nine requested routes use the actual application components on this origin:

- `/`
- `/services`
- `/services/web-development`
- `/services/custom-software`
- `/services/automation-ai`
- `/work`
- `/work/financeos`
- `/about`
- `/contact`

This expands the existing ignored `test-results/portfolio-qa/preview` harness. It renders the real root layout, homepage, services, About, portfolio and contact components. A preview-only module alias supplies `/work` and `/work/financeos` navigation; production has no environment/query bypass. All preview pages have noindex metadata and an `X-Robots-Tag` header. FinanceOS media is synthetic, labelled and stored only inside the ignored harness. It is not approved public evidence.

Local booking API requests return a deliberate 503 from the harness. The native BookingWizard displays its existing retry/error state. It cannot create a real calendar event or send an email here. A successful provider booking is not established by this visual review.

If these local processes stop, run each command in a separate terminal from the development repository:

```powershell
# Existing website images, read-only local static server
python -m http.server 3111 --bind 127.0.0.1 --directory public
```

```powershell
# Complete review harness; source and synthetic captures already exist locally
Set-Location test-results/portfolio-qa/preview
node ../../../node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3105
```

The harness and review evidence are ignored local artifacts, not production application routes or a portable committed preview package. Preserve them for this review.

## Implementation

- `Header.tsx` is a server wrapper around the existing interactive `HeaderNavigation.tsx`. It supplies a publication-safe Work URL, keeping catalog/draft data out of the client navigation. Desktop and mobile links, nested-page active states, contact active state, focus trap, Escape and focus return are connected.
- Header and footer use Services `/services`, About `/about`, Process `/#process` and contact `/contact`. Work uses `/work` in the isolated preview and the existing `/#work` production fallback while no approved item exists. The native contact page now uses the shared header, with enough top clearance; booking behavior is unchanged.
- `HomePageContent.tsx` preserves the original eight sections and order. Earth imagery, animation and layout remain intact. Service cards reach their details, Selected Work reaches the local portfolio, and the About section links to `/about`. Generic secondary work summaries are labelled illustrative capabilities and link to services. The final orange CTA now inherits the existing dark text style to fix its contrast failure.
- The new server-rendered About page uses modular `src/content/about.ts` copy. Its seven sections cover introduction, services, systems thinking, supported technical areas, collaboration, work and contact. It has unique canonical metadata and a sitemap entry. No portrait, experience length, credentials, testimonials or results were invented.
- WorkIndex has a complete one-project composition, capability summary, product visual, related services and final contact CTA. ProjectCaseStudy retains the FinanceOS showcase, challenge/solution, features, architecture, workflow, status, related services and contact composition. Both reuse typed content and existing design tokens.
- No new dependency, CMS, content database model or booking/authentication/provider change was introduced in this connected-site task.

## Verification and evidence

Browser evidence is under ignored `test-results/site-qa/`. `visual.mjs` covers all nine routes at 320, 390, 768, 1024, 1440 and 1920px (54 cases), with full-page and hero screenshots. `navigation.mjs` covers route destinations, footer/header consistency, active states, homepage transitions, Process anchor, mobile menus, focus/keyboard behavior, FAQ keyboard toggles and reduced-motion root behavior. Grouped image sheets are in `screenshots/`.

| Check | Final result |
|---|---|
| Production build | PASS, 24 static entries; draft project has no generated slug |
| TypeScript | PASS after production build |
| Full ESLint | PASS |
| Offline regression suite | 82/82 PASS, including four publication tests and the existing security/booking suites |
| Privacy and contact tracking scripts | PASS |
| Responsive browser matrix | 54/54 PASS: HTTP 200, one H1, clear header/content positioning, no horizontal overflow, all visible images loaded |
| Axe | 18 route/width scans PASS after the homepage CTA contrast correction (320 and 1440px per route) |
| Browser page errors | None; six expected contact 503 console messages from disconnected local providers |
| Navigation/keyboard | All nine route checks PASS, plus transitions, FAQs, Process anchor, reduced-motion and mobile-menu checks |
| Public route/metadata checks | PASS: seven complete public pages have unique titles/descriptions, expected canonicals and safe navigation; About is included in sitemap |
| Publication isolation | PASS in both coming-soon modes; draft/unknown details and preview media return 404, safe Work fallback retained, no draft client bundle payload |
| `git diff --check` | PASS |

Browser runtime: Chrome 155.0.8059.85 through the existing Playwright solution. Automated accessibility checks supplement the captured visual/keyboard review; they do not establish an exhaustive accessibility or live integration certification. No production provider or database was accessed by these checks.

## Publication and approval

Production candidate checks use http://127.0.0.1:3103/ with coming-soon disabled and port 3107 with it enabled. These are local servers, not deployment evidence.

FinanceOS remains a draft: production `/work` redirects to `/#work`; draft/unknown project details return 404 with noindex in both presentation modes. No draft route is in the sitemap/static parameters, no FinanceOS literal is in production client JavaScript, and preview captures are absent from root `public`. Local preview navigation is isolated from this gate.

Before publishing the portfolio, confirm actual role/attribution and rights, approve the factual narrative/current status, and approve at least three authorized sanitized visuals with captions and alt text. Then activate the index and detail together through the existing publication model. Review About/service wording and personal imagery separately as desired. See [publication dossier](FIRST_PROJECT_PUBLICATION_DOSSIER.md) and [portfolio implementation](FINANCEOS_PORTFOLIO_IMPLEMENTATION.md).

**SEC-01 remains a separate urgent production verification/containment task.** The prior read-only platform check could not establish the deployed revision. Local source and browser checks do not prove the older deployed booking/admin exposure is fixed. See [SEC-01 evidence](SEC01_PRODUCTION_VERIFICATION.md). Release remains outside this task and subject to the [deferred launch checklist](FINAL_LAUNCH_CHECKLIST.md).


## Navigation/SEO follow-up ? 24 October 2026

The subsequent [navigation and SEO audit](NAVIGATION_SEO_AUDIT.md) fixes shared desktop/mobile current states, Next.js internal links, public social-image routing, the homepage-only Markdown alternate, cookie-table keyboard access and coming-soon contrast. The sitemap now follows the runtime presentation flag: seven eligible pages in full-site mode, Contact alone while coming-soon is enabled, plus future legal/project entries only after their existing approval gates pass. Earlier build counts/results above describe the connected-site implementation before this follow-up. See the newer report for exact audit files and final checks.


## Portable handoff - 27 October 2026

The former ignored-only harness is superseded for new PCs by `npm run preview:design` and the private media supplement. See [PC setup](PC_HANDOFF.md) and [handoff review](PC_HANDOFF_REVIEW.md). The root app publication gate remains unchanged.
