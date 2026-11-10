import { expect, test, type Page } from "@playwright/test";

async function open(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

async function distinctColorCount(page: Page, selector: string): Promise<number> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLCanvasElement | null;
    if (!el) return 0;
    const w = el.width || el.clientWidth;
    const h = el.height || el.clientHeight;
    if (w === 0 || h === 0) return 0;
    const tmp = document.createElement("canvas");
    tmp.width = w;
    tmp.height = h;
    const ctx = tmp.getContext("2d");
    if (!ctx) return 0;
    try {
      ctx.drawImage(el, 0, 0, w, h);
    } catch {
      return 0;
    }
    const data = ctx.getImageData(0, 0, w, h).data;
    const seen = new Set<string>();
    for (let i = 0; i < data.length; i += 16) {
      seen.add(`${data[i]},${data[i + 1]},${data[i + 2]}`);
    }
    return seen.size;
  }, selector);
}

test.describe("3D is on by default", () => {
  test("WebGL2 is available in this browser", async ({ page }) => {
    await page.goto("about:blank");
    const has = await page.evaluate(() => {
      try {
        return Boolean(document.createElement("canvas").getContext("webgl2"));
      } catch {
        return false;
      }
    });
    expect(has).toBe(true);
  });

  test("landing hero TrackWorld is ready with a non-blank canvas", async ({ page }) => {
    await open(page, "/");
    const section = page.getByTestId("track-world");
    await expect(section).toHaveAttribute("data-state", "ready");
    await expect(section).toHaveAttribute("data-track-world", "on");
    const canvas = section.locator("canvas");
    await expect(canvas).toBeVisible();
    await page.waitForTimeout(800);
    const colors = await distinctColorCount(page, "[data-testid='track-world'] canvas");
    expect(colors).toBeGreaterThan(8);
  });

  test("header scene is ready on /backend", async ({ page }) => {
    await open(page, "/backend");
    const section = page.getByTestId("track-world");
    await expect(section).toHaveAttribute("data-state", "ready");
    await expect(section.locator("canvas")).toBeVisible();
  });

  test("header scene is ready on /ai-engineer", async ({ page }) => {
    await open(page, "/ai-engineer");
    const section = page.getByTestId("track-world");
    await expect(section).toHaveAttribute("data-state", "ready");
    await expect(section.locator("canvas")).toBeVisible();
  });

  test("?view=journey opens Journey3D", async ({ page }) => {
    await open(page, "/backend?view=journey");
    const journey = page.getByTestId("journey-3d");
    await expect(journey).toBeVisible();
    await expect(journey.locator("canvas")).toBeVisible();
    // tab present
    await expect(page.getByRole("button", { name: /3D/i })).toBeVisible();
  });

  test("ProgressCore is on the dashboard", async ({ page }) => {
    await open(page, "/backend/log");
    const core = page.getByTestId("progress-core");
    await expect(core).toBeVisible();
    await expect(core.locator("canvas")).toBeVisible();
  });

  test("switching tracks flips the header scene layout", async ({ page }) => {
    await open(page, "/backend");
    await page
      .getByRole("link", { name: /Switch to AI Engineer/i })
      .first()
      .click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(400);
    const section = page.getByTestId("track-world");
    await expect(section).toHaveAttribute("data-state", "ready");
    await expect(section).toBeVisible();
  });
});

test.describe("3D fallback reasons", () => {
  test("getContext returning null yields fallback with reason webgl-unavailable", async ({
    browser,
  }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.addInitScript(() => {
      const orig = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (
        type: string,
        ...rest: unknown[]
      ) {
        if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") {
          return null;
        }
        return (orig as (this: HTMLCanvasElement, ...args: unknown[]) => unknown).call(
          this,
          type,
          ...rest,
        );
      } as unknown as typeof orig;
    });
    await page.goto("http://localhost:3100/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    const section = page.getByTestId("track-world");
    await expect(section).toHaveAttribute("data-state", "fallback");
    await expect(section).toHaveAttribute("data-fallback-reason", "webgl-unavailable");
    await context.close();
  });

  test("Off setting yields user-off fallback", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "backend-roadmap-3d",
        JSON.stringify({ state: { preference: "off" }, version: 0 }),
      );
    });
    await page.goto("http://localhost:3100/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    const section = page.getByTestId("track-world");
    await expect(section).toHaveAttribute("data-state", "fallback");
    await expect(section).toHaveAttribute("data-fallback-reason", "user-off");
    await context.close();
  });
});

test.describe("3D reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("reduced motion keeps a canvas in static state", async ({ page }) => {
    await open(page, "/");
    const section = page.getByTestId("track-world");
    await expect(section).toHaveAttribute("data-state", "static");
    await expect(section.locator("canvas")).toBeVisible();
  });
});
