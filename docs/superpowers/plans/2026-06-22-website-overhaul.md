# AI API Hub — Website Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make AI API Hub best-in-class for *fast AI-API decision-making* through a responsive, token-driven UI and three decision-support features.

**Architecture:** Incremental refactor of a Next.js 14 static-export site. Migrate layout-critical inline styles to a Tailwind-first design system, make it mobile-first and accessible, then add client-side decision features (use-case recommender, comparison tray + rich compare, URL-synced filters) operating over build-loaded JSON data.

**Tech Stack:** Next.js 14 App Router (`output: 'export'`), TypeScript, Tailwind CSS, Jest + Testing Library. Fonts: Bricolage Grotesque / Manrope / Geist Mono. No backend.

## Global Constraints

- Static export only: `next.config.mjs` has `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`. No route handlers, no server code, no runtime `fetch`, no `next/headers`.
- Browser APIs (localStorage, window, useSearchParams) require a `'use client'` component and must be SSR-guarded.
- Data is read at build time via `lib/data.ts` (`loadApis`, `loadHistory`); all new behavior is client-side over already-loaded props.
- Preserve the dark aesthetic: primary `--accent: #8b5cf6`, bright `--accent-bright: #a78bfa`. Keep existing features working (search, filter, sort, favorites, compare, badges, SEO).
- Verification gate for every task: `npx tsc --noEmit` clean, `npx jest` green, and `npx next build` succeeds.
- TDD for all pure logic. Match existing test patterns in `components/__tests__` and `lib/__tests__`.
- The exact visual styling (token values, motion, layout polish) on the CSS tasks is set during implementation using the `frontend-design` skill; this plan fixes the structure, class names, responsiveness, and acceptance criteria.

---

## File Structure

**Create**
- `lib/recommend.ts` — pure use-case ranking (Phase 2)
- `lib/__tests__/recommend.test.ts`
- `lib/urlState.ts` — pure encode/decode of grid view state to URL params (Phase 2)
- `lib/__tests__/urlState.test.ts`
- `components/UseCasePicker.tsx` — client; use-case → shortlist UI
- `components/ComparisonTray.tsx` — client; selection tray
- `components/ControlBar.tsx` — client; sticky search+filter+sort container
- `components/__tests__/UseCasePicker.test.tsx`
- `components/__tests__/ComparisonTray.test.tsx`

**Modify**
- `tailwind.config.ts` — design tokens
- `app/globals.css` — formalize CSS custom properties, reduced-motion, focus-visible, new component classes
- `app/page.tsx` — hero/stats/footer inline styles → responsive classes
- `app/api/[id]/page.tsx` — inline styles → responsive classes
- `components/NavBar.tsx` — mobile treatment
- `components/ApiCard.tsx` — decision-first layout, metric pills, responsive
- `components/ApiGrid.tsx` — owns filter/sort/compare/URL state; renders ControlBar, ComparisonTray
- `components/CompareModal.tsx` — rich comparison table
- `components/FilterChips.tsx`, `components/SortControl.tsx` — consumed by ControlBar

---

# PHASE 1 — UI/UX + Responsiveness

### Task 1: Design tokens & global CSS foundation

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

**Interfaces:**
- Produces: CSS custom properties and Tailwind theme tokens used by all later tasks: color roles (`--bg`, `--surface`, `--surface-hover`, `--border`, `--border-hover`, `--accent`, `--accent-bright`, `--accent-2`, `--text`, `--text-2`, `--text-3`, `--live`, `--down`), spacing scale, radii (`--r-sm/md/lg/xl`), motion durations (`--dur-fast: 120ms`, `--dur: 180ms`, `--dur-slow: 280ms`), and component classes `.metric-pill`, `.control-bar`, plus a global `:focus-visible` ring and a `prefers-reduced-motion` reset.

- [ ] **Step 1: Read current tokens**

Run: read `app/globals.css` and `tailwind.config.ts`. Confirm which `--*` vars already exist (accent, surface, border, text tiers, live/down) so we extend rather than duplicate.

- [ ] **Step 2: Add focus-visible + reduced-motion globals**

Append to `app/globals.css` (outside `@layer components`):

```css
:where(a, button, [role="button"], input, select, [tabindex]):focus-visible {
  outline: 2px solid var(--accent-bright);
  outline-offset: 2px;
  border-radius: 6px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Add motion + radius tokens to `:root`**

In the `:root` block of `app/globals.css`, add (keep existing vars):

```css
  --r-sm: 6px;
  --r-md: 8px;
  --r-lg: 12px;
  --r-xl: 16px;
  --dur-fast: 120ms;
  --dur: 180ms;
  --dur-slow: 280ms;
  --ease: cubic-bezier(0.4, 0, 0.2, 1);
```

- [ ] **Step 4: Add metric-pill + control-bar component classes**

Inside the `@layer components` block in `app/globals.css`:

```css
  .metric-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: var(--r-sm);
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text-2);
    font-family: var(--font-mono);
    font-size: 10.5px;
    line-height: 1.4;
    white-space: nowrap;
  }
  .control-bar {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }
  @media (max-width: 640px) {
    .control-bar { flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .control-bar::-webkit-scrollbar { display: none; }
  }
```

- [ ] **Step 5: Expose tokens to Tailwind**

In `tailwind.config.ts`, extend `theme.extend` so utilities map to the CSS vars (merge with any existing extend):

```ts
extend: {
  colors: {
    bg: 'var(--bg)',
    surface: 'var(--surface)',
    border: 'var(--border)',
    accent: 'var(--accent)',
    'accent-bright': 'var(--accent-bright)',
  },
  borderRadius: { sm: 'var(--r-sm)', md: 'var(--r-md)', lg: 'var(--r-lg)', xl: 'var(--r-xl)' },
  transitionTimingFunction: { brand: 'var(--ease)' },
}
```

- [ ] **Step 6: Verify build**

Run: `npx next build`
Expected: compiles, 19+ static pages generated, no errors.

- [ ] **Step 7: Commit**

```bash
git add app/globals.css tailwind.config.ts
git commit -m "feat(ui): design tokens, focus-visible, reduced-motion foundation"
```

---

### Task 2: Responsive home page (hero / stats / footer)

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: token classes from Task 1.
- Produces: no API change; `app/page.tsx` keeps `loadApis()` build-time data flow and the `stats` array shape.

- [ ] **Step 1: Read `app/page.tsx`** and inventory inline styles on hero `<section>`, `.hero-stats`, `.hero-stat`, page padding, and footer.

- [ ] **Step 2: Migrate hero + section padding to responsive classes**

Replace fixed inline paddings (`padding: '80px 48px 64px'`, `padding: '0 48px'`) with Tailwind responsive utilities, e.g. `className="px-5 pt-14 pb-12 sm:px-10 md:px-12 md:pt-20"`. Apply `frontend-design` for the exact scale. Keep the animated grid + glow but ensure they are decorative (`aria-hidden`, disabled under reduced-motion via Task 1).

- [ ] **Step 3: Make the stats row reflow**

Convert `.hero-stats` from a flex row with `borderRight` separators to a layout that becomes a 2×2 grid under 640px (e.g. `grid grid-cols-2 gap-y-6 sm:flex sm:justify-center`). Remove the per-item `borderRight` on mobile.

- [ ] **Step 4: Make the footer stack on mobile**

The footer currently uses `justify-content: space-between`. Add `flex-col gap-3 text-center sm:flex-row sm:text-left sm:justify-between`.

- [ ] **Step 5: Acceptance check at breakpoints**

Run: `npx next build` then visually verify (dev server `npm run dev`) at ~360px, 768px, 1024px, 1440px:
- No horizontal scroll on the body at 360px.
- Stats readable (2×2 on mobile), hero text not clipped.
Expected: passes at all four widths.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx
git commit -m "feat(ui): responsive hero, stats, and footer"
```

---

### Task 3: NavBar mobile treatment

**Files:**
- Modify: `components/NavBar.tsx`

**Interfaces:**
- Consumes: existing props (`liveCount`, `apis`). Do NOT change the props.
- Produces: same component contract; adds responsive internal layout.

- [ ] **Step 1: Read `components/NavBar.tsx`** and identify actions (links, compare entry point, live count).

- [ ] **Step 2: Add a responsive layout**

Ensure the brand stays left and actions collapse gracefully on mobile: hide non-essential text labels under 640px (keep icons + the Compare entry point reachable). Use Tailwind responsive classes; no JS menu is required if actions fit — only add a disclosure/menu if they don't.

- [ ] **Step 3: Keyboard + aria**

Confirm all nav controls are `<a>`/`<button>` with discernible names (`aria-label` on icon-only). Tab order left→right.

- [ ] **Step 4: Verify**

Run: `npx next build` and check NavBar at 360px (no overflow) and desktop (unchanged).
Expected: no horizontal overflow; Compare reachable on mobile.

- [ ] **Step 5: Commit**

```bash
git add components/NavBar.tsx
git commit -m "feat(ui): responsive NavBar with reachable compare on mobile"
```

---

### Task 4: Sticky control bar (search + filter + sort)

**Files:**
- Create: `components/ControlBar.tsx`
- Modify: `components/ApiGrid.tsx`
- (Consumed: `components/SearchBar.tsx`, `components/FilterChips.tsx`, `components/SortControl.tsx`)

**Interfaces:**
- Consumes: token class `.control-bar` (Task 1); existing `SearchBar`, `FilterChips`, `SortControl` props.
- Produces: `ControlBar` component:
  ```ts
  interface ControlBarProps {
    apis: ApiEntry[]
    query: string; onQueryChange: (v: string) => void
    filter: FilterType; onFilterChange: (f: FilterType) => void
    sort: SortKey; onSortChange: (s: SortKey) => void
  }
  export function ControlBar(props: ControlBarProps): JSX.Element
  ```

- [ ] **Step 1: Read `ApiGrid.tsx`, `SearchBar.tsx`, `FilterChips.tsx`, `SortControl.tsx`** to confirm current props.

- [ ] **Step 2: Create `components/ControlBar.tsx`** (`'use client'`) that composes SearchBar + FilterChips + SortControl, wrapping the filter/sort row in `className="control-bar"` so it becomes horizontally scrollable under 640px (Task 1 CSS). Make the bar sticky: `className="sticky top-0 z-20 ..."` with the existing page background so content scrolls under it.

- [ ] **Step 3: Wire into `ApiGrid.tsx`**

Replace the inline SearchBar + FilterChips + SortControl block with `<ControlBar ...>` passing the existing state and setters. No behavior change to filtering/sorting.

- [ ] **Step 4: Verify**

Run: `npx jest` (existing SearchBar/FilterChips tests still pass) and `npx next build`.
Expected: tests green; on mobile the filter row scrolls horizontally and the bar sticks on scroll.

- [ ] **Step 5: Commit**

```bash
git add components/ControlBar.tsx components/ApiGrid.tsx
git commit -m "feat(ui): sticky, scrollable control bar for search/filter/sort"
```

---

### Task 5: Decision-first ApiCard

**Files:**
- Modify: `components/ApiCard.tsx`
- Modify: `components/__tests__/ApiCard.test.tsx`

**Interfaces:**
- Consumes: `metric-pill` class (Task 1); `formatRelative` from `lib/uptime.ts`; `ApiEntry` fields incl. optional `pricing`.
- Produces: unchanged props (`{ api: ApiEntry }`). Card must keep rendering name, category, description, free-tier, tags, snippet, FavoriteButton, and the Get API key / Docs / Details actions.

- [ ] **Step 1: Add a failing test** in `components/__tests__/ApiCard.test.tsx` asserting the card renders latency and a price hint as metric pills when present:

```tsx
it('shows latency and price as metric pills when present', () => {
  const api = { ...baseApi, status: { ...baseApi.status, latencyMs: 125, alive: true }, pricing: '$0.05/1M' }
  render(<ApiCard api={api} />)
  expect(screen.getByText(/125\s*ms/i)).toBeInTheDocument()
  expect(screen.getByText(/\$0\.05\/1M/)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx jest components/__tests__/ApiCard.test.tsx -t "metric pills"`
Expected: FAIL (price pill not rendered yet).

- [ ] **Step 3: Restructure the card to a decision-first layout**

Group the scannable signals into a metric-pill row near the top: status (existing `StatusBadge`), free-tier indicator, avg latency (`{api.status.latencyMs}ms` when non-null), and price hint (`api.pricing` when present). Keep description, tags, snippet, favorite star, and action row. Use `.metric-pill` for the new pills. Ensure layout is responsive (pills wrap; tap targets ≥ 32px). Apply `frontend-design` for spacing/hierarchy.

- [ ] **Step 4: Run tests**

Run: `npx jest components/__tests__/ApiCard.test.tsx`
Expected: PASS (all existing card tests + new one).

- [ ] **Step 5: Commit**

```bash
git add components/ApiCard.tsx components/__tests__/ApiCard.test.tsx
git commit -m "feat(ui): decision-first ApiCard with scannable metric pills"
```

---

### Task 6: Accessibility pass

**Files:**
- Modify: `components/CompareModal.tsx` (focus trap + Escape if missing)
- Modify: `app/globals.css` (only if contrast fixes needed)
- Create: `components/__tests__/CompareModal.a11y.test.tsx`

**Interfaces:**
- Consumes: existing `CompareModal` props.
- Produces: modal with `role="dialog"`, `aria-modal="true"`, Escape-to-close, and focus return.

- [ ] **Step 1: Read `CompareModal.tsx`** to see current dialog semantics and close behavior.

- [ ] **Step 2: Add failing a11y test**

```tsx
it('closes on Escape and has dialog role', () => {
  const onClose = jest.fn()
  render(<CompareModal apis={[apiA, apiB]} onClose={onClose} />)
  expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  fireEvent.keyDown(document, { key: 'Escape' })
  expect(onClose).toHaveBeenCalled()
})
```

- [ ] **Step 3: Run to confirm fail**

Run: `npx jest components/__tests__/CompareModal.a11y.test.tsx`
Expected: FAIL.

- [ ] **Step 4: Implement dialog semantics**

Add `role="dialog"` + `aria-modal="true"` + `aria-label`, an Escape `keydown` listener (cleaned up on unmount), focus the modal on open, and return focus to the opener on close. Add `aria-label`s to any icon-only controls across modified components.

- [ ] **Step 5: Contrast audit**

Check `--text-3` (`#38344a`) usage against its backgrounds for WCAG AA on small text; if any fail, raise the lightness of the muted tier in `:root` (one-line change) and re-verify visually.

- [ ] **Step 6: Run tests + build**

Run: `npx jest && npx next build`
Expected: green.

- [ ] **Step 7: Commit**

```bash
git add components/CompareModal.tsx components/__tests__/CompareModal.a11y.test.tsx app/globals.css
git commit -m "feat(a11y): dialog semantics, keyboard close, contrast fixes"
```

---

# PHASE 2 — Decision-making features

### Task 7: `lib/recommend.ts` — use-case ranking (pure)

**Files:**
- Create: `lib/recommend.ts`
- Create: `lib/__tests__/recommend.test.ts`

**Interfaces:**
- Consumes: `ApiEntry`, `Category` from `@/types/api`.
- Produces:
  ```ts
  export interface ScoredApi { api: ApiEntry; score: number }
  export interface RecommendWeights { alive: number; latency: number; freeTier: number }
  export const DEFAULT_WEIGHTS: RecommendWeights
  export function recommend(apis: ApiEntry[], useCase: Category, weights?: RecommendWeights): ScoredApi[]
  ```

- [ ] **Step 1: Write failing tests** in `lib/__tests__/recommend.test.ts`:

```ts
import { recommend, DEFAULT_WEIGHTS } from '@/lib/recommend'
import type { ApiEntry } from '@/types/api'

const mk = (over: Partial<ApiEntry>): ApiEntry => ({
  id: over.id ?? 'x', name: over.name ?? 'X', description: '', url: '', docsUrl: '',
  category: over.category ?? 'inference', models: [], auth: 'api_key', tags: [],
  freeTier: over.freeTier ?? { available: false, details: '' },
  status: over.status ?? { alive: true, lastChecked: '', latencyMs: 100 },
  snippets: { python: '', javascript: '', curl: '' },
})

describe('recommend', () => {
  it('returns only APIs in the requested category', () => {
    const list = [mk({ id: 'a', category: 'inference' }), mk({ id: 'b', category: 'speech' })]
    const out = recommend(list, 'inference')
    expect(out.map(s => s.api.id)).toEqual(['a'])
  })

  it('ranks alive above down', () => {
    const list = [
      mk({ id: 'down', status: { alive: false, lastChecked: '', latencyMs: null } }),
      mk({ id: 'up', status: { alive: true, lastChecked: '', latencyMs: 100 } }),
    ]
    expect(recommend(list, 'inference')[0].api.id).toBe('up')
  })

  it('ranks lower latency higher among alive APIs', () => {
    const list = [
      mk({ id: 'slow', status: { alive: true, lastChecked: '', latencyMs: 900 } }),
      mk({ id: 'fast', status: { alive: true, lastChecked: '', latencyMs: 80 } }),
    ]
    expect(recommend(list, 'inference')[0].api.id).toBe('fast')
  })

  it('boosts APIs with a free tier', () => {
    const list = [
      mk({ id: 'paid', freeTier: { available: false, details: '' } }),
      mk({ id: 'free', freeTier: { available: true, details: 'yes' } }),
    ]
    expect(recommend(list, 'inference')[0].api.id).toBe('free')
  })

  it('returns empty array when no API matches the use case', () => {
    expect(recommend([mk({ category: 'speech' })], 'vision')).toEqual([])
  })
})
```

- [ ] **Step 2: Run to confirm fail**

Run: `npx jest lib/__tests__/recommend.test.ts`
Expected: FAIL ("Cannot find module '@/lib/recommend'").

- [ ] **Step 3: Implement `lib/recommend.ts`**

```ts
import type { ApiEntry, Category } from '@/types/api'

export interface ScoredApi { api: ApiEntry; score: number }
export interface RecommendWeights { alive: number; latency: number; freeTier: number }

export const DEFAULT_WEIGHTS: RecommendWeights = { alive: 100, latency: 40, freeTier: 30 }

// Latency normalized to 0..1 (lower is better); 1000ms+ scores ~0.
function latencyScore(ms: number | null): number {
  if (ms == null) return 0
  return Math.max(0, 1 - ms / 1000)
}

export function recommend(
  apis: ApiEntry[],
  useCase: Category,
  weights: RecommendWeights = DEFAULT_WEIGHTS,
): ScoredApi[] {
  return apis
    .filter((api) => api.category === useCase)
    .map((api) => {
      const score =
        (api.status.alive ? weights.alive : 0) +
        latencyScore(api.status.latencyMs) * weights.latency +
        (api.freeTier.available ? weights.freeTier : 0)
      return { api, score }
    })
    .sort((a, b) => b.score - a.score)
}
```

- [ ] **Step 4: Run tests**

Run: `npx jest lib/__tests__/recommend.test.ts`
Expected: PASS (5/5).

- [ ] **Step 5: Commit**

```bash
git add lib/recommend.ts lib/__tests__/recommend.test.ts
git commit -m "feat: use-case recommendation ranking (pure, tested)"
```

---

### Task 8: UseCasePicker component

**Files:**
- Create: `components/UseCasePicker.tsx`
- Create: `components/__tests__/UseCasePicker.test.tsx`
- Modify: `components/ApiGrid.tsx` (render the picker; surface its result)

**Interfaces:**
- Consumes: `recommend`, `ScoredApi` (Task 7); `Category` type.
- Produces:
  ```ts
  interface UseCasePickerProps {
    apis: ApiEntry[]
    onPick: (useCase: Category | null) => void
    active: Category | null
  }
  export function UseCasePicker(props: UseCasePickerProps): JSX.Element
  ```

- [ ] **Step 1: Write failing test** in `components/__tests__/UseCasePicker.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { UseCasePicker } from '@/components/UseCasePicker'

it('calls onPick with the chosen use case', () => {
  const onPick = jest.fn()
  render(<UseCasePicker apis={[]} active={null} onPick={onPick} />)
  fireEvent.click(screen.getByRole('button', { name: /chat|inference/i }))
  expect(onPick).toHaveBeenCalled()
})
```

- [ ] **Step 2: Run to confirm fail**

Run: `npx jest components/__tests__/UseCasePicker.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `UseCasePicker.tsx`** (`'use client'`)

Render a labeled set of use-case buttons (mapping the `Category` union: inference→"Chat / LLM", embeddings, image-gen→"Image", speech, code, multimodal, vision). Clicking a button calls `onPick(category)`; clicking the active one again calls `onPick(null)` to clear. Style with existing `.chip`/`.chip.active`. Each button has an accessible name. The picker is presentational — ranking happens in `ApiGrid` via `recommend`.

- [ ] **Step 4: Integrate in `ApiGrid.tsx`**

Add `const [useCase, setUseCase] = useState<Category | null>(null)`. When `useCase` is set, render the grid from `recommend(apis, useCase).map(s => s.api)` (a "Recommended for {useCase}" view); when null, fall back to the existing filter+sort pipeline. Render `<UseCasePicker apis={apis} active={useCase} onPick={setUseCase} />` near the control bar.

- [ ] **Step 5: Run tests + build**

Run: `npx jest && npx next build`
Expected: green; selecting a use case reorders the grid to the ranked shortlist.

- [ ] **Step 6: Commit**

```bash
git add components/UseCasePicker.tsx components/__tests__/UseCasePicker.test.tsx components/ApiGrid.tsx
git commit -m "feat: use-case picker that surfaces a ranked shortlist"
```

---

### Task 9: Comparison selection state + ComparisonTray

**Files:**
- Create: `components/ComparisonTray.tsx`
- Create: `components/__tests__/ComparisonTray.test.tsx`
- Modify: `components/ApiGrid.tsx` (selection state, pass to cards + tray)
- Modify: `components/ApiCard.tsx` (add a compare toggle action)

**Interfaces:**
- Consumes: `ApiEntry`.
- Produces:
  ```ts
  interface ComparisonTrayProps {
    selected: ApiEntry[]
    onRemove: (id: string) => void
    onClear: () => void
    onCompare: () => void
  }
  export function ComparisonTray(props: ComparisonTrayProps): JSX.Element | null
  ```
  ApiCard gains optional props (defaulted, so existing usages/tests still pass):
  ```ts
  interface Props { api: ApiEntry; selected?: boolean; onToggleCompare?: (id: string) => void }
  ```

- [ ] **Step 1: Write failing test** in `components/__tests__/ComparisonTray.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ComparisonTray } from '@/components/ComparisonTray'

const apiA = { id: 'a', name: 'Alpha' } as any

it('renders selected items and fires compare', () => {
  const onCompare = jest.fn()
  render(<ComparisonTray selected={[apiA]} onRemove={() => {}} onClear={() => {}} onCompare={onCompare} />)
  expect(screen.getByText('Alpha')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /compare/i }))
  expect(onCompare).toHaveBeenCalled()
})

it('renders nothing when empty', () => {
  const { container } = render(<ComparisonTray selected={[]} onRemove={() => {}} onClear={() => {}} onCompare={() => {}} />)
  expect(container).toBeEmptyDOMElement()
})
```

- [ ] **Step 2: Run to confirm fail**

Run: `npx jest components/__tests__/ComparisonTray.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `ComparisonTray.tsx`** (`'use client'`)

Returns `null` when `selected.length === 0`. Otherwise renders a fixed-bottom bar listing selected API names (each with a remove control), a Clear action, and a Compare action (disabled until `selected.length >= 2`). Responsive and dismissible; `aria-label`s on icon controls.

- [ ] **Step 4: Add selection state in `ApiGrid.tsx`**

`const [selectedIds, setSelectedIds] = useState<string[]>([])`. `toggleCompare(id)` adds/removes, capping at 3 (ignore adds beyond cap). Pass `selected`/`onToggleCompare` to each `ApiCard`. Compute `selected = apis.filter(a => selectedIds.includes(a.id))`. Render `<ComparisonTray>`; `onCompare` opens the existing `CompareModal` with `selected`.

- [ ] **Step 5: Add compare toggle to `ApiCard.tsx`**

Add a small "Compare" toggle button in the action row that calls `onToggleCompare?.(api.id)` and reflects `selected` (aria-pressed). Optional props default to undefined so existing tests/usages are unaffected.

- [ ] **Step 6: Run tests + build**

Run: `npx jest && npx next build`
Expected: green; selecting 2–3 cards shows the tray and opens the compare modal.

- [ ] **Step 7: Commit**

```bash
git add components/ComparisonTray.tsx components/__tests__/ComparisonTray.test.tsx components/ApiGrid.tsx components/ApiCard.tsx
git commit -m "feat: comparison tray with multi-select from cards"
```

---

### Task 10: Rich compare table

**Files:**
- Modify: `components/CompareModal.tsx`

**Interfaces:**
- Consumes: `ApiEntry` (incl. optional `pricing`, `rateLimit`, `freeCredits`, `sdkLanguages`, `regions`).
- Produces: same props; richer table body.

- [ ] **Step 1: Read `CompareModal.tsx`** to see the current comparison rows.

- [ ] **Step 2: Expand the comparison rows**

Render a row per decision dimension across the selected APIs: category, status (alive/down), avg latency, free tier (yes/details), pricing, rate limit, free credits, auth, SDK languages, regions, models. Render "—" when an optional field is absent. Keep the table horizontally scrollable on mobile (`overflow-x: auto` wrapper). Preserve the dialog semantics added in Task 6.

- [ ] **Step 3: Run tests + build**

Run: `npx jest && npx next build`
Expected: green; the a11y test from Task 6 still passes.

- [ ] **Step 4: Commit**

```bash
git add components/CompareModal.tsx
git commit -m "feat: rich side-by-side comparison across decision dimensions"
```

---

### Task 11: URL-synced filters/sort

**Files:**
- Create: `lib/urlState.ts`
- Create: `lib/__tests__/urlState.test.ts`
- Modify: `components/ApiGrid.tsx`

**Interfaces:**
- Produces:
  ```ts
  export interface GridView { query: string; filter: FilterType; sort: SortKey }
  export function encodeView(v: GridView): string          // -> "q=..&f=..&s=.." (omits defaults)
  export function decodeView(params: URLSearchParams): GridView
  export const DEFAULT_VIEW: GridView
  ```

- [ ] **Step 1: Write failing tests** in `lib/__tests__/urlState.test.ts`:

```ts
import { encodeView, decodeView, DEFAULT_VIEW } from '@/lib/urlState'

it('round-trips a non-default view', () => {
  const v = { query: 'groq', filter: 'free' as const, sort: 'latency' as const }
  const decoded = decodeView(new URLSearchParams(encodeView(v)))
  expect(decoded).toEqual(v)
})

it('omits defaults from the encoded string', () => {
  expect(encodeView(DEFAULT_VIEW)).toBe('')
})

it('falls back to defaults for missing/unknown params', () => {
  expect(decodeView(new URLSearchParams(''))).toEqual(DEFAULT_VIEW)
  expect(decodeView(new URLSearchParams('s=bogus')).sort).toBe(DEFAULT_VIEW.sort)
})
```

- [ ] **Step 2: Run to confirm fail**

Run: `npx jest lib/__tests__/urlState.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `lib/urlState.ts`**

```ts
import type { FilterType, SortKey } from '@/types/api'

export interface GridView { query: string; filter: FilterType; sort: SortKey }
export const DEFAULT_VIEW: GridView = { query: '', filter: 'all', sort: 'recommended' }

const SORTS: SortKey[] = ['recommended', 'latency', 'uptime', 'name']

export function encodeView(v: GridView): string {
  const p = new URLSearchParams()
  if (v.query) p.set('q', v.query)
  if (v.filter && v.filter !== 'all') p.set('f', v.filter)
  if (v.sort && v.sort !== 'recommended') p.set('s', v.sort)
  return p.toString()
}

export function decodeView(params: URLSearchParams): GridView {
  const q = params.get('q') ?? ''
  const f = (params.get('f') as FilterType | null) ?? 'all'
  const sRaw = params.get('s') as SortKey | null
  const s = sRaw && SORTS.includes(sRaw) ? sRaw : 'recommended'
  return { query: q, filter: f, sort: s }
}
```

- [ ] **Step 4: Run tests**

Run: `npx jest lib/__tests__/urlState.test.ts`
Expected: PASS (3/3).

- [ ] **Step 5: Sync `ApiGrid` state with the URL**

In `ApiGrid.tsx` (`'use client'`): on mount, initialize query/filter/sort from `decodeView(new URLSearchParams(window.location.search))` (SSR-guarded via `useEffect`). On any change, call `window.history.replaceState(null, '', encoded ? '?' + encoded : window.location.pathname)`. Do not push history entries (avoid back-button spam).

- [ ] **Step 6: Run tests + build**

Run: `npx jest && npx next build`
Expected: green; reloading a filtered URL restores the view.

- [ ] **Step 7: Commit**

```bash
git add lib/urlState.ts lib/__tests__/urlState.test.ts components/ApiGrid.tsx
git commit -m "feat: shareable URL-synced filters and sort"
```

---

### Task 12: Final verification & responsive QA

**Files:** none (verification only)

- [ ] **Step 1: Full gate**

Run: `npx tsc --noEmit && npx jest && npx next build`
Expected: tsc clean, all tests green, static export builds (19+ pages).

- [ ] **Step 2: Responsive + a11y manual pass**

Run `npm run dev`; verify at ~360/768/1024/1440px: no body horizontal scroll, sticky control bar works, cards scannable, use-case picker reorders, comparison tray + rich compare work, URL sync survives reload. Tab through the page for visible focus; toggle OS reduced-motion and confirm animations are suppressed.

- [ ] **Step 3: Commit any fixes found, then open PR**

```bash
git add -A
git commit -m "test: responsive and accessibility QA fixes"
```
Open a PR from `feat/website-overhaul` into `master`.

---

## Self-Review

**Spec coverage:**
- G1 responsiveness → Tasks 2,3,4,5,12. G2 design system → Task 1. G3 decision-first cards → Task 5. G4 accessibility → Tasks 1,6,12. G5 features → recommender (7,8), comparison tray + rich compare (9,10), URL sync (11). All spec sections map to tasks.
- Non-goals (playground, light theme, backend) correctly absent.

**Placeholder scan:** No "TBD/TODO". Visual-styling tasks intentionally defer *aesthetic values* to the `frontend-design` skill but fix structure, class names, responsiveness, and measurable acceptance criteria — not logic gaps.

**Type consistency:** `recommend`/`ScoredApi`/`RecommendWeights`/`DEFAULT_WEIGHTS` (Task 7) used consistently in Task 8. `GridView`/`encodeView`/`decodeView`/`DEFAULT_VIEW` (Task 11) consistent. `SortKey`/`FilterType`/`Category`/`ApiEntry` come from existing `types/api.ts`. ApiCard's new optional props (`selected`, `onToggleCompare`) are additive and defaulted, preserving existing callers/tests.
