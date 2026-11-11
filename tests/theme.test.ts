import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  contrastRatio,
  deltaEOk,
  hueDistance,
  parseColor,
  type Oklch,
} from "@/lib/theme/color";
import {
  migrateStoredTheme,
  resolveTheme,
  themeColors,
  themeSettings,
} from "@/lib/theme/config";
import { renderIconSvg, renderThemesCss } from "@/lib/theme/generate";
import {
  parseToken,
  themes,
  themeNames,
  trackSlugs,
  type ThemeName,
  type TrackSlug,
} from "@/lib/theme/tokens";

const TEXT_MIN = 4.5;
const COMPONENT_MIN = 3;
const PHASE_DISTANCE_MIN = 0.08;
const HUE_SHIFT_MAX = 15;

const surfaces = ["bg", "surface1", "surface2", "surface3"] as const;
const textTones = ["text", "textMuted", "textFaint"] as const;

function token(theme: ThemeName, key: string): Oklch {
  return parseToken(themes[theme].base[key as keyof typeof themes.black.base]);
}

function focusRing(theme: ThemeName, track: TrackSlug): Oklch {
  const value = themes[theme].base.focusRing;
  if (value.includes("--track-accent")) {
    return parseToken(themes[theme].tracks[track].accent);
  }
  if (value.includes("--brand")) return token(theme, "brand");
  return parseToken(value);
}

describe("theme tokens", () => {
  it("defines exactly black, purple and light", () => {
    expect(themeNames).toEqual(["black", "purple", "light"]);
    expect(themeSettings).toEqual(["black", "purple", "light", "system"]);
  });

  it("keeps every text tone above 4.5:1 on every surface", () => {
    for (const theme of themeNames) {
      for (const tone of textTones) {
        for (const surface of surfaces) {
          const ratio = contrastRatio(token(theme, tone), token(theme, surface));
          expect(
            ratio,
            `${theme}.${tone} on ${surface} (${ratio.toFixed(2)}:1)`,
          ).toBeGreaterThanOrEqual(TEXT_MIN);
        }
      }
    }
  });

  it("keeps brand text and on-brand button labels readable", () => {
    for (const theme of themeNames) {
      for (const surface of surfaces) {
        const ratio = contrastRatio(token(theme, "brand"), token(theme, surface));
        expect(
          ratio,
          `${theme}.brand on ${surface} (${ratio.toFixed(2)}:1)`,
        ).toBeGreaterThanOrEqual(TEXT_MIN);
      }
      const label = contrastRatio(token(theme, "onBrand"), token(theme, "brand"));
      expect(label, `${theme} on-brand (${label.toFixed(2)}:1)`).toBeGreaterThanOrEqual(
        TEXT_MIN,
      );
    }
  });

  it("keeps state colours readable on every surface", () => {
    for (const theme of themeNames) {
      for (const tone of ["success", "warning", "danger"] as const) {
        for (const surface of surfaces) {
          const ratio = contrastRatio(token(theme, tone), token(theme, surface));
          expect(
            ratio,
            `${theme}.${tone} on ${surface} (${ratio.toFixed(2)}:1)`,
          ).toBeGreaterThanOrEqual(TEXT_MIN);
        }
      }
    }
  });

  it("keeps track accents readable and at least 3:1 as components", () => {
    for (const theme of themeNames) {
      for (const track of trackSlugs) {
        const accent = parseToken(themes[theme].tracks[track].accent);
        for (const surface of surfaces) {
          const ratio = contrastRatio(accent, token(theme, surface));
          expect(
            ratio,
            `${theme}.${track} on ${surface} (${ratio.toFixed(2)}:1)`,
          ).toBeGreaterThanOrEqual(TEXT_MIN);
          expect(ratio).toBeGreaterThanOrEqual(COMPONENT_MIN);
        }

        const ring = focusRing(theme, track);
        for (const surface of surfaces) {
          const ratio = contrastRatio(ring, token(theme, surface));
          expect(
            ratio,
            `${theme}.${track} focus ring on ${surface} (${ratio.toFixed(2)}:1)`,
          ).toBeGreaterThanOrEqual(COMPONENT_MIN);
        }
      }
    }
  });

  it("keeps every phase readable and pair-separated by OKLab distance", () => {
    for (const theme of themeNames) {
      for (const track of trackSlugs) {
        const tokens = themes[theme].tracks[track];
        const phases = tokens.phases.map(parseToken);

        for (const [index, phase] of phases.entries()) {
          for (const surface of surfaces) {
            const ratio = contrastRatio(phase, token(theme, surface));
            expect(
              ratio,
              `${theme}.${track}.phase-${index + 1} on ${surface} (${ratio.toFixed(2)}:1)`,
            ).toBeGreaterThanOrEqual(TEXT_MIN);
          }

          const label = contrastRatio(parseToken(tokens.phaseContrast), phase);
          expect(
            label,
            `${theme}.${track}.phase-${index + 1} contrast label (${label.toFixed(2)}:1)`,
          ).toBeGreaterThanOrEqual(TEXT_MIN);
        }

        for (let i = 0; i < phases.length; i++) {
          for (let j = i + 1; j < phases.length; j++) {
            const distance = deltaEOk(phases[i]!, phases[j]!);
            expect(
              distance,
              `${theme}.${track} phase ${i + 1}/${j + 1} distance ${distance.toFixed(3)}`,
            ).toBeGreaterThanOrEqual(PHASE_DISTANCE_MIN);
          }
        }
      }
    }
  });

  it("keeps track identity hues within 15 degrees across themes", () => {
    for (const track of trackSlugs) {
      const reference = themes.black.tracks[track];
      const referenceHues = [
        parseToken(reference.accent).h,
        ...reference.phases.map((phase) => parseToken(phase).h),
      ];

      for (const theme of themeNames) {
        const tokens = themes[theme].tracks[track];
        const hues = [
          parseToken(tokens.accent).h,
          ...tokens.phases.map((phase) => parseToken(phase).h),
        ];
        hues.forEach((hue, index) => {
          const shift = hueDistance(hue, referenceHues[index]!);
          expect(
            shift,
            `${theme}.${track} hue ${index} shift ${shift.toFixed(1)}deg`,
          ).toBeLessThanOrEqual(HUE_SHIFT_MAX);
        });
      }
    }
  });

  it("parses every scene and status token", () => {
    for (const theme of themeNames) {
      for (const value of Object.values(themes[theme].scene)) {
        expect(parseColor(value), `${theme} scene ${value}`).not.toBeNull();
      }
      for (const value of Object.values(themeColors)) {
        expect(parseColor(value)).not.toBeNull();
      }
    }
  });
});

describe("theme preference", () => {
  it("migrates dark to black and keeps the rest", () => {
    expect(migrateStoredTheme("dark")).toBe("black");
    expect(migrateStoredTheme("black")).toBe("black");
    expect(migrateStoredTheme("purple")).toBe("purple");
    expect(migrateStoredTheme("light")).toBe("light");
    expect(migrateStoredTheme("system")).toBe("system");
    expect(migrateStoredTheme("sepia")).toBeNull();
    expect(migrateStoredTheme(null)).toBeNull();
  });

  it("resolves system to black in the dark and light in the light", () => {
    expect(resolveTheme("system", true)).toBe("black");
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("purple", false)).toBe("purple");
  });
});

describe("generated theme files", () => {
  const read = (path: string) =>
    readFileSync(join(process.cwd(), path), "utf8").replace(/\r\n/g, "\n");

  it("matches app/themes.css", () => {
    expect(read("app/themes.css")).toBe(renderThemesCss());
  });

  it("matches app/icon.svg", () => {
    expect(read("app/icon.svg")).toBe(renderIconSvg());
  });
});

describe("colour guardrail", () => {
  it("has no hardcoded colours outside lib/theme", () => {
    expect(() =>
      execFileSync(process.execPath, ["scripts/check-theme-colors.mjs"], {
        cwd: process.cwd(),
        stdio: "pipe",
      }),
    ).not.toThrow();
  });
});
