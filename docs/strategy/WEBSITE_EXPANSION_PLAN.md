# Website expansion plan

23 October 2026. Planning only: no new routes, CMS, content publication or redesign. Source: RC1 `66fde05…`, especially site.ts, app routes, Hero, WhatIBuild, selectedWork.data.ts, Process, WhyWorkWithDaniel, ContactPage and BookingWizard. See [audit](../audits/MASTER_SECURITY_ARCHITECTURE_AUDIT.md) for evidence and limits.

## 1. Business positioning and current foundation

Position Daniel VLKO as a **Software Developer & Automation Architect** who designs and delivers connected digital systems. Lead with customer problems and delivery responsibility, then show technical judgment and real implementation evidence. Keep the premium near-black background, orange accent, Geist, Earth hero and existing section structure. Expansion should deepen evidence and intent, not increase decoration or generic agency language.

Three core service families: premium custom websites/webshops; custom software/internal platforms; business automation/applied AI. Maintenance/optimization is the ongoing layer across those services. Websites remain a core offer rather than being hidden beneath abstract “systems” language. AI offers should name the actual workflow, human review, failure handling and data boundary, not suggest autonomous guaranteed outcomes.

Current public route inventory: `/`, `/contact`, draft `/legal`, `/privacy`, `/cookies`, `/coming-soon`; `/work` is a redirect to `/#work`. Private utility routes `/admin`, `/admin/login`, `/booking/manage` and APIs are not marketing sitemap entries. Current work cards are generic descriptions, not proof of authorized public client case studies. Current contact already contains native booking plus email fallback; improve it incrementally, do not build a duplicate contact flow.

## 2. Proposed sitemap and publishing gates

```text
/
/contact                         existing
/work                            replace redirect only when evidence exists
/work/[slug]                     real, approved projects
/services
/services/web-development
/services/custom-software
/services/automation-ai
/about
/legal /privacy /cookies         existing; complete and approve

Later, only with distinct content and sustained ownership:
/process
/insights
/insights/[slug]

Do not create /packages or /solutions as a duplicate index now.
Keep maintenance offers within each relevant service initially.
```

Publish in small coherent sets: one complete case study with its `/work` index; then real About and the service pages with clear distinctions. A service detail page needs substantive original content even if sibling pages are not ready; link only existing completed routes. No empty page, “case study coming soon” index, fabricated client or public placeholder slug.

| Page / decision | Business purpose, audience and intent | Primary CTA / trust role | Required content, SEO opportunity and components | Complexity / dependencies |
|---|---|---|---|---|
| `/` retain | First impression for business decision makers; establish fit and three service families | Book discovery call; secondary real work | Existing hierarchy; clearer concrete outcomes without guarantees, service links, evidence summaries; broad brand/developer/automation intent | S editorial; proof and accepted booking |
| `/work` justify now, publish with proof | Buyers assessing delivery capability across project types | Discuss a similar system | Real project index with type/service tags, role, approved thumbnail and challenge; portfolio intent; shared ProjectCard; no filtering UI until enough projects | M; at least one complete authorized case study |
| `/work/[slug]` high priority | Technical/commercial evaluators seeking evidence relevant to their problem | Book a call about related work | Problem, constraints, actual solution/role, architecture, sanitized images, verified results and limitations; project/problem-specific intent; CaseStudyLayout, evidence blocks, related services, breadcrumbs | M template + M per story; permissions, real artifacts, claim approval |
| `/services` justified | Visitors uncertain whether they need website, software or automation | Choose relevant service / discovery | Three distinct service summaries, example problems, engagement outline and maintenance; software/automation service overview intent; reusable service cards, fit guide | S–M; defined offers and live destination pages |
| `/services/web-development` justified | Companies needing premium websites, webshops or client platforms | Discuss website/platform scope | Audience/use cases, custom vs platform decision criteria, commerce/payment/integration scope, accessibility/performance approach, CMS/support options, real evidence; commercial web development/webshop intent | M; approved capability claims, platform/commerce boundaries |
| `/services/custom-software` justified | Operations/finance teams outgrowing spreadsheets/disconnected tools | Request scoped discovery | Internal platforms, invoicing/workflow examples, integrations, access/data migration/testing, acceptance and handover; custom software/internal business system intent | M; system examples, security/support responsibility |
| `/services/automation-ai` justified | Operators with repeated manual processes and integration gaps | Discuss a specific workflow | Triggers/data/integrations, AI suitability and human review, exception paths, monitoring, recurring support, examples; business automation/AI workflow integration intent | M; real workflow evidence, provider/data policies |
| `/about` justified | Buyers assessing the person responsible for delivery | Book discovery | Authentic story, actual background/role, technical principles, collaboration/communication, verified portrait, relationship to legal operator; brand/entity intent | S–M; factual narrative and approved image; no invented years/credentials |
| `/process` defer standalone | Buyers wanting procurement/delivery clarity | Start discovery | Discovery → scope → delivery → integration → acceptance → support, client responsibilities and change handling; process block shared first; publish separately only when it answers additional questions | S reuse / M standalone; documented operating process, not duplicate service copy |
| `/packages` decline now | Standardizing offers helps sales, but a separate generic price grid blurs custom scope | Service-specific scoped enquiry | Show engagement options inside services; page justified later only by repeatedly sold, distinct fixed deliverables and real qualification needs | No page now; validate offers first |
| `/solutions` decline now | Industry/problem grouping could aid buyers after relevant proof exists | Related service discovery | Requires repeated industry expertise and distinct evidence; avoid synonym of services or unsupported industry authority | Later only; multiple real projects in a niche |
| `/contact` improve existing | Qualified visitors ready to talk, plus asynchronous enquiries | Confirm discovery booking; email alternative | Existing free/30-minute/video expectations, what to prepare, privacy notice, provider-outage fallback; branded contact intent; existing wizard | S content / reliability work separate; accepted booking/privacy |
| `/insights` and detail defer | Answer real customer questions and demonstrate judgment | Related case study/service, then discovery | Original technical/problem explanations, accurate author/date, maintenance plan and helpful internal links; informational intent | M structure + recurring editorial work; capacity and real expertise |
| Existing legal pages complete | Identify operator and processing choices; satisfy actual reviewed disclosure needs | Contact rights/business email; return to site | Approved real entity/processor/retention/transfer facts, cookies/consent behavior matching deployment; exclude drafts from index until approved | M factual/legal dependency; no automatic legal approval |

## 3. Simplest scalable case-study architecture

Choose **typed local TypeScript content**, building on `selectedWork.data.ts`. Few engineer-maintained projects need no CMS accounts, content API, webhooks, rich-text sanitizer or runtime DB. Store public content separately from private audit/research notes; compile-time types and a small validator can enforce required publication fields. Render sections with shared server components, allowing narrowly scoped interactive images only when useful.

MDX becomes worthwhile when technical narratives need many custom prose sections and the author prefers Markdown. Avoid arbitrary untrusted MDX execution or duplicating the same fields in TS and MDX. A CMS is justified later by several nontechnical editors, frequent publishing, approval workflows, localization or a large media library, not by a hypothetical future website. Preserve portable content IDs/slugs so migration remains simple.

Proposed model, **design specification only**:

| Field | Type / rule | Why |
|---|---|---|
| id, slug, title, summary | Stable ID; unique validated slug; concise required copy | Stable links, cards and page identity |
| projectKind | `client`, `internal`, `product`, `demo`, or `open-source` | Prevent internal tools being presented as client commissions |
| clientDisplayName, industry | Optional; permission-bound | Credibility without revealing confidential identity |
| visibility, publicationApproval | Draft/published; approver/date/scope; keep private proof outside shipped public content | Explicit publication gate |
| role, collaborators, deliveryScope | Actual responsibility and contribution | Avoid implying sole authorship or unsupported delivery |
| problem, audience, constraints | Required factual context | Explain why work mattered and who used it |
| solution, architecture | Narrative plus optional sanitized diagram | Show system judgment; no private hosts/keys/customer schema |
| technologies | Actual tools used, with relevance | Evidence of implementation rather than logo stuffing |
| featuresDelivered, challenges, tradeoffs | Real delivered capabilities and decisions | Demonstrate depth and distinguish scope from roadmap |
| media | Source path, alt, caption, dimensions, permission and redaction review | Accessible, safe screenshots; responsive image delivery |
| outcomes | Claim, qualitative/quantitative kind, verification source/method, period and publication approval | Only verified results; absent numeric evidence means no numeric claim |
| testimonial | Optional quote/name/role with explicit authorization | Social proof only when permission exists |
| relatedServices, relatedProjects | Valid identifiers for published destinations | Buyer navigation and internal linking |
| dates, status | Accurate project/publish/update dates and current delivery state | Distinguish active work, prototypes and shipped systems |
| seo | Unique title/description/social image; canonical derived from slug | Page-specific search/share intent |
| CTA | Fixed approved label and existing contact path | Consistent conversion without arbitrary redirect URLs |

Recommended rendered order: project type/summary and role → problem/constraints → solution and architecture → delivered features/screenshots → challenges/tradeoffs → verified outcomes/limits → authorized testimonial if available → related service and CTA. A finance/invoicing system may show architecture and redacted synthetic screens without real invoices or claiming public client authorization. A mobile app may be described as a project type; it does not require a new mobile-app service route without an actual offer.

Publication checklist: owner/client permission, truthful project type and authorship, screenshot redaction, license/asset rights, no credentials/PII/financial records, verified outcome wording, functioning published links, unique metadata, image alt/dimensions, browser/mobile acceptance. Private verification documents stay outside public bundles. Anonymous client work still needs permission and must not suggest a named endorsement.

## 4. Offers and recurring revenue

Use a consistent engagement ladder with service-specific deliverables. Publish qualification and scope rather than invented market prices or guaranteed revenue/time savings.

| Engagement | Standardizable deliverables | Requires scoping | Completion / recurring boundary |
|---|---|---|---|
| Discovery / technical audit | Intake/workshop, current-system map, risks, options and written scoped recommendation | System access, data sensitivity, number of stakeholders/integrations | Decision artifact and prioritized scope; no implied full implementation |
| Build / implementation | Milestones, reviewed acceptance criteria, test/demo/handover format | Features, commerce rules, identity/roles, migration, performance targets, provider constraints | Accepted deliverables against scope; changes handled through agreed change control |
| Integration / deployment | Environment checklist, release/runbook, smoke acceptance, rollback evidence | Existing hosts, downtime tolerance, compliance/provider accounts and external systems | Operational handover with named responsibility; separate authorization for production changes |
| Ongoing care / optimization | Scheduled updates, monitoring review, backup/restore checks, agreed response windows and reporting | Supported integrations, traffic, on-call coverage, incident scope, enhancement allowance | Recurring defined service, with exclusions and capacity; no invented 24/7 promise |

Examples of service fit: website care covers content/platform dependencies, accessibility/performance review and release health; software care adds integration/data consistency and access reviews; automation care covers provider changes, failed-run recovery, monitoring and human escalation. “Monitoring included” must identify who receives alerts and acts on them.

Separate free fit/discovery call from a paid technical audit engagement when the actual offer is established; do not advertise a free call as a full free architecture consultation. No prices are created by this plan. A dedicated packages page is justified only after repeat sales establish stable inclusions, exclusions and delivery boundaries. Start with compact engagement blocks and FAQs on service pages.

## 5. SEO and conversion mapping

Keyword themes below are intent hypotheses, **not researched volume/rank forecasts**. Validate through real search/customer language before claiming opportunity. English is the only actual localization; Austrian and SK/CZ targeting needs actual language/support strategy and evidence of service availability. Do not fabricate addresses, city pages or local-business presence. Add hreflang only between complete translated equivalents.

| Destination | Search intent / theme | Evidence needed | Conversion path |
|---|---|---|---|
| Home | Daniel VLKO; software developer and automation architect | Actual role/service fit | Relevant service or direct discovery |
| Web development | Custom business website / webshop development | Real web/platform work, technical/commerce boundaries | Case study → scoped enquiry |
| Custom software | Internal business platform / custom operations software | Genuine systems, implementation role, constraints | Relevant system story → discovery |
| Automation & AI | Business process automation / AI workflow integration | Actual integrations, exception handling, data policy | Workflow example → discussion |
| Work detail | Specific problem/system type and actual project name | Unique solution/screenshots/results | Related service → contact |
| About | Daniel VLKO background / approach | Factual biography and responsibilities | Work or direct call |
| Insights later | Specific customer question, e.g. evaluating a manual workflow | Original useful explanation, limitations, author review | Related proof/service; avoid every article forcing a booking |

Keep unique title/H1/description/canonical, truthful OG image, server-rendered essential copy, breadcrumbs on detail pages and validated sitemap inclusion for published pages only. Work/services/about should cross-link by relevance, not repeat the same broad copy. Existing unused StructuredData must be wired before claiming JSON-LD coverage. Use Person/WebSite initially; Service, CreativeWork and BreadcrumbList where they accurately describe visible content; no invented ratings, client results or FAQ rich-result guarantee.

Preserve private route/API noindex, draft notices and Preview access controls. Indexing changes follow actual public-launch approval. Measure consented conversion and server success separately so analytics loss/denial is not mistaken for booking failure. Content quality and production reliability precede an insights calendar.

## 6. First content work and explicit exclusions

First, gather one real project dossier: public/internal type, permission, actual role, problem, architecture, three to five sanitized screenshots and verifiable results. Draft one complete case study before building its reusable view. Then write actual About and three differentiated service briefs. This is the smallest credible growth foundation.

Do not redesign current sections, invent testimonials or numbers, create placeholder routes, add localization by inference, move content into Neon or buy a CMS. No page implementation is authorized by this audit plan.
