# ADR 0004 — Interactive 3D UI (Correction #2)

- Status: accepted · 2026-11-11
- Base: `main` @ `v0.2.0` (tag). Before-screenshots: `docs/screenshots/3d-before/`.

## 1. Why

The 3D shipped in v0.2.0 is decorative: ambient particle fields, a header strip,
an unsteerable camera flythrough, flat materials, weak hierarchy. Nothing to touch.
Correction #2 replaces it with interactive 3D UI where every object either encodes
data (progress, status, time) or is a control the user operates. Decorative-only
objects are deleted.

## 2. Five critiques of the current 3D (plain language)

1. **Nothing to touch.** The landing band, header strip and Journey flythrough
   are all look-don't-touch. There is no drag, no click target, no state change
   from interacting with the canvas. The canvas is `aria-hidden` decoration.
2. **No data encoding.** The particle lattice and constellation carry no
   progress, status or time. The ProgressCore ring exists but is a separate,
   weakly integrated widget. Geometry does not grow with weeks.
3. **No art direction.** Flat `MeshStandard`/`pointsMaterial` with default-ish
   lighting, no ground plane, no shadow, no material discipline. Reads like a
   demo, not a product.
4. **No camera control.** The Journey flythrough auto-plays a fixed path; the
   user cannot orbit, zoom or focus. The dial does not scrub.
5. **No interaction feedback.** No hover lift, no cursor change, no spring,
   no haptic, no keyboard equivalent beyond tabbing the DOM mirror. Pointer
   feedback is absent.

## 3. New art direction

See `DESIGN-3D.md` (authoritative). Summary: a physical architectural desk model —
matte graphite blocks on a dark blueprint grid, soft studio light, thin accent
edges, mono micro-labels. Calm, precise, expensive. Accent color appears only
where state changes.

## 4. Deletions in this step

- `components/three/track-world-scene.tsx` (ambient lattice + constellation)
- `components/three/track-world-canvas.tsx` (old band canvas) — replaced in step 2
- `components/three/track-world.tsx` `TrackWorldSection` decorative band — replaced
- `components/three/journey-3d.tsx` (old flythrough) — replaced in step 3/4
- `components/three/progress-core.tsx` (old dial ring) — replaced in step 5
- `components/three/poster.tsx` kept (still the WebGL-failure fallback)

Infrastructure kept: `lib/three-fallback.ts`, `store/three-store.ts`, data-*
state attributes, WebGL-enabled Playwright, lazy loading, settings toggle.

## 5. Branch plan

1. `chore/3d-audit-and-art-direction` (this ADR + DESIGN-3D.md + deletions)
2. `feat/3d-track-monolith`
3. `feat/3d-roadmap-explorer`
4. `feat/3d-explorer-exploded-view`
5. `feat/3d-progress-dial`
6. `feat/css-3d-interactions`
7. `test/3d-interaction-e2e`
8. `chore/3d-polish`

## 6. Non-goals

- No backend data changes. No auth/SEO/i18n. No new tracks.
- No physics engine. No glass/transmission/bloom unless tiny and justified.
