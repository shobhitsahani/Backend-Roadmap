# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Self-directed developers choosing a direction and then working through a fixed curriculum on their own. Two audiences share one app:

- **Backend Engineer** — the existing 36-week backend syllabus. 4 phases, 11 topics, 52 subtopics.
- **AI Engineer** — developers moving from software engineering into applied AI: support chatbots, RAG pipelines, agent systems. The track assumes the Backend foundation and says so.

They use the app across desktop and mobile, often in short sessions between study blocks, to decide what to work on next and to record what they finished. The job is unchanged: **where am I, what is next, and what have I finished?** — now asked per track and across both.

The first visit is guest-first: no account, local progress, a picker that explains the recommended path (Backend, then AI). Accounts arrive later and adopt local progress; nothing is lost by starting without one.

## Product Purpose

Backend Roadmap Tracker is an interactive field manual for real, fixed curricula. It turns a syllabus into a working document: phases, topics, subtopics, durations, checklists, notes, and derived progress. A second track does not fork the app — it adds content and swaps the signal colour.

Success means the developer always knows their true position against the plan, in either track, and can act on the next subtopic in one click.

## Positioning

The roadmap itself is the product, not a generic task manager. Progress, timeline projection, streaks, graph layout and the journey path are all derived from one seeded content snapshot, so the app can show expected vs actual position rather than asking the user to maintain a plan by hand.

Two properties make the multi-track model credible:

1. **Prerequisites are real links, not copy.** AI Phase 1 topics point at the matching Backend topics and mirror their status read-only, with an explicit "I already know this" override.
2. **Adding a track is a content file.** Content is typed and validated; the seed upserts by stable slug, so re-seeding never wipes progress.

## Operating Context

- Study happens in short, repeated sessions over weeks; the app is opened to check position and tick subtopics.
- Completion is recorded at subtopic level; topic completion follows from subtopics.
- A start date anchors each track's timeline: expected week, on-track/behind status, and milestone targets.
- Track is the URL's source of truth: `/backend`, `/ai-engineer`, `/journey`, `/settings`; `/` is the landing and picker. `?view=list|graph|journey` selects the view.
- The last track is stored in a cookie so the server renders the right accent and links with no flash.
- Keyboard-first: Alt+1 / Alt+2 switch tracks outside inputs, Ctrl/Cmd+K opens the palette, `1/2/3` switch views, `?` shows shortcuts.
- Both themes and 375, 768, 1440 px widths are first-class.

## Capabilities and Constraints

- **Tracks:** Backend Engineer (existing data unchanged) and AI Engineer (5 phases; Phase 1 is a zero-week prerequisite linked to Backend).
- **Views per track:** List, Graph, and Journey 3D. Journey 3D is on by default for
  every visitor whose device can run WebGL; it degrades to the SVG poster only on
  WebGL failure, user Off, Save-Data, or `NEXT_PUBLIC_ENABLE_3D=false`.
- **Journey:** both tracks as one connected path, showing prerequisites and what each Backend phase unlocks.
- **Topic drawer:** subtopic checklist, notes, duration, progress path, optimistic updates with rollback. One shared drawer across views.
- **Estimated content:** every AI duration is an estimate, marked with an "Estimated" badge and tooltip, editable in the content file.
- **Data actions:** export, import, reset; the format is versioned and scoped by track.
- **3D is on by default:** `NEXT_PUBLIC_ENABLE_3D=false` removes it; reduced motion renders
  a single static frame (canvas kept); Save-Data and no-WebGL get the SVG poster. Weak
  devices keep 3D at lower DPR and point counts. Settings: "3D effects: On / Reduced / Off".
- **Accessibility:** WCAG AA in both themes, visible focus, full keyboard operation, aria-live progress announcements.
- **Stack:** Next.js App Router, TypeScript strict, Tailwind v4, shadcn/ui on Base UI, Drizzle/PostgreSQL, Zustand, Motion, React Flow, Recharts, Sonner, next-themes, Lucide, Vitest, Playwright.

## Brand Commitments

The existing DESIGN.md and GOAL.md are binding: a graphite "engineer's field notebook" aesthetic, dark-first with a drafting-paper light theme, the week measure as signature motif, one flat phase colour per phase, hairline structure, and mono data type.

Two surfaces, one world:

- **Brand** — the landing page and track picker. Editorial and confident, with real roadmap data on screen instead of feature cards.
- **Product** — the tracker. Dense, fast, and quiet, optimised for repeated use.

The AI track gets a warm signal (amber/copper on graphite) and its own phase accents. No purple-blue gradients: that is the AI-site cliché. Never replace the field-notebook world.

## Evidence on Hand

- `DESIGN.md`: committed design direction, tokens, type scale, motion rules, component treatment, per-track tokens.
- `GOAL.md`: product objective, verification gates, constraints, checkpoints.
- `README.md`: features, stack, scripts, architecture, release convention.
- Seeded Backend curriculum (4 phases / 11 topics / 52 subtopics) is real content, not placeholder.
- AI Engineer curriculum from the brief, with source credit ("AI Engineer Roadmap 2027", https://www.youtube.com/watch?v=CpI7pd5yGCw).
- `screenshots/` holds local captures (gitignored). No testimonials, customers, benchmarks, or pricing exist; do not invent them.

## Product Principles

1. The plan is the source of truth: every number, bar, and status is a derivation over the seeded content.
2. Answer position before detail: where am I, what is next, what is done, in that order.
3. Record work in one action: ticking a subtopic is the primary interaction and must feel immediate.
4. Quiet tool, legible data: structure from hairlines and type, colour reserved for real state.
5. One model, two tracks: never fork a component or a query to add content.
6. Honest about estimates: label what is estimated, credit the source, never invent a URL.

## Accessibility & Inclusion

WCAG AA contrast in dark and light; visible focus at all times; full keyboard operation of switcher, palette, views, drawer, checklists, and the 3D camera; reduced-motion support that removes orchestration, camera travel, and looping motion; 44px touch targets at 375 px; every canvas is `aria-hidden` and duplicated in the DOM.
