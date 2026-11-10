---
name: Backend Roadmap Tracker
description: A graphite field manual for two engineering tracks — Backend and AI Engineer.
colors:
  surface-0: "oklch(0.166 0.008 145)"
  surface-1: "oklch(0.196 0.009 145)"
  surface-2: "oklch(0.226 0.010 145)"
  surface-3: "oklch(0.266 0.011 145)"
  ink: "oklch(0.930 0.011 110)"
  ink-muted: "oklch(0.710 0.012 135)"
  ink-subtle: "oklch(0.650 0.012 135)"
  hairline: "oklch(0.930 0.020 120 / 0.14)"
  hairline-strong: "oklch(0.930 0.020 120 / 0.26)"
  phase-1: "oklch(0.775 0.130 150)"
  phase-2: "oklch(0.750 0.115 246)"
  phase-3: "oklch(0.760 0.120 300)"
  phase-4: "oklch(0.735 0.150 28)"
  phase-contrast: "oklch(0.166 0.008 145)"
  surface-0-paper: "oklch(0.968 0.005 120)"
  surface-1-paper: "oklch(0.992 0.002 120)"
  surface-2-paper: "oklch(0.946 0.006 120)"
  surface-3-paper: "oklch(0.920 0.008 120)"
  ink-paper: "oklch(0.220 0.012 140)"
  ink-muted-paper: "oklch(0.430 0.012 140)"
  ink-subtle-paper: "oklch(0.470 0.012 140)"
  hairline-paper: "oklch(0.220 0.012 140 / 0.16)"
  hairline-strong-paper: "oklch(0.220 0.012 140 / 0.28)"
  phase-1-paper: "oklch(0.465 0.105 150)"
  phase-2-paper: "oklch(0.470 0.125 250)"
  phase-3-paper: "oklch(0.475 0.150 300)"
  phase-4-paper: "oklch(0.480 0.155 29)"
  track-ai: "oklch(0.780 0.140 62)"
  track-ai-paper: "oklch(0.500 0.120 55)"
  ai-phase-1: "oklch(0.760 0.055 78)"
  ai-phase-2: "oklch(0.810 0.130 88)"
  ai-phase-3: "oklch(0.750 0.140 62)"
  ai-phase-4: "oklch(0.715 0.150 38)"
  ai-phase-5: "oklch(0.685 0.145 25)"
  ai-phase-1-paper: "oklch(0.500 0.045 78)"
  ai-phase-2-paper: "oklch(0.505 0.105 88)"
  ai-phase-3-paper: "oklch(0.500 0.115 62)"
  ai-phase-4-paper: "oklch(0.495 0.130 38)"
  ai-phase-5-paper: "oklch(0.485 0.130 25)"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, sans-serif"
    fontSize: "3.5rem"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.045em"
  title:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Instrument Sans, ui-sans-serif, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "-0.005em"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "0.06em"
  micro:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.14em"
rounded:
  xs: "2px"
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
  "12": "48px"
  "16": "64px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface-0}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "40px"
    typography: "{typography.label}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "40px"
    typography: "{typography.label}"
  input:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "40px"
  card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "16px"
  checkbox:
    backgroundColor: "transparent"
    textColor: "{colors.phase-1}"
    rounded: "{rounded.xs}"
    size: "20px"
---

# Design System: Backend Roadmap Tracker

## Overview

**Creative North Star: "The Engineer's Field Notebook"**

The app should feel like a working document pinned to a drafting table: graphite surfaces, measured hairlines, compact annotations, and one flat signal colour per phase. It is a tool that records work, not a dashboard that performs enthusiasm. Dark is the default working light; light mode is drafting paper, not a different product.

The roadmap itself is the composition. Structure comes from 1px rules, a tight type scale, and generous margins before it comes from boxes. Phase colour is a flat tint that marks real state, never atmosphere. The signature element is the 36-week measure: a hairline ruler split across phases, filled only by completed weeks, with a crosshair marking today's expected position.

Motion is restrained and semantic: a check stroke draws, a row settles 2px, a drawer springs in. Only `transform` and `opacity` animate, with path drawing reserved for progress and checkmarks because drawing _is_ the state.

**Key Characteristics:**

- Graphite canvas with a green undertone; cool paper in light mode.
- Hairline structure; one border, one accent.
- Flat phase tints, never gradients, glows, or tinted glass.
- Mono data type with tabular numerals; display face reserved for names and titles.
- Measured 2–6px radii; controls on a 4px baseline.
- Dense labels, open section spacing.

## Colors

A near-neutral graphite range carries almost the whole screen; four flat phase hues do the signalling.

### Primary

- **Ink** (`oklch(0.930 0.011 110)`): primary text, primary button fill, active navigation. In light mode, **Paper Ink** (`oklch(0.220 0.012 140)`).
- **Foundation Green** (`oklch(0.775 0.130 150)`): phase 1, current-topic pulse, focus ring, selected navigation underline.

### Secondary

- **Core Blue** (`oklch(0.750 0.115 246)`): phase 2 signals, progress segments, chart series 2.
- **Production Violet** (`oklch(0.760 0.120 300)`): phase 3 signals, chart series 3.
- **Hard Core Red** (`oklch(0.735 0.150 28)`): phase 4 signals, destructive actions, chart series 4.

### Neutral

- **Graphite Canvas** (`oklch(0.166 0.008 145)`): app background.
- **Graphite Panel** (`oklch(0.196 0.009 145)`): panels, cards, inputs, drawer.
- **Graphite Raised** (`oklch(0.226 0.010 145)`): hover rows, secondary controls.
- **Graphite Field** (`oklch(0.266 0.011 145)`): tooltips, selected fields.
- **Ink Muted** (`oklch(0.710 0.012 135)`): secondary copy, inactive navigation.
- **Ink Subtle** (`oklch(0.650 0.012 135)`): metadata that must still pass AA.
- **Hairline** (`oklch(0.930 0.020 120 / 0.14)`): 1px rules.
- **Hairline Strong** (`oklch(0.930 0.020 120 / 0.26)`): interactive field borders.

### Named Rules

**The One Border, One Accent Rule.** Structure comes from hairlines, type scale, and whitespace before boxes. Phase tints occupy less than 10% of any viewport.

**The Flat Signal Rule.** Phase colours are flat tints. Never gradients, glows, or tinted glass. Soft fills use `color-mix(in oklch, var(--phase-N) 12%, transparent)`; borders use 34%.

## Track Identities

Two tracks, one world. The field-notebook system does not change; the signal palette does. `data-track` on `<html>` swaps the accent tokens, and every component reads the same `--phase-N` / `--track-accent` names in both tracks.

| Token            | Backend Engineer (default)                | AI Engineer (warm)                                 |
| ---------------- | ----------------------------------------- | -------------------------------------------------- |
| `--track-accent` | Foundation Green `oklch(0.775 0.130 150)` | Copper `oklch(0.780 0.140 62)`                     |
| Phases           | 4                                         | 5 (Phase 1 is a zero-week prerequisite)            |
| Phase ramp       | green / blue / violet / red               | warm grey-gold / amber / copper / rust / deep rust |
| Identity use     | focus ring, active nav underline          | focus ring, active nav underline, switcher ring    |

Light-mode values are the `*-paper` tokens above; every pair is AA on its own surface (phase text on `surface-0`/`surface-1`, and `accent-contrast` on phase fills).

### Named Rules

**The Track Swap Rule.** A track changes hue, not structure. Same grid, same type, same radii, same density. If a layout only works for one track, the layout is wrong.

**The No AI Cliché Rule.** No purple-blue gradients, no neon glow, no "neural network" decoration. The AI track is warm metal on graphite: amber, copper, rust. Colour still marks real state only.

**The Estimated Rule.** Estimated durations are labelled, never hidden. An "Estimated" chip uses copper at 12% fill and a tooltip that says the duration is an estimate and where it comes from.

## Typography

**Display Font:** Bricolage Grotesque (with ui-sans-serif fallback)
**Body Font:** Instrument Sans (with ui-sans-serif fallback)
**Label/Mono Font:** JetBrains Mono (with ui-monospace fallback)

**Character:** A compact grotesque for names and page titles, a neutral humanist sans for reading, and a mono face for every number, date, eyebrow, and keyboard hint. Numbers are always monospace and tabular; no number is set in the display face.

### Hierarchy

- **Display** (600, 56px / 0.98, −0.045em): desktop page titles only; 40px on mobile.
- **Readout** (500, 72px / 0.9, −0.05em, mono): the overall progress figure, used once per screen.
- **Title** (600, 28px / 1.15, −0.025em): section titles and phase names.
- **Title Small** (600, 22px / 1.25, −0.02em): drawer topic title.
- **Body** (400, 15px / 1.55): interface copy and notes; 17px for lead paragraphs.
- **Caption** (400, 13px / 1.45): helper text.
- **Label** (500, 12px / 1.35, +0.06em, uppercase, mono): metadata, buttons, chips.
- **Micro** (500, 11px / 1.3, +0.14em, uppercase, mono): eyebrows, chart axes, keyboard hints.

### Named Rules

**The Mono Numbers Rule.** Every percentage, duration, date, week count, and keyboard hint uses JetBrains Mono with tabular numerals.

## Layout

A single 1440px-max column with page gutters of 16px at mobile, 24px at tablet, and 40px at desktop. The masthead is a sticky 64px ruled bar, not a floating card. Content follows a 12-column desktop grid, 8-column tablet, 4-column mobile; everything aligns to column start and no card floats centred.

Density is deliberately uneven: topic rows are compact (12–16px vertical padding), while section breaks open up to 32–64px. The roadmap list and map share one header and one measure. Mobile navigation becomes a fixed 64px bottom index and the topic panel becomes a bottom sheet at 92dvh.

The 4px baseline governs control heights (40px desktop, 44px mobile), icon sizes, and gaps. Permitted spacing steps: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128.

## Elevation & Depth

The system is flat by default. Depth is conveyed by tonal steps (`surface-0` → `surface-3`) and 1px hairlines, not shadows. One reserved elevation shadow exists for overlays: `0 24px 64px -32px rgb(0 0 0 / 0.65)` in dark, lighter in paper. Cards lift 2px on hover and their border brightens; no glow.

### Shadow Vocabulary

- **Panel** (`0 24px 64px -32px rgb(0 0 0 / 0.65)`): drawers, dialogs, command palette, popovers.
- **Lift** (`0 2px 0 0 rgb(0 0 0 / 0.2)`): the 2px hover settle on interactive rows and cards.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only for overlays and as a response to state.

## Shapes

Corners are measured, not rounded: 2px for checkboxes and micro controls, 4px for buttons and inputs, 6px for dialogs and the mobile sheet, 8px for grouped panels, 12px for cards. Pills appear only for status dots and week markers, never for navigation or badges. Borders are 1px only: strong borders mark interactive fields, regular hairlines mark structure.

The recurring silhouette is the ruled row: a full-width line with an index number, a title, a mono readout, and a progress mark. The second motif is the crosshair: a small plus or tick mark attached to real sequence, never decoration.

## Components

### Buttons

- **Shape:** 4px radius (2px for extra-small), mono uppercase label.
- **Primary:** ink fill with surface-0 text; 40px desktop / 44px mobile; 16px horizontal padding.
- **Hover / Focus:** background shifts to 88% ink; 2px focus ring in phase-1 with 2px offset; active nudges down 1px. No glow.
- **Secondary / Ghost / Outline:** hairline-strong outline on transparent, raised fill on hover; ghost uses ink-muted text and a raised hover fill. Destructive uses phase-4 at 10% fill and 35% border.

### Chips

- **Style:** 2px radius, 10–12px mono, hairline border, phase tint only for state.
- **State:** no pill shapes; selected state uses a phase tint plus ink text.

### Cards / Containers

- **Corner Style:** 12px radius for cards, 8px for grouped panels.
- **Background:** surface-1.
- **Shadow Strategy:** flat at rest; panel shadow only when elevated as an overlay.
- **Border:** 1px hairline ring.
- **Internal Padding:** 16px default, 12px compact.

### Inputs / Fields

- **Style:** surface-1 fill, 1px hairline-strong border, 4px radius, 40–44px height.
- **Focus:** 2px phase-1 ring at 60% with 2px offset; border shifts to ring colour.
- **Error / Disabled:** phase-4 border and 20% ring on invalid; 45% opacity and no pointer events when disabled. Native date input uses the same shell with an inverted picker icon in dark mode.

### Navigation

- **Style:** sticky 64px masthead with a bottom hairline. Desktop items are mono uppercase micro labels with a 2px bottom border; active gets ink text and a phase-1 underline. The wordmark is a ruled mark plus a two-line wordmark.
- **Mobile:** fixed 64px bottom index, three equal cells, 20px Lucide icon plus micro label; active icon takes phase-1.
- **Skip link:** appears top-left on focus with panel fill and hairline border.

### Track Switcher (signature)

A segmented control in the masthead, built from real `<Link>`s, never buttons.

- **Shape:** 4px radius track on `surface-1`, 1px hairline, 36px tall desktop / 44px mobile. Two segments, equal width.
- **Segment:** mono label plus a 16px progress ring. Inactive text is `ink-muted`; active text is `ink` and the ring uses that track's accent.
- **Indicator:** one sliding fill behind the active segment (Motion `layoutId`), 150ms ease-out, no overshoot. It moves; the segments do not fade.
- **State:** `aria-current="page"` on the active link, `aria-live="polite"` announces the switch. Alt+1 / Alt+2 work outside inputs.
- **Mobile:** the switcher sits above the bottom index in a 44px row; never inside the sheet.

### Topic Row (signature)

A full-width ruled row: index number in mono, topic title in display face, duration and percentage in mono, a ring or bar progress mark, and a disclosure control. Subtopics sit underneath as a 20px square checkbox with a hand-drawn SVG check and a 44px hit area. The current topic carries a 2.4s opacity pulse on a small dot.

### 36-Week Measure (signature)

A hairline ruler split into phase blocks, filled only by real completed weeks, with a crosshair at today's expected position. It appears large on the roadmap header and compact in the masthead context line. It is the one place where phase colour may span a wide area, and only as a 12% wash or a 1px rule.

## Do's and Don'ts

### Do:

- **Do** keep phase tints under 10% of any viewport and use them only for real state.
- **Do** set every number, date, and duration in mono with tabular numerals.
- **Do** use 1px hairlines and tonal steps before adding a border or a shadow.
- **Do** align controls to the 4px baseline and use 40px desktop / 44px mobile heights.
- **Do** preserve visible focus rings and 44px touch targets at 375px.
- **Do** let the roadmap content carry the composition; chrome stays quiet.

### Don't:

- **Don't** use gradients, glows, glassmorphism, blobs, or emoji icons.
- **Don't** use pill-shaped navigation, badges, or buttons.
- **Don't** set numbers in the display face or body copy in mono.
- **Don't** add looping motion beyond the current-topic pulse.
- **Don't** invent encouragement, social proof, or marketing headings.
- **Don't** replace the field-notebook world with a generic dashboard look.
