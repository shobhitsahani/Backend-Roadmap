import { oklchToHex, parseColor } from "./color";
import {
  themes,
  themeNames,
  trackSlugs,
  type ThemeName,
  type ThemeTokens,
  type TrackSlug,
} from "./tokens";

const HEADER = `/*
 * AUTO-GENERATED FILE. Do not edit by hand.
 * Source: lib/theme/tokens.ts
 * Regenerate: npm run tokens
 */

`;

function baseBlock(selector: string, theme: ThemeTokens): string {
  const { base, scene, tracks } = theme;
  const lines: string[] = [
    `${selector} {`,
    `  color-scheme: ${theme.colorScheme};`,
    "",
    `  --bg: ${base.bg};`,
    `  --surface-1: ${base.surface1};`,
    `  --surface-2: ${base.surface2};`,
    `  --surface-3: ${base.surface3};`,
    `  --border: ${base.border};`,
    `  --border-strong: ${base.borderStrong};`,
    `  --fg: ${base.text};`,
    `  --fg-muted: ${base.textMuted};`,
    `  --fg-faint: ${base.textFaint};`,
    `  --brand: ${base.brand};`,
    `  --brand-hover: ${base.brandHover};`,
    `  --on-brand: ${base.onBrand};`,
    `  --highlight: ${base.highlight};`,
    `  --focus-ring: ${base.focusRing};`,
    `  --selection: ${base.selection};`,
    `  --chrome-highlight: ${base.chromeHighlight};`,
    `  --chrome-indicator: ${base.chromeIndicator};`,
    `  --grid: ${base.grid};`,
    `  --success: ${base.success};`,
    `  --warning: ${base.warning};`,
    `  --danger: ${base.danger};`,
    "",
    `  --scene-ground: ${scene.ground};`,
    `  --scene-block: ${scene.block};`,
    `  --scene-edge: ${scene.edge};`,
    `  --scene-key-light: ${scene.keyLight};`,
    `  --scene-rim-light: ${scene.rimLight};`,
    `  --scene-fog: ${scene.fog};`,
    "",
    `  --track-backend: ${tracks.backend.accent};`,
    `  --track-ai-engineer: ${tracks["ai-engineer"].accent};`,
    `  --track-accent: ${tracks.backend.accent};`,
    `  --phase-1: ${tracks.backend.phases[0]};`,
    `  --phase-2: ${tracks.backend.phases[1]};`,
    `  --phase-3: ${tracks.backend.phases[2]};`,
    `  --phase-4: ${tracks.backend.phases[3]};`,
    `  --phase-5: ${tracks.backend.phases[4]};`,
    `  --phase-contrast: ${tracks.backend.phaseContrast};`,
    "",
    `  --shadow-panel: ${base.shadowPanel};`,
    `  --shadow-lift: ${base.shadowLift};`,
    `  --panel-shadow: ${base.shadowPanel};`,
    `  --lift-shadow: ${base.shadowLift};`,
    "",
    "  /* Legacy names used by existing components. */",
    "  --surface-0: var(--bg);",
    "  --ink: var(--fg);",
    "  --ink-muted: var(--fg-muted);",
    "  --ink-subtle: var(--fg-faint);",
    "  --hairline: var(--border);",
    "  --hairline-strong: var(--border-strong);",
    "  --dot: var(--grid);",
    "",
    "  /* shadcn/ui variables. */",
    "  --background: var(--bg);",
    "  --foreground: var(--fg);",
    "  --card: var(--surface-1);",
    "  --card-foreground: var(--fg);",
    "  --popover: var(--surface-1);",
    "  --popover-foreground: var(--fg);",
    "  --primary: var(--brand);",
    "  --primary-foreground: var(--on-brand);",
    "  --secondary: var(--surface-2);",
    "  --secondary-foreground: var(--fg);",
    "  --muted: var(--surface-2);",
    "  --muted-foreground: var(--fg-muted);",
    "  --accent: var(--surface-2);",
    "  --accent-foreground: var(--fg);",
    "  --destructive: var(--danger);",
    "  --input: var(--border-strong);",
    "  --ring: var(--focus-ring);",
    "  --chart-1: var(--phase-1);",
    "  --chart-2: var(--phase-2);",
    "  --chart-3: var(--phase-3);",
    "  --chart-4: var(--phase-4);",
    "  --chart-5: var(--fg-muted);",
    "  --sidebar: var(--bg);",
    "  --sidebar-foreground: var(--fg);",
    "  --sidebar-primary: var(--brand);",
    "  --sidebar-primary-foreground: var(--on-brand);",
    "  --sidebar-accent: var(--surface-2);",
    "  --sidebar-accent-foreground: var(--fg);",
    "  --sidebar-border: var(--border);",
    "  --sidebar-ring: var(--focus-ring);",
    "}",
  ];
  return lines.join("\n");
}

function trackBlock(theme: ThemeName, track: TrackSlug): string {
  const tokens = themes[theme].tracks[track];
  const themeSelector =
    theme === "black" ? `[data-theme="black"]` : `[data-theme="${theme}"]`;
  const selector =
    theme === "black"
      ? `${themeSelector}[data-track="${track}"], :root:not([data-theme])[data-track="${track}"]`
      : `${themeSelector}[data-track="${track}"]`;
  return [
    `${selector} {`,
    `  --track-accent: ${tokens.accent};`,
    `  --phase-1: ${tokens.phases[0]};`,
    `  --phase-2: ${tokens.phases[1]};`,
    `  --phase-3: ${tokens.phases[2]};`,
    `  --phase-4: ${tokens.phases[3]};`,
    `  --phase-5: ${tokens.phases[4]};`,
    `  --phase-contrast: ${tokens.phaseContrast};`,
    "}",
  ].join("\n");
}

export function renderThemesCss(): string {
  const blocks: string[] = [HEADER.trimEnd()];
  for (const themeName of themeNames) {
    const theme = themes[themeName];
    const selector =
      themeName === "black"
        ? `:root:not([data-theme]),\n[data-theme="black"]`
        : `[data-theme="${themeName}"]`;
    blocks.push(baseBlock(selector, theme));
    if (themeName === "black") {
      blocks.push(
        `/* No-JS and pre-hydration fallback is Black, the first-visit default. */`,
      );
    }
    for (const track of trackSlugs) {
      blocks.push(trackBlock(themeName, track));
    }
  }
  return `${blocks.join("\n\n")}\n`;
}

export function renderIconSvg(): string {
  const palette = themes.purple.base;
  const bg = hex(palette.bg);
  const brand = hex(palette.brand);
  const text = hex(palette.text);
  const muted = hex(palette.textFaint);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="5" fill="${bg}"/>
  <path d="M7 8.5h18M7 16h12M7 23.5h7" stroke="${text}" stroke-width="1.75" stroke-linecap="square"/>
  <path d="M23.5 16v7.5" stroke="${brand}" stroke-width="1.75" stroke-linecap="square"/>
  <circle cx="23.5" cy="13.5" r="1.5" fill="${muted}"/>
</svg>
`;
}

function hex(value: string): string {
  const parsed = parseColor(value);
  if (!parsed) throw new Error(`Unsupported token: ${value}`);
  return oklchToHex(parsed);
}

export const generatedFiles = [
  { path: "app/themes.css", render: renderThemesCss },
  { path: "app/icon.svg", render: renderIconSvg },
] as const;
