# Daniel VLKO - project instructions

Daniel VLKO is a Software Developer & Automation Architect. Position the business as a builder of connected systems, with clear professional copy and real delivery evidence.

## Start here

- Read [development workflow](docs/DEVELOPMENT_WORKFLOW.md) and [Website V2 plan](docs/WEBSITE_V2_PLAN.md) before implementation. Read only the task-relevant release/audit sections when needed; do not restart a general audit.
- Main development base: `develop/website-v2`. Stable checkpoint: RC2 `736dc09539919180c4c2ec6ab29978adf1795149` on `release/danielvlko-rc2`.
- Inspect repository root, current branch/commit, status and worktrees first. Use the dedicated development worktree; never assume the older integration folder or `origin/main` is current. Do not overwrite an existing branch.
- Preserve RC1/RC2, security/integration/backup branches, unrelated changes and environment files. Keep new work scoped to the user's request.

## Technology and architecture

- Next.js App Router, React, TypeScript, Tailwind/CSS modules, Prisma and Neon PostgreSQL. Retain Google Calendar/Meet, Resend and existing consent-aware integrations.
- Reuse existing architecture and components. Default to server components for page content; isolate client interactions. Keep the native BookingWizard. No Cal.com.
- Preserve A1-A5, B1 and B2 behavior: ownership-bound booking attempts, exact-origin/request guards, durable session revocation, bounded inputs/quotas, safe logging, reservation/revision guards and provider/email recovery.
- No unnecessary abstractions, state libraries, UI frameworks, dependencies or component rewrites. Start case studies with typed local TypeScript content; no CMS or database content models without a concrete need.
- Keep runtime portable to Linux VPS. Avoid new Vercel-specific coupling. Change Prisma models only when needed; use reviewed additive migrations and preserve data/history. Never run production migrations as routine development.
- Do not casually change production configuration, hosting, OAuth, email settings or secrets. Local presentation work needs no production database/provider access.

## Design and content

- Preserve the current premium design, branding, orange/dark palette, Geist typography, design tokens, spacing and visual hierarchy. No template-style redesign or unnecessary decoration.
- Reuse Container, existing page/section composition and established UI patterns. Maintain responsive layouts, keyboard access, visible focus and reduced-motion behavior.
- Do not move the Header/Footer into the root layout indiscriminately: public, contact and private pages use different composition.
- Keep a professional, concrete tone. No invented client relationships, case studies, testimonials, credentials, prices, results or metrics. Internal/demo projects must be labelled truthfully.
- Publish project material only with approved facts, rights and sanitized screenshots. Keep private evidence, credentials and customer data out of public content/bundles.
- Link only completed public destinations. Preserve private/draft noindex, consent behavior and booking/contact paths.

## Work and verification

- Inspect relevant files before editing; make targeted changes and preserve unrelated work. Document meaningful architectural changes.
- Run relevant existing tests, TypeScript and full ESLint; run a production build for significant application changes. Report actual results and unverified integration checks separately.
- Fresh worktrees need a build before standalone TypeScript so Next route types exist. The workflow lists safe commands and the complete offline regression suite; package test aliases do not cover every B1/B2 test.
- Keep tests synthetic. Do not send real email/calendar events or connect to production Neon. Do not invoke Docker/database acceptance runners by default.
- Do not push, deploy, change production settings or execute launch steps unless the user requests that scope. Use the [deferred launch checklist](docs/FINAL_LAUNCH_CHECKLIST.md) when release work is explicitly authorized.
- Local development readiness does not establish deployed security. Existing documentation records SEC-01 older deployed booking/admin exposure; flag a separate urgent hotfix/containment task rather than deferring it to content launch. Current deployment state must be verified separately before claiming it is fixed.
