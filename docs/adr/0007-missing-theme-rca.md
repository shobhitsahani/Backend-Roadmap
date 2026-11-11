# ADR 0007 — Root cause: Purple theme missing from theme system

- Status: accepted · 2026-11-11
- Fix branch: `fix/missing-theme` → merged to `main` as `28d90bc`

## 1. Symptom

The product ships three intended themes: **Black**, **Purple**, **Light** (ADR 0005). On `main`, users could reach only **Dark** and **Light**; **Purple** never appeared. "Dark"/"Light" were not the intended Black/Light palettes either.

## 2. Root cause

The complete theme system — `lib/theme/tokens.ts` (`themeNames = ["black", "purple", "light"]`), `lib/theme/config.ts` (custom `ThemeProvider`), `components/theme/theme-picker.tsx`, `app/themes.css`, and the test suites — was developed entirely on the `safety/theme-system` branch and **was never merged into `main`**.

`main` instead uses `next-themes` (`dark`/`light` only, via `app/providers.tsx` and `components/theme-toggle.tsx`), so:

- `purple` was never a known theme name anywhere in the runtime code path.
- There was no `data-theme="purple"`, no `app/themes.css` block for purple, no picker entry, and no provider acceptance of `purple`.
- The old `theme-toggle.tsx` offered only "Dark"/"Light".

`git log -S "purple"` confirms: every commit touching purple tokens/provider/picker lives on `safety/theme-system`; none reached `main`. No later merge (hero, 3D, track-stacks) dropped theme code — theme code was never on `main` to begin with.

## 3. Fix

Merged `safety/theme-system` into `main` via branch `fix/missing-theme` (`28d90bc`):

- `lib/theme/tokens.ts`: single source `themeNames = ["black", "purple", "light"]` + full token sets (base, scene, per-track phase ramps).
- `lib/theme/config.ts`: `ThemeProvider` replaces `next-themes`; `data-theme="black|purple|light"`, cross-tab sync, `meta[name=theme-color]`, `color-scheme`, View Transitions, legacy `dark`→`black` migration (stored `purple` stays `purple`; only unknown values fall back to Black).
- `lib/theme/generate.ts` + committed `app/themes.css`: CI-checked via `tokens:check`.
- `components/theme/theme-picker.tsx` / `theme-provider.tsx`: all three themes + System, each marked when active.
- `types/roadmap.ts`: `RoadmapView` narrowed to `"list" | "graph"` (journey removed with the 3D toggle).
- `scripts/check-theme-colors.mjs`: excludes test files (test colour assertions are not shipped UI).
- Removed `components/theme-toggle.tsx` (next-themes toggle) and `next-themes` dependency.

## 4. Contributing causes (addressed)

- `package.json` still listed `next-themes` → removed; added `clsx`, `tailwind-merge`.
- `check-theme-colors.mjs` flagged colour literals in test files → excludes `*.test.ts`/`*.spec.ts` (tests are not shipped UI).
- `RoadmapView` type still included `"journey"` → narrowed to `"list" | "graph"`.

## 5. Verification

- `npm run lint` clean · `npm run typecheck` clean · `npm run test` 85/85 · `npm run theme:check` pass · `npm run build` success.
- Live probe on `http://localhost:3100/settings`: picker offers Black/Purple/Light/System; switching sets `data-theme`, persists in `localStorage` across reload, and `--bg`/`--brand` differ per theme (Purple brand OKLCH hue ≈ 290, violet).
- Screenshots for all three themes already captured on `safety/theme-system` (`docs/screenshots/themes/`).

## 6. Non-goals (out of scope)

- Correction #3 TrackStacks hero / Roadmap Explorer / Progress Dial (separate work).
- Adding new themes beyond Black/Purple/Light (now a one-line addition to `tokens.ts`).
