import * as THREE from "three";

import { oklchToRgb, parseColor } from "@/lib/theme/color";
import {
  themes,
  type SceneTokens,
  type ThemeName,
  type TrackSlug,
} from "@/lib/theme/tokens";

function toColor(value: string): THREE.Color | null {
  const parsed = parseColor(value);
  if (!parsed) return null;
  const { r, g, b } = oklchToRgb(parsed);
  return new THREE.Color(r, g, b);
}

/**
 * Reads a themed CSS custom property (OKLCH, hex or rgb) and converts it to a
 * THREE.Color. Falls back to the token value when the variable is unavailable
 * (server render, tests, or a missing stylesheet).
 */
export function cssVarColor(name: string, fallback: string): THREE.Color {
  if (typeof window !== "undefined") {
    const raw = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
    const fromCss = raw ? toColor(raw) : null;
    if (fromCss) return fromCss;
  }
  return toColor(fallback) ?? new THREE.Color(0, 0, 0);
}

function kebab(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/** Scene tokens for the active theme, read live from `--scene-*`. */
export function sceneColor(name: keyof SceneTokens, theme: ThemeName): THREE.Color {
  return cssVarColor(`--scene-${kebab(name)}`, themes[theme].scene[name]);
}

/** Track identity accent, read live from `--track-*`. */
export function trackColor(track: TrackSlug, theme: ThemeName): THREE.Color {
  return cssVarColor(`--track-${track}`, themes[theme].tracks[track].accent);
}

/** Base text token for 3D labels. */
export function textColor(
  tone: "text" | "textMuted" | "textFaint",
  theme: ThemeName,
): THREE.Color {
  const variable =
    tone === "text" ? "--ink" : tone === "textMuted" ? "--ink-muted" : "--ink-subtle";
  return cssVarColor(variable, themes[theme].base[tone]);
}
