import { expect, test } from "@playwright/test";

test("roadmap renders the seeded plan", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Backend roadmap");
  await expect(page.getByRole("region", { name: "Foundation" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Map view/i })).toBeVisible();
});

test("theme toggle persists across reloads", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Switch to light theme/i }).click();
  await expect(page.locator("html")).toHaveClass(/light/);

  await page.reload();
  await expect(page.locator("html")).toHaveClass(/light/);
});
