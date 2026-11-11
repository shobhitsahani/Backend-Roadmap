/**
 * Single source of truth for every colour in the product.
 *
 * Values are CSS colour strings (OKLCH by default) so the generated stylesheet
 * can be inspected and tuned by eye. Tests parse the same values for WCAG
 * contrast and OKLab phase separation. Nothing outside this folder may contain
 * a colour literal — see `scripts/check-theme-colors.mjs`.
 */

import { oklch, parseColor, type Oklch } from "./color";

export const themeNames = ["black", "purple", "light"] as const;
export type ThemeName = (typeof themeNames)[number];
export const DEFAULT_THEME: ThemeName = "black";

export const trackSlugs = ["backend", "ai-engineer"] as const;
export type TrackSlug = (typeof trackSlugs)[number];

export type PhaseRamp = readonly [string, string, string, string, string];

export type ThemeBaseTokens = {
  /** App canvas. */
  bg: string;
  /** Panels, cards, drawer, command palette. */
  surface1: string;
  /** Raised rows, secondary controls. */
  surface2: string;
  /** Fields, tooltips, selected rows. */
  surface3: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textFaint: string;
  /** Chrome accent: primary buttons, active nav, focus, selection. */
  brand: string;
  brandHover: string;
  onBrand: string;
  /** Secondary brand tint, used sparingly. */
  highlight: string;
  /** Usually `var(--brand)` or `var(--track-accent)`, per theme. */
  focusRing: string;
  selection: string;
  /** Selected command-palette row. Purple mixes its brand; neutrals stay grey. */
  chromeHighlight: string;
  /** Sliding track-switcher indicator. */
  chromeIndicator: string;
  /** Dot-grid colour. */
  grid: string;
  success: string;
  warning: string;
  danger: string;
  shadowPanel: string;
  shadowLift: string;
};

export type SceneTokens = {
  ground: string;
  block: string;
  edge: string;
  keyLight: string;
  rimLight: string;
  fog: string;
};

export type TrackTokens = {
  accent: string;
  phases: PhaseRamp;
  phaseContrast: string;
};

export type ThemeTokens = {
  name: ThemeName;
  label: string;
  colorScheme: "dark" | "light";
  description: string;
  base: ThemeBaseTokens;
  scene: SceneTokens;
  tracks: Record<TrackSlug, TrackTokens>;
};

const ON_DARK = oklch(0.12, 0.02, 295);
const ON_LIGHT = oklch(0.968, 0.005, 120);

export const themes: Record<ThemeName, ThemeTokens> = {
  black: {
    name: "black",
    label: "Black",
    colorScheme: "dark",
    description: "OLED black, neutral, restrained.",
    base: {
      bg: oklch(0, 0, 0),
      surface1: oklch(0.145, 0, 0),
      surface2: oklch(0.19, 0, 0),
      surface3: oklch(0.235, 0, 0),
      border: oklch(0.27, 0, 0),
      borderStrong: oklch(0.38, 0, 0),
      text: oklch(0.96, 0, 0),
      textMuted: oklch(0.72, 0, 0),
      textFaint: oklch(0.64, 0, 0),
      brand: oklch(0.96, 0, 0),
      brandHover: oklch(1, 0, 0),
      onBrand: oklch(0, 0, 0),
      highlight: oklch(0.8, 0, 0),
      focusRing: "var(--track-accent)",
      selection: "color-mix(in oklch, var(--focus-ring) 30%, transparent)",
      chromeHighlight: "color-mix(in oklch, var(--fg) 9%, transparent)",
      chromeIndicator: "color-mix(in oklch, var(--fg) 10%, transparent)",
      grid: "oklch(1 0 0 / 0.09)",
      success: oklch(0.78, 0.15, 150),
      warning: oklch(0.82, 0.14, 75),
      danger: oklch(0.72, 0.18, 25),
      shadowPanel: "0 24px 64px -32px oklch(0 0 0 / 0.65)",
      shadowLift: "0 2px 0 0 oklch(0 0 0 / 0.2)",
    },
    scene: {
      ground: oklch(0, 0, 0),
      block: oklch(0.19, 0, 0),
      edge: oklch(0.38, 0, 0),
      keyLight: oklch(1, 0, 0),
      rimLight: oklch(0.72, 0, 0),
      fog: oklch(0, 0, 0),
    },
    tracks: {
      backend: {
        accent: oklch(0.775, 0.13, 150),
        phases: [
          oklch(0.775, 0.13, 150),
          oklch(0.75, 0.115, 246),
          oklch(0.76, 0.12, 300),
          oklch(0.735, 0.15, 28),
          oklch(0.82, 0.13, 70),
        ],
        phaseContrast: ON_DARK,
      },
      "ai-engineer": {
        accent: oklch(0.78, 0.14, 62),
        phases: [
          oklch(0.85, 0.09, 95),
          oklch(0.71, 0.14, 70),
          oklch(0.82, 0.15, 45),
          oklch(0.65, 0.15, 20),
          oklch(0.76, 0.11, 350),
        ],
        phaseContrast: ON_DARK,
      },
    },
  },

  purple: {
    name: "purple",
    label: "Purple",
    colorScheme: "dark",
    description: "Violet-black with flat purple chrome.",
    base: {
      bg: oklch(0.12, 0.03, 295),
      surface1: oklch(0.165, 0.04, 295),
      surface2: oklch(0.205, 0.045, 295),
      surface3: oklch(0.25, 0.05, 295),
      border: oklch(0.31, 0.05, 295),
      borderStrong: oklch(0.42, 0.07, 295),
      text: oklch(0.96, 0.012, 295),
      textMuted: oklch(0.76, 0.035, 295),
      textFaint: oklch(0.67, 0.045, 295),
      brand: oklch(0.72, 0.17, 295),
      brandHover: oklch(0.78, 0.16, 295),
      onBrand: oklch(0.14, 0.03, 295),
      highlight: oklch(0.8, 0.13, 330),
      focusRing: "var(--brand)",
      selection: "color-mix(in oklch, var(--brand) 34%, transparent)",
      chromeHighlight: "color-mix(in oklch, var(--brand) 20%, transparent)",
      chromeIndicator: "color-mix(in oklch, var(--brand) 24%, transparent)",
      grid: "oklch(0.72 0.17 295 / 0.1)",
      success: oklch(0.8, 0.15, 150),
      warning: oklch(0.84, 0.14, 75),
      danger: oklch(0.74, 0.18, 25),
      shadowPanel: "0 24px 64px -32px oklch(0.04 0.02 295 / 0.7)",
      shadowLift: "0 2px 0 0 oklch(0.04 0.02 295 / 0.25)",
    },
    scene: {
      ground: oklch(0.12, 0.03, 295),
      block: oklch(0.25, 0.05, 295),
      edge: oklch(0.72, 0.17, 295),
      keyLight: oklch(0.96, 0.012, 295),
      rimLight: oklch(0.78, 0.16, 295),
      fog: oklch(0.12, 0.03, 295),
    },
    tracks: {
      backend: {
        accent: oklch(0.785, 0.15, 150),
        phases: [
          oklch(0.78, 0.14, 150),
          oklch(0.76, 0.12, 246),
          oklch(0.77, 0.14, 302),
          oklch(0.75, 0.16, 28),
          oklch(0.84, 0.13, 70),
        ],
        phaseContrast: ON_DARK,
      },
      "ai-engineer": {
        accent: oklch(0.8, 0.14, 62),
        phases: [
          oklch(0.86, 0.09, 95),
          oklch(0.73, 0.14, 70),
          oklch(0.83, 0.15, 45),
          oklch(0.67, 0.15, 20),
          oklch(0.78, 0.11, 350),
        ],
        phaseContrast: ON_DARK,
      },
    },
  },

  light: {
    name: "light",
    label: "Light",
    colorScheme: "light",
    description: "Drafting paper, same field manual.",
    base: {
      bg: oklch(0.968, 0.005, 120),
      surface1: oklch(0.992, 0.002, 120),
      surface2: oklch(0.946, 0.006, 120),
      surface3: oklch(0.92, 0.008, 120),
      border: "oklch(0.22 0.012 140 / 0.16)",
      borderStrong: "oklch(0.22 0.012 140 / 0.3)",
      text: oklch(0.22, 0.012, 140),
      textMuted: oklch(0.42, 0.012, 140),
      textFaint: oklch(0.44, 0.012, 140),
      brand: oklch(0.22, 0.012, 140),
      brandHover: oklch(0.3, 0.012, 140),
      onBrand: oklch(0.968, 0.005, 120),
      highlight: oklch(0.48, 0.155, 29),
      focusRing: "var(--track-accent)",
      selection: "color-mix(in oklch, var(--focus-ring) 26%, transparent)",
      chromeHighlight: "color-mix(in oklch, var(--fg) 8%, transparent)",
      chromeIndicator: "color-mix(in oklch, var(--fg) 8%, transparent)",
      grid: "oklch(0.22 0.012 140 / 0.16)",
      success: oklch(0.445, 0.105, 150),
      warning: oklch(0.45, 0.13, 70),
      danger: oklch(0.46, 0.16, 29),
      shadowPanel: "0 24px 64px -32px oklch(0.22 0.012 140 / 0.18)",
      shadowLift: "0 2px 0 0 oklch(0.22 0.012 140 / 0.12)",
    },
    scene: {
      ground: oklch(0.94, 0.006, 120),
      block: oklch(0.84, 0.008, 140),
      edge: oklch(0.465, 0.105, 150),
      keyLight: oklch(1, 0, 0),
      rimLight: oklch(0.52, 0.12, 62),
      fog: oklch(0.968, 0.005, 120),
    },
    tracks: {
      backend: {
        accent: oklch(0.445, 0.105, 150),
        phases: [
          oklch(0.445, 0.105, 150),
          oklch(0.45, 0.125, 250),
          oklch(0.455, 0.15, 300),
          oklch(0.46, 0.155, 29),
          oklch(0.46, 0.13, 70),
        ],
        phaseContrast: ON_LIGHT,
      },
      "ai-engineer": {
        accent: oklch(0.49, 0.12, 62),
        phases: [
          oklch(0.5, 0.08, 95),
          oklch(0.38, 0.11, 70),
          oklch(0.47, 0.12, 45),
          oklch(0.34, 0.12, 20),
          oklch(0.42, 0.1, 350),
        ],
        phaseContrast: ON_LIGHT,
      },
    },
  },
};

export const themeMeta: Record<
  ThemeName,
  { label: string; description: string; colorScheme: "dark" | "light" }
> = {
  black: {
    label: themes.black.label,
    description: themes.black.description,
    colorScheme: themes.black.colorScheme,
  },
  purple: {
    label: themes.purple.label,
    description: themes.purple.description,
    colorScheme: themes.purple.colorScheme,
  },
  light: {
    label: themes.light.label,
    description: themes.light.description,
    colorScheme: themes.light.colorScheme,
  },
};

const parseColorCache = new Map<string, Oklch>();

/** Parsed token helper for tests and generator-time contrast checks. */
export function parseToken(value: string): Oklch {
  const cached = parseColorCache.get(value);
  if (cached) return cached;
  const parsed = parseColor(value);
  if (!parsed) throw new Error(`Unsupported colour token: ${value}`);
  parseColorCache.set(value, parsed);
  return parsed;
}
