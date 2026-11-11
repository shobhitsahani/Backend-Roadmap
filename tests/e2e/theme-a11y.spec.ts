import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const STORAGE_KEY = "backend-roadmap-theme";

// The axe matrix boots 33 dev-server routes in parallel; give slower pages room.
test.setTimeout(60_000);

const routes = [
  "/",
  "/journey",
  "/settings",
  "/backend",
  "/backend?view=graph",
  "/backend/log",
  "/backend/timeline",
  "/ai-engineer",
  "/ai-engineer?view=graph",
  "/ai-engineer/log",
  "/ai-engineer/timeline",
] as const;

async function open(page: Page, theme: string, path: string) {
  await page.addInitScript(({ key, value }) => window.localStorage.setItem(key, value), {
    key: STORAGE_KEY,
    value: theme,
  });
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

for (const theme of ["black", "purple", "light"] as const) {
  test.describe(`axe: ${theme}`, () => {
    test.use({ colorScheme: theme === "light" ? "light" : "dark" });

    for (const route of routes) {
      test(`${route}`, async ({ page }) => {
        await open(page, theme, route);

        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();
        const serious = results.violations.filter(
          (violation) =>
            violation.impact === "serious" || violation.impact === "critical",
        );

        expect(
          serious,
          `${theme} ${route}: ${serious
            .map((entry) => `${entry.id} (${entry.nodes.length})`)
            .join(", ")}`,
        ).toEqual([]);
      });
    }
  });
}
