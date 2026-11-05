import type {
  Activity,
  PhaseWithTopics,
  Subtopic,
  Topic,
  TopicStatus,
} from "@/types/roadmap";

export type ProgressStats = {
  completedSubtopics: number;
  totalSubtopics: number;
  completedTopics: number;
  totalTopics: number;
  completedWeeks: number;
  totalWeeks: number;
  percent: number;
};

export function deriveTopicStatus(
  subtopics: ReadonlyArray<Pick<Subtopic, "done">>,
): TopicStatus {
  if (subtopics.length === 0) return "not_started";
  const done = subtopics.filter((subtopic) => subtopic.done).length;
  if (done === 0) return "not_started";
  if (done === subtopics.length) return "done";
  return "in_progress";
}

export function topicProgress(topic: Topic) {
  const totalSubtopics = topic.subtopics.length;
  const completedSubtopics = topic.subtopics.filter((subtopic) => subtopic.done).length;
  const percent =
    totalSubtopics === 0
      ? topic.status === "done"
        ? 100
        : 0
      : (completedSubtopics / totalSubtopics) * 100;
  const completedWeeks = (topic.durationWeeks * percent) / 100;

  return {
    completedSubtopics,
    totalSubtopics,
    percent,
    completedWeeks,
  };
}

export function phaseProgress(phase: PhaseWithTopics): ProgressStats {
  const totals = phase.topics.reduce(
    (accumulator, topic) => {
      const progress = topicProgress(topic);
      return {
        completedSubtopics: accumulator.completedSubtopics + progress.completedSubtopics,
        totalSubtopics: accumulator.totalSubtopics + progress.totalSubtopics,
        completedTopics: accumulator.completedTopics + (topic.status === "done" ? 1 : 0),
        totalTopics: accumulator.totalTopics + 1,
        completedWeeks: accumulator.completedWeeks + progress.completedWeeks,
        totalWeeks: accumulator.totalWeeks + topic.durationWeeks,
      };
    },
    {
      completedSubtopics: 0,
      totalSubtopics: 0,
      completedTopics: 0,
      totalTopics: 0,
      completedWeeks: 0,
      totalWeeks: 0,
    },
  );

  return {
    ...totals,
    percent:
      totals.totalWeeks === 0 ? 0 : (totals.completedWeeks / totals.totalWeeks) * 100,
  };
}

export function roadmapProgress(phases: PhaseWithTopics[]): ProgressStats {
  const totals = phases.reduce(
    (accumulator, phase) => {
      const progress = phaseProgress(phase);
      return {
        completedSubtopics: accumulator.completedSubtopics + progress.completedSubtopics,
        totalSubtopics: accumulator.totalSubtopics + progress.totalSubtopics,
        completedTopics: accumulator.completedTopics + progress.completedTopics,
        totalTopics: accumulator.totalTopics + progress.totalTopics,
        completedWeeks: accumulator.completedWeeks + progress.completedWeeks,
        totalWeeks: accumulator.totalWeeks + progress.totalWeeks,
      };
    },
    {
      completedSubtopics: 0,
      totalSubtopics: 0,
      completedTopics: 0,
      totalTopics: 0,
      completedWeeks: 0,
      totalWeeks: 0,
    },
  );

  return {
    ...totals,
    percent:
      totals.totalWeeks === 0 ? 0 : (totals.completedWeeks / totals.totalWeeks) * 100,
  };
}

export function flattenTopics(phases: PhaseWithTopics[]) {
  return phases.flatMap((phase) => phase.topics.map((topic) => ({ ...topic, phase })));
}

export function findTopic(phases: PhaseWithTopics[], topicId: string) {
  for (const phase of phases) {
    const topic = phase.topics.find((candidate) => candidate.id === topicId);
    if (topic) return { topic, phase };
  }
  return null;
}

export function currentTopic(phases: PhaseWithTopics[]) {
  for (const phase of phases) {
    const topic = phase.topics.find((candidate) => candidate.status !== "done");
    if (topic) return { topic, phase };
  }
  return null;
}

export function isComplete(phases: PhaseWithTopics[]) {
  return phases.every((phase) => phase.topics.every((topic) => topic.status === "done"));
}

export function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function localDayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function activityDayKeys(activity: Activity[]) {
  return new Set(activity.map((entry) => localDayKey(new Date(entry.createdAt))));
}

export function calculateStreak(activity: Activity[], now = new Date()) {
  const activeDays = activityDayKeys(activity);
  const today = startOfLocalDay(now);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let cursor: Date;
  if (activeDays.has(localDayKey(today))) {
    cursor = today;
  } else if (activeDays.has(localDayKey(yesterday))) {
    cursor = yesterday;
  } else {
    return 0;
  }

  let streak = 0;
  while (activeDays.has(localDayKey(cursor))) {
    streak += 1;
    cursor = new Date(cursor);
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export type HeatmapDay = {
  date: string;
  label: string;
  count: number;
  level: 0 | 1 | 2 | 3;
};

export function buildHeatmap(activity: Activity[], now = new Date(), weeks = 12) {
  const today = startOfLocalDay(now);
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  monday.setDate(monday.getDate() - (weeks - 1) * 7);

  const counts = new Map<string, number>();
  for (const entry of activity) {
    const key = localDayKey(new Date(entry.createdAt));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const days: HeatmapDay[] = [];
  for (let index = 0; index < weeks * 7; index += 1) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const dateKey = localDayKey(date);
    const count = date > today ? 0 : (counts.get(dateKey) ?? 0);
    const level: HeatmapDay["level"] =
      count === 0 ? 0 : count < 2 ? 1 : count < 4 ? 2 : 3;
    days.push({
      date: dateKey,
      label: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count,
      level,
    });
  }
  return days;
}
