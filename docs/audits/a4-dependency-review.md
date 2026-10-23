# A4 dependency security review - 23 October 2026

Fresh full `npm audit --json`: **14 affected package entries** (1 critical, 12 high, 1 moderate). The earlier A3 count of eight used `--omit=dev`. After scoped updates: **5 high entries, all development-only in one unpatched braces chain; zero critical/moderate/low**. Production `npm audit --omit=dev --json`: **0 findings**. An affected-package count is not a count of distinct vulnerabilities or demonstrated exploits.

No force fix, major application/Prisma upgrade, dependency removal, destructive reinstall, production operation or guard change was used. Next/ESLint config move together from 16.3.4 to 16.4.2; Prisma CLI/client/PG adapter move together from 7.10.0 to 7.10.1. Parent-supported dependency changes resolve deepmerge-ts and mysql2; targeted compatible updates resolve sharp, fast-uri, source-map-js and both brace-expansion branches. Prisma 8 prereleases were deliberately not adopted. `npm ls --json` and `npm ci --dry-run --ignore-scripts --no-audit` exit 0; the latter verifies install-plan/lock consistency without reinstalling.

| Dependency | Before severity | Relationship | Installed before | Installed after | Outcome | Exposure/reachability assessment |
|---|---|---|---|---|---|---|
| `@next/eslint-plugin-next` | high | transitive | 16.3.4 | 16.4.2 | OPEN: no compatible upstream fix | Development lint/glob dependency; trusted repository/config patterns, no application HTTP import. |
| `@prisma/config` | high | transitive | 7.10.0 | 7.10.1 | Resolved in current npm audit | CLI/config/dev-server tooling. npm retains this tree via the Prisma client optional peer; app uses PostgreSQL and generated runtime, with no mysql2 or Prisma CLI HTTP import. |
| `brace-expansion` | high | transitive | 1.1.18, 5.0.9 | 1.1.21, 5.0.12 | Resolved in current npm audit | Development lint/glob dependency; trusted repository/config patterns, no application HTTP import. |
| `braces` | high | transitive | 3.0.3 | 3.0.3 | OPEN: no compatible upstream fix | Development lint/glob dependency; trusted repository/config patterns, no application HTTP import. |
| `deepmerge-ts` | high | transitive | 7.1.5 | 8.0.2 | Resolved in current npm audit | CLI/config/dev-server tooling. npm retains this tree via the Prisma client optional peer; app uses PostgreSQL and generated runtime, with no mysql2 or Prisma CLI HTTP import. |
| `eslint-config-next` | high | direct | 16.3.4 | 16.4.2 | OPEN: no compatible upstream fix | Development lint/glob dependency; trusted repository/config patterns, no application HTTP import. |
| `fast-glob` | high | transitive | 3.3.1 | 3.3.1 | OPEN: no compatible upstream fix | Development lint/glob dependency; trusted repository/config patterns, no application HTTP import. |
| `fast-uri` | moderate | transitive | 3.1.7 | 3.1.9 | Resolved in current npm audit | CLI/config/dev-server tooling. npm retains this tree via the Prisma client optional peer; app uses PostgreSQL and generated runtime, with no mysql2 or Prisma CLI HTTP import. |
| `micromatch` | high | transitive | 4.0.8 | 4.0.8 | OPEN: no compatible upstream fix | Development lint/glob dependency; trusted repository/config patterns, no application HTTP import. |
| `mysql2` | high | transitive | 3.15.3 | 3.24.4 | Resolved in current npm audit | CLI/config/dev-server tooling. npm retains this tree via the Prisma client optional peer; app uses PostgreSQL and generated runtime, with no mysql2 or Prisma CLI HTTP import. |
| `next` | critical | direct | 16.3.4 | 16.4.2 | Resolved in current npm audit | Production framework/image infrastructure present. Exploitability depends on advisory prerequisites; no exploit demonstrated. |
| `prisma` | high | direct | 7.10.0 | 7.10.1 | Resolved in current npm audit | CLI/config/dev-server tooling. npm retains this tree via the Prisma client optional peer; app uses PostgreSQL and generated runtime, with no mysql2 or Prisma CLI HTTP import. |
| `sharp` | high | transitive | 0.35.4 | 0.35.5 | Resolved in current npm audit | Production framework/image infrastructure present. Exploitability depends on advisory prerequisites; no exploit demonstrated. |
| `source-map-js` | high | transitive | 1.2.1 | 1.2.2 | Resolved in current npm audit | PostCSS/Tailwind build source-map processing. No user-supplied source maps accepted by this app. |

## Advisory-by-advisory record

The links/ranges below are from the freshly queried npm advisory feed. GitHub Reviewed advisories and the maintainer's [Next 16.4.2 release](https://github.com/vercel/next.js/releases/tag/v16.4.2) were also consulted where retrievable. A listed remediation target is the release actually installed, not a claim that it is the first patched release on every historical branch.

- **moderate - brace-expansion**: [brace-expansion: Quadratic-time expansion of the `{a},b}` rewrite causes CPU denial of service](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr). Affected range: `<1.1.21`. Current target: `1.1.21, 5.0.12`; outside the reported affected range.
- **high - brace-expansion**: [brace-expansion: DoS via uncontrolled recursion on nested brace groups causing stack exhaustion](https://github.com/advisories/GHSA-qhr7-859c-m2p7). Affected range: `<1.1.20`. Current target: `1.1.21, 5.0.12`; outside the reported affected range.
- **high - brace-expansion**: [brace-expansion: DoS via uncontrolled recursion in parseCommaParts causing stack exhaustion](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p). Affected range: `<1.1.19`. Current target: `1.1.21, 5.0.12`; outside the reported affected range.
- **high - braces**: [braces vulnerable to stack-exhaustion denial of service through deeply nested patterns](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). Affected range: `<=3.0.3`. Current target: `3.0.3`; still affected; upstream reports no patched braces release.
- **high - deepmerge-ts**: [DeepmergeTS has stack exhaustion when merging recursive object graphs](https://github.com/advisories/GHSA-ggr8-5vv4-36mx). Affected range: `<8.0.0`. Current target: `8.0.2`; outside the reported affected range.
- **moderate - fast-uri**: [fast-uri vulnerable to inconsistent host case normalization via percent-encoded octets](https://github.com/advisories/GHSA-hrr3-gc8f-f4qj). Affected range: `>=3.0.0 <3.1.8`. Current target: `3.1.9`; outside the reported affected range.
- **high - mysql2**: [MySQL2: Auth Plugin Downgrade to mysql_clear_password Leaks Plaintext Credentials](https://github.com/advisories/GHSA-3f6p-5ww8-9rcr). Affected range: `<3.22.0`. Current target: `3.24.4`; outside the reported affected range.
- **moderate - mysql2**: [MySQL2: Unbounded zlib inflate in compressed MySQL protocol handler allows decompression-bomb DoS](https://github.com/advisories/GHSA-rgwj-5xj2-c3m3). Affected range: `<=3.23.0`. Current target: `3.24.4`; outside the reported affected range.
- **critical - next**: [Next.js: Remote Code Execution in next/og ImageResponse](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j). Affected range: `>=16.2.0 <16.3.6`. Current target: `16.4.2`; outside the reported affected range.
- **moderate - next**: [Next.js: Pending `use cache` fill can leak Draft Mode content into regular responses and persisted pages](https://github.com/advisories/GHSA-3w37-wq28-93x7). Affected range: `>=16.3.0 <16.3.8`. Current target: `16.4.2`; outside the reported affected range.
- **moderate - next**: [Next.js has cache poisoning of SSG and ISR pages in self-hosted applications](https://github.com/advisories/GHSA-4jqv-mc3x-m676). Affected range: `>=16.0.0 <16.3.8`. Current target: `16.4.2`; outside the reported affected range.
- **low ? next**: [Next.js has information disclosure in development server's Model Context Protocol endpoint](https://github.com/advisories/GHSA-39w2-rjm5-chcv). Affected range: `>=16.0.0 <16.3.8`. Current target: `16.4.2`; outside the reported affected range.
- **moderate - next**: [Next.js has information disclosure in App Router metadata image routes via dynamicParams bypass](https://github.com/advisories/GHSA-f87g-xv8r-7p7x). Affected range: `>=16.0.0 <16.3.8`. Current target: `16.4.2`; outside the reported affected range.
- **moderate - next**: [Next.js has cache poisoning in SSG/ISR rendering that leads to cross-user content substitution and persistent denial of service](https://github.com/advisories/GHSA-mcj8-r9mp-w47p). Affected range: `>=16.0.0 <16.3.8`. Current target: `16.4.2`; outside the reported affected range.
- **high - next**: [Next.js has Server-Side Request Forgery in Image Optimization](https://github.com/advisories/GHSA-cjq9-62q9-8jv4). Affected range: `>=16.0.0 <16.3.8`. Current target: `16.4.2`; outside the reported affected range.
- **critical - next**: [Next.js: Unauthenticated Remote Code Execution in Image Optimization API when SVG files are used](https://github.com/advisories/GHSA-2464-fhr4-w9xw). Affected range: `>=16.0.0 <=16.4.0`. Current target: `16.4.2`; outside the reported affected range.
- **high - next**: [Next.js: Denial of Service in App Router using Server Actions](https://github.com/advisories/GHSA-p3m5-59mp-jv5r). Affected range: `>=16.0.0 <=16.4.0`. Current target: `16.4.2`; outside the reported affected range.
- **moderate - next**: [next.js cache leak across root param values in nested 'use cache' functions](https://github.com/advisories/GHSA-h694-7cp9-m8p3). Affected range: `>=16.3.0 <16.3.8`. Current target: `16.4.2`; outside the reported affected range.
- **critical - next**: [Next.js: Unauthenticated Remote Code Execution in `use cache` functions returning typed arrays](https://github.com/advisories/GHSA-673q-mjm6-r5xr). Affected range: `>=16.0.0 <=16.4.0`. Current target: `16.4.2`; outside the reported affected range.
- **high - sharp**: [sharp : Vulnerability in librsvg dependency CVE-2026-96889](https://github.com/advisories/GHSA-wq5f-xc86-pv6w). Affected range: `<0.35.5`. Current target: `0.35.5`; outside the reported affected range.
- **high - source-map-js**: [source-map-js allows event-loop denial of service through indexed source-map section offsets](https://github.com/advisories/GHSA-68fv-2mgg-jv7q). Affected range: `>=1.0.0 <1.2.2`. Current target: `1.2.2`; outside the reported affected range.

## Critical Next.js conditions and limits

`src/lib/social-image.tsx` uses Node ImageResponse, but only fixed, repository-owned JSX/text/style values: there are no URL/body/user values passed into SVG content/attributes/styles. The [ImageResponse advisory](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j) requires attacker-controlled rendering inputs; that prerequisite was not found. The image optimizer is framework-reachable and used for local assets, while no remote image hosts or `dangerouslyAllowSVG` are configured. The separate optimizer/use-cache advisories were still remediated by updating Next; lack of a demonstrated exploit is not a justification for retaining an affected framework.

Source searches found no application `use cache`, Draft Mode or explicit Server Actions. Social-image routes have no dynamic path parameter or external input. These are source-level applicability observations, not a penetration test, a proof that all framework paths were unreachable, or production evidence. No exploitation payload was run.

## Unresolved development-only chain

`eslint-config-next -> @next/eslint-plugin-next -> fast-glob -> micromatch -> braces@3.0.3` accounts for all five remaining entries. [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) reports stack exhaustion on deeply nested glob patterns and **no patched version**. No compatible fixed version is currently published. npm suggests downgrading eslint-config-next to 14.2.35, which would mismatch the Next 16 toolchain; it was not accepted.

The chain is marked dev-only in the lockfile. It processes repository/configuration glob patterns during lint, rather than visitor HTTP data. Trusted inputs reduce the demonstrated attack surface, but untrusted contributions/build inputs still need isolation. Keep lint in restricted CI, do not feed untrusted patterns into these packages, monitor the upstream advisory and adopt a compatible patched lint/glob chain when available. Any local patch or toolchain replacement would need its own reviewed compatibility/tests; no fake override to an unaffected version or risk suppression was added. The full audit therefore remains FAIL/open, despite the clean production-only audit.

## Evidence

- `a4-dependency-before.json`, `a4-dependency-after.json`: full registry responses.
- `a4-dependency-production-after.json`: production-only response.
- `a4-dependency-tree-before.json`, `a4-dependency-tree-after.json`: successful npm ls snapshots.
- Full A4 regression results and operational launch blockers are recorded in `../LAUNCH_READINESS.md`.
