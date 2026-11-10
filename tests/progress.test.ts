import { describe, expect, it } from "vitest";

import { createProgressFile } from "@/lib/progress-file";
import {
  buildHeatmap,
  calculateStreak,
  currentTopic,
  deriveTopicStatus,
  phaseProgress,
  roadmapProgress,
  topicProgress,
} from "@/lib/progress";
import { buildTimeline, getElapsedWeeks } from "@/lib/timeline";
import type {
  Activity,
  PhaseWithTopics,
  Subtopic,
  Topic,
  TopicStatus,
} from "@/types/roadmap";
import { progressFileSchema } from "@/types/roadmap";

function subtopic(id: string, topicId: string, done: boolean, order: number): Subtopic {
  return { id, topicId, title: `Subtopic ${order}`, done, order };
}

function topic({
  id,
  phaseId,
  order,
  durationWeeks,
  status,
  done = 0,
  total = 2,
}: {
  id: string;
  phaseId: string;
  order: number;
  durationWeeks: number;
  status: TopicStatus;
  done?: number;
  total?: number;
}): Topic {
  return {
    id,
    phaseId,
    title: `Topic ${id}`,
    summary: "",
    durationWeeks,
    order,
    tip: "",
    outcome: null,
    flow: null,
    estimated: false,
    linkedTopicId: null,
    honestyNote: null,
    status,
    notes: "",
    mirrored: false,
    subtopics: Array.from({ length: total }, (_, index) =>
      subtopic(`${id}-${index + 1}`, id, index < done, index + 1),
    ),
    resources: [],
  };
}

function phase(id: string, order: number, topics: Topic[]): PhaseWithTopics {
  return {
    id,
    trackId: "backend",
    title: `Phase ${order}`,
    subtitle: "",
    tip: "",
    order,
    topics,
  };
}

const foundation = phase("foundation", 1, [
  topic({
    id: "language",
    phaseId: "foundation",
    order: 1,
    durationWeeks: 4,
    status: "in_progress",
    done: 1,
    total: 2,
  }),
  topic({
    id: "web",
    phaseId: "foundation",
    order: 2,
    durationWeeks: 3,
    status: "not_started",
    total: 1,
  }),
]);

const core = phase("core", 2, [
  topic({
    id: "apis",
    phaseId: "core",
    order: 1,
    durationWeeks: 3,
    status: "done",
    done: 2,
    total: 2,
  }),
]);

describe("deriveTopicStatus", () => {
  it("maps subtopic state to a topic status", () => {
    expect(deriveTopicStatus([])).toBe("not_started");
    expect(deriveTopicStatus([{ done: false }, { done: false }])).toBe("not_started");
    expect(deriveTopicStatus([{ done: true }, { done: false }])).toBe("in_progress");
    expect(deriveTopicStatus([{ done: true }, { done: true }])).toBe("done");
  });
});

describe("progress", () => {
  it("weights topic progress by duration", () => {
    const progress = topicProgress(foundation.topics[0]!);
    expect(progress.completedSubtopics).toBe(1);
    expect(progress.totalSubtopics).toBe(2);
    expect(progress.percent).toBe(50);
    expect(progress.completedWeeks).toBe(2);
  });

  it("aggregates a phase from real week weights", () => {
    const progress = phaseProgress(foundation);
    expect(progress.totalWeeks).toBe(7);
    expect(progress.completedWeeks).toBe(2);
    expect(progress.percent).toBeCloseTo(28.571, 2);
    expect(progress.completedTopics).toBe(0);
    expect(progress.totalTopics).toBe(2);
  });

  it("aggregates the roadmap and ignores empty phases safely", () => {
    const progress = roadmapProgress([foundation, core]);
    expect(progress.totalWeeks).toBe(10);
    expect(progress.completedWeeks).toBe(5);
    expect(progress.percent).toBe(50);
    expect(progress.completedTopics).toBe(1);
    expect(progress.totalTopics).toBe(3);
  });

  it("falls back to topic completion for zero-week prerequisite phases", () => {
    const prerequisite = phase("prerequisite", 1, [
      topic({
        id: "apis-prereq",
        phaseId: "prerequisite",
        order: 1,
        durationWeeks: 0,
        status: "done",
        total: 0,
      }),
      topic({
        id: "db-prereq",
        phaseId: "prerequisite",
        order: 2,
        durationWeeks: 0,
        status: "not_started",
        total: 0,
      }),
    ]);
    const progress = phaseProgress(prerequisite);
    expect(progress.totalWeeks).toBe(0);
    expect(progress.percent).toBe(50);
    expect(progress.completedTopics).toBe(1);
    expect(progress.totalTopics).toBe(2);
  });

  it("finds the next unfinished topic in order", () => {
    expect(currentTopic([foundation, core])?.topic.id).toBe("language");
    const complete = phase("complete", 1, [
      topic({
        id: "done",
        phaseId: "complete",
        order: 1,
        durationWeeks: 1,
        status: "done",
        total: 1,
        done: 1,
      }),
    ]);
    expect(currentTopic([complete])).toBeNull();
  });
});

function activityOn(date: Date, index: number): Activity {
  return {
    id: index,
    kind: "subtopic_checked",
    topicId: "language",
    subtopicId: "language-1",
    createdAt: date.toISOString(),
  };
}

describe("streak", () => {
  const now = new Date(2026, 10, 5, 18);
  const daysAgo = (days: number) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days);
    return date;
  };

  it("counts consecutive days including today", () => {
    const activity = [
      activityOn(daysAgo(0), 1),
      activityOn(daysAgo(1), 2),
      activityOn(daysAgo(2), 3),
      activityOn(daysAgo(4), 4),
    ];
    expect(calculateStreak(activity, now)).toBe(3);
  });

  it("keeps a streak alive when today has no activity yet", () => {
    const activity = [activityOn(daysAgo(1), 1), activityOn(daysAgo(2), 2)];
    expect(calculateStreak(activity, now)).toBe(2);
  });

  it("returns zero after a missed day", () => {
    expect(calculateStreak([activityOn(daysAgo(2), 1)], now)).toBe(0);
  });

  it("builds an aligned 12-week heatmap", () => {
    const days = buildHeatmap([activityOn(daysAgo(0), 1)], now);
    expect(days).toHaveLength(84);
    expect(days.at(-1)?.date).toBe("2026-11-08");
    const today = days.find((day) => day.date === "2026-11-05");
    expect(today?.count).toBe(1);
    expect(today?.level).toBe(1);
  });
});

describe("timeline", () => {
  const startDate = "2026-01-01";

  it("computes elapsed weeks from a local start date", () => {
    expect(getElapsedWeeks(startDate, new Date(2026, 0, 15))).toBe(2);
    expect(getElapsedWeeks(null, new Date(2026, 0, 15))).toBeNull();
  });

  it("marks active and upcoming topics without a start date", () => {
    const timeline = buildTimeline([foundation, core], null, new Date(2026, 0, 15));
    expect(timeline.planStatus).toBe("unset");
    expect(timeline.entries.map((entry) => entry.status)).toEqual([
      "active",
      "upcoming",
      "complete",
    ]);
    expect(timeline.entries[0]!.startWeek).toBe(1);
    expect(timeline.entries[0]!.endWeek).toBe(4);
    expect(timeline.entries[1]!.startWeek).toBe(5);
    expect(timeline.totalWeeks).toBe(10);
  });

  it("skips zero-week prerequisite phases on the week ruler", () => {
    const prerequisite = phase("prerequisite", 1, [
      topic({
        id: "prereq",
        phaseId: "prerequisite",
        order: 1,
        durationWeeks: 0,
        status: "done",
        total: 0,
      }),
    ]);
    const timeline = buildTimeline(
      [prerequisite, foundation],
      null,
      new Date(2026, 0, 15),
    );
    expect(timeline.totalWeeks).toBe(7);
    expect(timeline.entries.map((entry) => entry.topic.id)).toEqual(["language", "web"]);
    expect(timeline.phases.map((entry) => entry.phase.id)).toEqual(["foundation"]);
    expect(timeline.entries[0]!.startWeek).toBe(1);
  });

  it("marks the plan behind when elapsed weeks exceed completed weeks", () => {
    const timeline = buildTimeline([foundation], startDate, new Date(2026, 1, 1));
    expect(timeline.planStatus).toBe("behind");
    expect(timeline.entries[0]!.status).toBe("behind");
    expect(timeline.currentWeek).toBe(5);
  });

  it("keeps a matched plan on track", () => {
    const onTrack = phase("on-track", 1, [
      topic({
        id: "first",
        phaseId: "on-track",
        order: 1,
        durationWeeks: 4,
        status: "done",
        done: 2,
        total: 2,
      }),
      topic({
        id: "second",
        phaseId: "on-track",
        order: 2,
        durationWeeks: 4,
        status: "in_progress",
        done: 1,
        total: 2,
      }),
    ]);
    const timeline = buildTimeline([onTrack], startDate, new Date(2026, 0, 30));
    expect(timeline.planStatus).toBe("on_track");
    expect(timeline.entries[1]!.status).toBe("active");
  });

  it("reports before-start and completion states", () => {
    const before = buildTimeline([foundation], "2026-02-01", new Date(2026, 0, 15));
    expect(before.planStatus).toBe("not_started");
    expect(before.currentWeek).toBeNull();

    const completeTopic = phase("complete", 1, [
      topic({
        id: "complete",
        phaseId: "complete",
        order: 1,
        durationWeeks: 4,
        status: "done",
        done: 2,
        total: 2,
      }),
    ]);
    const complete = buildTimeline([completeTopic], "2026-01-01", new Date(2026, 0, 15));
    expect(complete.planStatus).toBe("complete");
    expect(complete.entries[0]!.status).toBe("complete");
  });
});

describe("progress file", () => {
  it("round-trips the editable state through the import schema", () => {
    const snapshot = {
      track: {
        id: "backend",
        slug: "backend",
        title: "Backend Engineer",
        subtitle: "36 weeks",
        summary: "",
        footer: null,
        order: 1,
        identityHue: 150,
        sourceTitle: null,
        sourceUrl: null,
      },
      tracks: [],
      phases: [foundation, core],
      settings: {
        trackId: "backend",
        startDate: "2026-01-01",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
      activity: [activityOn(new Date(2026, 10, 5), 1)],
    };
    const file = createProgressFile(snapshot, new Date("2026-11-05T00:00:00.000Z"));
    expect(progressFileSchema.safeParse(file).success).toBe(true);
    expect(file.version).toBe(2);
    expect(file.data.trackSlug).toBe("backend");
    expect(file.data.topics).toHaveLength(3);
    expect(file.data.subtopics).toHaveLength(5);
    expect(file.data.activity).toHaveLength(1);
    expect(file.data.topics[0]!.notes).toBe("");
  });

  it("does not export a mirrored prerequisite status as an override", () => {
    const mirroredPhase = phase("prereq", 1, [
      {
        ...topic({
          id: "ai-apis",
          phaseId: "prereq",
          order: 1,
          durationWeeks: 0,
          status: "done",
          total: 0,
        }),
        linkedTopicId: "apis",
        mirrored: true,
      },
    ]);
    const snapshot = {
      track: {
        id: "ai-engineer",
        slug: "ai-engineer",
        title: "AI Engineer",
        subtitle: "28 weeks",
        summary: "",
        footer: null,
        order: 2,
        identityHue: 62,
        sourceTitle: null,
        sourceUrl: null,
      },
      tracks: [],
      phases: [mirroredPhase],
      settings: {
        trackId: "ai-engineer",
        startDate: null,
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
      activity: [],
    };
    const file = createProgressFile(snapshot, new Date("2026-11-05T00:00:00.000Z"));
    expect(file.data.trackSlug).toBe("ai-engineer");
    expect(file.data.topics[0]!.status).toBe("not_started");
  });
});
