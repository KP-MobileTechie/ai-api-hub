---
name: frontend-conventions
description: Use when building or changing any UI in the AI API Hub repo (components/, app/, app/globals.css, tailwind.config.ts) — the design system tokens, component classes, responsiveness rules, accessibility requirements, and testing patterns that keep the site consistent.
---

# AI API Hub — Frontend Conventions

Apply these when touching `app/`, `components/`, `app/globals.css`, or
`tailwind.config.ts`. The site is a **static export** (see CLAUDE.md) — no server
code; browser APIs require `'use client'` + SSR guards.

## Design tokens (defined in `app/globals.css` `:root`)

- **Color roles:** `--bg`, `--surface`, `--surface-hover`, `--border`,
  `--border-hover`, `--text`, `--text-2`, `--text-3` (muted — kept at WCAG-AA
  contrast), `--live` (#10b981), `--down` (#ef4444).
- **Accent:** `--accent` #8b5cf6 (primary), `--accent-bright` #a78bfa, `--accent-2`
  (cyan). Gradients use `accent → accent-bright`.
- **Radii:** `--r-sm/md/lg/xl`. **Motion:** `--dur-fast/--dur/--dur-slow`, `--ease`.
- **Fonts:** `--font-display` (Bricolage Grotesque), `--font-body` (Manrope),
  `--font-mono` (Geist Mono).

Never hardcode hex values that a token already covers; reference the token.

## Component classes (reuse before inventing)

`.btn` + `.btn-primary` / `.btn-secondary`, `.chip` (+ `.active`), `.metric-pill`,
`.tag`, `.card-free`, `.control-bar` (horizontally scrollable < 640px), `.snippet-btn`.
Add new shared classes inside the `@layer components` block in `app/globals.css`.

## Responsiveness (mobile-first)

- Use responsive Tailwind utilities for anything layout-/breakpoint-sensitive.
  **Inline `style={{}}` objects cannot hold media queries** — this was the root cause
  of past responsiveness gaps. Don't reintroduce layout-critical inline styles.
- Verify at ~360 / 768 / 1024 / 1440px. The body must never scroll horizontally at
  360px; wide content (tables, code) scrolls inside its own `overflow-x:auto` wrapper.
- Tap targets ≥ ~32px on mobile.

## Accessibility (required)

- Keep the global `:focus-visible` ring and the `prefers-reduced-motion` reset.
- Icon-only controls need an `aria-label`. Toggles use `aria-pressed`.
- Modals: `role="dialog"`, `aria-modal="true"`, accessible name, Escape-to-close,
  focus the dialog on open and return focus to the opener on close (see
  `CompareModal.tsx`).
- Decorative layers (`hero-grid`, glows) get `aria-hidden`.

## State ownership

`ApiGrid` (client) owns query/filter/sort/use-case/compare-selection and URL sync.
Cards are presentational — pass data + callbacks down; don't add cross-cutting state
to cards. Favorites and the use-case picker manage only their own local concerns.

## Testing

- Mirror existing tests in `components/__tests__`. Query by role/text/label the way
  a user would; add `aria-label`s rather than test-only hooks.
- Pure logic goes in `lib/` and is TDD'd in `lib/__tests__` first.
- `jest.setup.ts` already resets the jsdom URL between tests — rely on it; don't
  write tests that depend on leftover URL state.
- ESLint runs in `next build`: no `any`, no unused imports (test files included).

## Before finishing any UI change

Run the full gate and, for visible changes, check the rendered result at the
breakpoints above:

```bash
npx tsc --noEmit && npm test && npx next build
```
