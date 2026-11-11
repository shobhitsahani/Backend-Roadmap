import { expect, test, type Page } from "@playwright/test";

const STORAGE_KEY = "backend-roadmap-theme";

async function open(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

async function setStoredTheme(page: Page, theme: string) {
  await page.addInitScript(({ key, value }) => window.localStorage.setItem(key, value), {
    key: STORAGE_KEY,
    value: theme,
  });
}

const sceneTokens = [
  "--scene-ground",
  "--scene-block",
  "--scene-edge",
  "--scene-key-light",
  "--scene-rim-light",
  "--scene-fog",
] as const;

test.describe("scene tokens", () => {
  test("every theme publishes scene tokens and they differ per theme", async ({
    page,
  }) => {
    const seen = new Map<string, string>();

    for (const theme of ["black", "purple", "light"] as const) {
      await setStoredTheme(page, theme);
      await open(page, "/");

      const values = await page.evaluate((tokens) => {
        const style = getComputedStyle(document.documentElement);
        return Object.fromEntries(
          tokens.map((token) => [token, style.getPropertyValue(token).trim()]),
        );
      }, sceneTokens);

      for (const token of sceneTokens) {
        expect(values[token], `${theme} ${token}`).not.toBe("");
        expect(values[token]).not.toBe("initial");
      }

      seen.set(theme, values["--scene-ground"]!);
    }

    expect(new Set(seen.values()).size).toBe(3);
    // Chrome serialises authored OKLCH custom properties differently per
    // colour (hex, lab(), oklch()), so assert distinct resolved values here and
    // leave exact token freshness to the generated-file unit test.
    for (const theme of ["black", "purple", "light"] as const) {
      expect(seen.get(theme), `${theme} scene-ground`).toBeTruthy();
    }
  });

  test("a 3D scene wrapper, when present, matches the stored theme", async ({ page }) => {
    await setStoredTheme(page, "purple");
    await open(page, "/");

    const scene = page.locator("[data-scene-theme]").first();
    if ((await scene.count()) === 0) {
      test.skip(true, "No WebGL scene on this revision; the Exploded Stack is DOM/CSS.");
      return;
    }

    await expect(scene).toHaveAttribute("data-scene-theme", "purple");
  });
});
