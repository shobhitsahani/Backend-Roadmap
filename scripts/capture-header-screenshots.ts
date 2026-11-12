import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const PORT = process.env.PORT ?? "3005";
const BASE_URL = `http://localhost:${PORT}`;
const OUT_DIRS = [
  path.join(process.cwd(), "screenshots", "header"),
  path.join(
    "C:\\Users\\shobh\\.gemini\\antigravity\\brain\\80e814f8-f954-47d4-859d-12f315a20eb6",
    "screenshots",
  ),
];

const VIEWPORTS = [
  { name: "1440", width: 1440, height: 900 },
  { name: "390", width: 390, height: 844 },
] as const;

const THEMES = ["black", "purple", "light"] as const;

async function main() {
  for (const dir of OUT_DIRS) {
    await mkdir(dir, { recursive: true });
  }

  const browser = await chromium.launch();

  try {
    for (const theme of THEMES) {
      for (const vp of VIEWPORTS) {
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          colorScheme: theme === "light" ? "light" : "dark",
        });
        const page = await context.newPage();

        await page.addInitScript(
          ({ key, value }) => window.localStorage.setItem(key, value),
          {
            key: "backend-roadmap-theme",
            value: theme,
          },
        );

        await page.goto(`${BASE_URL}/backend`, { waitUntil: "domcontentloaded" });
        await page.waitForLoadState("networkidle");
        await page.waitForSelector("header.sticky");
        await page.waitForTimeout(500);

        const header = page.locator("header.sticky").first();
        const filename = `header-${vp.name}-${theme}.png`;

        for (const dir of OUT_DIRS) {
          await header.screenshot({ path: path.join(dir, filename) });
        }

        console.log(`Captured ${filename}`);
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
