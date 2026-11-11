# ADR 0006 — Exploded Stack replaces Track Monolith

- Status: accepted · 2026-11-11
- Base: `main` (Correction #3).
- Supersedes: the Track Monolith (Correction #2, step 2) as the landing hero 3D.

## 1. Why

The Track Monolith looked bad: slab bled out of its container, default font, broken
green sliver progress indicator, dark-on-dark, overlapping "Open Backend / Open AI
Engineer" buttons. It was decorative, not interactive.

Decision: the landing hero becomes a **CSS 3D "Exploded Stack"**, not WebGL. Reason:
it needs crisp DOM text, theme tokens, accessibility and zero GPU cost. WebGL stays
only where the 3D object is the product (the Roadmap Explorer). The landing page
will have no `<canvas>`.

## 2. Deletions in this step

- `components/three/track-monolith.tsx` (deleted).
- Removed TrackMonolith usage from `components/landing/landing-page.tsx`.
- Landing page now has no WebGL canvas (interim; TrackStacks arrives in step 2).

## 3. Branch plan (Correction #3)

1. `chore/remove-track-monolith` (this ADR + deletion) — DONE
2. `feat/track-stacks-scene` — geometry, tokens, themes, labels, static states
3. `feat/track-stacks-interaction` — explode, hover, drag with inertia, connector, keyboard, touch
4. `feat/track-stacks-responsive-and-states` — mobile layout, reduced motion, 3D Off, new vs returning
5. `test/track-stacks` — e2e, snapshots, axe, bounding boxes
6. `chore/track-stacks-polish` — impeccable passes, tag next version

## 4. Non-goals

- Roadmap Explorer (WebGL) stays. Progress Dial rebuilt as SVG/CSS if it fails checklist.
- No backend data changes.
- Number of phases/names/weeks/progress/next-topic come from content + state, never hardcoded.
