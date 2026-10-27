# Website V2 on another PC

Use **Node.js 24 LTS**, npm and Git. Development branch: `develop/website-v2`. Source includes the homepage, services, About, portfolio components, typography, CSS modules, animations and existing public images. No original worktree path or design tool is needed.

## Complete private transfer ZIP

Extract `daniel-vlko-v2-transfer-2026-10-27.zip` into a new folder. The snapshot includes current code and three synthetic FinanceOS review images. It excludes Git metadata, environment files, credentials, dependencies, build caches and local `.vercel` settings.

From the extracted project root:

```powershell
npm ci
npm run preview:design
```

Open **http://127.0.0.1:3105/**. Use `npm run preview:design -- --port 3106` if needed. Stop with Ctrl+C. Paths containing spaces are supported; Python is not required.

Do not extract over a dirty checkout. To retain Git history, use the Git route below and extract only the small media ZIP there.

## Git checkout plus private review media

```powershell
git clone --branch develop/website-v2 https://github.com/dvlcek/daniel-vlcek-web.git
cd daniel-vlcek-web
```

For an existing clean checkout, fetch the branch, switch to it and use `git pull --ff-only`. Preserve or commit your own work first; no reset/clean/force command is needed.

Extract `daniel-vlko-design-media-2026-10-27.zip` into the repository root. It supplies:

```text
tools/design-preview/private-media/dashboard.webp
tools/design-preview/private-media/cashflow.webp
tools/design-preview/private-media/priorities.webp
```

Then run the two npm commands above. The repository is public, so these unapproved local-review captures deliberately remain ignored. Keep both transfer ZIPs private; they are not publication approval.

## Preview behavior

All nine pages share one origin: `/`, `/services`, its three service details, `/work`, `/work/financeos`, `/about` and `/contact`. Legal and coming-soon presentation is also available. Actual source components and CSS render directly; edits refresh in the browser.

The separate app in `tools/design-preview` substitutes only local portfolio navigation/content. Its launcher binds to loopback and serves images only from two allowed folders. It does not forward database, admin, OAuth or email variables to Next.js. No `.env` is required. Its API catch-all returns an explicit 503; it cannot create real bookings, email or calendar events. Private/admin pages are not imported. All responses are noindex.

The root production app has no preview bypass. Its existing FinanceOS approval gate, Work fallback, consent and security behavior remain effective. `npm run dev` starts that root app; for design work use `preview:design`.

## Editing map

| Area | Files |
|---|---|
| Tokens, typography and buttons | `src/app/globals.css`, `src/components/ui/Container.tsx` |
| Navigation | `src/components/layout/HeaderNavigation.tsx`, `Footer.tsx` |
| Homepage | `src/components/sections/`, composed by `src/components/pages/HomePageContent.tsx` |
| Services | `src/components/services/`, `src/content/services.ts` |
| About | `src/components/about/`, `src/content/about.ts` |
| Work and FinanceOS | `src/components/work/`, `src/content/projects.ts` |
| Local-only fixture | `tools/design-preview/project.js`, ignored `private-media/` |

Keep synthetic images in the preview folder. Do not copy them to root `public` or enable approval flags as a design workaround. Booking, auth, APIs and Prisma need no changes for presentation edits.

## Verification and release boundary

See [PC handoff review](PC_HANDOFF_REVIEW.md) for fresh results and [navigation audit](NAVIGATION_SEO_AUDIT.md) for earlier evidence.

RC2 security/booking protections are present locally. This does not establish the deployed production revision, migrations or provider behavior. SEC-01 remains a separate urgent deployment-verification/containment task; see [existing evidence](SEC01_PRODUCTION_VERIFICATION.md). FinanceOS and legal publication approvals remain outstanding. Design readiness is not production launch approval.
