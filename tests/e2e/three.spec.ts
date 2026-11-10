import { expect, test } from "@playwright/test";

test("WebGL2 is available in this browser", async ({ page }) => {
  await page.goto("about:blank");
  const hasWebgl2 = await page.evaluate(() => {
    try {
      return Boolean(document.createElement("canvas").getContext("webgl2"));
    } catch {
      return false;
    }
  });
  expect(hasWebgl2).toBe(true);
});

test("landing TrackWorld reports ready state", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const section = page.getByTestId("track-world");
  await expect(section).toHaveAttribute("data-state", "ready");
  await expect(section).toHaveAttribute("data-track-world", "on");
});
