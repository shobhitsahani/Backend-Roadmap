import { describe, expect, it } from "vitest";
import { phaseSeeds, resourceSeeds, subtopicSeeds, topicSeeds } from "@/db/seed-data";

describe("roadmap seed", () => {
  it("covers 36 weeks across four phases", () => {
    expect(phaseSeeds).toHaveLength(4);
    expect(topicSeeds.reduce((total, topic) => total + topic.durationWeeks, 0)).toBe(36);
  });

  it("keeps every phase, topic and subtopic connected", () => {
    const phaseIds = new Set(phaseSeeds.map((phase) => phase.id));
    const topicIds = new Set(topicSeeds.map((topic) => topic.id));

    for (const topic of topicSeeds) {
      expect(phaseIds.has(topic.phaseId)).toBe(true);
    }

    for (const subtopic of subtopicSeeds) {
      expect(topicIds.has(subtopic.topicId)).toBe(true);
    }

    for (const resource of resourceSeeds) {
      expect(topicIds.has(resource.topicId)).toBe(true);
      expect(() => new URL(resource.url)).not.toThrow();
    }
  });

  it("uses unique ids for every record", () => {
    for (const records of [phaseSeeds, topicSeeds, subtopicSeeds, resourceSeeds]) {
      const ids = records.map((record) => record.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});
