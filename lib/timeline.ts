import {
  flattenTopics,
  isComplete,
  phaseProgress,
  roadmapProgress,
  startOfLocalDay,
  topicProgress,
} from "@/lib/progress";
import type { PhaseWithTopics, Topic } from "@/types/roadmap";

export type PlanStatus = "unset" | "not_started" | "on_track" | "behind" | "complete";
export type TopicTimelineStatus = "complete" | "active" | "upcoming" | "behind";

export type TimelineEntry = {
  topic: Topic;
  phase: PhaseWithTopics;
  startWeek: number;
  endWeek: number;
  progress: ReturnType<typeof topicProgress>;
  status: TopicTimelineStatus;
};

export type PhaseTimeline = {
  phase: PhaseWithTopics;
  startWeek: number;
  endWeek: number;
  progress: ReturnType<typeof phaseProgress>;
};

const DAY_MS = 86_400_000;

export function totalPlanWeeks(phases: PhaseWithTopics[]) {
  return phases.reduce(
    (total, phase) =>
      total + phase.topics.reduce((sum, topic) => sum + topic.durationWeeks, 0),
    0,
  );
}

export function parseLocalDate(value: string) {
  const [year = 1970, month = 1, day = 1] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getElapsedWeeks(startDate: string | null, now = new Date()) {
  if (!startDate) return null;
  const start = startOfLocalDay(parseLocalDate(startDate));
  const end = startOfLocalDay(now);
  return (end.getTime() - start.getTime()) / (DAY_MS * 7);
}

export function getExpectedWeek(
  startDate: string | null,
  now = new Date(),
  totalWeeks = Number.POSITIVE_INFINITY,
) {
  const elapsed = getElapsedWeeks(startDate, now);
  if (elapsed === null) return null;
  return Math.min(totalWeeks, Math.max(0, elapsed));
}

export function getCurrentWeek(
  startDate: string | null,
  now = new Date(),
  totalWeeks = Number.POSITIVE_INFINITY,
) {
  const elapsed = getElapsedWeeks(startDate, now);
  if (elapsed === null || elapsed < 0) return null;
  return Math.min(totalWeeks, Math.floor(elapsed) + 1);
}

export function buildTimeline(
  phases: PhaseWithTopics[],
  startDate: string | null,
  now = new Date(),
) {
  const totalWeeks = totalPlanWeeks(phases);
  const elapsed = getElapsedWeeks(startDate, now);
  const expectedWeek = getExpectedWeek(startDate, now, totalWeeks);
  const currentWeek = getCurrentWeek(startDate, now, totalWeeks);
  const overall = roadmapProgress(phases);
  const complete = isComplete(phases);
  // Zero-week phases are prerequisites, not calendar time. They stay in
  // progress totals but never occupy a week on the ruler.
  const timedPhases = phases.filter((phase) =>
    phase.topics.some((topic) => topic.durationWeeks > 0),
  );
  const flatTopics = flattenTopics(timedPhases).filter(
    (entry) => entry.durationWeeks > 0,
  );
  const currentIndex = flatTopics.findIndex((entry) => entry.status !== "done");

  let planStatus: PlanStatus;
  if (startDate === null) {
    planStatus = "unset";
  } else if (complete) {
    planStatus = "complete";
  } else if (elapsed === null || elapsed < 0) {
    planStatus = "not_started";
  } else if (overall.completedWeeks + 0.5 < elapsed) {
    planStatus = "behind";
  } else {
    planStatus = "on_track";
  }

  const entries: TimelineEntry[] = [];
  const phaseTimeline: PhaseTimeline[] = [];
  let weekCursor = 1;
  let flatIndex = 0;

  for (const phase of timedPhases) {
    const phaseStart = weekCursor;
    for (const topic of phase.topics) {
      if (topic.durationWeeks === 0) continue;
      const startWeek = weekCursor;
      const endWeek = weekCursor + topic.durationWeeks - 1;
      let status: TopicTimelineStatus;

      if (topic.status === "done") {
        status = "complete";
      } else if (startDate === null) {
        status = flatIndex === currentIndex ? "active" : "upcoming";
      } else if (elapsed !== null && elapsed > endWeek) {
        status = "behind";
      } else if (
        currentWeek !== null &&
        currentWeek >= startWeek &&
        currentWeek <= endWeek
      ) {
        status = "active";
      } else {
        status = "upcoming";
      }

      entries.push({
        topic,
        phase,
        startWeek,
        endWeek,
        progress: topicProgress(topic),
        status,
      });

      weekCursor += topic.durationWeeks;
      flatIndex += 1;
    }
    phaseTimeline.push({
      phase,
      startWeek: phaseStart,
      endWeek: weekCursor - 1,
      progress: phaseProgress(phase),
    });
  }

  return {
    entries,
    phases: phaseTimeline,
    expectedWeek,
    currentWeek,
    elapsedWeeks: elapsed,
    totalWeeks,
    overall,
    planStatus,
  };
}
