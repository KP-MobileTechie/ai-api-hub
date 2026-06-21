# AI API Hub — Project Guide

Live-tested directory of AI/LLM APIs. The differentiator is **live health data**
(daily uptime/latency checks) used to help developers pick the right API fast.

## Architecture

- **Next.js 14 App Router, STATIC EXPORT.** `next.config.mjs`: `output: 'export'`,
  `trailingSlash: true`, `images.unoptimized: true`.
- **No server.** No route handlers, no server actions, no `next/headers`, no runtime
  `fetch`. Everything renders at build time. Browser-only code (localStorage, window,
  `useSearchParams`) must live in a `'use client'` component and be SSR-guarded.
- **Data is build-time.** `lib/data.ts` reads `data/apis.json` + `data/history.json`
  via `readFileSync` and passes them as props. All interactivity (search, filter,
  sort, recommend, compare, URL sync) is client-side over already-loaded data.
- **Hosting:** Vercel (static), builds from `master`.

## Key directories

- `app/` — pages. `app/page.tsx` (home), `app/api/[id]/page.tsx` (detail, uses
  `generateStaticParams` + `generateMetadata`).
- `components/` — UI. `ApiGrid` is the client container that owns query/filter/sort/
  use-case/compare-selection/URL state; cards stay presentational.
- `lib/` — pure, unit-tested logic: `filter.ts` (`filterApis`, `sortApis`),
  `uptime.ts` (`computeUptime`, `formatRelative`), `recommend.ts` (`recommend`),
  `urlState.ts` (`encodeView`/`decodeView`), `data.ts`.
- `types/api.ts` — `ApiEntry`, `Category`, `FilterType`, `SortKey`, `History`.
- `scripts/` — `health-check.js` (daily liveness), `generate-badges.js` (status SVGs),
  `generate-snippets.js` (LLM-generated code snippets, needs `GROQ_API_KEY`).
- `data/apis.json` — the catalog. `data/history.json` — 7-day status history.

## Data pipeline (automated)

`.github/workflows/health-check.yml` runs daily (06:00 UTC): pings each API, writes
`data/apis.json` + `data/history.json`, generates `public/badge/<id>.svg`, then
**pushes directly to `master`** using the classic admin PAT secret `PROMOTE_TOKEN`
(scoped to the push step only). `master` is PR-protected with code-owner review;
a classic admin token bypasses it (a fine-grained PAT cannot). When an API is down it
opens/updates a rolling "⚠️ API health alert" issue.

## Conventions

- **Styling:** dark theme, primary `--accent: #8b5cf6`, bright `--accent-bright:
  #a78bfa`. Use the design tokens / component classes in `app/globals.css`
  (`.btn`, `.btn-primary`, `.btn-secondary`, `.metric-pill`, `.chip`, `.control-bar`,
  `.tag`). Prefer responsive Tailwind classes over inline styles for anything
  layout-/breakpoint-sensitive. See the `frontend-conventions` skill.
- **Accessibility:** global `:focus-visible` ring and `prefers-reduced-motion` reset
  exist; keep them. Icon-only controls need `aria-label`. Modals use
  `role="dialog"` + `aria-modal` + Escape-to-close + focus management.
- **Testing:** Jest + Testing Library. Pure logic is TDD'd in `lib/__tests__`;
  components mirror patterns in `components/__tests__`. `jest.setup.ts` resets the
  jsdom URL between tests (URL-syncing components leak otherwise).
- **Optional `ApiEntry` fields** (`pricing`, `rateLimit`, `freeCredits`,
  `sdkLanguages`, `regions`) render only when present — keep them optional.

## Commands

```bash
npm run dev          # local dev server (localhost:3000)
npm run build        # next build (static export) — also runs ESLint
npm test             # jest
npx tsc --noEmit     # typecheck
```

**Verification gate for any change:** `npx tsc --noEmit` clean, `npm test` green,
`npx next build` succeeds (19+ static pages, no lint errors).

## Gotchas

- ESLint runs during `next build` over test files too — no `any`
  (`@typescript-eslint/no-explicit-any`) and no unused imports, even in tests.
- `master` is protected; open a PR (CI/automation uses `PROMOTE_TOKEN`).
- Adding an API: see the `add-api` agent — it knows the full `ApiEntry` schema.
