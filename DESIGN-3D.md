# DESIGN-3D.md — Art direction for the interactive 3D UI

Authoritative for all 3D surfaces. Reviewed against PRODUCT.md and DESIGN.md.

## Look

A physical architectural desk model. Matte graphite blocks on a dark blueprint
grid, soft studio light, thin accent edges, mono micro-labels. Calm, precise,
expensive. Accent color appears **only** where state changes (in progress, done,
next up).

## Camera

Perspective, narrow field of view (25-32 degrees) from a three-quarter top
angle. Flattens distortion and reads like a product shot. No wide-angle fisheye.

## Lighting

A procedural environment (drei Lightformers) or a small self-hosted HDR. drei
Environment presets may fetch HDR files from a third-party CDN at runtime —
verify for the installed version and avoid it (CSP, offline, speed). One soft key
light with shadows plus a faint rim light. Ground objects with ContactShadows
(baked or low frames).

## Materials

- MeshStandardMaterial, roughness 0.55-0.8, metalness 0.1-0.3.
- Subtle clearcoat only on controls.
- Accent only as emissive on thin edges (drei Edges) and small indicator parts.
- No glass, no transmission, no bloom unless tiny and justified.

## Geometry

RoundedBox with a small radius (about 0.04-0.08), consistent scale, grid-aligned
layout. Sizes encode data (footprint or height from weeks).

## Ground

Dark plane with a fading blueprint Grid (drei Grid with fadeDistance) in the
border color token. Light theme gets its own tuned values (lighter ground, darker
blocks), not an inverted dark scene.

## Text in 3D

drei Text with the project's mono and heading fonts. Troika-based: use
.ttf/.otf/.woff from /public (verify woff2 support). Labels are billboarded,
readable at 375px, AA contrast against their background.

## Color

Only from the CSS tokens, read at runtime. Accent (green backend, copper AI)
appears only where state changes.

## Motion

Critically damped springs (maath damp or drei controls' built-in springs). No
bounce, no overshoot. Hover 120ms, selection and camera moves 600-900ms ease-out.
Idle motion allowed only as a barely-there settle.

## Anti-slop

No floating random shapes, no rainbow, no glow orbs, no default drei sphere, no
rotating for the sake of rotating.

## Interaction rules

- Never trap scrolling. Embedded canvases (landing, dashboard) use drag only:
  no wheel zoom, `touch-action: pan-y` so the page still scrolls on touch. The
  Explorer is its own full-height view where wheel and pinch zoom are allowed,
  with a clear Reset.
- Every canvas interaction has a keyboard and DOM equivalent. Canvas stays
  aria-hidden. DOM mirrors have visible focus rings.
- Pointer feedback in under 100ms. Cursor changes via useCursor. stopPropagation
  on hits so blocks do not trigger the ground.
- Reduced motion: no inertia, no camera fly (jump cut to target), static render,
  interactions still work.
- Haptics: `navigator.vibrate(10)` on tile toggle where supported, respecting the
  3D settings toggle.
- One WebGL canvas per page where possible, never more than 2.

## Tech

- Keep R3F, drei, three, maath. Add `@use-gesture/react` only if a custom drag
  is needed. Dev-only: `leva` (tuning panel at `?tune=1`, stripped from prod
  builds) and `r3f-perf`. No physics engine.
- drei: CameraControls, PresentationControls, RoundedBox, Edges, Outlines, Text,
  Grid, ContactShadows, Html (tooltips only), fitToBox, useCursor,
  PerformanceMonitor, AdaptiveDpr. InstancedMesh for repeated segments/tiles.
- Antialias on, dpr [1,2], static shadows. Frameloop demand with invalidate on
  any interaction, spring in flight, or camera move. Dispose on unmount. Lazy
  chunk under existing size budget.

## Test hooks

Wrapper data attributes: `data-state`, `data-active-face`, `data-camera-state`,
`data-focused-topic`, `data-camera-distance`, `data-camera-azimuth`,
`data-segments-done`, `data-scrub-week`. DOM overlay exposes each node's
projected position (`data-screen-x`, `data-screen-y`) so tests can click the
canvas in the right place.

## Visual iteration loop

For each element do at least 3 rounds: render, screenshot (desktop 1440 and
mobile 390, dark and light), run `/impeccable critique` plus this checklist,
then adjust with the Leva panel and bake the chosen values into constants.

- one clear focal point, nothing clipped at 375px
- state readable at a glance (color, height, lighting encode status)
- crisp edges (no aliasing or z-fighting), labels legible with AA contrast
- shadows ground every object, no blown-out highlights
- composition has breathing room and matches DESIGN.md
  Stop only when every box passes. Save final screenshots to docs/screenshots/3d/
  and a short Playwright video of each element being used to docs/media/.
