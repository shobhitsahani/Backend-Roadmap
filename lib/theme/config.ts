import { oklchToHex, parseColor } from "./color";
import {
  DEFAULT_THEME,
  themes,
  themeNames,
  type ThemeName,
  type TrackSlug,
} from "./tokens";

export const THEME_STORAGE_KEY = "backend-roadmap-theme";

export const themeSettings = [...themeNames, "system"] as const;
export type ThemeSetting = (typeof themeSettings)[number];

export function isThemeName(value: unknown): value is ThemeName {
  return typeof value === "string" && (themeNames as readonly string[]).includes(value);
}

export function isThemeSetting(value: unknown): value is ThemeSetting {
  return value === "system" || isThemeName(value);
}

/** Legacy `dark` becomes Black; unknown values are ignored. */
export function migrateStoredTheme(value: string | null): ThemeSetting | null {
  if (!value) return null;
  if (value === "dark") return "black";
  return isThemeSetting(value) ? value : null;
}

export function resolveTheme(setting: ThemeSetting, prefersDark: boolean): ThemeName {
  if (setting === "system") return prefersDark ? "black" : "light";
  return setting;
}

export function isDarkTheme(theme: ThemeName): boolean {
  return themes[theme].colorScheme === "dark";
}

function toHex(value: string): string {
  const parsed = parseColor(value);
  if (!parsed) throw new Error(`Unsupported token: ${value}`);
  return oklchToHex(parsed);
}

export type ThemeHexPalette = {
  bg: string;
  surface1: string;
  surface2: string;
  surface3: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  brand: string;
  onBrand: string;
  highlight: string;
  trackAccent: Record<TrackSlug, string>;
  phases: Record<TrackSlug, readonly [string, string, string, string, string]>;
};

/** sRGB hex palette for `next/og`, which cannot render OKLCH. */
export function hexPalette(theme: ThemeName): ThemeHexPalette {
  const tokens = themes[theme];
  return {
    bg: toHex(tokens.base.bg),
    surface1: toHex(tokens.base.surface1),
    surface2: toHex(tokens.base.surface2),
    surface3: toHex(tokens.base.surface3),
    border: toHex(tokens.base.border),
    borderStrong: toHex(tokens.base.borderStrong),
    text: toHex(tokens.base.text),
    textMuted: toHex(tokens.base.textMuted),
    brand: toHex(tokens.base.brand),
    onBrand: toHex(tokens.base.onBrand),
    highlight: toHex(tokens.base.highlight),
    trackAccent: {
      backend: toHex(tokens.tracks.backend.accent),
      "ai-engineer": toHex(tokens.tracks["ai-engineer"].accent),
    },
    phases: {
      backend: tokens.tracks.backend.phases.map(toHex) as [
        string,
        string,
        string,
        string,
        string,
      ],
      "ai-engineer": tokens.tracks["ai-engineer"].phases.map(toHex) as [
        string,
        string,
        string,
        string,
        string,
      ],
    },
  };
}

export const themeColors: Record<ThemeName, string> = {
  black: toHex(themes.black.base.bg),
  purple: toHex(themes.purple.base.bg),
  light: toHex(themes.light.base.bg),
};

export const themeOptionLabels: Record<ThemeSetting, string> = {
  black: "Black",
  purple: "Purple",
  light: "Light",
  system: "System",
};

export const defaultTheme = DEFAULT_THEME;
