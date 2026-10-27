# Website V2 development workflow

## Source and working directory

Use `develop/website-v2` in `C:/Users/danko/Desktop/daniel-vlcek-web/danielvlko-dev`. Open this folder in the next Codex chat, then read AGENTS.md and WEBSITE_V2_PLAN.md. The original `daniel-vlcek-web-phase-1` folder remains a dirty integration worktree; it is not the active V2 base.

Starting checkpoint: **RC2 `736dc09539919180c4c2ec6ab29978adf1795149`**. Verified ancestry is A5 `1f4a4f4` -> RC1 `66fde05` -> B1 `2d272df` -> B2/RC2 `736dc09`. RC1 retains the A5 runtime/test/migration/package blobs (no differences in those paths); A5 release evidence records preservation of A1-A4. RC2 includes B1/B2 source, migrations and tests. This confirms local source lineage, not that every historical acceptance gate or deployment is complete.

RC1, RC2, security/integration and backup refs remain preserved. Do not reset/rebase/force-update them or use outdated origin/main as the baseline. Do not copy environment files from another worktree.

At the start of a task:

```powershell
git rev-parse --show-toplevel
git status --short
git branch --show-current
git rev-parse HEAD
git worktree list
git merge-base --is-ancestor 736dc09539919180c4c2ec6ab29978adf1795149 HEAD
```

Inspect existing changes before editing. Work on the active development branch or a scoped child branch when useful; inspect a pre-existing branch instead of replacing it. Commit only the intended files. No automatic push or deployment.

## Local development

Use the existing lockfile and Node 24 toolchain (RC2 verification: Node 24.18.0, npm 11.16.0). Each worktree needs its own working node_modules; do not use an external-worktree junction for Turbopack. Install with `npm ci` when dependencies are absent; do not upgrade dependencies as setup work. This setup reuses a local copy of RC2's existing dependencies, not a fresh install.

To view the full site locally, set the process-only presentation flag:

```powershell
$env:COMING_SOON_ENABLED = "false"
npm run dev -- --hostname 127.0.0.1
```

The flag controls presentation; it does not disable booking/admin APIs. Public page work requires no database or provider credentials. Do not load a production environment for routine development. Use synthetic fixtures for booking/admin work; an isolated database/provider environment needs a separate scoped task. Preserve all existing secrets without printing, copying or editing them.

## Verification

For a fresh worktree, build before standalone TypeScript because Next generates route declarations:

```powershell
npm run build
node node_modules/typescript/bin/tsc --noEmit
npm run lint
node --import tsx --test tests/admin-security.test.ts tests/security.test.ts tests/booking-calendar.test.ts tests/booking-reminders.test.ts tests/booking-reliability.test.ts
node --import tsx scripts/check-privacy.ts
node --import tsx scripts/check-contact-tracking.ts
git diff --check
```

Check each command's exit code. `test:security` and `test:booking` aliases run subsets; the explicit command covers all current B1/B2/ownership/calendar/reminder fixtures. These tests intercept providers and use in-memory persistence; they do not prove real PostgreSQL concurrency, migration/rollback or delivery. `test:security:postgres` and `test:acceptance` can launch Docker/use external fixtures; do not run them as this lightweight check.

For ordinary changes, select relevant tests and verify TypeScript/full ESLint; include the production build for significant changes. Add tests for new behavior, not documentation-only changes. Future page work also needs local responsive/keyboard/metadata checks; record browser checks as unverified if unavailable.

No application code, packages, schemas or configuration are changed by this setup.

## Next-chat handoff

Describe one page/change and its acceptance criteria. Supply approved real content/assets or identify the missing facts. Use WEBSITE_V2_PLAN.md for scope and reuse guidance. Keep launch work separate using FINAL_LAUNCH_CHECKLIST.md. Historical operational/source evidence remains in RELEASE_CANDIDATE.md and the B1/B2 completion sections of strategy/EXECUTION_ROADMAP.md and audits/MASTER_SECURITY_ARCHITECTURE_AUDIT.md; older audit prose is not a new instruction to repeat hardening.

The historical WEBSITE_EXPANSION_PLAN.md was absent from RC2 but present untracked in the preserved integration workspace. This development branch carries an unchanged copy for continuity. W1-W5 ordering in WEBSITE_V2_PLAN.md supersedes its older sequencing suggestions.


## Setup verification - 23 October 2026

Dedicated worktree, unchanged RC2 application, Node 24.18.0 / npm 11.16.0, copied existing RC2 dependencies; no credential environment files copied or created.

| Check | Actual result |
|---|---|
| `npm run build` | PASS; production Next build, 19 static entries |
| `node node_modules/typescript/bin/tsc --noEmit` | PASS after build |
| `npm run lint` | PASS; full ESLint |
| Explicit five-file regression command above | **78/78 PASS**; B1, B2, A2 ownership, calendar/reminder fixtures |
| Privacy/contact tracking scripts | PASS |
| New documentation links and copied expansion-plan identity | PASS; copied plan byte-for-byte unchanged |
| Source ancestry | PASS; exact RC2 includes A5 -> RC1 -> B1 -> B2; A1-A4 preservation recorded in existing A5 evidence |
| Application/manifest/schema/config delta from RC2 | NONE; documentation-only setup |

Real Neon/concurrency/migration/rollback, live provider delivery and fresh browser acceptance are **NOT VERIFIED** by this setup. No migrations, external booking writes, infrastructure, production changes, push or deployment were performed. The older-production exposure flag is in FINAL_LAUNCH_CHECKLIST.md; development verification does not resolve it.


## Portable design work - 27 October 2026

For a new PC, follow [PC_HANDOFF.md](PC_HANDOFF.md). `npm ci` then `npm run preview:design` runs the actual site components at loopback port 3105, including draft portfolio pages with private supplemental synthetic media. The launcher needs no Python, database or .env and does not forward application credentials. Its API routes are disconnected; production publication/security behavior is separate. [Review results](PC_HANDOFF_REVIEW.md) cover the fresh transfer check and the targeted Zod security patch. The older test-results-only harness is historical and is not needed for this workflow.
