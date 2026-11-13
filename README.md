# Backend Roadmap Tracker

> An interactive, offline-capable engineering field manual and syllabus tracker for self-directed developers. Turn fixed, rigorous curricula into working documents with real-time progress projections, dual list/graph maps, a field log streak dashboard, and an interactive 3D visualizer.

[![CI Status](https://github.com/shobhitsahani/Backend-Roadmap/actions/workflows/ci.yml/badge.svg)](https://github.com/shobhitsahani/Backend-Roadmap/actions)
[![Next.js](https://img.shields.io/badge/Next.js-16.4.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-5.1.0-6E9F18?style=flat&logo=vitest)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-1.64.1-45BA4B?style=flat&logo=playwright)](https://playwright.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Repository: [github.com/shobhitsahani/Backend-Roadmap](https://github.com/shobhitsahani/Backend-Roadmap)

---

## Table of Contents

- [Overview](#overview)
  - [The Problem](#the-problem)
  - [Key Features](#key-features)
  - [Target Audiences & Tracks](#target-audiences--tracks)
- [Screenshots & Visual Tour](#screenshots--visual-tour)
- [Tech Stack](#tech-stack)
- [High-Level Design (HLD)](#high-level-design-hld)
  - [System Architecture](#system-architecture)
  - [Data Flow](#data-flow)
- [Low-Level Design (LLD)](#low-level-design-lld)
  - [Folder Structure](#folder-structure)
  - [Module Responsibilities](#module-responsibilities)
  - [Database Schema](#database-schema)
  - [API Endpoints](#api-endpoints)
  - [Key Sequence Flows](#key-sequence-flows)
  - [Error Handling & Validation](#error-handling--validation)
  - [Authentication & Multi-Tenancy Strategy](#authentication--multi-tenancy-strategy)
  - [Theme System & Guardrails](#theme-system--guardrails)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Configure Environment Variables](#3-configure-environment-variables)
  - [4. Start PostgreSQL Database](#4-start-postgresql-database)
  - [5. Run Migrations & Seed Content](#5-run-migrations--seed-content)
  - [6. Start Development Server](#6-start-development-server)
  - [7. Production Build & Execution](#7-production-build--execution)
  - [8. Running Tests, Linting & Formatting](#8-running-tests-linting--formatting)
  - [Operating System Notes (Windows / macOS / Linux)](#operating-system-notes-windows--macos--linux)
- [All Available Scripts](#all-available-scripts)
- [Deployment](#deployment)
  - [Deploying to Vercel + Neon PostgreSQL](#deploying-to-vercel--neon-postgresql)
  - [Self-Hosting with Docker](#self-hosting-with-docker)
- [Troubleshooting](#troubleshooting)
- [Architecture Deep Dive](#architecture-deep-dive)
- [Contributing](#contributing)
- [License](#license)
- [Contact & Links](#contact--links)

---

## Overview

### The Problem

Self-directed engineers studying extensive roadmaps struggle with generic task boards (Trello, Notion, Jira). Generic task managers fail for fixed syllabi because:

1. They require manually entering hundreds of topics, subtopics, study links, and durations.
2. They do not calculate milestone projections against a curriculum timeline.
3. They cannot visualize prerequisite dependencies between tracks (e.g., Software Engineering foundations required for Applied AI).

### Key Features

- **Multi-Track Engineering Manual**: 2 pre-seeded, production-grade curricula spanning **9 phases**, **39 topics**, **150 subtopics**, and **95 learning resources**.
- **Dual Visualizations (List & Node Graph)**: Switch between a high-density checklist with topic drawers and an interactive node graph powered by `@xyflow/react` (React Flow).
- **0ms Optimistic UI Engine**: Check off subtopics with immediate visual feedback. If the network or database write fails, the UI rolls back automatically with a notification.
- **36-Week Timeline Projection**: Anchors to your custom start date, continuously calculating elapsed vs expected weeks, milestone targets, and on-track/behind status.
- **Field Log & Streak Heatmap**: Tracks study consistency with an active day streak counter, a 12-week GitHub-style activity heatmap, and a chronological event log.
- **Cross-Track Journey Map**: Visualizes the interconnected learning journey, showing how foundational backend knowledge unlocks AI Engineering topics.
- **Interactive 3D TrackWorld Scene**: A physical architectural desk model rendered using Three.js and React Three Fiber with an automatic fallback ladder for low-power devices.
- **Data Portability**: Full JSON backup export and import (`backend-roadmap-progress` v2 format) with a 10-second undo toast for destructive operations.
- **Command Palette & Keyboard-First Navigation**: Press `Ctrl+K` / `Cmd+K` to search topics and trigger actions; use `1/2/3` to switch views, `Alt+1/Alt+2` to switch tracks, and `?` for shortcuts.
- **Triple Theme System (OKLCH)**: Supports `Black` (matte graphite), `Purple` (deep neon violet), and `Light` (drafting paper). CI guardrails prevent hardcoded hex color leaks.

### Target Audiences & Tracks

| Track                             | Target Audience                                                                     | Syllabus Scope                      | Duration        | Source Credit                                                           |
| :-------------------------------- | :---------------------------------------------------------------------------------- | :---------------------------------- | :-------------- | :---------------------------------------------------------------------- |
| **Backend Engineer** (`/backend`) | Engineers mastering system design, concurrency, distributed storage, and protocols. | 4 Phases · 11 Topics · 52 Subtopics | 36 Weeks        | Canonical Backend Syllabus                                              |
| **AI Engineer** (`/ai-engineer`)  | Software engineers bridging into LLMs, RAG architectures, and agent systems.        | 5 Phases · 28 Topics · 98 Subtopics | 28 Weeks (Est.) | [AI Engineer Roadmap 2027](https://www.youtube.com/watch?v=CpI7pd5yGCw) |

---

## Screenshots & Visual Tour

|                Landing Page & 3D TrackWorld                |               Backend Roadmap (List View & Drawer)               |
| :--------------------------------------------------------: | :--------------------------------------------------------------: |
| ![Landing Page](docs/screenshots/3d/home-desktop-dark.png) | ![Backend Roadmap](docs/screenshots/3d/backend-desktop-dark.png) |

|                        Connected Journey Map                         |                  Field Log & Activity Heatmap                  |
| :------------------------------------------------------------------: | :------------------------------------------------------------: |
| ![Journey Map](docs/screenshots/3d/backend-journey-desktop-dark.png) | ![Field Log](docs/screenshots/3d/backend-log-desktop-dark.png) |

---

## Tech Stack

| Technology                     | Category         | Purpose                                                                         | Version            |
| :----------------------------- | :--------------- | :------------------------------------------------------------------------------ | :----------------- |
| **Next.js**                    | Framework        | Full-stack React framework (App Router, Server Components, API Route Handlers)  | `16.4.5`           |
| **React** / **React DOM**      | UI Library       | Core component tree and DOM renderer                                            | `19.3.0`           |
| **TypeScript**                 | Language         | Strict static typing, type safety, and interface contracts                      | `6.0.3`            |
| **Tailwind CSS**               | Styling          | Utility-first styling with `@tailwindcss/turbopack` and CSS variables           | `4.3.4`            |
| **Base UI** (`@base-ui/react`) | Primitives       | Accessible headless UI primitives powering shadcn components                    | `1.9.0`            |
| **Drizzle ORM**                | ORM              | Type-safe SQL query builder and schema declarations                             | `0.45.4`           |
| **Drizzle Kit**                | Migration Tool   | Schema diffing and automatic migration file generator                           | `0.31.11`          |
| **postgres** (`postgres.js`)   | DB Client        | Fast PostgreSQL client supporting serverless connection poolers                 | `4.0.0`            |
| **PostgreSQL**                 | Database         | Relational database (PostgreSQL 17 on Docker or Neon Cloud)                     | `17-alpine`        |
| **Zustand**                    | State Management | Client state management with optimistic mutations and local storage persistence | `5.0.16`           |
| **Zod**                        | Validation       | Runtime type validation for API route bodies and export/import schemas          | `4.6.7`            |
| **Three.js**                   | 3D Graphics      | Low-level WebGL 3D rendering library                                            | `0.187.0`          |
| **React Three Fiber**          | 3D Integration   | Declarative Three.js scene graph for React                                      | `9.8.2`            |
| **@react-three/drei**          | 3D Helpers       | Camera controls, performance monitors, lighting, and procedural grids           | `10.7.9`           |
| **@xyflow/react**              | Graph UI         | Interactive node-based React Flow graph canvas for roadmap maps                 | `12.12.1`          |
| **Motion**                     | Animation        | Spring animations, drawer transitions, and pulse indicators                     | `14.9.1`           |
| **Recharts**                   | Data Viz         | SVG phase progress distribution and analytics charts                            | `3.8.0`            |
| **cmdk**                       | Command Menu     | Fast keyboard-driven command palette (`Ctrl+K`)                                 | `1.1.1`            |
| **Sonner**                     | Notifications    | Toast notifications for status updates and 10-second undo prompts               | `2.0.8`            |
| **Vitest**                     | Testing          | Fast unit and integration test runner                                           | `5.1.0`            |
| **Playwright**                 | Testing          | Cross-browser End-to-End and WCAG accessibility test runner                     | `1.64.1`           |
| **Axe Core**                   | Accessibility    | Automated WCAG 2.1 AA accessibility auditing in Playwright tests                | `4.14.0`           |
| **ESLint**                     | Code Quality     | Linter with Next.js and Prettier configuration rules                            | `9.39.5`           |
| **Prettier**                   | Code Formatter   | Opinionated code formatting with Tailwind plugin                                | `3.9.10`           |
| **Husky** / **Commitlint**     | Git Hooks        | Pre-commit formatting and Conventional Commits enforcement                      | `9.1.7` / `21.2.4` |

---

## High-Level Design (HLD)

### System Architecture

The application adopts a **local-first, server-authoritative** design. Client interactions update optimistic Zustand stores immediately and dispatch asynchronous REST calls to Next.js API routes backed by PostgreSQL.

```mermaid
flowchart TB
    subgraph Client["Client Tier (Browser)"]
        Landing["Landing Page / Track Picker (/)"]
        RoadmapUI["Roadmap UI (/backend, /ai-engineer)<br/>List View & React Flow Graph"]
        TimelineUI["Timeline View (/timeline)<br/>36-Week Projection"]
        LogUI["Field Log View (/log)<br/>Streak & Heatmap"]
        ThreeCanvas["TrackWorld 3D Engine<br/>(Three.js / React Three Fiber)"]
        ClientStore["Zustand Client Store<br/>(Optimistic UI + Snapshot Cache)"]

        RoadmapUI --> ClientStore
        TimelineUI --> ClientStore
        LogUI --> ClientStore
        ThreeCanvas --> ClientStore
    end

    subgraph Server["Application Server (Next.js 16 App Router)"]
        ServerComponents["React Server Components<br/>(Initial Fast Server-Side Render)"]
        APIRoutes["Zod-Validated Route Handlers (/api/*)<br/>(subtopics, topics, settings, export, import, reset)"]
        RoadmapEngine["Roadmap Engine (lib/roadmap-server.ts)<br/>Snapshot Builder & Cross-Track Resolver"]
        PureEngines["Pure Calculation Modules<br/>lib/progress.ts · lib/timeline.ts"]

        ServerComponents --> RoadmapEngine
        APIRoutes --> RoadmapEngine
        RoadmapEngine --> PureEngines
    end

    subgraph Data["Persistence Tier"]
        PostgresDB[("PostgreSQL 17 Database<br/>(Docker / Neon Cloud)")]
        DrizzleORM["Drizzle ORM Engine<br/>(Prepared Statement Pooling Safe)"]

        RoadmapEngine --> DrizzleORM
        DrizzleORM --> PostgresDB
    end

    ClientStore -.->|REST HTTP Mutations| APIRoutes
    ServerComponents -.->|Hydration Payload| ClientStore
```

### Data Flow

1. **Initial Page Load**: Server Components read track slug cookies (`last_track`), fetch a consolidated `RoadmapSnapshot` through `lib/roadmap-server.ts`, and render the page shell without layout shift.
2. **Hydration**: The `RoadmapSnapshot` is passed into `store/roadmap-store.tsx`, initializing client components.
3. **User Action (e.g., Ticking a Subtopic)**:
   - The Zustand store applies the update immediately (0ms latency), recomputing topic completion and phase percentages in memory.
   - A `PATCH /api/subtopics/[subtopicId]` request fires in the background.
   - If the request succeeds, the store updates with the server-reconciled snapshot.
   - If the request fails, the store reverts the change and displays an error toast.
4. **Data Isolation**: All user-specific progress is composite-keyed by `owner_id`. Content tables remain untouched during progress resets and imports.

---

## Low-Level Design (LLD)

### Folder Structure

```
├── .github/                      # CI/CD workflows and automation scripts
│   └── workflows/ci.yml          # GitHub Actions CI matrix pipeline
├── app/                          # Next.js App Router root
│   ├── (product)/                # Product routes (shared shell)
│   │   ├── [track]/              # Dynamic track parameter (/backend, /ai-engineer)
│   │   │   ├── log/              # Activity log and streak dashboard
│   │   │   ├── timeline/         # 36-week start-date timeline
│   │   │   ├── layout.tsx        # Track shell provider and layout boundary
│   │   │   └── page.tsx          # Main roadmap screen (List/Graph views)
│   │   ├── journey/              # Connected multi-track journey view
│   │   └── settings/             # User settings (theme, 3D, backup actions)
│   ├── api/                      # Typed REST API route handlers
│   │   ├── export/               # Backup download handler
│   │   ├── import/               # Backup restore handler
│   │   ├── reset/                # Progress reset handler
│   │   ├── roadmap/              # Roadmap snapshot fetcher
│   │   ├── settings/             # Track start date handler
│   │   ├── subtopics/[subtopicId]/ # Subtopic status patcher
│   │   └── topics/[topicId]/     # Topic status and notes patcher
│   ├── globals.css               # Core CSS & Tailwind directives
│   ├── layout.tsx                # Root layout with theme script injection
│   ├── page.tsx                  # Public landing page with 3D TrackWorld
│   └── themes.css                # Generated static CSS custom properties (OKLCH)
├── components/                   # Modular React components
│   ├── app/                      # Shell headers, masthead, track switcher
│   ├── command/                  # Command palette (`Ctrl+K`) and shortcuts modal
│   ├── dashboard/                # Heatmap, streak counters, phase charts
│   ├── graph/                    # React Flow nodes, edges, and custom layout
│   ├── landing/                  # Landing page presentation components
│   ├── roadmap/                  # Phase sections, topic items, topic drawer
│   ├── theme/                    # Theme switcher buttons and theme provider
│   ├── three/                    # Three.js TrackWorld canvas, lighting, ground grid
│   ├── timeline/                 # Week ruler, milestones, and status indicators
│   └── ui/                       # Accessible Base UI / shadcn primitive components
├── content/                      # Immutable curriculum source of truth
│   └── tracks/                   # Typed track curriculum files
│       ├── ai-engineer.ts        # AI Engineer syllabus definition
│       ├── backend.ts            # Backend Engineer syllabus definition
│       └── index.ts              # Track catalog index
├── db/                           # Database configuration and migration scripts
│   ├── index.ts                  # Drizzle ORM client initialization
│   ├── migrate.ts                # Drizzle migration execution runner
│   ├── schema.ts                 # Full PostgreSQL schema definition
│   ├── seed-plan.ts              # Pure content-to-database row mapper
│   └── seed.ts                   # Upsert script for curriculum content
├── docs/                         # Documentation assets and architecture records
│   ├── adr/                      # Architecture Decision Records (0002–0007)
│   ├── screenshots/              # Reference product screenshots
│   └── ARCHITECTURE.md           # Exhaustive system architecture document
├── drizzle/                      # Generated SQL migration scripts
├── lib/                          # Core domain engines and utilities
│   ├── api.ts                    # Server route wrappers and Zod parsers
│   ├── client-api.ts             # Client fetch wrapper with error decoding
│   ├── errors.ts                 # Standardized RoadmapError class
│   ├── motion.ts                 # Shared Framer Motion animation tokens
│   ├── owner.ts                  # Tenant owner ID resolver (guest-first)
│   ├── progress.ts               # Pure progress, streak, and heatmap calculations
│   ├── progress-file.ts          # JSON import/export serializer
│   ├── roadmap-server.ts         # Server-side snapshot builder and mutator
│   ├── three-fallback.ts         # 3D fallback logic and hardware detection
│   ├── timeline.ts               # 36-week schedule and milestone projector
│   └── theme/                    # OKLCH color token definitions and compiler
├── scripts/                      # Developer automation scripts
│   ├── check-theme-colors.mjs    # CI linter verifying zero hardcoded hex colors
│   ├── generate-themes.ts        # Generator compiling theme tokens to CSS/SVG
│   └── screenshots.ts            # Headless Playwright screenshot capture tool
├── store/                        # Client Zustand state stores
│   ├── roadmap-store.tsx         # Snapshot cache, optimistic updates, and rollback
│   ├── three-store.ts            # User 3D rendering preferences
│   └── ui-store.ts               # Topic drawer and modal open/close states
├── tests/                        # Vitest unit tests and Playwright E2E suites
│   ├── e2e/                      # Playwright E2E and WCAG accessibility specs
│   └── *.test.ts                 # Domain logic unit tests (progress, timeline, theme)
└── types/                        # Shared TypeScript interfaces and Zod schemas
    └── roadmap.ts                # RoadmapSnapshot, Track, Phase, Topic schemas
```

### Module Responsibilities

| Module                    | Core Responsibilities                                                                                                                                                                                 |
| :------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/roadmap-server.ts`   | Server-authoritative data engine. Loads content and user state in batched SQL queries, performs prerequisite topic mirroring, and executes ACID transaction writes.                                   |
| `lib/progress.ts`         | Pure deterministic calculation functions for topic completion, phase completion, overall progress percentage, active streak calculation, and 12-week heatmap generation.                              |
| `lib/timeline.ts`         | Timeline schedule engine. Takes a start date and derives elapsed weeks, expected week position, on-track/behind statuses, and calendar milestone targets.                                             |
| `lib/three-fallback.ts`   | Device capability detection ladder. Inspects WebGL 1/2 context availability, `Save-Data` headers, `prefers-reduced-motion`, and hardware concurrency to select 3D, static 3D, or SVG poster fallback. |
| `lib/theme/tokens.ts`     | Canonical color definitions using OKLCH color space for `black`, `purple`, and `light` themes.                                                                                                        |
| `store/roadmap-store.tsx` | React client store. Manages the active `RoadmapSnapshot`, executes 0ms optimistic UI updates, coordinates background API dispatches, and handles automatic rollbacks upon failure.                    |

### Database Schema

The database maintains a strict split between **Immutable Content** and **Mutable User State**:

```mermaid
erDiagram
    tracks ||--o{ phases : "contains"
    phases ||--o{ topics : "contains"
    topics ||--o{ subtopics : "contains"
    topics ||--o{ resources : "references"
    topics ||--o| topics : "prerequisite link (linkedTopicId)"

    tracks ||--o{ track_settings : "configured by"
    topics ||--o{ user_topic_state : "tracks status for"
    subtopics ||--o{ user_subtopic_state : "tracks completion for"
    topics ||--o{ activity : "logged against"
    subtopics ||--o{ activity : "logged against"
```

#### Tables Summary

1. `tracks`: Curriculum track definitions (ID slug, title, order, identity hue, source attribution).
2. `phases`: Curriculum phases tied to a track (`track_id`, title, tip, order).
3. `topics`: Syllabus topics (`phase_id`, duration in weeks, tip, outcome, `linked_topic_id` prerequisite pointer, `estimated` flag).
4. `subtopics`: Actionable checklist items per topic (`topic_id`, title, order).
5. `resources`: External study links per topic (`topic_id`, title, url).
6. `user_topic_state`: User status overrides and study notes (`owner_id`, `topic_id`, status, notes, `updated_at`).
7. `user_subtopic_state`: User checklist status (`owner_id`, `subtopic_id`, done, `done_at`, `updated_at`).
8. `track_settings`: Start date per user and track (`owner_id`, `track_id`, `start_date`, `updated_at`).
9. `activity`: Append-only activity log for streak and heatmap computations (`owner_id`, kind, `topic_id`, `subtopic_id`, `created_at`).

### API Endpoints

All API routes are served under `/api` and strictly validated using Zod:

| Method  | Endpoint                      | Description                              | Request Body / Query Params                                                                                  | Success Response                     | Error Codes                             |
| :------ | :---------------------------- | :--------------------------------------- | :----------------------------------------------------------------------------------------------------------- | :----------------------------------- | :-------------------------------------- |
| `GET`   | `/api/roadmap`                | Fetch full consolidated roadmap snapshot | Query: `?track=<slug>` (default: `backend`)                                                                  | `200 OK` `{ data: RoadmapSnapshot }` | `INVALID_TRACK`, `INTERNAL`             |
| `PATCH` | `/api/subtopics/[subtopicId]` | Check or uncheck a subtopic              | Body: `{ "done": boolean }`                                                                                  | `200 OK` `{ data: RoadmapSnapshot }` | `INVALID_BODY`, `NOT_FOUND`, `INTERNAL` |
| `PATCH` | `/api/topics/[topicId]`       | Update notes or manual topic status      | Body: `{ "notes"?: string, "status"?: "not_started" \| "in_progress" \| "done", "clearOverride"?: boolean }` | `200 OK` `{ data: RoadmapSnapshot }` | `INVALID_BODY`, `NOT_FOUND`, `INTERNAL` |
| `PATCH` | `/api/settings`               | Update track start date                  | Body: `{ "trackSlug": string, "startDate": "YYYY-MM-DD" \| null }`                                           | `200 OK` `{ data: RoadmapSnapshot }` | `INVALID_BODY`, `INTERNAL`              |
| `GET`   | `/api/export`                 | Download full progress backup JSON       | Query: `?track=<slug>` (default: `backend`)                                                                  | `200 OK` (JSON file attachment)      | `INVALID_TRACK`, `INTERNAL`             |
| `POST`  | `/api/import`                 | Restore progress from backup JSON        | Body: `{ "format": "backend-roadmap-progress", "version": 2, "data": ... }`                                  | `200 OK` `{ data: RoadmapSnapshot }` | `INVALID_BODY`, `INTERNAL`              |
| `POST`  | `/api/reset`                  | Wipe user progress for a track           | Query: `?track=<slug>` (default: `backend`)                                                                  | `200 OK` `{ data: RoadmapSnapshot }` | `INVALID_TRACK`, `INTERNAL`             |

### Key Sequence Flows

#### 1. Optimistic Subtopic Toggle & Rollback

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as Checklist Item
    participant Store as Zustand Store
    participant API as /api/subtopics/[id]
    participant DB as PostgreSQL

    User->>UI: Clicks subtopic checkbox
    UI->>Store: toggleSubtopic(id, true)
    Store->>Store: Apply optimistic change & recalculate stats (0ms)
    Store-->>UI: Checkbox updates to completed immediately

    Store->>API: HTTP PATCH { "done": true }
    alt Write Successful
        API->>DB: Upsert user_subtopic_state & insert activity row
        DB-->>API: Success
        API-->>Store: 200 OK { data: freshSnapshot }
        Store->>Store: Reconcile client state with server confirmation
    else Network or Server Failure
        API-->>Store: 500 Error / Network Timeout
        Store->>Store: Rollback state to previous snapshot!
        Store-->>UI: Checkbox reverts to unchecked
        Store->>User: Display Sonner error toast
    end
```

#### 2. Progress Export and Import Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Settings as Settings UI
    participant ExportAPI as /api/export
    participant ImportAPI as /api/import
    participant DB as PostgreSQL

    User->>Settings: Clicks "Export Progress"
    Settings->>ExportAPI: GET /api/export?track=backend
    ExportAPI->>DB: Query user state & activity
    DB-->>ExportAPI: Return rows
    ExportAPI-->>User: Download `backend-roadmap-YYYY-MM-DD.json`

    Note over User,Settings: User migrates to new PC or restores backup

    User->>Settings: Uploads JSON progress file
    Settings->>ImportAPI: POST /api/import (JSON payload)
    ImportAPI->>ImportAPI: Validate schema via Zod (version 1 or 2)
    ImportAPI->>DB: Transaction: Clear existing state & bulk-insert backup rows
    DB-->>ImportAPI: Commit OK
    ImportAPI-->>Settings: 200 OK { data: freshSnapshot }
    Settings-->>User: UI updates with restored study history
```

### Error Handling & Validation

- **Unified Route Handler (`handleRoute`)**: All API routes are wrapped with `handleRoute()` from `lib/api.ts`. Uncaught exceptions are intercepted, logged to server logs, and formatted into clean JSON responses with `Cache-Control: no-store`.
- **Zod Schema Parsing**: Request payloads are parsed via `readBody()`. Schema validation errors return HTTP 400 with exact field violation descriptions.
- **Structured Error Responses**:
  ```json
  {
    "error": {
      "code": "INVALID_BODY",
      "message": "done: Expected boolean, received string"
    }
  }
  ```

### Authentication & Multi-Tenancy Strategy

- The application currently operates in **guest-first local mode** using `owner_id = "guest-local"`.
- Every user data table (`user_topic_state`, `user_subtopic_state`, `track_settings`, `activity`) is composite-keyed with `owner_id`.
- When user authentication (e.g., Auth0, Supabase, NextAuth) is integrated, `getOwnerId()` in `lib/owner.ts` will simply resolve the logged-in session ID, immediately providing full tenant isolation without altering database schemas.

### Theme System & Guardrails

- **Color Spaces**: Authored entirely in **OKLCH** to guarantee uniform perceived contrast across light and dark modes.
- **Color Guardrail**: `scripts/check-theme-colors.mjs` scans all TypeScript and CSS files. If any hardcoded hex color (`#fff`), `rgb()`, `hsl()`, or unmapped Tailwind palette class (e.g. `bg-blue-500`) is detected outside `lib/theme/`, the build breaks.

---

## Prerequisites

Ensure the following tools are installed before running the project:

| Tool               | Minimum Version     | Check Command            | Purpose                           |
| :----------------- | :------------------ | :----------------------- | :-------------------------------- |
| **Node.js**        | `v22.0.0` or higher | `node -v`                | Application JavaScript runtime    |
| **npm**            | `v10.0.0` or higher | `npm -v`                 | Package dependency manager        |
| **Docker**         | `v24.0.0` or higher | `docker -v`              | Running PostgreSQL container      |
| **Docker Compose** | `v2.20.0` or higher | `docker compose version` | Managing multi-container services |
| **Git**            | `v2.30.0` or higher | `git --version`          | Version control system            |

_(Note: If you run PostgreSQL locally as a native service or use a hosted database like Neon, Docker is optional)._

---

## Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/shobhitsahani/Backend-Roadmap.git
cd Backend-Roadmap
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create your local `.env` configuration file from the template:

**macOS / Linux:**

```bash
cp .env.example .env
```

**Windows (PowerShell):**

```powershell
Copy-Item .env.example .env
```

**Windows (Command Prompt):**

```cmd
copy .env.example .env
```

#### Environment Variables Reference

| Variable                | Required | Default Value                                                 | Description                                                                                           | Where to Get                                                                                                          |
| :---------------------- | :------: | :------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`          | **Yes**  | `postgresql://roadmap:roadmap@localhost:5432/backend_roadmap` | PostgreSQL connection string used by Drizzle ORM, route handlers, migrations, and seed scripts.       | Local Docker Compose setup (provided in `compose.yaml`) or cloud providers like [Neon](https://neon.tech) / Supabase. |
| `NEXT_PUBLIC_ENABLE_3D` |    No    | `true`                                                        | Toggle for 3D TrackWorld scene. Set to `"false"` to disable WebGL canvas and force static SVG poster. | Optional local setting. Defaults to `true`.                                                                           |
| `NEXT_PUBLIC_SITE_URL`  |    No    | `http://localhost:3000`                                       | Canonical site URL used for metadata and OpenGraph images.                                            | Set to production domain in deployment.                                                                               |

### 4. Start PostgreSQL Database

Use Docker Compose to launch a pre-configured PostgreSQL 17 container with a healthcheck:

```bash
docker compose up -d
```

Verify that the container is healthy:

```bash
docker ps
```

_(The status should show `Up ... (healthy)` on port `5432`)._

### 5. Run Migrations & Seed Content

Apply schema migrations and upsert curriculum tracks (Backend + AI Engineer) into the database:

```bash
# 1. Apply Drizzle database migrations
npm run db:migrate

# 2. Seed syllabus content (39 topics, 150 subtopics, 95 resources)
npm run db:seed
```

### 6. Start Development Server

```bash
npm run dev
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**.

### 7. Production Build & Execution

To test the optimized production build locally:

```bash
# Compile and build Next.js application
npm run build

# Start the production server
npm run start
```

### 8. Running Tests, Linting & Formatting

```bash
# Run Vitest unit & integration tests (progress, timeline, theme logic)
npm test

# Run tests in watch mode during development
npm run test:watch

# Run TypeScript strict typecheck
npm run typecheck

# Run ESLint validation
npm run lint

# Validate theme token synchronization and color guardrails
npm run theme:check

# Format code with Prettier
npm run format

# Run Playwright End-to-End tests (requires dev server running or uses webServer)
npm run test:e2e
```

### Operating System Notes (Windows / macOS / Linux)

- **PowerShell Execution Policy (Windows)**: If running `npm run db:migrate` or scripts fails with script restriction errors, run PowerShell as Administrator and execute:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```
- **Line Endings (CRLF vs LF)**: Prettier automatically normalizes line endings across platforms. Git `core.autocrlf` is handled transparently.
- **Docker on Linux**: If running Docker without root privileges, ensure your user belongs to the `docker` group (`sudo usermod -aG docker $USER`).

---

## All Available Scripts

Every script declared in [package.json](package.json) and its operational purpose:

| Command                | Script Invocation                                             | Purpose                                                                                            |
| :--------------------- | :------------------------------------------------------------ | :------------------------------------------------------------------------------------------------- |
| `npm run dev`          | `next dev`                                                    | Starts the Next.js development server with hot-module reloading on `http://localhost:3000`.        |
| `npm run build`        | `next build`                                                  | Compiles the production build, generates static routes, and verifies type integrity.               |
| `npm run start`        | `next start`                                                  | Starts the production server using the compiled `.next` output.                                    |
| `npm run lint`         | `eslint .`                                                    | Runs ESLint across all JavaScript, TypeScript, and React source files.                             |
| `npm run typecheck`    | `tsc --noEmit`                                                | Runs TypeScript compiler to verify type definitions without emitting JavaScript.                   |
| `npm test`             | `vitest run`                                                  | Runs the full Vitest unit and integration test suite once.                                         |
| `npm run test:watch`   | `vitest`                                                      | Runs Vitest in interactive file-watching test-runner mode.                                         |
| `npm run test:e2e`     | `playwright test`                                             | Runs Playwright end-to-end tests and automated WCAG 2.1 AA accessibility audits.                   |
| `npm run format`       | `prettier --write .`                                          | Formats all project code, styles, and markdown files using Prettier.                               |
| `npm run format:check` | `prettier --check .`                                          | Verifies that all files conform to Prettier formatting rules without modifying files.              |
| `npm run db:generate`  | `drizzle-kit generate`                                        | Generates a new SQL migration file in `drizzle/` based on changes in `db/schema.ts`.               |
| `npm run db:migrate`   | `tsx db/migrate.ts`                                           | Applies pending SQL migrations from `drizzle/` to the target PostgreSQL database.                  |
| `npm run db:seed`      | `tsx db/seed.ts`                                              | Upserts curriculum tracks, phases, topics, subtopics, and resources into PostgreSQL.               |
| `npm run db:studio`    | `drizzle-kit studio`                                          | Opens the Drizzle Studio visual web database browser on `https://local.drizzle.studio`.            |
| `npm run tokens`       | `tsx scripts/generate-themes.ts`                              | Compiles `lib/theme/tokens.ts` into `app/themes.css` and `app/icon.svg`.                           |
| `npm run tokens:check` | `tsx scripts/generate-themes.ts --check`                      | Verifies that generated theme CSS and SVG files match token definitions.                           |
| `npm run theme:check`  | `npm run tokens:check && node scripts/check-theme-colors.mjs` | Full theme verification: checks token freshness and verifies zero hardcoded hex colors exist.      |
| `npm run screenshots`  | `tsx scripts/screenshots.ts`                                  | Uses Playwright to capture responsive screenshots (375px, 768px, 1440px) in dark and light themes. |
| `npm run prepare`      | `husky`                                                       | Configures Git pre-commit hooks for automated formatting and commit validation.                    |

---

## Deployment

### Deploying to Vercel + Neon PostgreSQL

The application is optimized for deployment on **Vercel** with **Neon Serverless PostgreSQL**.

#### 1. Configure Database (Neon)

1. Create a free PostgreSQL project on [Neon.tech](https://neon.tech).
2. Copy the pooled connection string (contains `-pooler` in the host).

#### 2. Configure Vercel Project

1. Push your repository to GitHub.
2. Import the repository into your Vercel Dashboard.
3. In **Project Settings** → **Environment Variables**, add:
   - **Key**: `DATABASE_URL`
   - **Value**: Your Neon pooled connection string:
     ```
     postgresql://<user>:<password>@<neon-pooler-host>/neondb?sslmode=require
     ```
   - **Environments**: Check `Production`, `Preview`, `Development`.
4. Click **Save**.

#### 3. Run Migrations on Neon

Execute migrations and seed data against your Neon database from your local machine:

```bash
# Apply migrations
DATABASE_URL="postgresql://<user>:<password>@<neon-host>/neondb?sslmode=require" npm run db:migrate

# Seed curriculum data
DATABASE_URL="postgresql://<user>:<password>@<neon-host>/neondb?sslmode=require" npm run db:seed
```

#### 4. Deploy

Trigger a deployment on Vercel. The project's [vercel.json](vercel.json) configures:

- Build command: `npm run build`
- Install command: `npm ci`
- Framework: `nextjs`

> [!NOTE]
> `db/index.ts` is explicitly configured with `prepare: false` to ensure 100% compatibility with Neon's PgBouncer transaction connection pooler across serverless invocations.

### Self-Hosting with Docker

You can run both PostgreSQL and the Next.js application using Docker:

1. Create a `Dockerfile`:
   ```dockerfile
   FROM node:22-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV=production
   COPY package*.json ./
   RUN npm ci --omit=dev
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "run", "start"]
   ```
2. Build and run container:
   ```bash
   docker build -t backend-roadmap .
   docker run -p 3000:3000 --env-file .env backend-roadmap
   ```

---

## Troubleshooting

### 1. `DATABASE_URL is not set` Error

- **Cause**: `.env` file does not exist or does not contain `DATABASE_URL`.
- **Fix**: Copy `.env.example` to `.env` (`cp .env.example .env`) and verify that `DATABASE_URL` is defined.

### 2. Database Connection Refused on `localhost:5432`

- **Cause**: PostgreSQL is not running or another service is occupying port 5432.
- **Fix**:
  1. Check if Docker container is running: `docker compose ps`
  2. If port 5432 is in use by local PostgreSQL, update `compose.yaml` and `.env` to map to port `5433:5432`.

### 3. Neon Connection Pooler Hangs / Prepared Statement Errors

- **Cause**: Using named prepared statements over PgBouncer in transaction pooling mode.
- **Fix**: Verify [db/index.ts](db/index.ts) includes `prepare: false`. Migrations and seed scripts must use the direct unpooled endpoint or have `prepare: false` set.

### 4. `check-theme-colors.mjs` Fails in CI

- **Cause**: A hardcoded color literal (`#hex`, `rgb()`, `hsl()`) or standard Tailwind palette class (e.g., `text-blue-400`) was introduced into a component or script.
- **Fix**: Replace the color with semantic design tokens defined in [lib/theme/tokens.ts](lib/theme/tokens.ts) (e.g., `var(--brand)`, `var(--track-accent)`, `var(--text-muted)`).

### 5. WebGL Context Fails or 3D Scene Is Blank

- **Cause**: The browser or VM lacks hardware WebGL acceleration.
- **Fix**: The application includes an automatic fallback ladder. Set `NEXT_PUBLIC_ENABLE_3D=false` in `.env` to test the SVG poster fallback directly, or switch 3D effects to "Off" in the Settings screen.

---

## Architecture Deep Dive

For an exhaustive architectural breakdown including:

- In-depth C4-style component diagrams
- The complete Content/State split architecture
- Prerequisite mirroring logic between tracks
- The 3D TrackWorld scene graph and lighting models
- Architecture Decision Records (ADRs) catalog

Please consult **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.

---

## Contributing

Contributions are welcome! Please adhere to our development conventions:

1. **Conventional Commits**: Commit messages must adhere to the Conventional Commits standard (enforced via Husky and Commitlint):
   - `feat(roadmap): add export progress shortcut`
   - `fix(timeline): adjust leap year week calculation`
   - `docs(readme): clarify Neon deployment steps`
2. **Pull Request Workflow**:
   - Fork the repository and create a branch from `main`: `git checkout -b feat/your-feature-name`.
   - Ensure all quality gates pass locally before submitting:
     ```bash
     npm run lint && npm run typecheck && npm run theme:check && npm test
     ```
   - Open a Pull Request against `main`.

---

## License

This project is licensed under the [MIT License](LICENSE) (TODO: verify and add formal LICENSE file to repository root if not present).

---

## Contact & Links

- **Repository**: [github.com/shobhitsahani/Backend-Roadmap](https://github.com/shobhitsahani/Backend-Roadmap)
- **Live Deployment**: [backend-roadmap-omega.vercel.app](https://backend-roadmap-omega.vercel.app)
- **Author**: Shobhit Sahani ([@shobhitsahani](https://github.com/shobhitsahani))
