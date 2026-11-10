import { describe, expect, it } from "vitest";

import { trackContents } from "@/content/tracks";
import { phaseLines, trackStats } from "@/lib/track-stats";

const backend = trackContents.find((track) => track.slug === "backend");
const ai = trackContents.find((track) => track.slug === "ai-engineer");

if (!backend || !ai) {
  throw new Error("Both tracks must exist for the stats tests to mean anything.");
}

describe("trackStats", () => {
  it("derives Backend totals from content, never constants", () => {
    expect(trackStats(backend)).toEqual({
      phases: 4,
      topics: 11,
      subtopics: 52,
      totalWeeks: 36,
    });
  });

  it("derives AI totals from content, never constants", () => {
    expect(trackStats(ai)).toEqual({
      phases: 5,
      topics: 19,
      subtopics: 54,
      totalWeeks: 30,
    });
  });

  it("counts zero-week prerequisite weeks toward nothing", () => {
    const firstPhase = ai.phases[0];
    expect(firstPhase?.topics.every((topic) => topic.durationWeeks === 0)).toBe(true);

    const weeks = ai.phases
      .flatMap((phase) => phase.topics)
      .reduce((sum, topic) => sum + topic.durationWeeks, 0);
    expect(weeks).toBe(30);
  });
});

describe("phaseLines", () => {
  it("returns phases in content order", () => {
    expect(phaseLines(backend).map((phase) => phase.order)).toEqual([1, 2, 3, 4]);
    expect(phaseLines(ai).map((phase) => phase.order)).toEqual([1, 2, 3, 4, 5]);
  });

  it("flags the zero-week AI phase as a prerequisite and nothing else", () => {
    const lines = phaseLines(ai);
    expect(lines[0]?.prerequisite).toBe(true);
    expect(lines.slice(1).every((phase) => !phase.prerequisite)).toBe(true);
  });

  it("rolls topic weeks up per phase", () => {
    const lines = phaseLines(backend);
    expect(lines.map((phase) => phase.weeks)).toEqual([7, 11, 12, 6]);
  });

  it("matches the whole-track total", () => {
    for (const track of trackContents) {
      const rolled = phaseLines(track).reduce((sum, phase) => sum + phase.weeks, 0);
      expect(rolled).toBe(trackStats(track).totalWeeks);
    }
  });
});
