import { describe, expect, it } from "vitest";

import {
  isRoadmapView,
  parseRoadmapView,
  pickActiveTrackSlug,
  roadmapViewHref,
  sectionFromPathname,
  sectionHref,
  trackSlugFromPathname,
  trackSwitchHref,
} from "@/lib/routes";

const slugs = ["backend", "ai-engineer"];

describe("track routes", () => {
  it("builds track section links", () => {
    expect(sectionHref("backend", "roadmap")).toBe("/backend");
    expect(sectionHref("ai-engineer", "log")).toBe("/ai-engineer/log");
    expect(sectionHref("ai-engineer", "timeline")).toBe("/ai-engineer/timeline");
  });

  it("recognises only exact track screens", () => {
    expect(sectionFromPathname("/backend", "backend")).toBe("roadmap");
    expect(sectionFromPathname("/backend/log", "backend")).toBe("log");
    expect(sectionFromPathname("/backend/timeline", "backend")).toBe("timeline");
    expect(sectionFromPathname("/backend/log/extra", "backend")).toBeNull();
    expect(sectionFromPathname("/ai-engineer", "backend")).toBeNull();
    expect(sectionFromPathname("/journey", "backend")).toBeNull();
  });

  it("reads a track slug from the first path segment", () => {
    expect(trackSlugFromPathname("/backend/log", slugs)).toBe("backend");
    expect(trackSlugFromPathname("/ai-engineer", slugs)).toBe("ai-engineer");
    expect(trackSlugFromPathname("/journey", slugs)).toBeNull();
    expect(trackSlugFromPathname("/", slugs)).toBeNull();
  });

  it("switches tracks while preserving the section and map view", () => {
    expect(trackSwitchHref("/backend/log", "", "ai-engineer", slugs)).toBe(
      "/ai-engineer/log",
    );
    expect(trackSwitchHref("/backend/timeline", "", "ai-engineer", slugs)).toBe(
      "/ai-engineer/timeline",
    );
    expect(trackSwitchHref("/backend", "?view=graph", "ai-engineer", slugs)).toBe(
      "/ai-engineer?view=graph",
    );
    expect(trackSwitchHref("/backend", "", "ai-engineer", slugs)).toBe("/ai-engineer");
    expect(trackSwitchHref("/journey", "", "ai-engineer", slugs)).toBe("/ai-engineer");
    expect(trackSwitchHref("/settings", "", "backend", slugs)).toBe("/backend");
  });

  it("falls back to the map for the reserved journey view", () => {
    expect(parseRoadmapView(null)).toBe("list");
    expect(parseRoadmapView("list")).toBe("list");
    expect(parseRoadmapView("graph")).toBe("graph");
    expect(parseRoadmapView("journey")).toBe("graph");
    expect(parseRoadmapView("unknown")).toBe("list");
  });

  it("builds URL state for the view toggle", () => {
    expect(roadmapViewHref("/backend", "list")).toBe("/backend");
    expect(roadmapViewHref("/backend", "graph")).toBe("/backend?view=graph");
    expect(isRoadmapView("journey")).toBe(true);
    expect(isRoadmapView("nope")).toBe(false);
  });

  it("resolves the active track from path, then cookie, then default", () => {
    expect(pickActiveTrackSlug("/ai-engineer", "backend", slugs, "backend")).toBe(
      "ai-engineer",
    );
    expect(pickActiveTrackSlug("/journey", "ai-engineer", slugs, "backend")).toBe(
      "ai-engineer",
    );
    expect(pickActiveTrackSlug("/settings", "unknown", slugs, "backend")).toBe("backend");
    expect(pickActiveTrackSlug("/", null, slugs, "backend")).toBe("backend");
  });
});
