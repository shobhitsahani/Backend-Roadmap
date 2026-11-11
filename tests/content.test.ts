import { describe, expect, it } from "vitest";

import { trackContents, getTrackContent } from "@/content/tracks";
import { trackContentSchema } from "@/content/schema";

describe("track content", () => {
  it("validates every registered track against the content schema", () => {
    for (const track of trackContents) {
      expect(trackContentSchema.safeParse(track).success).toBe(true);
    }
  });

  it("keeps track slugs unique and stable", () => {
    const slugs = trackContents.map((track) => track.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(getTrackContent("backend")?.title).toBe("Backend Engineer");
  });

  it("keeps the Backend curriculum at 4 phases, 11 topics, 52 subtopics and 36 weeks", () => {
    const backend = getTrackContent("backend");
    expect(backend).not.toBeNull();
    if (!backend) return;

    const topics = backend.phases.flatMap((phase) => phase.topics);
    const subtopics = topics.flatMap((topic) => topic.subtopics);
    const weeks = topics.reduce((total, topic) => total + topic.durationWeeks, 0);

    expect(backend.phases).toHaveLength(4);
    expect(topics).toHaveLength(11);
    expect(subtopics).toHaveLength(52);
    expect(weeks).toBe(36);
  });

  it("keeps every phase, topic, subtopic and resource connected and unique", () => {
    for (const track of trackContents) {
      const phaseIds = new Set(track.phases.map((phase) => phase.id));
      const topics = track.phases.flatMap((phase) => phase.topics);
      const topicIds = new Set(topics.map((topic) => topic.id));
      const subtopicIds = new Set(
        topics.flatMap((topic) => topic.subtopics.map((subtopic) => subtopic.id)),
      );

      expect(phaseIds.size).toBe(track.phases.length);
      expect(topicIds.size).toBe(topics.length);
      expect(subtopicIds.size).toBe(
        topics.reduce((total, topic) => total + topic.subtopics.length, 0),
      );

      for (const topic of topics) {
        for (const resource of topic.resources) {
          expect(() => new URL(resource.url)).not.toThrow();
        }
      }
    }
  });

  it("resolves every linked prerequisite to a Backend topic", () => {
    const backend = getTrackContent("backend");
    const backendTopicIds = new Set(
      backend?.phases.flatMap((phase) => phase.topics.map((topic) => topic.id)) ?? [],
    );

    for (const track of trackContents) {
      for (const phase of track.phases) {
        for (const topic of phase.topics) {
          if (topic.linkedTopicId === null) continue;
          expect(track.slug).not.toBe("backend");
          expect(backendTopicIds.has(topic.linkedTopicId)).toBe(true);
        }
      }
    }
  });

  it("keeps the AI Engineer track at 5 phases with a zero-week linked prerequisite phase", () => {
    const ai = getTrackContent("ai-engineer");
    expect(ai).not.toBeNull();
    if (!ai) return;

    const prerequisite = ai.phases[0];
    expect(ai.phases).toHaveLength(5);
    expect(prerequisite).toBeDefined();
    expect(prerequisite!.topics.length).toBeGreaterThan(0);
    expect(prerequisite!.topics.every((topic) => topic.durationWeeks === 0)).toBe(true);
    expect(prerequisite!.topics.every((topic) => topic.linkedTopicId !== null)).toBe(
      true,
    );
    expect(
      ai.phases
        .slice(1)
        .flatMap((phase) => phase.topics)
        .every((topic) => topic.durationWeeks > 0),
    ).toBe(true);
  });

  it("marks every AI duration as estimated", () => {
    const ai = getTrackContent("ai-engineer");
    expect(ai).not.toBeNull();
    if (!ai) return;

    const topics = ai.phases.flatMap((phase) => phase.topics);
    expect(topics.every((topic) => topic.estimated)).toBe(true);
  });

  it("derives the AI plan length from topic durations instead of a constant", () => {
    const ai = getTrackContent("ai-engineer");
    expect(ai).not.toBeNull();
    if (!ai) return;

    const weeks = ai.phases
      .flatMap((phase) => phase.topics)
      .reduce((total, topic) => total + topic.durationWeeks, 0);

    expect(weeks).toBeGreaterThan(0);
    expect(weeks).not.toBe(36);
    expect(ai.subtitle).not.toMatch(/\d+\s*weeks/i);
  });
});
