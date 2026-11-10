import { describe, expect, it } from "vitest";

import { shouldRenderStatic, shouldSkip3D } from "@/lib/three-fallback";

describe("shouldSkip3D", () => {
  it("allows 3D when nothing in the environment objects (including weak hardware)", () => {
    expect(
      shouldSkip3D({
        enable3D: undefined,
        prefersReducedMotion: false,
        saveData: false,
        hardwareConcurrency: 2,
      }),
    ).toBe(false);
  });

  it("skips when the kill switch is explicitly disabled", () => {
    expect(
      shouldSkip3D({
        enable3D: "false",
        prefersReducedMotion: false,
        saveData: false,
        hardwareConcurrency: 16,
      }),
    ).toBe(true);
  });

  it("does not confuse a truthy non-false kill switch with disabled", () => {
    expect(
      shouldSkip3D({
        enable3D: "0",
        prefersReducedMotion: false,
        saveData: false,
        hardwareConcurrency: 8,
      }),
    ).toBe(false);
  });

  it("does not skip on reduced motion (renders a static frame instead)", () => {
    expect(
      shouldSkip3D({
        enable3D: undefined,
        prefersReducedMotion: true,
        saveData: false,
        hardwareConcurrency: 16,
      }),
    ).toBe(false);
  });

  it("skips on a metered or save-data connection", () => {
    expect(
      shouldSkip3D({
        enable3D: undefined,
        prefersReducedMotion: false,
        saveData: true,
        hardwareConcurrency: 16,
      }),
    ).toBe(true);
  });

  it("skips when the user sets 3D to Off", () => {
    expect(
      shouldSkip3D({
        enable3D: undefined,
        prefersReducedMotion: false,
        saveData: false,
        hardwareConcurrency: 16,
        userPreference: "off",
      }),
    ).toBe(true);
  });

  it("does not skip for reduced or on preference", () => {
    for (const pref of ["on", "reduced"] as const) {
      expect(
        shouldSkip3D({
          enable3D: undefined,
          prefersReducedMotion: false,
          saveData: false,
          hardwareConcurrency: 16,
          userPreference: pref,
        }),
      ).toBe(false);
    }
  });
});

describe("shouldRenderStatic", () => {
  it("is true for reduced motion", () => {
    expect(
      shouldRenderStatic({
        enable3D: undefined,
        prefersReducedMotion: true,
        saveData: false,
        hardwareConcurrency: 16,
      }),
    ).toBe(true);
  });

  it("is true when the user sets 3D to Reduced", () => {
    expect(
      shouldRenderStatic({
        enable3D: undefined,
        prefersReducedMotion: false,
        saveData: false,
        hardwareConcurrency: 16,
        userPreference: "reduced",
      }),
    ).toBe(true);
  });

  it("is false otherwise", () => {
    expect(
      shouldRenderStatic({
        enable3D: undefined,
        prefersReducedMotion: false,
        saveData: false,
        hardwareConcurrency: 16,
        userPreference: "on",
      }),
    ).toBe(false);
  });
});
