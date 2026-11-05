# DESIGN.md — Backend Roadmap Tracker

## 1. Direction

**Engineer's blueprint / field notebook.** The app should feel like a working document pinned to a drafting table: graphite surfaces, measured hairlines, compact annotations, and one flat signal colour per phase. It is a tool that records work, not a dashboard that performs enthusiasm.

- **Audience:** one self-directed developer following a 36-week backend syllabus.
- **Single job of the screen:** answer “where am I, what is next, and what have I finished?”
- **Signature:** the **36-week measure** — a hairline ruler split into seven/every topic block, filled only by real completed weeks, with a crosshair marking today's expected position. It appears large in the field log and compact in the roadmap header.
- **Second motif:** handwritten margin logic without handwriting fonts — mono annotations, small crosshair marks, and index numbers attached to real sequence, never decoration.

The interface is dark-first. Light mode is drafting paper, not a different product.

## 2. Design principles

1. **One border, one accent.** Structure comes from hairlines, type scale, and whitespace before boxes.
2. **Data is the decoration.** Rings, ticks and fills always encode progress. Nothing loops except the current topic marker.
3. **Flat phase signals.** Phase colours are flat tints. Never gradients, glows, or tinted glass.
4. **Measured, not rounded.** Small 2–6px radii. Controls align to a 4px baseline.
5. **The notebook stays quiet; the plan carries the colour.** Phase tints occupy less than 10% of any viewport.
6. **Tight type, generous margins.** Dense labels and numbers, open section spacing.

## 3. Colour tokens

All tokens are OKLCH. Phase colours are defined separately per theme so text passes WCAG AA on their own surfaces.

### Graphite (dark, default)

| Token               | Value                           | Role                                        |
| ------------------- | ------------------------------- | ------------------------------------------- |
| `--surface-0`       | `oklch(0.166 0.008 145)`        | app canvas, graphite with a green undertone |
| `--surface-1`       | `oklch(0.196 0.009 145)`        | panels, inputs                              |
| `--surface-2`       | `oklch(0.226 0.010 145)`        | raised controls, hover rows                 |
| `--surface-3`       | `oklch(0.266 0.011 145)`        | tooltips, selected fields                   |
| `--ink`             | `oklch(0.930 0.011 110)`        | primary text                                |
| `--ink-muted`       | `oklch(0.710 0.012 135)`        | secondary text                              |
| `--ink-subtle`      | `oklch(0.650 0.012 135)`        | metadata that must still pass AA            |
| `--hairline`        | `oklch(0.930 0.020 120 / 0.14)` | 1px rules                                   |
| `--hairline-strong` | `oklch(0.930 0.020 120 / 0.26)` | control borders                             |
| `--phase-1`         | `oklch(0.775 0.130 150)`        | Foundation / green                          |
| `--phase-2`         | `oklch(0.750 0.115 246)`        | Core backend / blue                         |
| `--phase-3`         | `oklch(0.760 0.120 300)`        | Production / violet                         |
| `--phase-4`         | `oklch(0.735 0.150 28)`         | Hard core / red                             |
| `--accent-contrast` | `oklch(0.166 0.008 145)`        | text sitting on a phase fill                |

### Drafting paper (light)

| Token               | Value                           | Role                         |
| ------------------- | ------------------------------- | ---------------------------- |
| `--surface-0`       | `oklch(0.968 0.005 120)`        | cool paper, never cream      |
| `--surface-1`       | `oklch(0.992 0.002 120)`        | panels                       |
| `--surface-2`       | `oklch(0.946 0.006 120)`        | raised fields                |
| `--surface-3`       | `oklch(0.920 0.008 120)`        | tooltips, selected fields    |
| `--ink`             | `oklch(0.220 0.012 140)`        | near-black ink               |
| `--ink-muted`       | `oklch(0.430 0.012 140)`        | secondary text               |
| `--ink-subtle`      | `oklch(0.470 0.012 140)`        | metadata                     |
| `--hairline`        | `oklch(0.220 0.012 140 / 0.16)` | 1px rules                    |
| `--hairline-strong` | `oklch(0.220 0.012 140 / 0.28)` | control borders              |
| `--phase-1`         | `oklch(0.465 0.105 150)`        | Foundation / green           |
| `--phase-2`         | `oklch(0.470 0.125 250)`        | Core backend / blue          |
| `--phase-3`         | `oklch(0.475 0.150 300)`        | Production / violet          |
| `--phase-4`         | `oklch(0.480 0.155 29)`         | Hard core / red              |
| `--accent-contrast` | `oklch(0.968 0.005 120)`        | text sitting on a phase fill |

Soft phase fills use `color-mix(in oklch, var(--phase-N) 12%, transparent)`. Phase borders use 34% mix. No phase fill exceeds 12% opacity across large areas.

Semantic shadcn variables map directly: `background` → surface-0, `card`/`popover` → surface-1, `secondary`/`muted` → surface-2, `border`/`input` → hairline tokens, `foreground` → ink, `muted-foreground` → ink-subtle, `primary` → ink (dark) / ink (light), `ring` → phase-1. Exceptions are documented per theme in `app/globals.css`.

## 4. Type

| Role    | Family                  | Usage                                                                                          |
| ------- | ----------------------- | ---------------------------------------------------------------------------------------------- |
| Display | **Bricolage Grotesque** | page titles, phase names, drawer title. Restrained, 600–700 weight.                            |
| Body    | **Instrument Sans**     | interface copy, topic summaries, notes. 400–600.                                               |
| Data    | **JetBrains Mono**      | percentages, durations, dates, week counts, eyebrows, keyboard hints. Always tabular numerals. |

### Scale

| Token        | Size / line-height | Tracking | Use                           |
| ------------ | ------------------ | -------- | ----------------------------- |
| `micro`      | 10px / 1.3         | +0.14em  | uppercase eyebrow, chart axes |
| `label`      | 12px / 1.35        | +0.06em  | metadata, buttons, chips      |
| `caption`    | 13px / 1.45        | 0        | helper text                   |
| `body`       | 15px / 1.55        | -0.005em | default copy                  |
| `body-lg`    | 17px / 1.55        | -0.01em  | lead paragraphs               |
| `title-sm`   | 22px / 1.25        | -0.02em  | drawer topic title            |
| `title`      | 28px / 1.15        | -0.025em | section titles                |
| `display-sm` | 40px / 1.03        | -0.035em | mobile page titles            |
| `display`    | 56px / 0.98        | -0.045em | desktop page titles           |
| `readout`    | 72px / 0.9         | -0.05em  | progress readout only         |

Numbers are monospace and tabular. No number is rendered in the display face.

## 5. Spacing, radii, border, elevation

- **Spacing:** 4px base; permitted steps are 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128. Page gutters: 16px mobile, 24px tablet, 40px desktop, 64px at 1440+.
- **Radius:** `xs` 2px, `sm` 4px, `md` 6px, `lg` 8px, `xl` 12px. Pills only for status dots/week markers, never for navigation or badges.
- **Border:** 1px only. Strong borders mark interactive fields; regular borders mark structure.
- **Shadow:** near-none in flat areas. One reserved elevation shadow for overlays: `0 24px 64px -32px rgb(0 0 0 / 0.65)` dark, lighter in paper. Cards lift 2px on hover and border brightens; no glow.
- **Grid:** 12-column desktop, 8-column tablet, 4-column mobile. Everything aligns to the column start; no centred floating cards.

## 6. Layout sketch

```
┌──────────────────────────────────────────────────────────────────────────┐
│ ▦ BACKEND ROADMAP      Roadmap   Field log   Timeline     ⌘K   ◐         │ 64px masthead
├──────────────────────────────────────────────────────────────────────────┤
│ FIELD MANUAL / 36 WEEKS                                     OVERALL      │
│ Backend roadmap                              0%  ███░░░░░ 36-week measure │
│ Four phases. One working system.            0 / 36 weeks                 │
├──────────────────────────────────────────────────────────────────────────┤
│  [ LIST | MAP ]                                      [ SET START DATE ]  │
│ ┌ 01 FOUNDATION ────────────────────────────── 0 / 7 weeks ───────────┐  │
│ │ 1.1  Pick a programming language       4w   ◯ 0%   ▾                 │  │
│ │      □ Pick one: JavaScript, Golang, Java, or Python                 │  │
│ │      □ Clear the language fundamentals                               │  │
│ │ 1.2  How the web works                 3w   ◯ 0%   ▾                 │  │
│ └─────────────────────────────────────────────────────────────────────┘  │
│ ...                                                                       │
├──────────────────────────────────────────────────────────────────────────┤
│ Backend isn't about memorizing tools...                                  │
└──────────────────────────────────────────────────────────────────────────┘
```

- The masthead is a single ruled bar, not a floating nav card.
- Desktop defaults to the list on first visit? No: desktop uses the map when the user has no saved preference; mobile always starts in list. Both share the same row and state treatment.
- Mobile navigation becomes a fixed 64px bottom index; the topic panel becomes a bottom sheet.

## 7. Motion tokens

| Token           | Value                               | Use                                      |
| --------------- | ----------------------------------- | ---------------------------------------- |
| `duration.fast` | 150ms                               | button, chip, border feedback            |
| `duration.base` | 220ms                               | rows, tabs, theme crossfade              |
| `duration.slow` | 300ms                               | view orchestration, drawer content       |
| `ease.out`      | `cubic-bezier(0.22, 1, 0.36, 1)`    | reveals, hovers                          |
| `ease.inOut`    | `cubic-bezier(0.65, 0, 0.35, 1)`    | shared transitions                       |
| `spring.panel`  | stiffness 320, damping 34, mass 0.9 | drawer slide-in                          |
| `spring.layout` | stiffness 380, damping 38, mass 0.7 | selected row, layoutId                   |
| stagger         | 40ms                                | drawer content, first-load orchestration |

Rules:

- Only `transform` and `opacity` animate in UI transitions. Progress path fills and checkmark path drawing are the two semantic exceptions because drawing is the state.
- No looping motion except a 2.4s opacity pulse on the current topic marker.
- `MotionConfig reducedMotion="user"` wraps the tree. When reduced motion is on: no orchestrated entrance, no pulse, no path drawing; values snap.
- Hover lift max 2px. Never scale above 1.02.

### Signature motion moments

1. **Tick a subtopic:** check stroke draws, row settles 2px, topic ring stroke animates, readout ticks by one.
2. **Complete a topic:** the node takes its phase tint and border; the next edge draws its path from top to bottom.
3. **List ↔ map:** topic title shared with a `layoutId`, with a full crossfade fallback if measured positions fight.
4. **Drawer:** spring in from the right on desktop / bottom on mobile; content stagger 40ms; exit via `AnimatePresence`.
5. **Dashboard:** count-up numbers, one-time entrance sequence, diagonal-wave heatmap.
6. **Hover:** row panels raise 2px, hairline brightens, phase marker expands 2px.

## 8. Component treatment

- **Buttons:** 40px desktop / 44px mobile, 4px radius, mono uppercase labels, flat ink fill or hairline outline. Active state nudges down 1px, no glow.
- **Inputs/selects:** 40–44px, surface-1, 1px strong hairline, 2px focus ring. Native date input uses the same shell.
- **Badges/chips:** 2px radius, 10–12px mono, hairline, phase tint only for state. No pills.
- **Checkbox:** 20px square, 2px radius, phase fill and a hand-drawn SVG check. 44px row hit area.
- **Tabs/toggle groups:** bottom-border index, not pill toggles. Active label gets ink and a 1px phase underline.
- **Dialogs/command:** panel on surface-1, 6px radius, no blur, border hairline, elevation shadow. Command rows use mono shortcuts.
- **Drawer:** surface-1 panel, thick left border phase tint (desktop) / top drag handle (mobile). Tip appears as a margin note with a phase rule, not a filled alert box.
- **Charts:** Recharts with a custom tick style, no gridline noise; only 4 phase bars. Use shadcn Chart primitives.
- **Graph:** custom rectangular nodes, 6px radius, phase hairline, dot canvas. Edges are 1px cubic Béziers at 30% opacity; completed segments fill with the phase tint. Controls/MiniMap flattened to the same tokens.
- **Empty states:** small line-art SVG built from crosshairs and rulers; plain explanation and one action. No mascots.
- **Skeletons:** real layout silhouettes (masthead, phase row, topic rows, checklist), pulsing opacity only.

## 9. Copy rules

- Use the roadmap data verbatim for phase names, topics, subtopics, tips, and the footer quote.
- Interface labels are short verbs: "Set start date", "Export JSON", "Reset progress", "Open topic".
- Empty states direct the next action; no apology, no mood.
- Never invent encouragement, fake social proof, marketing headings, or lorem ipsum.

## 10. Verification

- Axe/Lighthouse accessibility >= 95 in dark and light.
- Keyboard: focus always visible; `?`, `Cmd/Ctrl+K`, arrows, Space, Esc all work.
- 44px touch targets at 375px; no horizontal overflow at 375, 768, 1440.
- Reduced-motion pass: no entrance orchestration, no looping current-topic pulse, values snap.
- Screenshot evidence for every UI branch at 375/768/1440 in both themes.
