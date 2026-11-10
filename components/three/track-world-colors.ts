import * as THREE from "three";

export function cssVarToRgbString(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const raw = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return oklchOrRgbToColor(raw, fallback);
}

function oklchOrRgbToColor(value: string, fallback: string): string {
  if (value.startsWith("oklch(")) {
    const match = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([-\d.]+)/i);
    if (!match) return fallback;
    const rgb = oklchToSrgb(Number(match[1]), Number(match[2]), Number(match[3]));
    return rgb ? rgbString(rgb) : fallback;
  }
  if (value.startsWith("#") || value.startsWith("rgb(")) return value;
  return fallback;
}

function oklchToSrgb(
  L: number,
  C: number,
  hDegrees: number,
): [number, number, number] | null {
  if (![L, C, hDegrees].every(Number.isFinite)) return null;
  const h = (hDegrees * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const lPrime = L + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = L - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = L - 0.0894841775 * a - 1.291485548 * b;
  const l = lPrime ** 3;
  const m = mPrime ** 3;
  const s = sPrime ** 3;
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  return [clamp(r), clamp(g), clamp(bl)];
}

function rgbString([r, g, b]: [number, number, number]) {
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}

export function threeColorFromCssVar(name: string, fallback: string) {
  return new THREE.Color(cssVarToRgbString(name, fallback));
}
