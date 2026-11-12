import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { siteConfig } from "../../lib/site";

const STORAGE_KEY = "backend-roadmap-theme";

async function open(
  page: Page,
  path = "/backend",
  theme: "black" | "purple" | "light" = "black",
) {
  await page.addInitScript(({ key, value }) => window.localStorage.setItem(key, value), {
    key: STORAGE_KEY,
    value: theme,
  });
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

test.describe("GitHub header link", () => {
  test.beforeEach(async ({ page }) => {
    // Intercept outbound calls to github.com so tests don't load external network
    await page.context().route("https://github.com/**", (route) => {
      void route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<!doctype html><html><head><title>GitHub</title></head><body>GitHub Mock</body></html>",
      });
    });
  });

  test("link attributes, single source of truth URL, accessible name and DOM order", async ({
    page,
  }) => {
    await open(page, "/backend");

    const themeButton = page.getByTestId("theme-picker-trigger");
    const githubLink = page.getByTestId("header-github-link");

    await expect(themeButton).toBeVisible();
    await expect(githubLink).toBeVisible();

    // DOM order: GitHub link comes immediately after theme button
    const isAfter = await page.evaluate(() => {
      const themeBtn = document.querySelector('[data-testid="theme-picker-trigger"]');
      const ghLink = document.querySelector('[data-testid="header-github-link"]');
      if (!themeBtn || !ghLink) return false;
      const pos = themeBtn.compareDocumentPosition(ghLink);
      return Boolean(pos & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(isAfter).toBe(true);

    // Exact single source of truth URL
    await expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/shobhitsahani/Backend-Roadmap",
    );
    await expect(githubLink).toHaveAttribute("href", siteConfig.githubUrl);

    // Target and rel
    await expect(githubLink).toHaveAttribute("target", "_blank");
    const rel = await githubLink.getAttribute("rel");
    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");

    // Accessible name
    await expect(githubLink).toHaveAccessibleName(
      "View source on GitHub (opens in a new tab)",
    );

    // SVG icon is aria-hidden
    const svg = githubLink.locator("svg");
    await expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  test("hit target is at least 40px desktop and 44px mobile", async ({ page }) => {
    // Desktop (1440px)
    await page.setViewportSize({ width: 1440, height: 900 });
    await open(page, "/backend");
    const desktopLink = page.getByTestId("header-github-link");
    const desktopBox = await desktopLink.boundingBox();
    expect(desktopBox).not.toBeNull();
    expect(desktopBox!.width).toBeGreaterThanOrEqual(40);
    expect(desktopBox!.height).toBeGreaterThanOrEqual(40);

    // Mobile (390px)
    await page.setViewportSize({ width: 390, height: 844 });
    const mobileBox = await desktopLink.boundingBox();
    expect(mobileBox).not.toBeNull();
    expect(mobileBox!.width).toBeGreaterThanOrEqual(44);
    expect(mobileBox!.height).toBeGreaterThanOrEqual(44);
  });

  test("keyboard navigation: Tab reaches link from theme button, Enter triggers popup", async ({
    page,
  }) => {
    await open(page, "/backend");

    const themeButton = page.getByTestId("theme-picker-trigger");
    const githubLink = page.getByTestId("header-github-link");

    await themeButton.focus();
    await expect(themeButton).toBeFocused();

    // Tab to GitHub link
    await page.keyboard.press("Tab");
    await expect(githubLink).toBeFocused();

    // Enter opens popup with single source of truth URL
    const popupPromise = page.waitForEvent("popup");
    await page.keyboard.press("Enter");
    const popup = await popupPromise;
    expect(popup.url()).toBe(siteConfig.githubUrl);
    await popup.close();
  });

  test("command palette entry 'Open GitHub repository' opens project URL", async ({
    page,
  }) => {
    await open(page, "/backend");

    const dialog = page.getByRole("dialog", { name: "Command palette" });
    await expect
      .poll(
        async () => {
          if (await dialog.isVisible()) return true;
          await page.keyboard.press("Control+k");
          return dialog.isVisible();
        },
        { timeout: 15_000 },
      )
      .toBe(true);

    const ghOption = page.getByRole("option", {
      name: /Open GitHub repository/i,
    });
    await expect(ghOption).toBeVisible();

    const popupPromise = page.waitForEvent("popup");
    await ghOption.click();
    const popup = await popupPromise;
    expect(popup.url()).toBe(siteConfig.githubUrl);
    await popup.close();
  });

  for (const theme of ["black", "purple", "light"] as const) {
    test(`no horizontal overflow across viewports (1440, 768, 390) in ${theme}`, async ({
      page,
    }) => {
      for (const width of [1440, 768, 390]) {
        await page.setViewportSize({ width, height: 800 });
        await open(page, "/backend", theme);

        const ghLink = page.getByTestId("header-github-link");
        await expect(ghLink).toBeVisible();

        const headerOverflow = await page.evaluate(() => {
          const header = document.querySelector("header");
          if (!header) return false;
          return header.scrollWidth > header.clientWidth;
        });
        expect(headerOverflow, `Header overflow at width ${width} in ${theme}`).toBe(
          false,
        );

        const docOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });
        expect(docOverflow, `Document overflow at width ${width} in ${theme}`).toBe(
          false,
        );
      }
    });

    test(`axe-core passes for header in ${theme}`, async ({ page }) => {
      await open(page, "/backend", theme);
      await page.waitForSelector("header.sticky");

      const results = await new AxeBuilder({ page })
        .include("header.sticky")
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const serious = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      expect(
        serious,
        `${theme} header violations: ${serious
          .map((s) => `${s.id} (${s.nodes.length})`)
          .join(", ")}`,
      ).toEqual([]);
    });
  }
});
