# Goal — Backend Roadmap Tracker

## Objective
Ship a production-quality, single-user web app called **Backend Roadmap Tracker**: an interactive 36-week backend engineering field manual. Dark-first with a complete light theme, built with Next.js App Router, TypeScript strict, Tailwind v4, shadcn/ui (Base UI), Drizzle/PostgreSQL, typed Zod route handlers, Zustand, Motion, React Flow, Recharts, Sonner, next-themes, and Lucide. It must include the graph and list views, topic drawer, phase/topic/overall progress, start-date timeline with on-track/behind status, dashboard with streak and activity heatmap, export/import/reset with undo, command palette and keyboard shortcuts, responsive/mobile behavior, accessibility, design tokens, motion system, and real seed content from the brief. Repository must follow the requested branch/commit/CI/release workflow and end with README, CHANGELOG, and tag `v0.1.0`.

## Verification
1. `npm run lint` passes.
2. `npm run typecheck` passes.
3. `npm test` passes (progress/timeline/streak logic).
4. `npm run build` passes.
5. Drizzle schema, generated migration, and `npm run db:seed` run successfully against the configured PostgreSQL (or embedded PostgreSQL fallback documented in `.env.example`).
6. Playwright captures screenshots at 375, 768 and 1440 px in dark and light; visual inspection confirms no overflow, spacing/contrast issues.
7. Lighthouse accessibility score >= 95 on the final production build.
8. Reduced-motion and keyboard flows verified (Cmd/Ctrl+K, arrows, Space, Esc, ?).
9. `git log` shows short-lived feature branches merged into `main`; tag `v0.1.0` exists.
10. README documents setup, env, db seed, test, screenshots, and architecture; CHANGELOG documents the release.

## Constraints
- Do not use Inter, Roboto, Arial, system fonts, Space Grotesk, Radix primitives, gradients, blobs/glows, glassmorphism, emoji icons, placeholder copy, or looping decoration.
- Maximum four Magic UI / React Bits components; may use fewer.
- Motion only animates transform and opacity; 150–300ms UI transitions; spring drawers/layout; one subtle pulse for the current topic.
- No layout shift when the drawer opens; 44px mobile touch targets; WCAG AA in both themes.
- No direct commits to `main` after the scaffold commit.
- Never commit `.env`, `node_modules`, `.next`, or Playwright screenshots unless intentionally documented.
- Preserve unrelated user files; existing `tmp-app/` is untracked scaffold material and may be removed only after its reusable scaffold is adopted.

## Boundaries
In scope: the entire repository at `C:/projects/Backend-Roadmap` (Next app, components, lib, db, store, types, tests, tooling, docs, git history).
Out of scope: hosting/deployment credentials, multi-user auth implementation, external production database provisioning, network-dependent third-party services beyond npm/fonts/CDN.

## Checkpoints
- [x] 01 Goal structured and scaffold inspected
- [x] 02 Scaffold: Next/Tailwind v4/shadcn Base UI, tooling, CI, Drizzle schema/migration/seed
- [x] 03 Design system: DESIGN.md, tokens, fonts, re-themed primitives, themes, motion tokens
- [x] 04 Typed API routes and data layer
- [x] 05 List view, detail drawer, progress engine, optimistic updates
- [x] 06 Graph view with custom nodes/edges
- [x] 07 Timeline, start date, dashboard, heatmap
- [x] 08 Export/import/reset with undo
- [x] 09 Command palette and keyboard shortcuts
- [x] 10 Motion, empty states, skeletons, mobile, accessibility polish
- [x] 11 README, CHANGELOG, release tag
- [ ] 12 Final screenshots, Lighthouse, verification and merge audit

## Status
pursuing
