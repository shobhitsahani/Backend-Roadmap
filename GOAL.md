# Goal — Impeccable UI/Design Pass

## Objective
Improve the UI/design of Backend Roadmap Tracker with Impeccable, entirely inside the
`Backend-Roadmap-impeccable` worktree on branch `impeccable-enhance`. Run critique/audit,
fix P0/P1 first, then typeset/layout/polish and harden the main screens (Roadmap list +
map, Field log, Timeline, shared shell, topic drawer), run `impeccable detect`, and leave
the branch building and tested. Do not merge into `main`.

## Verification
1. `npm run lint` passes.
2. `npm run typecheck` passes.
3. `npm test` passes.
4. `npm run build` passes.
5. `npx impeccable detect app/ components/` reports no unresolved findings (repo has no `src/`).
6. Playwright screenshots at 375 and 1440 in dark and light show: map edges render,
   no clipped graph titles, mobile toolbar labels visible, timeline bars full-width on
   mobile, dashboard zero-state chart and square heatmap cells, readable mobile map zoom.
7. `git log` shows small focused commits on `impeccable-enhance`; main worktree untouched.

## Constraints
- Do not change backend logic, APIs, or the database.
- No live-mode runs against deployed sites.
- Preserve the existing "engineer's field notebook" visual direction and DESIGN.md tokens.
- Keep changes small and focused, one target at a time.
- Do not commit `.env`, `node_modules`, `.next`, or scratch screenshots.

## Boundaries
In scope: `app/`, `components/`, `lib/` presentation utilities, `DESIGN.md`, `PRODUCT.md`,
`.impeccable/`, and UI tooling config in the worktree.
Out of scope: `db/`, API route behavior, data model, deployment, and the main worktree.

## Checkpoints
- [x] 01 Worktree + branch created; dependencies installed; baseline tests green
- [x] 02 Impeccable installed; PRODUCT.md and DESIGN.md written and committed
- [x] 03 Critique + audit captured (screenshots, axe, responsive checks); findings ranked P0–P3
- [x] 04 P0: graph edges/handles and edge data
- [x] 05 P1: mobile roadmap toolbar, graph node typography, mobile timeline, dashboard zero-state + heatmap, mobile map zoom
- [x] 06 P2/P3: phase labels, dynamic phase colors, graph phase headers, command palette header, metadata casing
- [x] 07 Typeset / layout / polish / harden pass
- [x] 08 `impeccable detect`, lint, typecheck, tests, build, screenshots, commits

## Verification evidence
- `npm run lint` — pass.
- `npm run typecheck` — pass.
- `npm test` — 2 files, 18 tests pass.
- `npm run build` — pass (Next.js 16.4.5, 8 routes).
- `npx impeccable detect app/ components/` — 0 anti-patterns.
- `npx impeccable detect http://localhost:3001` — 0 anti-patterns; 4 advisory
  `numbered-section-labels` notes are intentional phase indices in the field-manual
  structure, not decorative scaffolding.
- Playwright screenshots at 375/1440, dark/light: graph renders 10 edges and 14 nodes,
  node titles wrap, mobile toolbar labels visible, timeline rows stack with a full-width
  ruler, dashboard zero-state and 24px square heatmap cells, mobile map starts at phase 1.
- Axe: 0 violations on dashboard, timeline, and topic panel at both widths and themes.

## Status
achieved
