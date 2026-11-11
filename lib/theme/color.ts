/**
 * Colour maths shared by the token generator, tests and runtime helpers.
 * No Node APIs: safe to import from client components and route handlers.
 */

export type Oklch = {
  l: number;
  c: number;
  h: number;
  alpha: number;
};

export type Rgb = {
  r: number;
  g: number;
  b: number;
  a: number;
};

const OKLCH_RE =
  /^oklch\(\s*([+-]?(?:\d+\.?\d*|\.\d+))(%?)\s+([+-]?(?:\d+\.?\d*|\.\d+))\s+([+-]?(?:\d+\.?\d*|\.\d+))(?:\s*\/\s*([+-]?(?:\d+\.?\d*|\.\d+))(%?))?\s*\)$/i;

const HEX_RE = /^#([0-9a-f]{3,8})$/i;
const RGB_RE =
  /^rgba?\(\s*([+-]?(?:\d+\.?\d*|\.\d+))(?:\s*,\s*|\s+)([+-]?(?:\d+\.?\d*|\.\d+))(?:\s*,\s*|\s+)([+-]?(?:\d+\.?\d*|\.\d+))(?:\s*(?:,|\/)\s*([+-]?(?:\d+\.?\d*|\.\d+)))?\s*\)$/i;

/** Parse the colour formats used by the token source and runtime CSS. */
export function parseColor(value: string): Oklch | null {
  const raw = value.trim();

  const oklch = raw.match(OKLCH_RE);
  if (oklch) {
    const l = Number(oklch[1]) / (oklch[2] === "%" ? 100 : 1);
    const alphaValue = oklch[5] === undefined ? 1 : Number(oklch[5]);
    const alpha = alphaValue / (oklch[6] === "%" ? 100 : 1);
    return {
      l,
      c: Number(oklch[3]),
      h: Number(oklch[4]),
      alpha: clamp01(alpha),
    };
  }

  const hex = raw.match(HEX_RE);
  if (hex) {
    const rgb = rgbFromHex(hex[1]!);
    return rgb ? srgbToOklch(rgb) : null;
  }

  const rgb = raw.match(RGB_RE);
  if (rgb) {
    const [r, g, b] = [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
    const alpha = rgb[4] === undefined ? 1 : Number(rgb[4]);
    return srgbToOklch({ r, g, b, a: clamp01(alpha) });
  }

  return null;
}

export function oklch(l: number, c: number, h: number, alpha?: number): string {
  const base = `oklch(${trim(l)} ${trim(c)} ${trim(h)}`;
  return alpha === undefined ? `${base})` : `${base} / ${trim(alpha)})`;
}

function trim(value: number): string {
  return Number(value.toFixed(4)).toString();
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function rgbFromHex(hex: string): Rgb | null {
  if (![3, 4, 6, 8].includes(hex.length)) return null;
  const expanded =
    hex.length <= 4
      ? hex
          .split("")
          .map((char) => char + char)
          .join("")
      : hex;
  const r = parseInt(expanded.slice(0, 2), 16) / 255;
  const g = parseInt(expanded.slice(2, 4), 16) / 255;
  const b = parseInt(expanded.slice(4, 6), 16) / 255;
  const a = expanded.length === 8 ? parseInt(expanded.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

/** Linear-light sRGB values for a colour (unclamped for delta maths). */
export function oklchToLinearSrgb(color: Oklch): [number, number, number] {
  const h = (color.h * Math.PI) / 180;
  const a = color.c * Math.cos(h);
  const b = color.c * Math.sin(h);
  const lPrime = color.l + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = color.l - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = color.l - 0.0894841775 * a - 1.291485548 * b;
  const l = lPrime ** 3;
  const m = mPrime ** 3;
  const s = sPrime ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

function linearToSrgb(value: number): number {
  const clamped = Math.min(1, Math.max(0, value));
  return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055;
}

function srgbToLinear(value: number): number {
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function srgbToOklch({ r, g, b, a }: Rgb): Oklch {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const lPrime = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const aPrime = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bPrime = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const chroma = Math.hypot(aPrime, bPrime);
  const hue = (Math.atan2(bPrime, aPrime) * 180) / Math.PI;
  return {
    l: lPrime,
    c: chroma,
    h: hue < 0 ? hue + 360 : hue,
    alpha: a,
  };
}

export function oklchToRgb(color: Oklch): Rgb {
  const [r, g, b] = oklchToLinearSrgb(color);
  return {
    r: linearToSrgb(r),
    g: linearToSrgb(g),
    b: linearToSrgb(b),
    a: color.alpha,
  };
}

export function oklchToHex(color: Oklch): string {
  const { r, g, b } = oklchToRgb(color);
  const toHex = (value: number) =>
    Math.round(value * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexFromCss(value: string, fallback = "#000000"): string {
  const parsed = parseColor(value);
  return parsed ? oklchToHex(parsed) : fallback;
}

/** WCAG 2.x relative luminance from linear-light sRGB. */
export function relativeLuminance(color: Oklch): number {
  const [r, g, b] = oklchToLinearSrgb(color).map((value) =>
    Math.min(1, Math.max(0, value)),
  ) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: Oklch, background: Oklch): number {
  const fg = compositeOver(foreground, background);
  const light = Math.max(relativeLuminance(fg), relativeLuminance(background));
  const dark = Math.min(relativeLuminance(fg), relativeLuminance(background));
  return (light + 0.05) / (dark + 0.05);
}

function compositeOver(fg: Oklch, bg: Oklch): Oklch {
  if (fg.alpha >= 1) return fg;
  const fgRgb = oklchToRgb(fg);
  const bgRgb = oklchToRgb(bg);
  const mix = (a: number, b: number) => a * fg.alpha + b * (1 - fg.alpha);
  return srgbToOklch({
    r: mix(fgRgb.r, bgRgb.r),
    g: mix(fgRgb.g, bgRgb.g),
    b: mix(fgRgb.b, bgRgb.b),
    a: 1,
  });
}

function oklab(color: Oklch): [number, number, number] {
  const h = (color.h * Math.PI) / 180;
  return [color.l, color.c * Math.cos(h), color.c * Math.sin(h)];
}

/** Euclidean OKLab distance; 0.08 is the phase separation floor. */
export function deltaEOk(a: Oklch, b: Oklch): number {
  const [l1, a1, b1] = oklab(a);
  const [l2, a2, b2] = oklab(b);
  return Math.hypot(l1 - l2, a1 - a2, b1 - b2);
}

export function hueDistance(a: number, b: number): number {
  const diff = Math.abs(((a - b + 540) % 360) - 180);
  return diff;
}

/** Alpha-composite a colour over a background into a solid OKLCH value. */
export function flatten(color: Oklch, background: Oklch): Oklch {
  return compositeOver(color, background);
}
