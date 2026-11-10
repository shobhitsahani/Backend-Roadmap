# ADR 0003 — TypeScript-only AI track and mandatory, on-by-default 3D

- Status: accepted · 2026-11-11 · Deciders: product owner (correction directive) · Supersedes: 3D-fallback
  language in [PRODUCT.md](../../PRODUCT.md) and ADR 0002's "3D is optional" scope.
- Base: `main` @ `d2c5fa9` (B3 TrackWorld band merged).

## 1. Why

Two defects against the intended product:

1. **The AI Engineer track came out Python-flavored.** Every other track in the
   product is expressed as TypeScript tooling, but the AI track taught Python,
   Pydantic, FastAPI and Python-ecosystem SDKs. The correction is absolute:
   the track is language-agnostic in _concepts_, but every topic, subtopic,
   tool, library, resource and code sample is JavaScript/TypeScript.
2. **The 3D requirement is not visibly delivered.** B3 shipped a single landing
   band that is below the hero, effectively static, and invisible on every
   other surface. The directive makes 3D a hard requirement: on by default for
   every visitor whose device can run WebGL, clearly visible, and proven by
   tests and screenshots.

## 2. Python audit (sweep method)

Case-insensitive pattern
`python|\.py\b|\bpip\b|pyproject|requirements\.txt|fastapi|flask|django|jupyter|pytorch|langchain python`
over `content/`, `app/`, `components/`, `lib/`, `db/`, `drizzle/`, `scripts/`,
`docs/`, `tests/`, `README.md`, `GOAL.md`, `PRODUCT.md`, `DESIGN.md`,
`CHANGELOG.md`, `.github/`, `compose.yaml`, plus a direct search for Python
code samples and `*.py`/`Dockerfile` (none exist).

### Hits

| File                                                                                                                                                            | Line(s)       | Content                                                                                                                                                                                                                                                                                      | Disposition                                                                                                                                                                                                       |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content/tracks/ai-engineer.ts`                                                                                                                                 | 119           | Phase 2 title "Python and LLM foundations"                                                                                                                                                                                                                                                   | Rewrite → "AI primitives"                                                                                                                                                                                         |
|                                                                                                                                                                 | 126–182       | Topic `ai-python` "Python for AI engineers": summary ("Typed Python…"), tip ("Most AI tooling is Python-first…"), flow (`pydantic model → async client`), subtopics (`ai-python-1..4`), outcome, resources (`docs.python.org` tutorial/asyncio, `docs.pydantic.dev`, `fastapi.tiangolo.com`) | Remove topic; replace with `typescript-for-ai-engineering` (new id)                                                                                                                                               |
|                                                                                                                                                                 | 570           | Resource "LangGraph overview" → `docs.langchain.com/oss/python/langgraph/overview`                                                                                                                                                                                                           | Replace with LangGraph **JS** docs or drop                                                                                                                                                                        |
|                                                                                                                                                                 | 575           | Resource "OpenAI Agents SDK" → `openai.github.io/openai-agents-python/`                                                                                                                                                                                                                      | Replace with TS SDK docs or drop                                                                                                                                                                                  |
|                                                                                                                                                                 | 396           | Resource "LlamaIndex documentation" → `docs.llamaindex.ai` (Python-first)                                                                                                                                                                                                                    | Drop/replace after doc verification                                                                                                                                                                               |
|                                                                                                                                                                 | 454           | Resource "Ragas" → `github.com/explodinggradients/ragas` (Python lib)                                                                                                                                                                                                                        | Drop; evals → Vitest/promptfoo/Mastra evals                                                                                                                                                                       |
|                                                                                                                                                                 | 459, 729      | LangSmith observability links (`docs.langchain.com/langsmith/…`)                                                                                                                                                                                                                             | Replace with Langfuse JS/TS SDK docs (spec names it)                                                                                                                                                              |
|                                                                                                                                                                 | 221           | "Hugging Face LLM course" (`huggingface.co/learn/llm-course`; notebooks are Python-first)                                                                                                                                                                                                    | Replace with verified TS-first source                                                                                                                                                                             |
| `components/landing/landing-page.tsx`                                                                                                                           | 179           | Hero copy "Python, retrieval, agents"                                                                                                                                                                                                                                                        | Rewrite to not name a language; summary carries the TS rationale                                                                                                                                                  |
| `content/tracks/backend.ts`                                                                                                                                     | 28, 39, 65–67 | "JavaScript, Golang, Java, Python" language options + Python tutorial resource                                                                                                                                                                                                               | **Retained deliberately** — Backend track is out of scope for this correction; its four-language choice is shipped Backend product content. Backlog: revisit with the owner if Backend must also become TS-first. |
| `tests/seed-plan.test.ts`                                                                                                                                       | 31            | Fixture references `pick-a-language`                                                                                                                                                                                                                                                         | Retained — legitimate Backend fixture                                                                                                                                                                             |
| `package-lock.json`                                                                                                                                             | ~6069         | String `"Python-2.0"`                                                                                                                                                                                                                                                                        | SPDX license identifier of an npm package; **not** a Python dependency. No action.                                                                                                                                |
| `README.md`, `GOAL.md`, `PRODUCT.md`, `DESIGN.md`, `docs/`, `app/`, `components/` (rest), `lib/`, `db/`, `drizzle/`, `scripts/`, `.github/`, `compose.yaml`, CI | —             | no matches                                                                                                                                                                                                                                                                                   | —                                                                                                                                                                                                                 |
| "Python or JS/TS"-style choice phrasing                                                                                                                         | —             | none found                                                                                                                                                                                                                                                                                   | The AI track was Python-only, never a choice                                                                                                                                                                      |

### Consequences

- New content test (branch 2) fails on
  `/python|\bpip\b|\.py\b|fastapi|flask|django|jupyter|pytorch/i` in any
  AI-track string; sole exception is the `honestyNote` field on the
  Fine-tuning topic.
- Resource URLs in the rewritten track are limited to official docs verified
  by fetching at authoring time; no invented URLs.

## 3. 3D honest audit (probe: Chromium via Playwright, WebGL/SwiftShader,

1440×960, dev server `localhost:3100` serving `main` @ `d2c5fa9`, screenshots + DOM probe)

| Element (required by directive)                                  | Exists?                                             | Actually renders?                                                                                                                            | Notes / blockers                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Landing hero `TrackWorld`                                        | Partial — `components/three/track-world.tsx` et al. | **Yes, but wrong place and inert.** `data-track-world="on"`; one canvas 1086×300; WebGL2 present. Playwright screenshot shows both clusters. | Band is **below the hero**, not in the first viewport. `frameloop="demand"` + no `invalidate()` anywhere → single static frame; pulses and camera dolly never animate. `dpr [1,1.5]` vs required `[1,2]`. Caption click fires route change immediately (no dolly-then-route). No hover tilt. No `data-testid`/`data-state`/`data-fallback-reason`. Canvas missing `aria-hidden` attribute (R3F spread did not land it). |
| Track header scene (`/backend`, `/ai-engineer`)                  | **Missing**                                         | No                                                                                                                                           | Not implemented.                                                                                                                                                                                                                                                                                                                                                                                                        |
| `Journey3D` (`?view=journey`)                                    | **Missing**                                         | No                                                                                                                                           | `lib/routes.ts parseRoadmapView` maps `journey→graph` (B1 stopgap); no List \| Graph \| 3D Journey switcher.                                                                                                                                                                                                                                                                                                            |
| `ProgressCore` on dashboard (`/[track]/log`)                     | **Missing**                                         | No                                                                                                                                           | Dashboard is "Field log"; segmented phase ring absent. Also carries a hardcoded `/ 36` weeks total (violates derived-totals rule) — fix in step 6.                                                                                                                                                                                                                                                                      |
| CSS 3D card tilt (≤6°, spring, off on touch)                     | **Missing**                                         | No                                                                                                                                           | —                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Settings "3D effects: On / Reduced / Off", default On, persisted | **Missing**                                         | No                                                                                                                                           | `/settings` has no 3D control; no persisted client-side preference.                                                                                                                                                                                                                                                                                                                                                     |
| Fallback chain                                                   | Exists, deviates                                    | —                                                                                                                                            | Skips on `hardwareConcurrency ≤ 4` (directive removes this gate) and on `prefers-reduced-motion` (directive keeps the canvas as a static frame). Save-Data skip OK. `NEXT_PUBLIC_ENABLE_3D`: `.env.example`=`true` ✓; local `.env` unset → enabled ✓. No `data-state` contract; no `3d_fallback_used` logging.                                                                                                          |
| Playwright WebGL launch args                                     | **Missing**                                         | —                                                                                                                                            | `playwright.config.ts` has no WebGL flags; B3 e2e passed on default headless WebGL luck. Directive requires explicit args and a fail-first WebGL2 assertion.                                                                                                                                                                                                                                                            |
| Poster fallback                                                  | OK                                                  | OK                                                                                                                                           | SVG poster mirrors both clusters; kept as the WebGL-failure path.                                                                                                                                                                                                                                                                                                                                                       |

### Consequences

- The kill chain becomes: WebGL context creation failure → user Off →
  Save-Data → `NEXT_PUBLIC_ENABLE_3D="false"` → SVG poster.
  `prefers-reduced-motion` renders one static frame instead of unmounting.
  Remove the `hardwareConcurrency` gate; weak devices get lower DPR and fewer
  points via Drei `PerformanceMonitor`, with a sustained fps<24 escape hatch.
- `.env.example` remains `NEXT_PUBLIC_ENABLE_3D=true`.
- Every 3D wrapper ships `data-testid`, `data-state`
  (`loading|ready|static|fallback`), `data-fallback-reason`, and logs
  `3d_fallback_used` with the reason.
- 3D is never the LCP path; DOM content renders first; canvases stay
  `aria-hidden="true"` with DOM controls as the a11y story; max two canvases
  mounted at once; dispose on unmount; `frameloop="demand"` + `invalidate()`
  only while animating.

## 4. Migration plan for user progress (branch 2)

Hand-written additive migration `drizzle/0002_*.sql` (house style: the
migration is tested as a file, like `0001_zippy_riptide.sql`):

- `ai-python` → `typescript-for-ai-engineering` (direct predecessor).
- `pick-a-language` → `typescript-for-ai-engineering` (explicit directive).
  **Copy, not move** — `pick-a-language` is live Backend content and its rows
  must stay for the Backend track.
- `ai-embeddings` → `ai-rag`; `ai-rag-eval` → `ai-evals`;
  `ai-architecture` → `ai-auth-payments`; `ai-safety` → `ai-guardrails`
  (content moved there).
- Kept ids: `ai-llm-fundamentals`, `ai-prompting`, `ai-tool-calling`,
  `ai-agent-loops`, `ai-mcp`, `ai-observability`, `ai-capstone`,
  phase ids `ai-foundations` (→ "AI primitives"), `ai-retrieval` (→ "AI systems"),
  `ai-agents` (→ "Production AI"), `ai-production` (→ "Leverage and build").
- Subtopic state maps source→target **by order, capped at min length**
  (`ai-python-1..4` → the new TS subtopics; remainder source rows deleted
  with their topic, target beyond the cap starts fresh).
- `activity.topic_id/subtopic_id` remapped with the same mapping so the Field
  log replay stays meaningful.
- All statements additive/upsert-if-absent; no drops of progress tables;
  content re-seed is idempotent (upsert by stable id).
- Proven by `tests/migration-ai-ts.test.ts` in the house style.

## 5. Branch plan

1. `chore/audit-python-and-3d` (this ADR)
2. `fix/ai-track-typescript-only`
3. `fix/3d-on-by-default`
4. `feat/3d-trackworld-hero-and-header`
5. `feat/3d-journey-view`
6. `feat/3d-progress-core`
7. `test/3d-e2e-and-screenshots`
8. `chore/3d-polish`

## Non-goals

- Backend content untouched; Backend keeps its Python language option.
- Poster is not removed — it is the WebGL-unavailable path.
- No C1–C4 scope (auth/SEO/observability/i18n) here; no D-series gates reopened
  except G3/G5, closed in step 8.
