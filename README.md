# Backend Roadmap Tracker

An interactive 36-week backend engineering field manual. The roadmap is a working
document: mark subtopics done as you learn them, watch the plan project forward
and backward from your start date, and keep a running field log of what you did.
Single user, local first, dark first.

Repository: [github.com/shobhitsahani/Backend-Roadmap](https://github.com/shobhitsahani/Backend-Roadmap)

## Features

- **Roadmap** — 4 phases / 11 topics / 52 subtopics seeded from the brief, as a
  list with per-topic checklists or a phase-linked graph (map) view.
- **Topic drawer** — subtopic checklist, notes, duration, and progress path with
  optimistic updates and rollback on API failure.
- **Progress engine** — topic, phase, and overall progress plus a "current
  topic" pulse that follows your most recent work.
- **Timeline** — start-date projection with on-track/behind status, expected vs
  calendar week, a 36-week ruler, and milestone targets.
- **Field log (dashboard)** — streak, activity heatmap, per-phase bars, and a
  recent-activity feed.
- **Data actions** — export the full progress file (`backend-roadmap-progress`
  v1) as JSON, import a previous file, reset everything; destructive actions get
  a 10-second undo toast.
- **Command palette** — Ctrl/Cmd+K to navigate, search topics, switch theme,
  export, or reset; `?` shows keyboard shortcuts; `1/2/3` switch views.
- **Design system** — graphite "field manual" aesthetic described in
  [DESIGN.md](DESIGN.md): dark-first tokens, mono overprint labels, one accent
  per phase, flat surfaces only.

## Stack

Next.js (App Router) · TypeScript strict · Tailwind CSS v4 · shadcn/ui on Base
UI · Drizzle ORM on PostgreSQL 17 · Zod-typed route handlers · Zustand ·
Motion · React Flow (@xyflow/react) · Recharts · Sonner · next-themes · Vitest ·
Playwright.

## Getting started

Prerequisites: Node.js 22+ and Docker (for PostgreSQL).

```bash
# 1. Start the database (postgres:17-alpine, healthchecked)
docker compose up -d

# 2. environment
cp .env.example .env

# 3. dependencies
npm install

# 4. schema + seed content
npm run db:migrate
npm run db:seed

# 5. run
npm run dev        # http://localhost:3000
```

The dev server reads `DATABASE_URL` from `.env` and renders the seeded state.
Progress writes go through the typed API routes into PostgreSQL.

### Environment

| Variable       | Purpose                                                                                        |
| -------------- | ---------------------------------------------------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string used by Drizzle, route handlers, and scripts. See `.env.example`. |

## Scripts

| Command               | What it does                                     |
| --------------------- | ------------------------------------------------ |
| `npm run dev`         | Development server                               |
| `npm run build`       | Production build                                 |
| `npm run start`       | Serve the production build                       |
| `npm run lint`        | ESLint                                           |
| `npm run typecheck`   | `tsc --noEmit`                                   |
| `npm test`            | Vitest (progress / timeline / streak logic)      |
| `npm run format`      | Prettier write                                   |
| `npm run db:generate` | Generate a Drizzle migration from `db/schema.ts` |
| `npm run db:migrate`  | Apply migrations via Drizzle                     |
| `npm run db:seed`     | Seed roadmap content (`db/seed.ts`)              |
| `npm run db:studio`   | Drizzle Studio                                   |
| `npm run screenshots` | Capture 375/768/1440 × dark/light (see below)    |

## Tests and screenshots

`npm test` runs the logic suite (progress engine, timeline projection, streak
calculation) in Vitest. Lint and typecheck are kept clean in the same gate.

For screenshots you need the production build serving locally:

```bash
npm run build && npm run start    # terminal 1
npm run screenshots               # terminal 2 (or against the dev server)
```

`scripts/screenshots.ts` captures `/` at 375×812, 768×1024, and 1440×960 in
dark and light into `screenshots/` (gitignored). The route list and output
directory are controlled by `SCREENSHOT_PATHS` / `SCREENSHOT_DIR`.

## Architecture

```
app/                     App Router shell, typed API routes, providers, fonts
  api/                   route handlers (Zod-validated)
    roadmap/             GET   → RoadmapSnapshot
    subtopics/[id]/      PATCH → toggle one subtopic
    topics/[id]/         PATCH → topic status / notes
    settings/            PATCH → start date
    export|import|reset/ progress-file actions (v1 format)
components/              UI: app shell, roadmap, graph, timeline, dashboard,
                         command palette, data section, primitives (ui/)
lib/                     pure logic + client helpers
  progress.ts            progress/streak/heatmap engine
  timeline.ts            start-date projection + milestones
  progress-file.ts       export/import format (backend-roadmap-progress v1)
  data-actions.ts        export/import/reset client actions (undo toast)
  motion.ts              motion tokens (duration, ease, reveal variants)
store/                   Zustand stores (roadmap data, UI state)
db/                      Drizzle schema, migration runner, seed data
types/                   shared RoadmapSnapshot / ProgressFile types
tests/                   Vitest suites for the engines above
```

Data flow: server components fetch a `RoadmapSnapshot` through
`lib/roadmap-server.ts`, hydrate the client store, and all mutations go through
the typed route handlers with optimistic updates in `store/roadmap-store.tsx`
(rollback on failure). The snapshot is the single source of truth for every
view — progress, timeline, and dashboard are pure derivations over it.

Design tokens, motion rules, and component conventions live in
[DESIGN.md](DESIGN.md); the implementation plan and checkpoint log in
[GOAL.md](GOAL.md).

## Release convention

Work lands on short-lived `feat/<topic>` branches with Conventional Commits
(husky + commitlint enforce the format), and each checkpoint merges into `main`
with `--no-ff`. Releases are tagged after CHANGELOG entries (see
[CHANGELOG.md](CHANGELOG.md)). CI runs lint, typecheck, tests, migration,
seed, and build against a Postgres 17 service on every push to `main`
([ci.yml](.github/workflows/ci.yml)).
