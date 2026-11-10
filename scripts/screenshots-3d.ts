import { chromium, type Browser, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE_URL = process.env.SCREENSHOT_BASE_URL ?? "http://localhost:3000";
const OUT_DIR =
  process.env.SCREENSHOT_DIR ?? path.join(process.cwd(), "docs", "screenshots", "3d");

const ROUTES = [
  "/",
  "/backend",
  "/ai-engineer",
  "/backend?view=journey",
  "/ai-engineer?view=journey",
  "/backend/log",
  "/ai-engineer/log",
];

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 960 },
  { name: "mobile", width: 375, height: 812 },
] as const;

const THEMES = ["dark", "light"] as const;

function slugify(route: string) {
  return (
    route
      .replace(/\?.*/, "")
      .replace(/^\/|\/$/g, "")
      .replaceAll("/", "-") || "home"
  );
}

async function openPage(browser: Browser, width: number, height: number, theme: string) {
  const context = await browser.newContext({
    viewport: { width, height },
    colorScheme: theme === "dark" ? "dark" : "light",
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page.addInitScript((themeName) => {
    window.localStorage.setItem("backend-roadmap-theme", themeName);
  }, theme);
  return page;
}

async function settle(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({
    args: [
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
      "--ignore-gpu-blocklist",
    ],
  });
  try {
    for (const route of ROUTES) {
      for (const theme of THEMES) {
        for (const viewport of VIEWPORTS) {
          const page = await openPage(browser, viewport.width, viewport.height, theme);
          try {
            await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded" });
            await settle(page);
            const name = `${slugify(route)}-${viewport.name}-${theme}.png`;
            await page.screenshot({ path: path.join(OUT_DIR, name), fullPage: true });
            console.log(`captured ${route} ${viewport.name} ${theme}`);
          } finally {
            await page.context().close();
          }
        }
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
