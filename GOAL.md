# Goal: Exploded Stack landing hero (Correction #3)

Status: pursuing

## Objective
Replace the Track Monolith (landing hero WebGL) with "Exploded Stack" — a CSS 3D
component. Landing page has NO <canvas>. Each stack = pile of thin slabs (one per
phase), bottom = first phase. Slabs have real thickness (top + 2 side faces),
flat token tones, blueprint grid on top faces, progress cells, done edges, one
current-phase pulse. Labels are flat DOM callouts with leader lines. Connector
dashed SVG path Backend->AI with traveling dot. States: new visitor (dim, "Start
here" tag) vs returning (progress cells, done edges, current marked).

Interactions: hover/focus explodes stack (gap 10->46px, staggered labels); hover
slab lifts + callout expands; click slab/callout -> track page focused on phase;
drag rotates azimuth +/-30 / tilt 48-66 with inertia + spring settle; keyboard
Tab/Enter, "Explode/Collapse" toggle; touch pan-y + tap. Reduced motion = instant
toggles, no animation. 3D Off = flat list of progress bars. Accessibility: scene
aria-hidden, links have full names.

## Verification
- / contains no <canvas>.
- Hover stack: data-stack-state="exploded", measured gap between slab tops increases; collapses on leave.
- Drag on stage: data-azimuth changes, returns to rest after release.
- Click callout: navigates to track route with phase focus. Keyboard: Tab to slab sets data-hovered-layer, Enter navigates.
- Reduced motion: state changes instant (no running animations). 3D Off: flat list renders, transform-style not preserve-3d.
- Bounding-box: every slab, callout, ring inside stage at 1440/1024/768/390.
- Visual regression snapshots: 3 themes x desktop/mobile x collapsed/exploded. axe-core passes.
- npm run lint/typecheck/test/build green.

## Constraints
- Keep Roadmap Explorer (WebGL) — apply same quality bar. Progress Dial: if not passing checklist after 3 rounds, rebuild as SVG/CSS.
- Update older 3D tests that expected canvas on landing.
- Only transform/opacity animate; will-change only while interacting; contain: layout paint; ~40 DOM nodes per stack; reserve stage height.
- Number of phases/names/weeks/progress/next topic from content+state, never hardcoded (Backend 4 phases, AI 5).

## Boundaries
- In scope: components/ (new TrackStacks, remove monolith), docs (ADR 0006, DESIGN-3D update), tests/e2e, scripts.
- Out of scope: backend data, auth/SEO/i18n.

## Status
pursuing

## Checkpoints
(none yet)
