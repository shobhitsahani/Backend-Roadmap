import type { TrackContent } from "@/content/schema";

export type TrackStats = {
  phases: number;
  topics: number;
  subtopics: number;
  totalWeeks: number;
};

export type PhaseLine = {
  id: string;
  order: number;
  title: string;
  /** Weeks rolled up from the phase's topics. Zero means a mirrored prerequisite phase. */
  weeks: number;
  prerequisite: boolean;
};

/**
 * Content-derived totals for a track. The landing prints these and nothing is
 * allowed to hardcode them, so a content edit can never leave stale numbers in
 * the marketing copy.
 */
export function trackStats(track: TrackContent): TrackStats {
  let topics = 0;
  let subtopics = 0;
  let totalWeeks = 0;

  for (const phase of track.phases) {
    for (const topic of phase.topics) {
      topics += 1;
      subtopics += topic.subtopics.length;
      totalWeeks += topic.durationWeeks;
    }
  }

  return { phases: track.phases.length, topics, subtopics, totalWeeks };
}

/** Phase rows for the landing index, ordered by the content file's own order. */
export function phaseLines(track: TrackContent): PhaseLine[] {
  return [...track.phases]
    .sort((left, right) => left.order - right.order)
    .map((phase) => {
      const weeks = phase.topics.reduce((sum, topic) => sum + topic.durationWeeks, 0);
      return {
        id: phase.id,
        order: phase.order,
        title: phase.title,
        weeks,
        prerequisite: weeks === 0,
      };
    });
}
