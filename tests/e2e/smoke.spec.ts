import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * Next streams the shell before React hydrates. Waiting for network idle keeps
 * interactions from firing against server HTML whose handlers are not attached
 * yet, which is the main source of flakes on a cold dev server.
 */
async function open(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

test("roadmap renders the seeded plan", async ({ page }) => {
  await open(page, "/");

  await expect(page).toHaveURL(/\/backend$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Backend Engineer roadmap",
  );
  await expect(page.getByRole("region", { name: "Foundation" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Map view/i })).toBeVisible();
});

test("theme toggle persists across reloads", async ({ page }) => {
  await open(page, "/");
  await page.getByRole("button", { name: /Switch to light theme/i }).click();
  await expect(page.locator("html")).toHaveClass(/light/);

  await page.reload();
  await expect(page.locator("html")).toHaveClass(/light/);
});

test("track switcher changes the URL, the cookie and the document accent", async ({
  page,
}) => {
  await open(page, "/backend");

  await page
    .getByRole("link", { name: /Switch to AI Engineer/i })
    .first()
    .click();

  await expect(page).toHaveURL(/\/ai-engineer$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "AI Engineer roadmap",
  );
  await expect(page.locator("html")).toHaveAttribute("data-track", "ai-engineer");

  const cookies = await page.context().cookies();
  expect(cookies.find((cookie) => cookie.name === "last_track")?.value).toBe(
    "ai-engineer",
  );

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-track", "ai-engineer");
});

test("the remembered track wins when visiting the root", async ({ page }) => {
  await open(page, "/ai-engineer");
  await open(page, "/");

  await expect(page).toHaveURL(/\/ai-engineer$/);
  await expect(page.locator("html")).toHaveAttribute("data-track", "ai-engineer");
});

test("Alt+2 switches track and keeps the current screen", async ({ page }) => {
  await open(page, "/backend/log");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Field log");

  await page.keyboard.press("Alt+2");

  await expect(page).toHaveURL(/\/ai-engineer\/log$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Field log");
});

test("the roadmap view is stored in the URL and journey falls back to the map", async ({
  page,
}) => {
  await open(page, "/backend");
  await page.getByRole("button", { name: /Map view/i }).click();
  await expect(page).toHaveURL(/\/backend\?view=graph$/);
  await expect(page.locator(".react-flow")).toBeVisible();

  await open(page, "/backend?view=journey");
  await expect(page.locator(".react-flow")).toBeVisible();
});

test("journey and settings are real routes", async ({ page }) => {
  await open(page, "/journey");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Two tracks, one field plan",
  );
  await expect(page.getByRole("heading", { name: "AI Engineer" })).toBeVisible();

  await open(page, "/settings");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Settings");
  await expect(page.getByRole("heading", { name: "Progress file" })).toBeVisible();
});

test("key screens have no serious axe violations", async ({ page }) => {
  for (const path of ["/backend", "/ai-engineer", "/journey", "/settings"]) {
    await open(page, path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const serious = results.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical",
    );
    expect(serious, `${path}: ${serious.map((entry) => entry.id).join(", ")}`).toEqual(
      [],
    );
  }
});
