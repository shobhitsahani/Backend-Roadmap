import "server-only";

import { asc, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { activity, phases, resources, settings, subtopics, topics } from "@/db/schema";
import { RoadmapError } from "@/lib/errors";
import { deriveTopicStatus } from "@/lib/progress";
import type { ProgressFile, RoadmapSnapshot } from "@/types/roadmap";

export async function getRoadmapSnapshot(): Promise<RoadmapSnapshot> {
  const [phaseRows, topicRows, subtopicRows, resourceRows, settingRows, activityRows] =
    await Promise.all([
      db.select().from(phases).orderBy(asc(phases.order)),
      db.select().from(topics).orderBy(asc(topics.order)),
      db.select().from(subtopics).orderBy(asc(subtopics.order)),
      db.select().from(resources),
      db.select().from(settings).where(eq(settings.id, "singleton")),
      db.select().from(activity).orderBy(desc(activity.createdAt)),
    ]);

  const subtopicsByTopic = new Map<string, typeof subtopicRows>();
  for (const subtopic of subtopicRows) {
    const current = subtopicsByTopic.get(subtopic.topicId) ?? [];
    current.push(subtopic);
    subtopicsByTopic.set(subtopic.topicId, current);
  }

  const resourcesByTopic = new Map<string, typeof resourceRows>();
  for (const resource of resourceRows) {
    const current = resourcesByTopic.get(resource.topicId) ?? [];
    current.push(resource);
    resourcesByTopic.set(resource.topicId, current);
  }

  const topicsByPhase = new Map<string, typeof topicRows>();
  for (const topic of topicRows) {
    const current = topicsByPhase.get(topic.phaseId) ?? [];
    current.push(topic);
    topicsByPhase.set(topic.phaseId, current);
  }

  const setting = settingRows[0];

  return {
    phases: phaseRows.map((phase) => ({
      id: phase.id,
      title: phase.title,
      subtitle: phase.subtitle,
      order: phase.order,
      topics: (topicsByPhase.get(phase.id) ?? []).map((topic) => ({
        id: topic.id,
        phaseId: topic.phaseId,
        title: topic.title,
        summary: topic.summary,
        durationWeeks: topic.durationWeeks,
        order: topic.order,
        tip: topic.tip,
        outcome: topic.outcome,
        flow: topic.flow,
        status: topic.status,
        notes: topic.notes,
        subtopics: (subtopicsByTopic.get(topic.id) ?? []).map((subtopic) => ({
          id: subtopic.id,
          topicId: subtopic.topicId,
          title: subtopic.title,
          done: subtopic.done,
          order: subtopic.order,
        })),
        resources: (resourcesByTopic.get(topic.id) ?? []).map((resource) => ({
          id: resource.id,
          topicId: resource.topicId,
          title: resource.title,
          url: resource.url,
        })),
      })),
    })),
    settings: {
      id: "singleton",
      startDate: setting?.startDate ?? null,
      updatedAt: (setting?.updatedAt ?? new Date()).toISOString(),
    },
    activity: activityRows.map((entry) => ({
      id: entry.id,
      kind: entry.kind,
      topicId: entry.topicId,
      subtopicId: entry.subtopicId,
      createdAt: entry.createdAt.toISOString(),
    })),
  };
}

export async function setSubtopicDone(subtopicId: string, done: boolean) {
  await db.transaction(async (tx) => {
    const [subtopic] = await tx
      .select()
      .from(subtopics)
      .where(eq(subtopics.id, subtopicId));

    if (!subtopic) {
      throw new RoadmapError("Subtopic not found.", 404, "NOT_FOUND");
    }

    if (subtopic.done === done) return;

    await tx.update(subtopics).set({ done }).where(eq(subtopics.id, subtopicId));

    const topicSubtopics = await tx
      .select()
      .from(subtopics)
      .where(eq(subtopics.topicId, subtopic.topicId))
      .orderBy(asc(subtopics.order));

    const [topic] = await tx.select().from(topics).where(eq(topics.id, subtopic.topicId));

    if (!topic) {
      throw new RoadmapError("Topic not found.", 404, "NOT_FOUND");
    }

    const nextStatus = deriveTopicStatus(topicSubtopics);
    if (nextStatus !== topic.status) {
      await tx.update(topics).set({ status: nextStatus }).where(eq(topics.id, topic.id));
    }

    const activityRows: Array<{
      kind:
        "subtopic_checked" | "subtopic_unchecked" | "topic_completed" | "topic_reopened";
      topicId: string;
      subtopicId: string | null;
    }> = [
      {
        kind: done ? "subtopic_checked" : "subtopic_unchecked",
        topicId: topic.id,
        subtopicId: subtopic.id,
      },
    ];

    if (nextStatus === "done" && topic.status !== "done") {
      activityRows.push({
        kind: "topic_completed",
        topicId: topic.id,
        subtopicId: null,
      });
    } else if (nextStatus !== "done" && topic.status === "done") {
      activityRows.push({
        kind: "topic_reopened",
        topicId: topic.id,
        subtopicId: null,
      });
    }

    await tx.insert(activity).values(activityRows);
  });

  return getRoadmapSnapshot();
}

export async function setTopicNotes(topicId: string, notes: string) {
  const updated = await db
    .update(topics)
    .set({ notes })
    .where(eq(topics.id, topicId))
    .returning({ id: topics.id });

  if (updated.length === 0) {
    throw new RoadmapError("Topic not found.", 404, "NOT_FOUND");
  }

  return getRoadmapSnapshot();
}

export async function setStartDate(startDate: string | null) {
  const now = new Date();
  await db
    .insert(settings)
    .values({ id: "singleton", startDate, updatedAt: now })
    .onConflictDoUpdate({
      target: settings.id,
      set: { startDate, updatedAt: now },
    });

  return getRoadmapSnapshot();
}

export async function resetProgress() {
  await db.transaction(async (tx) => {
    await tx.update(subtopics).set({ done: false });
    await tx.update(topics).set({ status: "not_started", notes: "" });
    await tx.delete(activity);
    await tx
      .insert(settings)
      .values({ id: "singleton", startDate: null, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: settings.id,
        set: { startDate: null, updatedAt: new Date() },
      });
  });

  return getRoadmapSnapshot();
}

export async function importProgress(file: ProgressFile["data"]) {
  const [topicRows, subtopicRows] = await Promise.all([
    db.select({ id: topics.id }).from(topics),
    db.select({ id: subtopics.id, topicId: subtopics.topicId }).from(subtopics),
  ]);

  const knownTopicIds = new Set(topicRows.map((topic) => topic.id));
  const knownSubtopicIds = new Set(subtopicRows.map((subtopic) => subtopic.id));

  const importedTopicIds = new Set(file.topics.map((topic) => topic.id));
  const importedSubtopicIds = new Set(file.subtopics.map((subtopic) => subtopic.id));

  if (
    importedTopicIds.size !== knownTopicIds.size ||
    importedTopicIds.size !== file.topics.length ||
    [...importedTopicIds].some((id) => !knownTopicIds.has(id))
  ) {
    throw new RoadmapError(
      "The import does not match this roadmap's topic list.",
      400,
      "INVALID_IMPORT",
    );
  }

  if (
    importedSubtopicIds.size !== knownSubtopicIds.size ||
    importedSubtopicIds.size !== file.subtopics.length ||
    [...importedSubtopicIds].some((id) => !knownSubtopicIds.has(id))
  ) {
    throw new RoadmapError(
      "The import does not match this roadmap's subtopic list.",
      400,
      "INVALID_IMPORT",
    );
  }

  for (const entry of file.activity) {
    if (entry.topicId !== null && !knownTopicIds.has(entry.topicId)) {
      throw new RoadmapError(
        "The import references an unknown topic in its activity log.",
        400,
        "INVALID_IMPORT",
      );
    }
    if (entry.subtopicId !== null && !knownSubtopicIds.has(entry.subtopicId)) {
      throw new RoadmapError(
        "The import references an unknown subtopic in its activity log.",
        400,
        "INVALID_IMPORT",
      );
    }
  }

  const doneByTopic = new Map<string, boolean[]>();
  for (const subtopic of subtopicRows) {
    doneByTopic.set(subtopic.topicId, []);
  }
  const topicBySubtopic = new Map(
    subtopicRows.map((subtopic) => [subtopic.id, subtopic.topicId]),
  );
  for (const subtopic of file.subtopics) {
    const topicId = topicBySubtopic.get(subtopic.id);
    doneByTopic.get(topicId ?? "")?.push(subtopic.done);
  }

  const notesByTopic = new Map(file.topics.map((topic) => [topic.id, topic.notes]));
  const importedStatus = new Map(file.topics.map((topic) => [topic.id, topic.status]));

  await db.transaction(async (tx) => {
    for (const subtopic of file.subtopics) {
      await tx
        .update(subtopics)
        .set({ done: subtopic.done })
        .where(eq(subtopics.id, subtopic.id));
    }

    for (const topic of topicRows) {
      const states = doneByTopic.get(topic.id) ?? [];
      const nextStatus =
        states.length > 0
          ? deriveTopicStatus(states.map((done) => ({ done })))
          : (importedStatus.get(topic.id) ?? "not_started");
      await tx
        .update(topics)
        .set({
          notes: notesByTopic.get(topic.id) ?? "",
          status: nextStatus,
        })
        .where(eq(topics.id, topic.id));
    }

    await tx.delete(activity);
    if (file.activity.length > 0) {
      await tx.insert(activity).values(
        file.activity.map((entry) => ({
          kind: entry.kind,
          topicId: entry.topicId,
          subtopicId: entry.subtopicId,
          createdAt: new Date(entry.createdAt),
        })),
      );
    }

    const now = new Date();
    await tx
      .insert(settings)
      .values({ id: "singleton", startDate: file.startDate, updatedAt: now })
      .onConflictDoUpdate({
        target: settings.id,
        set: { startDate: file.startDate, updatedAt: now },
      });
  });

  return getRoadmapSnapshot();
}
