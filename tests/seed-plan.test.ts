import { describe, expect, it } from "vitest";

import { trackContents } from "@/content/tracks";
import { buildSeedRows } from "@/db/seed-plan";

describe("seed plan", () => {
  const rows = buildSeedRows();
  const topics = trackContents.flatMap((track) =>
    track.phases.flatMap((phase) => phase.topics),
  );

  it("maps content to exactly one row per record", () => {
    expect(rows.trackRows).toHaveLength(trackContents.length);
    expect(rows.phaseRows).toHaveLength(
      trackContents.reduce((total, track) => total + track.phases.length, 0),
    );
    expect(rows.topicRows).toHaveLength(topics.length);
    expect(rows.subtopicRows).toHaveLength(
      topics.reduce((total, topic) => total + topic.subtopics.length, 0),
    );
    expect(rows.resourceRows).toHaveLength(
      topics.reduce((total, topic) => total + topic.resources.length, 0),
    );
  });

  it("keeps the original Backend topic ids so progress rows still resolve", () => {
    const topicIds = rows.topicRows.map((topic) => topic.id);

    expect(topicIds).toEqual(
      expect.arrayContaining([
        "pick-a-language",
        "how-the-web-works",
        "building-apis",
        "database-design",
        "data-communication",
        "testing",
        "deployment",
        "security",
        "scaling",
        "observability",
        "become-a-nerd",
      ]),
    );
  });

  it("uses unique ids for every content row", () => {
    for (const records of [
      rows.trackRows,
      rows.phaseRows,
      rows.topicRows,
      rows.subtopicRows,
      rows.resourceRows,
    ]) {
      const ids = records.map((record) => record.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("scopes every phase to a track and every topic to a phase", () => {
    const trackIds = new Set(rows.trackRows.map((track) => track.id));
    const phaseIds = new Set(rows.phaseRows.map((phase) => phase.id));

    for (const phase of rows.phaseRows) {
      expect(trackIds.has(phase.trackId)).toBe(true);
    }
    for (const topic of rows.topicRows) {
      expect(phaseIds.has(topic.phaseId)).toBe(true);
    }
  });
});
