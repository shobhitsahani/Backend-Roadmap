# Goal: Interactive 3D UI (Correction #2)

Status: pursuing

## Objective
Replace the current decorative 3D (ambient particle fields, header strip, old ProgressCore ring, old Journey3D flythrough) with INTERACTIVE 3D UI that users can grab, rotate, click and operate. Every 3D object must either encode data (progress, status, time) or be a control. New art direction: physical architectural desk model (matte graphite blocks on dark blueprint grid, soft studio light, thin accent edges, mono micro-labels).

Deliverables (8 branches):
1. chore/3d-audit-and-art-direction — before screenshots, ADR 0004, DESIGN-3D.md, remove old decorative scenes
2. feat/3d-track-monolith — landing hero two-sided slab
3. feat/3d-roadmap-explorer — tabletop model: platforms, blocks, path tube, camera, hover/select
4. feat/3d-explorer-exploded-view — tiles, two-way sync, completion effects, keyboard/touch
5. feat/3d-progress-dial — dashboard dial with planned vs actual + scrub
6. feat/css-3d-interactions — 3D card tilt + switcher flip
7. test/3d-interaction-e2e — tests, screenshots, recordings
8. chore/3d-polish — impeccable passes; tag next version

## Verification
- npm run lint / typecheck / test (72+) / build all green
- Playwright (WebGL-enabled) interaction tests pass with no skip guards
- data-state, data-active-face, data-camera-state, data-focused-topic, data-camera-distance, data-camera-azimuth, data-segments-done, data-scrub-week attributes exercised
- Two-way sync: drawer <-> 3D both directions
- Fallback + reduced-motion tests still pass
- No console errors / WebGL warnings
- Screenshots + short videos saved to docs/screenshots/3d/ and docs/media/
- ADR 0004 + DESIGN-3D.md committed

## Constraints
- Keep infrastructure: lazy loading, fallback logic, 3D settings, data-* attributes, WebGL Playwright harness, git workflow (--no-ff, Conventional Commits, never force-push main).
- Stack: R3F, drei, three, maath. Add @use-gesture/react only if custom drag needed. Dev-only: leva (stripped in prod), r3f-perf. No physics engine.
- Max 2 canvases per page; one where possible. Canvas aria-hidden; DOM mirrors with focus rings.
- No bounce/overshoot; critically damped springs. Hover 120ms, selection/camera 600-900ms ease-out.
- Colors only from CSS tokens read at runtime; light theme gets tuned values.
- frameloop demand + invalidate on interaction/spring/camera move.

## Boundaries
- In scope: components/three/, components that host 3D, docs (ADR, DESIGN-3D, PRODUCT/DESIGN updates), tests/e2e, scripts.
- Out of scope: backend data, auth/SEO/i18n (prior C-series), backend track content.

## Status
pursuing

## Checkpoints
(none yet)
