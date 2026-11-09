# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

One self-directed developer working through a 36-week backend engineering syllabus on their own. They use the app across desktop and mobile, often in short sessions between study blocks, to decide what to work on next and to record what they finished. The job: answer “where am I, what is next, and what have I finished?” without leaving the plan.

## Product Purpose

Backend Roadmap Tracker is an interactive field manual for a fixed 36-week backend curriculum. It turns the syllabus into a trackable working document: 4 phases, 11 topics, 52 subtopics, each with durations, checklists, notes, and per-phase progress. Success means the developer always knows their true position against the plan and can act on the next subtopic in one click.

## Positioning

The roadmap itself is the product, not a generic task manager. Progress, timeline projection, streaks, and the graph are all derived from one seeded syllabus snapshot, so the app can show expected vs actual position rather than asking the user to maintain a plan by hand. It is local-first, single-user, and ships with real curriculum content rather than empty boards.

## Operating Context

- Study happens in short, repeated sessions over 36 weeks; the app is opened to check position and tick subtopics.
- Users record completion at subtopic level; topic completion follows from subtopics.
- A start date anchors the timeline: expected week, on-track/behind status, and milestone targets.
- Progress is stored in PostgreSQL through typed API routes; a JSON progress file (v1) can be exported, imported, and reset with a 10-second undo.
- Keyboard-first use is expected: Ctrl/Cmd+K palette, 1/2/3 view switching, `?` shortcuts, arrows/Space/Esc.
- The app is used in both dark (default) and light themes and at 375, 768, and 1440 px widths.

## Capabilities and Constraints

- Views: roadmap list (per-topic checklists), roadmap map (phase-linked graph), field log (dashboard: streak, heatmap, phase bars, recent activity), and timeline (36-week ruler, expected vs calendar week, milestones).
- Topic drawer: subtopic checklist, notes, duration, progress path, optimistic updates with rollback on API failure.
- Data actions: export, import, reset, all via the `backend-roadmap-progress` v1 format.
- Single user, no auth. Local-first posture. Backend logic, APIs, and database schema are out of scope for UI work.
- Stack: Next.js App Router, TypeScript strict, Tailwind v4, shadcn/ui on Base UI, Drizzle/PostgreSQL, Zustand, Motion, React Flow, Recharts, Sonner, next-themes, Lucide, Vitest, Playwright.
- Must keep lint, typecheck, tests, and production build passing; WCAG AA in both themes; 44px mobile targets; no horizontal overflow at 375/768/1440.

## Brand Commitments

The existing DESIGN.md and GOAL.md are binding: a graphite “engineer's field notebook” aesthetic, dark-first with a drafting-paper light theme, the 36-week measure as signature motif, one flat phase colour per phase, hairline structure, and mono data type. Do not replace this visual world as part of refinement work.

## Evidence on Hand

- `DESIGN.md`: committed design direction, tokens, type scale, motion rules, component treatment.
- `GOAL.md`: product objective, verification gates, constraints, checkpoints.
- `README.md`: features, stack, scripts, architecture, release convention.
- Seeded curriculum content in `db/seed.ts` (4 phases / 11 topics / 52 subtopics) is real content, not placeholder.
- `screenshots/` holds local captures (gitignored). No testimonials, customers, benchmarks, or pricing exist; do not invent them.

## Product Principles

1. The plan is the source of truth: every number, bar, and status is a derivation over the seeded snapshot.
2. Answer position before detail: where am I, what is next, what is done, in that order.
3. Record work in one action: ticking a subtopic is the primary interaction and must feel immediate.
4. Quiet tool, legible data: structure from hairlines and type, colour reserved for real phase state.
5. Local-first and honest: no fake social proof, no invented encouragement, no backend changes to serve UI.

## Accessibility & Inclusion

WCAG AA contrast in dark and light; visible focus at all times; full keyboard operation of palette, views, drawer, and checklists; reduced-motion support that removes orchestration and looping motion; 44px touch targets at 375 px.
