# ADR 0002 — Multi-track content and per-user state

- **Status:** Accepted
- **Date:** 2026-11-10
- **Branch:** `chore/audit-and-tooling`
- **Supersedes:** the single-track assumptions in ADR 0001

## Context

The tracker shipped as one hard-coded Backend syllabus:

- `topics.status`, `topics.notes` and `subtopics.done` mix content with one person's progress, so a second track or a second user cannot exist without duplicating rows.
- `settings` is a `singleton` row (`id = 'singleton'`), so there is exactly one start date for the whole app.
- `db/seed.ts` deletes every table before inserting, so re-seeding destroys progress.
- "36 weeks" is repeated in copy and layout maths instead of being derived.
- There is one route (`/`) and the view is client state, so a track cannot be the URL's source of truth.

We are adding an **AI Engineer** track, a public landing page, a combined journey view, and (later) accounts. That needs three separations: **track from track**, **content from state**, and **owner from owner**.

## Decision

### 1. Track is a first-class content entity

```
tracks(id, slug, title, subtitle, summary, "order", identity_hue, source_title, source_url)
phases(id, track_id, title, subtitle, "order")
topics(id, phase_id, title, ..., linked_topic_id, estimated)
```

- `slug` is stable and human-readable (`backend`, `ai-engineer`); IDs are derived from it (`backend.phase.1`, `backend.topic.apis`).
- `phases.track_id` scopes every phase. `topics.linked_topic_id` points at a Backend topic for prerequisite mirroring; `topics.estimated` drives the "Estimated" badge.
- Every total (weeks, topics, percent) is derived in `lib/progress.ts`. The string "36" may appear only in content.

### 2. Content is read-only to users; state lives in its own tables

| Content (seeded, read-only) | State (per owner)                                             |
| --------------------------- | ------------------------------------------------------------- |
| `tracks`, `phases`          | `user_topic_state(owner_id, topic_id, status, notes)`         |
| `topics`, `subtopics`       | `user_subtopic_state(owner_id, subtopic_id, done, done_at)`   |
| `resources`                 | `track_settings(owner_id, track_id, start_date)`              |
|                             | `activity(owner_id, kind, topic_id, subtopic_id, created_at)` |

- `owner_id` is `text` with a `guest:<uuid>` value today. Auth later maps a session to the same column; no state table changes.
- Uniqueness: `(owner_id, topic_id)`, `(owner_id, subtopic_id)`, `(owner_id, track_id)`.
- **Every** read and write filters by `owner_id`; the API never accepts an owner from the client.
- Legacy `topics.status/notes`, `subtopics.done` and `settings` stay in the schema for one release as a rollback path. The migration backfills them into the state tables, then application code stops reading them. Dropping them is a separate, later migration.

### 3. Content lives in typed files, seeded idempotently

- `content/tracks/backend.ts` and `content/tracks/ai-engineer.ts` export a `TrackContent` object validated by Zod at import time.
- `db/seed.ts` upserts by slug ID inside one transaction: insert missing rows, update content fields, never delete. Progress rows are untouched. A removed topic is soft-retired by absence from the snapshot query, not by a destructive delete.
- Adding a track means adding one file plus one line in the registry. No schema change, no new route code.

### 4. AI track shape

- Phase 1 is a **prerequisite** phase: four topics (`APIs`, `Databases`, `Authentication`, `Infrastructure`) with `durationWeeks = 0`, each with `linkedTopicId` pointing at the matching Backend topic.
- A linked topic is read-only by default and mirrors the Backend topic's derived status; it shows "Done in Backend track". An explicit `user_topic_state` row (the "I already know this" override) takes precedence.
- AI timeline maths skip zero-week phases, so week 0 is Phase 2. Phase totals still include prerequisite topics for completion, but not for weeks.
- All AI durations are `estimated: true` and render an "Estimated" badge with a tooltip.

### 5. Routing and rendering

- `/` landing and picker, `/backend`, `/ai-engineer`, `/journey`, `/settings`.
- Track comes from the pathname. `?view=list|graph|journey` is the only view state that belongs in the URL.
- `last_track` cookie is written on track navigation and read by the server so `/` and `/journey` render the right accent and links without a client flash.
- `data-track` on `<html>` swaps per-track accent tokens; no flash because the server sets it.

### 6. 3D is optional and budgeted

- `TrackWorld` and `Journey3D` are `next/dynamic({ ssr: false })` behind `NEXT_PUBLIC_ENABLE_3D`.
- Fallback order: kill switch → reduced motion → Save-Data → `hardwareConcurrency <= 4` → no WebGL → static SVG poster.
- One canvas on the landing page; one on Journey. Never two mounted at once.
- A CI bundle budget records the 3D chunk size; a regression fails the build gate.

## Consequences

**Good**

- Backend progress survives the migration and re-seeding; a third track is a content file.
- Accounts become an auth layer, not a data migration.
- Track switching is a URL change, so links, back/forward and SSR all work.

**Costs / risks**

- Two-table reads replace one; the snapshot query grows. Mitigate with one query per table and in-memory joins (current pattern), plus indexes on `(owner_id, topic_id)`.
- Mirroring linked topics is a derived read, not a stored copy. If a Backend topic is renamed or removed, the AI prerequisite must fail loudly in the content test, not silently disappear.
- Keeping legacy columns for one release means two sources of truth in the schema. A test asserts the backfill counts match before the columns are dropped.

## Verification

1. Migration is additive: before/after row counts for `phases`, `topics`, `subtopics`, `resources` recorded in the merge notes.
2. Backfilled `user_subtopic_state.done` count equals the old `subtopics.done = true` count; `user_topic_state` notes non-empty count equals the old count.
3. `db:seed` run twice in a row leaves state row counts unchanged.
4. Vitest covers progress/timeline maths, content schema, and the migration mapping.
5. `lint`, `typecheck`, `test`, `build` green; axe clean on every route.

## Alternatives considered

- **Duplicate the schema per track** (`backend_topics`, `ai_topics`): rejected — every query and component doubles.
- **One `progress` JSON blob per owner**: rejected — no per-topic indexing, hard to scope and audit.
- **Separate apps per track**: rejected — the journey view and shared progress require one data model.
