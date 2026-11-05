import { chromium, type Browser, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE_URL = process.env.SCREENSHOT_BASE_URL ?? "http://localhost:3000";
const OUT_DIR = process.env.SCREENSHOT_DIR ?? path.join(process.cwd(), "screenshots");
const ROUTES = (process.env.SCREENSHOT_PATHS ?? "/")
  .split(",")
  .map((route) => route.trim())
  .filter(Boolean);

const VIEWPORTS = [
  { name: "375", width: 375, height: 812 },
  { name: "768", width: 768, height: 1024 },
  { name: "1440", width: 1440, height: 960 },
] as const;

const THEMES = ["dark", "light"] as const;

function slugify(route: string) {
  if (route === "/") return "home";
  return route.replace(/^\/|\/$/g, "").replaceAll("/", "-");
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
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();

  try {
    for (const route of ROUTES) {
      for (const theme of THEMES) {
        for (const viewport of VIEWPORTS) {
          const page = await openPage(browser, viewport.width, viewport.height, theme);
          try {
            await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded" });
            await settle(page);
            await page.screenshot({
              path: path.join(OUT_DIR, `${slugify(route)}-${viewport.name}-${theme}.png`),
              fullPage: true,
            });
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
