# Daniel Vlcek Website — Phase 1 Foundation

This repository is intentionally only the **foundation** of the final website.

The goal is not to vibe-code the whole website in one pass. We will build it
section by section so every important architectural and frontend decision is
understood.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Motion
- App Router

## What is already prepared

- production-style folder structure
- strict TypeScript configuration
- ESLint
- Tailwind CSS
- global design tokens
- reusable Container component
- initial Header
- temporary Hero shell
- folders for future sections/assets
- original visual reference in `reference/`

## Run locally

Open a terminal in this folder and run:

```powershell
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Current architecture

```text
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   │   └── Header.tsx
│   ├── sections/
│   │   └── HeroShell.tsx
│   └── ui/
│       └── Container.tsx
├── content/
├── lib/
└── types/
```

## Planned build order

1. Foundation — DONE
2. Hero structure
3. Hero visual layers / Earth
4. Hero typography and CTA
5. Responsive Hero
6. Problem section
7. Connected System section
8. Services
9. Selected Work / case studies
10. Process
11. Why Daniel
12. Final CTA
13. Footer
14. Motion pass
15. Performance / accessibility / SEO
16. Production deployment

## Learning rule

For each next phase we will cover:

1. what we are building,
2. why it belongs where it does,
3. component architecture,
4. layout / CSS reasoning,
5. implementation,
6. testing in browser,
7. what would break if implemented differently.

Do not jump ahead unless there is a clear reason.
