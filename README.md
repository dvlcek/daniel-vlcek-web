# Daniel VLKO - Website V2

Connected website for Daniel VLKO, Software Developer & Automation Architect. Next.js App Router, React, TypeScript, Tailwind/CSS modules and the existing native booking system.

## Local design work

Use **Node.js 24 LTS**. From the project root:

```powershell
npm ci
npm run preview:design
```

Open **http://127.0.0.1:3105/**. All nine pages use actual source components, images, typography and animations. Booking/providers are disconnected in this isolated preview; no database or `.env` is needed.

FinanceOS review captures are private supplemental files, excluded from this public repository. Extract the private media ZIP first, or use the complete transfer snapshot. See **[PC setup and design editing guide](docs/PC_HANDOFF.md)** for exact steps and file locations.

## Development and verification

- [Development workflow](docs/DEVELOPMENT_WORKFLOW.md)
- [Website V2 plan](docs/WEBSITE_V2_PLAN.md)
- [Connected website implementation](docs/CONNECTED_WEBSITE_IMPLEMENTATION.md)
- [Navigation and SEO audit](docs/NAVIGATION_SEO_AUDIT.md)
- [PC handoff review](docs/PC_HANDOFF_REVIEW.md)

Use `develop/website-v2` as the V2 base. Preserve security/booking behavior; production release is separate. FinanceOS and legal-review gates remain active. [SEC-01 production verification remains unresolved](docs/SEC01_PRODUCTION_VERIFICATION.md).
