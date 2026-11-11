# ADR 0005 — Theme System: Black, Purple, Light

- Status: Accepted
- Date: 2026-11-11
- Supersedes: the single "graphite + green/copper" palette assumption. The earlier
  "no purple" rule is explicitly overridden: purple is the brand accent of the
  Purple theme, applied as flat tints only.

## Context

The app currently ships one dark palette and one light palette as raw custom
properties in `app/globals.css`, with a `.dark` class and `next-themes`. Track
identity is swapped through `html[data-track="ai-engineer"]` overrides. There is
no single typed source, no generator, and no automated guard against hardcoded
colour drifting into components.

We are adding two selectable dark themes, **Black** (OLED, neutral, restrained)
and **Purple** (violet-black, purple chrome), while keeping **Light** on the same
token contract. All surfaces must read tokens; no gradients, gradient text or
neon glows; chrome uses `brand`, data uses track/phase accents.

## Audit — hardcoded colours (before this ADR)

| Location                                  | Finding                                                                                                                          |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `app/globals.css`                         | 30+ raw `oklch()` literals for surfaces, ink, phases, dots and AI overrides; two raw `rgb()` shadows; `.dark` token block.       |
| `app/layout.tsx`                          | `viewport.themeColor` hardcodes `#141813` / `#f4f6f1`.                                                                           |
| `app/icon.svg`                            | Hex fills/strokes `#141813`, `#a4d7a7`, `#748a74`.                                                                               |
| `components/ui/chart.tsx`                 | Recharts selector literals `#ccc`, `#fff`; dark theme keyed to `.dark`.                                                          |
| `components/three/track-monolith.tsx`     | Removed by ADR 0006 before this landed. Its material/text literals were audited so the replacement scene would not inherit them. |
| `components/three/track-world-colors.ts`  | Local OKLCH parser/fallback strings instead of the shared colour utilities; now reads `scene-*` tokens.                          |
| `components/theme-toggle.tsx`             | `next-themes` with only `dark`/`light`; moon icon toggle.                                                                        |
| `components/settings/settings-screen.tsx` | Two-value dark/light control; copy says "Both themes".                                                                           |
| `components/command/command-palette.tsx`  | "Switch to dark/light" toggle rather than explicit theme commands.                                                               |
| `components/ui/sonner.tsx`                | `next-themes` `theme` passed through (resolves to `dark`/`light`, not custom names).                                             |
| `components/three/poster.tsx`             | Already token-based (`var(--phase-1)`, `var(--track-ai-engineer)`), but has no scene-theme attribute.                            |
| `app/globals.css` (React Flow)            | Pane background forced transparent; `colorMode` never set on `<ReactFlow>`.                                                      |
| `app/**` metadata                         | No OG image route exists yet; site/track cards must be added.                                                                    |

No default-palette Tailwind classes (`bg-green-500` etc.) or inline hex styles
were found outside the files above. The heatmap, charts, progress bars/rings,
drawer, forms, tooltips and toasts already consume CSS variables.

## Audit — surfaces requiring theming

| Surface                        | Where                                                                  | Current source                     |
| ------------------------------ | ---------------------------------------------------------------------- | ---------------------------------- |
| Header / nav / masthead        | `components/app/masthead.tsx`, `mobile-nav.tsx`                        | `bg-canvas`, `hairline`, `phase-1` |
| Track switcher                 | `components/app/track-switcher.tsx`                                    | panel, raised, track accents       |
| Command palette                | `components/command/command-palette.tsx`, `components/ui/command.tsx`  | panel, canvas, ink, phase 4        |
| Buttons / chips / badges       | `components/ui/button.tsx`, `badge.tsx`, `estimated-badge.tsx`         | shadcn vars + phase vars           |
| Stat panel / readouts          | `components/dashboard/dashboard-screen.tsx`                            | panel, ink, phase                  |
| Progress bar / ring            | `components/progress-bar.tsx`, `progress-ring.tsx`, `week-ruler.tsx`   | hairline + track/phase             |
| View switcher (List/Map/3D)    | `components/roadmap/roadmap-screen.tsx`, `ui/toggle-group.tsx`         | raised, ink, ring                  |
| Drawer / topic panel           | `components/roadmap/topic-panel.tsx`, `ui/sheet.tsx`                   | canvas, panel, hairline            |
| Forms / dialogs                | `components/app/start-date-dialog.tsx`, `ui/input.tsx`, `ui/field.tsx` | field, hairline, ring              |
| Tooltips                       | `components/ui/tooltip.tsx`                                            | ink, panel                         |
| Toasts (Sonner)                | `components/ui/sonner.tsx`                                             | panel, ink, hairline               |
| Graphs (React Flow)            | `components/graph/*`, `graph-screen.tsx`                               | phase vars, panel, dot grid        |
| Charts / heatmap               | `components/dashboard/dashboard-screen.tsx`, `ui/chart.tsx`            | phase vars, hairline               |
| 3D scenes                      | `components/three/poster.tsx`, future explorer scenes                  | `scene-*` CSS vars read at runtime |
| Selection / scrollbars / focus | `app/globals.css`                                                      | phase-1, hairline-strong, ring     |
| Error / 404 pages              | not implemented                                                        | n/a — add theme-following states   |
| OG images                      | not implemented                                                        | n/a — add `next/og` routes         |
| Markdown notes / code blocks   | not implemented                                                        | n/a                                |

## Decision

1. **One typed source** — `lib/theme/tokens.ts` exports complete token sets for
   `black`, `purple` and `light`, including base surfaces, text, brand/highlight,
   focus/selection, state colours, scene tokens and per-track phase ramps.
2. **Generated CSS** — `scripts/generate-themes.ts` renders `app/themes.css`
   (committed) and `app/icon.svg`. `npm run tokens:check` fails if either is out
   of date. A unit test asserts the same.
3. **Runtime selector** — `data-theme="black|purple|light"` on `<html>`.
   `:root` falls back to Black so the first paint is never light before the
   blocking script runs. A custom Tailwind `dark` variant matches both dark
   themes. Token values are mapped to shadcn variables in `@theme inline`.
4. **Theme provider** — a small `ThemeProvider` replaces `next-themes` for custom
   names, `system` → Black/Light, cross-tab sync, `meta[name=theme-color]`,
   `color-scheme`, a View Transitions crossfade (Motion overlay fallback) and
   legacy `dark` → `black` migration. A parser-blocking inline script in the
   root layout's `<head>` sets the attribute, scheme and meta colour before the
   body paints; `next/script` queues beforeInteractive payloads in dev and was
   replaced. No theme cookie is read in the root layout.
5. **Token-only components** — hardcoded colours are replaced by token utilities
   or by token reads for canvas/3D (`getComputedStyle`). Scene wrappers expose
   `data-scene-theme` and re-read `scene-*` tokens on change without remounting;
   the landing hero itself is the DOM/CSS Exploded Stack from ADR 0006, so it
   consumes the same tokens directly.
6. **Guardrail** — `scripts/check-theme-colors.mjs` rejects hex/rgb/hsl/oklch
   literals and default palette classes outside `lib/theme/` (generated files
   excluded). CI runs it next to lint/typecheck/test.

## Consequences

- Theme changes are a data-attribute swap; no cookie reads, no server round-trip.
- Adding a theme is a single object in `tokens.ts` plus a generator run.
- Contrast, phase-distance and generated-file drift become test failures rather
  than review notes.
- `next-themes` is no longer the theme state owner (its storage key is preserved
  for migration). Third-party widgets that expect a `.dark` class receive an
  explicit `colorMode` / `theme` prop instead.
- The audit UI is flat by construction; any new hardcoded colour fails CI.
