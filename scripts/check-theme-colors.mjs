#!/usr/bin/env node
/**
 * Fails when a colour literal or a default Tailwind palette class appears
 * outside lib/theme (generated files are checked by tokens:check instead).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const scanRoots = ["app", "components", "lib", "scripts", "store", "tests", "types"];
const ignoredDirectories = new Set([
  "node_modules",
  ".next",
  ".git",
  "playwright-report",
  "test-results",
  "screenshots",
  "coverage",
]);
const ignoredFiles = new Set([
  "lib/theme/color.ts",
  "lib/theme/tokens.ts",
  "lib/theme/generate.ts",
  "app/themes.css",
  "app/icon.svg",
  "scripts/check-theme-colors.mjs",
]);
const ignoredPrefixes = ["lib/theme/", "tests/e2e/"];

const colorPatterns = [
  { name: "hex colour", pattern: /#[0-9a-f]{3,8}\b/i },
  { name: "rgb()/rgba()", pattern: /\brgba?\(/i },
  { name: "hsl()/hsla()", pattern: /\bhsla?\(/i },
  { name: "oklch()", pattern: /\boklch\(/i },
  {
    name: "default palette class",
    pattern:
      /\b(?:bg|text|border|from|to|via|fill|stroke|ring|outline|shadow|decoration|accent|caret|divide|placeholder)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-\d{2,3}\b/,
  },
  { name: "inline hex style", pattern: /color\s*:\s*["']#[0-9a-f]{3,8}["']/i },
];

function walk(directory) {
  const entries = readdirSync(directory);
  for (const entry of entries) {
    const absolute = join(directory, entry);
    const relativePath = relative(root, absolute).split(sep).join("/");
    if (ignoredFiles.has(relativePath)) continue;
    if (ignoredPrefixes.some((prefix) => relativePath.startsWith(prefix))) continue;
    const stats = statSync(absolute);
    if (stats.isDirectory()) {
      if (ignoredDirectories.has(entry)) continue;
      walk(absolute);
      continue;
    }
    if (!/\.(?:ts|tsx|css|mjs|js|svg)$/.test(entry)) continue;

    const lines = readFileSync(absolute, "utf8").split(/\r?\n/);
    lines.forEach((line, index) => {
      // Token-based arbitrary values are allowed: bg-[color-mix(...var(--phase-1))].
      const stripped = line
        .replace(/color-mix\(in oklch,[^)]*\)/gi, "")
        .replace(/var\(--[^)]*\)/g, "");
      for (const { name, pattern } of colorPatterns) {
        if (pattern.test(stripped)) {
          violations.push({
            file: relativePath,
            line: index + 1,
            name,
            text: line.trim(),
          });
          break;
        }
      }
    });
  }
}

const violations = [];
for (const directory of scanRoots) {
  try {
    if (statSync(join(root, directory)).isDirectory()) walk(join(root, directory));
  } catch {
    // Optional root (e.g. tests) may not exist yet.
  }
}

if (violations.length > 0) {
  console.error(`Hardcoded colours found outside lib/theme (${violations.length}):`);
  for (const violation of violations) {
    console.error(
      `  ${violation.file}:${violation.line} [${violation.name}] ${violation.text}`,
    );
  }
  console.error("\nMove the value into lib/theme/tokens.ts and use a token utility.");
  process.exit(1);
}

console.log("no hardcoded colours outside lib/theme");
