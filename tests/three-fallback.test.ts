import { describe, expect, it } from "vitest";

import { shouldSkip3D } from "@/lib/three-fallback";

describe("shouldSkip3D", () => {
  it("allows 3D when nothing in the environment objects", () => {
    expect(
      shouldSkip3D({
        enable3D: undefined,
        prefersReducedMotion: false,
        saveData: false,
        hardwareConcurrency: 8,
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

  it("skips when the user prefers reduced motion", () => {
    expect(
      shouldSkip3D({
        enable3D: undefined,
        prefersReducedMotion: true,
        saveData: false,
        hardwareConcurrency: 16,
      }),
    ).toBe(true);
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

  it("skips on weak hardware (<= 4 logical cores)", () => {
    for (const cores of [1, 2, 4]) {
      expect(
        shouldSkip3D({
          enable3D: undefined,
          prefersReducedMotion: false,
          saveData: false,
          hardwareConcurrency: cores,
        }),
      ).toBe(true);
    }
  });

  it("treats unknown hardware as strong enough rather than skipping", () => {
    expect(
      shouldSkip3D({
        enable3D: undefined,
        prefersReducedMotion: false,
        saveData: false,
        hardwareConcurrency: undefined,
      }),
    ).toBe(false);
    expect(
      shouldSkip3D({
        enable3D: undefined,
        prefersReducedMotion: false,
        saveData: false,
        hardwareConcurrency: 0,
      }),
    ).toBe(false);
  });
});
