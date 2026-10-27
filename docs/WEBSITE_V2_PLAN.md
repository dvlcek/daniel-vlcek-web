# Website V2 plan

Development base: `develop/website-v2`, starting from RC2 `736dc09539919180c4c2ec6ab29978adf1795149`. Setup is documentation only; no pages or abstractions are implemented. This is the active content-development order. Production approval remains separate.

> Earlier development progress, 24 October 2026: service pages and their QA are implemented in the current uncommitted worktree. FinanceOS is selected as the first internal-product case study; its typed content and portfolio UI are prepared **as a draft only**, with a separate ignored local preview. `/work` retains its redirect while no approved item exists, and `/work/financeos` returns 404 publicly in both presentation modes. See [portfolio handoff](FINANCEOS_PORTFOLIO_IMPLEMENTATION.md), [publication dossier](FIRST_PROJECT_PUBLICATION_DOSSIER.md) and [SEC-01 verification](SEC01_PRODUCTION_VERIFICATION.md). Historical setup text below is not a statement that these later development artifacts are absent.

> Connected-site update, 24 October 2026: all nine requested routes are now browsable together through the isolated local review site on port 3105, including the new About page. Navigation, homepage links, shared contact header and portfolio presentation are implemented. Production FinanceOS gates remain effective. See [connected website handoff](CONNECTED_WEBSITE_IMPLEMENTATION.md) for code, preview commands, QA and approval boundaries.

## Priorities and acceptance

| Order | Scope | Required content and completion gate |
|---|---|---|
| W1 | `/work` and one `/work/[slug]` | One real approved project: overview/type/actual role, problem, solution, delivered features, technologies, sanitized screenshots, verified outcomes/limits, relevant service references and contact CTA. Publish index and first complete detail together; no placeholder slugs. |
| W2 | `/services`, then `/services/web-development`, `/services/custom-software`, `/services/automation-ai` | Explain what is built, customer problems, deliverables, process, relevant real projects, cooperation options and CTA. Implement in that order; publish/link coherent completed destinations only. Distinguish website/webshop, internal software and automation/AI scopes; make human review/data boundaries clear where relevant. |
| W3 | `/about` | Owner-approved background, actual expertise, approach, values, portrait rights and systems-builder positioning. No invented experience length, credentials or client claims. |
| W4 | Cooperation/packages inside relevant service pages | Approved discovery/build/integration/care options with inclusions, exclusions and responsibilities. No invented prices, guarantees or support availability. Dedicated `/packages` only if distinct, repeatable offers justify it. |
| W5 | Content and final refinements | Link completed work/services/about/contact; check navigation, unique metadata/sitemap, responsiveness, keyboard/accessibility, CTA clarity and measured performance. Preserve consent/private-route behavior; optimize observed issues only. |

Qualitative outcomes are acceptable when accurate and approved; lack of measured numeric results never justifies invented metrics. Existing homepage work cards are generic summaries, not automatically approved case studies. Missing rights/facts block publication of that item, not unrelated development.

## Reuse map

| Existing source | How new pages should use it |
|---|---|
| `src/app/layout.tsx` | Already owns Geist, root metadata/viewport, skip link and PrivacyProvider. Do not duplicate them or wrap admin/contact in a new global marketing shell. Public pages need `<main id="main-content" tabIndex={-1}>`. |
| `src/components/layout/Header.tsx` | Server wrapper supplying publication-safe navigation to the existing interactive HeaderNavigation/mobile dialog. Reuse on appropriate marketing pages; it is absolutely positioned with white text, so account for its height/background in the page's top section. Services and About target their completed routes; Process targets the homepage anchor. Work retains the safe homepage fallback until a project is approved. |
| `src/components/layout/Footer.tsx` | Shared footer and consent settings; default CTA reaches `/contact`. Contact uses `bookingHref="#booking"`. Avoid copying legal/company details. |
| `src/components/ui/Container.tsx`, `src/app/globals.css` | Container uses `.page-container`. Reuse palette, radii, responsive `--type-*`, `--section-space`/`--content-space` and existing type/rhythm classes. Default container is 1480px; existing sections have deliberate overrides. Do not globally normalize them. |
| Existing sections and CSS modules | Follow composition in `src/app/page.tsx`; reuse established headings/cards/CTA treatments and `FinalCTA` when appropriate. Keep motion scoped and reduced-motion compatible. No generic Section/Button framework is required now. |
| `src/lib/metadata.ts`, `src/lib/site.ts` | Use `pageMetadata(title, description, path)` for unique canonical/OG/Twitter metadata and shared identity. Public content should remain server-rendered; published-only sitemap/structured data changes belong to the page task. |
| `src/components/sections/work/selectedWork.data.ts` | Existing typed local data is a useful pattern, not verified publication evidence. Preserve homepage content/design while adding approved detail content separately. |
| `/contact`, BookingWizard, privacy/admin/security helpers | Link to the existing conversion path. Do not introduce a second booking flow or alter secure APIs/session/consent to accommodate marketing pages. |

## Simplest content architecture

Use typed local TypeScript records, with a small `src/content/projects.ts` (or equivalent) only when W1 implementation starts. Do not create the file or a renderer in setup. Keep essentials explicit: stable slug, title/summary, project kind, real role/scope, problem, solution, features, technologies, media with alt/dimensions, approved outcomes/limits, related destinations and SEO copy. Keep private approval/evidence outside shipped bundles; public records contain only approved facts/assets.

Use server-rendered App Router pages. When implemented, generate only approved published slugs, return notFound for unknown/draft projects, and include only published routes in sitemap/navigation. `/work` currently redirects to `/#work`; replace it only with a complete approved index/detail set. Related services remain text or are omitted until their routes are live. Reuse small components when the actual repeated content warrants them, not ahead of need.

No CMS, MDX pipeline, database content schema, new UI framework or state library is justified for the first case study. Reconsider only when demonstrated editing needs change.

## Exact next task

**W1.1: approve the FinanceOS dossier and activate the prepared portfolio only after its gates pass.** FinanceOS internal-product classification is already confirmed. Obtain Daniel's actual role/attribution, approved claims/current status and at least three authorized sanitized screenshots with alt text/captions. Record unknowns honestly; no numerical outcomes may be invented. The typed draft, index/detail components and published-only routes already exist, with an isolated local review harness. Follow `FINANCEOS_PORTFOLIO_IMPLEMENTATION.md` to add approved assets/role and activate `/work` plus `/work/financeos` together, then verify homepage links without redesigning Selected Work. Preserve booking/admin behavior. The About page is now implemented for owner review; deployed security verification remains separate and urgent.

The retained [historical expansion plan](strategy/WEBSITE_EXPANSION_PLAN.md) provides deeper content guidance; the [execution roadmap](strategy/EXECUTION_ROADMAP.md) records B1/B2 completion and unfinished operational gates. The [launch checklist](FINAL_LAUNCH_CHECKLIST.md) is deferred until release is explicitly authorized.
