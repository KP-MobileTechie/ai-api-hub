# AI API Hub — Website Overhaul Design

**Date:** 2026-06-22
**Status:** Approved (scope) — pending spec review
**Author:** brainstorming session

## 1. Context

AI API Hub is a Next.js 14 App Router site exported as a **static site**
(`output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`). It is a
directory of AI APIs (currently 12) with a daily health check that records
liveness, latency, and 7-day history per API. Recent work added "Get API key"
actions, uptime metrics, sort, data enrichment, status badges, favorites, SEO,
and a fully automated daily data pipeline (health check pushes data + badges
straight to `master`).

Current UI: dark, premium aesthetic — purple (`#8b5cf6`) primary, cyan secondary;
fonts Bricolage Grotesque (display), Manrope, Geist Mono. Components: `NavBar`,
`ApiGrid`, `ApiCard`, `SearchBar`, `FilterChips`, `SortControl`, `CompareModal`,
`CodeSnippet`, `StatusBadge`, `FavoriteButton`. Data is read at build time via
`lib/data.ts` (`loadApis`, `loadHistory`).

**Root problem to fix:** layout-critical styling is written as **inline style
objects**, which cannot hold media queries. Responsiveness is therefore patchy
(handled by a few ad-hoc classes in `globals.css`), and styling is inconsistent
and hard to evolve.

## 2. North Star & Goals

**North star:** *Fastest decision-making.* A developer should be able to pick the
right AI API for their use case in under a minute. The live health/uptime/latency
data is the differentiator no other directory has.

**Goals**
- G1. Fully responsive, mobile-first experience (320px → wide desktop).
- G2. A coherent, token-driven design system replacing inline-style sprawl.
- G3. Decision-relevant data (free tier, latency, uptime, pricing) scannable at a
  glance on every card.
- G4. Accessibility: visible focus, sufficient contrast, keyboard nav, ARIA,
  `prefers-reduced-motion`.
- G5. New decision-making features: use-case recommender, comparison tray + rich
  compare, shareable URL-synced filters.

**Non-goals (YAGNI / deferred)**
- Live "try-it-now" playground / real API calls (needs a server + user keys;
  infeasible on a static export without a proxy).
- Light theme / theme switcher (dark is the brand identity).
- Backend, auth, user accounts, persistence beyond `localStorage`.
- Expanding the catalog count (separate content effort).

## 3. Approach

**Chosen:** Incremental refactor to a Tailwind-first design system. Migrate
layout-critical inline styles to Tailwind utility classes / CSS tokens one
component at a time, preserving all existing features and the dark aesthetic.
Lower risk than a from-scratch redesign, and reaches the quality bar that a
minimal mobile patch cannot.

The visual craft (palette refinement, typography scale, motion) will be guided by
the `frontend-design` skill during implementation.

## 4. Phase 1 — UI/UX + Responsiveness

### 4.1 Design-system foundation
- Define design tokens in `tailwind.config.ts` (and/or CSS custom properties in
  `globals.css`): a spacing scale, typography scale, color roles
  (surface/border/text tiers already exist as CSS vars — formalize them), radii,
  shadows, and motion durations/easings.
- Establish a small set of reusable component classes/utilities (buttons already
  exist as `.btn`/`.btn-primary`/`.btn-secondary`; extend the system: cards,
  chips, section headers, metric pills).
- Add a global `prefers-reduced-motion` rule that disables non-essential
  animations.

### 4.2 Responsiveness (mobile-first)
- Convert inline styles on layout elements (hero, stats row, footer, page
  padding, card internals) to responsive Tailwind classes so breakpoints apply
  everywhere.
- Hero: reduce padding on small screens; stats row reflows (no awkward
  border-right wrap) — stack or 2x2 grid on mobile.
- NavBar: add a mobile treatment (condensed actions / menu) and ensure the
  compare entry point is reachable on mobile.
- Filters + sort: a **sticky, horizontally scrollable control bar** on mobile so
  search/filter/sort stay accessible while scrolling the grid.
- Card grid: verified 1 / 2 / 3 column behavior with comfortable tap targets.

### 4.3 Decision-first cards
- Restructure `ApiCard` so the decision-relevant signals are scannable: status,
  free-tier, **uptime %**, **avg latency**, and price hint as compact "metric
  pills"; consistent action row (Get API key / Docs / Details) and the favorite
  star.
- Ensure the card reads well at all breakpoints and meets contrast/tap-target
  requirements.

### 4.4 Accessibility
- Visible `:focus-visible` rings on all interactive elements.
- Contrast audit against WCAG AA for text/UI on the dark theme; adjust the muted
  text tiers if any fail.
- Keyboard navigation for filters, sort, compare selection, and the modal (focus
  trap + Escape, which `CompareModal` should already approximate — verify).
- ARIA labels on icon-only controls; semantic landmarks.

## 5. Phase 2 — Features (serving "fastest decision-making")

### 5.1 Use-case recommender ("Help me choose")
- Entry point in the hero / nav. User picks a use case (chat / embeddings /
  image-gen / speech / code / multimodal / vision — these map to the existing
  `Category` type).
- Output: a ranked shortlist of APIs for that use case, scored from live data
  (alive, uptime %, latency) and free-tier generosity. Pure client-side ranking
  over the already-loaded data — no server needed.
- Implemented as a client component; ranking logic lives in a pure, unit-tested
  `lib/recommend.ts`.

### 5.2 Comparison tray + rich compare
- A persistent, dismissible **comparison tray**: selecting "compare" on cards
  adds them to the tray (cap ~3–4). The tray shows selected APIs and a "Compare"
  action.
- Compare view (upgrade of `CompareModal`): a side-by-side table across the
  decision dimensions — category, free tier, **uptime %**, **avg latency**,
  pricing, rate limit, free credits, auth, SDK languages, regions, models.
- Selection state in React (lifted to the grid/page level); no persistence
  required beyond the session.

### 5.3 URL-synced filters/sort
- Reflect search query, active filter, and sort key in the URL query string so a
  filtered view is shareable and survives reload.
- On a static export, read/write the query string client-side (e.g.
  `useSearchParams` + `history.replaceState` or `router.replace`); initial state
  hydrates from the URL.

## 6. Architecture & Components

- **Tokens:** `tailwind.config.ts` + `app/globals.css` (custom properties).
- **New pure libs (unit-tested):** `lib/recommend.ts` (use-case ranking). Reuse
  existing `lib/filter.ts` (`filterApis`, `sortApis`) and `lib/uptime.ts`.
- **New components:** `UseCasePicker` (client), `ComparisonTray` (client),
  `MobileFilterBar` (or refactor of `FilterChips`/`SortControl` into a sticky bar).
- **Refactored components:** `ApiCard`, `ApiGrid` (owns filter/sort/compare/URL
  state), `NavBar` (mobile), `CompareModal` (richer table), `app/page.tsx` and
  `app/api/[id]/page.tsx` (inline-style → classes).
- **State ownership:** `ApiGrid` is the client container that holds query, filter,
  sort, compare-selection, and URL sync. Cards stay presentational; the favorite
  star and use-case picker manage their own local concerns.

## 7. Data Flow

Unchanged at the source: data is read at build time from `data/apis.json` /
`data/history.json` and passed as props into client components. All new behavior
(recommend, compare, filter/sort, URL sync) is **client-side over already-loaded
data** — consistent with the static-export constraint. The daily pipeline keeps
refreshing the JSON + badges on `master`.

## 8. Error / Edge Handling

- Empty states: no search results, no APIs for a chosen use case, empty
  comparison tray — each gets a clear message.
- Missing optional fields (pricing, rateLimit, etc.) render gracefully (omit the
  row/pill), as today.
- Malformed/absent URL params fall back to defaults without throwing.
- `localStorage` access (favorites) stays SSR-guarded.

## 9. Testing

- **Unit (Jest, existing setup):** `lib/recommend.ts` ranking; extend
  `lib/filter.ts` tests if filter/sort change; component tests for the new
  controls mirroring existing `__tests__` patterns (ApiCard, FilterChips, etc.).
- **Build gate:** `npx tsc --noEmit`, `npx jest`, `npx next build` must all pass
  (static export must compile; 19+ pages generate).
- **Manual/responsive:** verify key breakpoints (≈360, 768, 1024, 1440) and a
  reduced-motion pass.

## 10. Rollout

- Branch `feat/website-overhaul`; ship Phase 1 and Phase 2 as reviewable
  increments (separate PRs where practical).
- Each PR keeps the verification gate green.
- After the website work, build the **minimal project tooling** that proved
  useful (e.g. a project design-system skill and an "add-new-API" content agent)
  — specced separately.

## 11. Open Questions / Decisions Deferred to Implementation

- Exact recommender scoring weights (tune during implementation against real data).
- Whether the mobile nav becomes a full menu or condensed actions (decide with a
  mockup during `frontend-design`).
- Comparison tray cap (start at 3).
