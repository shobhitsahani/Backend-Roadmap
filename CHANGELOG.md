# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-11-07

First release: the complete 36-week field manual as a single-user tracker.

### Added

- Roadmap content: 4 phases / 11 topics / 52 subtopics seeded into PostgreSQL
  via Drizzle, with duration, checklist, and study tips per topic.
- List and graph (map) roadmap views, switchable, with a per-topic drawer for
  the checklist, status, and notes.
- Progress engine with optimistic subtopic updates and API-failure rollback,
  driving topic / phase / overall completion and the "current topic" pulse.
- Start-date timeline: 36-week projection, expected vs calendar week,
  on-track/behind status, measure view, and milestone targets.
- Field log dashboard: streak, 12-week activity heatmap, per-phase progress
  bars, and a recent-activity feed.
- Progress-file data actions: export as `backend-roadmap-progress` v1 JSON,
  import a previous file, and reset all progress — with a 10-second undo toast
  after destructive actions.
- Command palette (Ctrl/Cmd+K) with topic search, view navigation, theme
  switch, export and reset commands; `?` shortcut help; `1/2/3` view keys.
- Dark-first design system with a complete light theme, graphite field-manual
  tokens, mono overprint labels, and flat phase accents.
- Motion system: transform/opacity only, 150–300ms transitions, spring
  drawers, entrance stagger, one pulse for the current topic, and
  reduced-motion fallbacks.
- Accessibility: WCAG AA contrast in both themes, focus-visible rings,
  keyboard flows for every surface, and 44px touch targets at 375px.
- First-paint skeletons while the snapshot streams, plus line-art empty states
  for the activity log and the unset start date.

### Tooling

- Postgres 17 via `compose.yaml` with a healthcheck; Drizzle migration and
  seed scripts.
- CI workflow running lint, typecheck, Vitest, migration, seed, and build
  against a Postgres service on pushes to `main` and pull requests.
- Conventional Commits enforced via husky + commitlint; prettier and
  lint-staged on pre-commit.
- Screenshot harness (`npm run screenshots`) for 375/768/1440 in dark and
  light.

[0.1.0]: https://github.com/shobhitsahani/Backend-Roadmap/releases/tag/v0.1.0
