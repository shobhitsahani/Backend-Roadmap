import { expect, test, type Page } from "@playwright/test";

import { themeColors } from "../../lib/theme/config";

const STORAGE_KEY = "backend-roadmap-theme";

async function open(page: Page, path = "/backend") {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

async function chooseTheme(page: Page, theme: "black" | "purple" | "light") {
  await page.getByTestId("theme-picker-trigger").click();
  await page.getByTestId(`theme-option-${theme}`).click();
}

async function expectTheme(page: Page, theme: "black" | "purple" | "light") {
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
  await expect
    .poll(() => page.evaluate((key) => window.localStorage.getItem(key), STORAGE_KEY))
    .toBe(theme);
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    "content",
    themeColors[theme],
  );
  await expect
    .poll(() => page.evaluate(() => document.documentElement.style.colorScheme))
    .toBe(theme === "light" ? "light" : "dark");
}

test.describe("theme selection", () => {
  test("first visit is Black with a dark color scheme", async ({ page }) => {
    await open(page);

    await expect(page.locator("html")).toHaveAttribute("data-theme", "black");
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      themeColors.black,
    );
    await expect
      .poll(() => page.evaluate(() => document.documentElement.style.colorScheme))
      .toBe("dark");
    expect(
      await page.evaluate((key) => window.localStorage.getItem(key), STORAGE_KEY),
    ).toBeNull();
  });

  test("picker applies, persists and survives a reload before paint", async ({
    page,
  }) => {
    await open(page);
    await chooseTheme(page, "purple");
    await expectTheme(page, "purple");

    // Compare when the head script stamps the theme with when the browser
    // records first-contentful-paint. The theme must win, otherwise a stored
    // theme flashes the default palette before hydration.
    await page.addInitScript(() => {
      const timing = { theme: null as number | null, fcp: null as number | null };
      const record = () => {
        if (
          timing.theme == null &&
          document.documentElement?.hasAttribute("data-theme")
        ) {
          timing.theme = performance.now();
        }
      };
      record();
      // Observe the document: documentElement does not exist yet when an init
      // script runs, but the theme attribute appears during parsing.
      new MutationObserver(record).observe(document, {
        attributes: true,
        subtree: true,
        attributeFilter: ["data-theme"],
      });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            timing.fcp = entry.startTime;
          }
        }
      }).observe({ type: "paint", buffered: true });
      (window as unknown as { __themeTiming: typeof timing }).__themeTiming = timing;
    });

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "purple");
    await page.waitForFunction(() => {
      const timing = (window as unknown as { __themeTiming?: { fcp: number | null } })
        .__themeTiming;
      return timing?.fcp != null;
    });
    const timing = await page.evaluate(
      () =>
        (
          window as unknown as {
            __themeTiming: { theme: number | null; fcp: number | null };
          }
        ).__themeTiming,
    );
    expect(timing.theme, "theme applied before first contentful paint").not.toBeNull();
    expect(timing.theme).toBeLessThanOrEqual(timing.fcp!);
  });

  test("legacy dark preference migrates to Black", async ({ page }) => {
    await page.addInitScript(
      (key) => window.localStorage.setItem(key, "dark"),
      STORAGE_KEY,
    );
    await open(page);

    await expect(page.locator("html")).toHaveAttribute("data-theme", "black");
    await expect
      .poll(() => page.evaluate((key) => window.localStorage.getItem(key), STORAGE_KEY))
      .toBe("black");
  });

  test("System follows prefers-color-scheme", async ({ page }) => {
    await open(page);
    await page.emulateMedia({ colorScheme: "dark" });
    await page.getByTestId("theme-picker-trigger").click();
    await page.getByTestId("theme-option-black").click();

    await open(page, "/settings");
    await page.getByTestId("settings-theme-system").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "black");

    await page.emulateMedia({ colorScheme: "light" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await page.emulateMedia({ colorScheme: "dark" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "black");
  });

  test("command palette exposes all four theme commands", async ({ page }) => {
    await open(page);
    const dialog = page.getByRole("dialog", { name: "Command palette" });
    await expect
      .poll(
        async () => {
          if (await dialog.isVisible()) return true;
          // Retry the shortcut until hydration has attached the listener.
          await page.keyboard.press("Control+k");
          return dialog.isVisible();
        },
        { timeout: 15_000 },
      )
      .toBe(true);

    await page.getByRole("option", { name: /Theme: Purple/ }).click();
    await expectTheme(page, "purple");

    await page.keyboard.press("Control+k");
    await page.getByRole("option", { name: /Theme: System/ }).click();
    await expect
      .poll(() => page.evaluate((key) => window.localStorage.getItem(key), STORAGE_KEY))
      .toBe("system");
  });

  test("Settings control switches every theme", async ({ page }) => {
    await open(page, "/settings");

    for (const theme of ["purple", "light", "black"] as const) {
      await page.getByTestId(`settings-theme-${theme}`).click();
      await expect(page.getByTestId(`settings-theme-${theme}`)).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      await expectTheme(page, theme);
    }
  });

  test("graph color mode follows the dark themes", async ({ page }) => {
    await open(page);
    await chooseTheme(page, "purple");
    await page.goto("/backend?view=graph");
    await page.waitForLoadState("networkidle");

    await expect(page.locator(".react-flow")).toHaveClass(/dark/);

    await chooseTheme(page, "light");
    await expect(page.locator(".react-flow")).not.toHaveClass(/dark/);
  });

  test("theme changes sync across tabs", async ({ context, page }) => {
    const second = await context.newPage();
    await open(page);
    await open(second);

    await chooseTheme(page, "purple");
    await expect(second.locator("html")).toHaveAttribute("data-theme", "purple");
  });

  test("Purple exposes purple chrome tokens", async ({ page }) => {
    await open(page);
    await chooseTheme(page, "purple");

    const values = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      const probe = document.createElement("span");
      probe.style.color = "var(--brand)";
      document.body.appendChild(probe);
      const resolvedBrand = getComputedStyle(probe).color;
      probe.remove();
      return {
        brand: style.getPropertyValue("--brand").trim(),
        focus: style.getPropertyValue("--focus-ring").trim(),
        highlight: style.getPropertyValue("--chrome-highlight").trim(),
        indicator: style.getPropertyValue("--chrome-indicator").trim(),
        resolvedBrand,
      };
    });

    // Chrome serialises authored OKLCH to lab() in computed custom properties,
    // so compare the resolved token graph rather than the authored string.
    expect(values.brand).toBe(values.focus);
    expect(values.highlight).toContain(values.brand);
    expect(values.indicator).toContain(values.brand);
    expect(values.resolvedBrand).not.toBe("rgb(255, 255, 255)");
    expect(values.resolvedBrand).not.toBe("rgb(0, 0, 0)");
  });
});
