import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE_URL = process.env.SCREENSHOT_BASE_URL ?? "http://localhost:3000";
const OUT_DIR =
  process.env.SCREENSHOT_DIR ??
  path.join(process.cwd(), "docs", "screenshots", "3d-before");

const ROUTES = ["/", "/backend", "/ai-engineer", "/backend?view=journey", "/backend/log"];
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];
const THEMES = ["dark", "light"] as const;

function slugify(route: string) {
  const view = route.includes("view=journey") ? "-journey" : "";
  const base =
    route
      .replace(/\?.*/, "")
      .replace(/^\/|\/$/g, "")
      .replaceAll("/", "-") || "home";
  return `${base}${view}`;
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
        for (const vp of VIEWPORTS) {
          const ctx = await browser.newContext({
            viewport: { width: vp.width, height: vp.height },
            colorScheme: theme === "dark" ? "dark" : "light",
            reducedMotion: "no-preference",
          });
          const page = await ctx.newPage();
          await page.addInitScript(
            (t) => window.localStorage.setItem("backend-roadmap-theme", t),
            theme,
          );
          await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded" });
          await page.waitForLoadState("networkidle");
          await page.waitForTimeout(1200);
          const name = `${slugify(route)}-${vp.name}-${theme}.png`;
          await page.screenshot({ path: path.join(OUT_DIR, name), fullPage: true });
          console.log("captured", route, vp.name, theme);
          await ctx.close();
        }
      }
    }
  } finally {
    await browser.close();
  }
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
