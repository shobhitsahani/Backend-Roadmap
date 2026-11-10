import "server-only";

import { and, asc, desc, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import {
  activity,
  phases,
  resources,
  subtopics,
  topics,
  trackSettings,
  tracks,
  userSubtopicState,
  userTopicState,
} from "@/db/schema";
import { RoadmapError } from "@/lib/errors";
import { getOwnerId } from "@/lib/owner";
import { deriveTopicStatus, roadmapProgress } from "@/lib/progress";
import type {
  Activity,
  PhaseWithTopics,
  ProgressFile,
  RoadmapSnapshot,
  Track,
  TrackSummary,
  Topic,
  TopicStatus,
} from "@/types/roadmap";

function toTrack(row: typeof tracks.$inferSelect): Track {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    summary: row.summary,
    footer: row.footer,
    order: row.order,
    identityHue: row.identityHue,
    sourceTitle: row.sourceTitle,
    sourceUrl: row.sourceUrl,
  };
}

/**
 * One read for the whole app. Content is small (tens of rows), so loading it
 * once and joining in memory keeps the query count flat as tracks are added.
 */
export async function getRoadmapSnapshot(
  trackSlug = "backend",
): Promise<RoadmapSnapshot> {
  const ownerId = getOwnerId();

  const [
    trackRows,
    phaseRows,
    topicRows,
    subtopicRows,
    resourceRows,
    topicStateRows,
    subtopicStateRows,
    settingsRows,
    activityRows,
  ] = await Promise.all([
    db.select().from(tracks).orderBy(asc(tracks.order)),
    db.select().from(phases).orderBy(asc(phases.order)),
    db.select().from(topics).orderBy(asc(topics.order)),
    db.select().from(subtopics).orderBy(asc(subtopics.order)),
    db.select().from(resources),
    db.select().from(userTopicState).where(eq(userTopicState.ownerId, ownerId)),
    db.select().from(userSubtopicState).where(eq(userSubtopicState.ownerId, ownerId)),
    db.select().from(trackSettings).where(eq(trackSettings.ownerId, ownerId)),
    db
      .select()
      .from(activity)
      .where(eq(activity.ownerId, ownerId))
      .orderBy(desc(activity.createdAt)),
  ]);

  const track = trackRows.find((row) => row.slug === trackSlug);
  if (!track) {
    throw new RoadmapError(`Unknown track "${trackSlug}".`, 404, "TRACK_NOT_FOUND");
  }

  const subtopicsByTopic = new Map<string, typeof subtopicRows>();
  for (const subtopic of subtopicRows) {
    const list = subtopicsByTopic.get(subtopic.topicId) ?? [];
    list.push(subtopic);
    subtopicsByTopic.set(subtopic.topicId, list);
  }

  const resourcesByTopic = new Map<string, typeof resourceRows>();
  for (const resource of resourceRows) {
    const list = resourcesByTopic.get(resource.topicId) ?? [];
    list.push(resource);
    resourcesByTopic.set(resource.topicId, list);
  }

  const doneBySubtopic = new Map(
    subtopicStateRows.map((row) => [row.subtopicId, row.done] as const),
  );
  const stateByTopic = new Map(
    topicStateRows.map(
      (row) => [row.topicId, { status: row.status, notes: row.notes }] as const,
    ),
  );

  const derivedStatus = new Map<string, TopicStatus>();
  for (const topic of topicRows) {
    if (topic.linkedTopicId) continue;
    const children = subtopicsByTopic.get(topic.id) ?? [];
    if (children.length > 0) {
      derivedStatus.set(
        topic.id,
        deriveTopicStatus(
          children.map((child) => ({ done: doneBySubtopic.get(child.id) ?? false })),
        ),
      );
    } else {
      derivedStatus.set(topic.id, stateByTopic.get(topic.id)?.status ?? "not_started");
    }
  }

  const resolvedStatus = new Map<string, TopicStatus>();
  const mirrored = new Set<string>();
  for (const topic of topicRows) {
    if (!topic.linkedTopicId) {
      resolvedStatus.set(topic.id, derivedStatus.get(topic.id) ?? "not_started");
      continue;
    }
    const override = stateByTopic.get(topic.id);
    if (override && override.status !== "not_started") {
      resolvedStatus.set(topic.id, override.status);
      continue;
    }
    mirrored.add(topic.id);
    resolvedStatus.set(topic.id, derivedStatus.get(topic.linkedTopicId) ?? "not_started");
  }

  const buildPhases = (trackId: string): PhaseWithTopics[] =>
    phaseRows
      .filter((phase) => phase.trackId === trackId)
      .map((phase) => ({
        id: phase.id,
        trackId: phase.trackId,
        title: phase.title,
        subtitle: phase.subtitle,
        tip: phase.tip,
        order: phase.order,
        topics: topicRows
          .filter((topic) => topic.phaseId === phase.id)
          .map<Topic>((topic) => ({
            id: topic.id,
            phaseId: topic.phaseId,
            title: topic.title,
            summary: topic.summary,
            durationWeeks: topic.durationWeeks,
            order: topic.order,
            tip: topic.tip,
            outcome: topic.outcome,
            flow: topic.flow,
            estimated: topic.estimated,
            linkedTopicId: topic.linkedTopicId,
            status: resolvedStatus.get(topic.id) ?? "not_started",
            notes: stateByTopic.get(topic.id)?.notes ?? "",
            mirrored: mirrored.has(topic.id),
            subtopics: (subtopicsByTopic.get(topic.id) ?? []).map((subtopic) => ({
              id: subtopic.id,
              topicId: subtopic.topicId,
              title: subtopic.title,
              done: doneBySubtopic.get(subtopic.id) ?? false,
              order: subtopic.order,
            })),
            resources: (resourcesByTopic.get(topic.id) ?? []).map((resource) => ({
              id: resource.id,
              topicId: resource.topicId,
              title: resource.title,
              url: resource.url,
            })),
          })),
      }));

  const trackSummaries: TrackSummary[] = trackRows.map((row) => {
    const progress = roadmapProgress(buildPhases(row.id));
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      identityHue: row.identityHue,
      percent: progress.percent,
      completedWeeks: progress.completedWeeks,
      totalWeeks: progress.totalWeeks,
      completedTopics: progress.completedTopics,
      totalTopics: progress.totalTopics,
    };
  });

  const phasesForTrack = buildPhases(track.id);
  const topicIdsInTrack = new Set(
    phasesForTrack.flatMap((phase) => phase.topics.map((topic) => topic.id)),
  );

  const settingsRow = settingsRows.find((row) => row.trackId === track.id);
  const trackActivity: Activity[] = activityRows
    .filter((entry) => entry.topicId !== null && topicIdsInTrack.has(entry.topicId))
    .map((entry) => ({
      id: entry.id,
      kind: entry.kind,
      topicId: entry.topicId,
      subtopicId: entry.subtopicId,
      createdAt: entry.createdAt.toISOString(),
    }));

  return {
    track: toTrack(track),
    tracks: trackSummaries,
    phases: phasesForTrack,
    settings: {
      trackId: track.id,
      startDate: settingsRow?.startDate ?? null,
      updatedAt: (settingsRow?.updatedAt ?? new Date()).toISOString(),
    },
    activity: trackActivity,
  };
}

async function trackSlugForTopic(topicId: string): Promise<string> {
  const [row] = await db
    .select({ slug: tracks.slug })
    .from(topics)
    .innerJoin(phases, eq(topics.phaseId, phases.id))
    .innerJoin(tracks, eq(phases.trackId, tracks.id))
    .where(eq(topics.id, topicId));
  if (!row) {
    throw new RoadmapError("Topic not found.", 404, "NOT_FOUND");
  }
  return row.slug;
}

export async function setSubtopicDone(subtopicId: string, done: boolean) {
  const ownerId = getOwnerId();
  let trackSlug = "backend";

  await db.transaction(async (tx) => {
    const [subtopic] = await tx
      .select()
      .from(subtopics)
      .where(eq(subtopics.id, subtopicId));

    if (!subtopic) {
      throw new RoadmapError("Subtopic not found.", 404, "NOT_FOUND");
    }

    const [topic] = await tx.select().from(topics).where(eq(topics.id, subtopic.topicId));
    if (!topic) {
      throw new RoadmapError("Topic not found.", 404, "NOT_FOUND");
    }

    const [phase] = await tx.select().from(phases).where(eq(phases.id, topic.phaseId));
    const [track] = phase
      ? await tx.select().from(tracks).where(eq(tracks.id, phase.trackId))
      : [];
    if (track) trackSlug = track.slug;

    // Read the previous state before writing so the activity feed can record
    // the real topic transition, not one derived from the new state.
    const topicSubtopics = await tx
      .select({ id: subtopics.id })
      .from(subtopics)
      .where(eq(subtopics.topicId, topic.id));
    const states = await tx
      .select({ subtopicId: userSubtopicState.subtopicId, done: userSubtopicState.done })
      .from(userSubtopicState)
      .where(
        and(
          eq(userSubtopicState.ownerId, ownerId),
          inArray(
            userSubtopicState.subtopicId,
            topicSubtopics.map((child) => child.id),
          ),
        ),
      );
    const doneBefore = new Set(
      states.filter((state) => state.done).map((state) => state.subtopicId),
    );
    const previousStatus = deriveTopicStatus(
      topicSubtopics.map((child) => ({ done: doneBefore.has(child.id) })),
    );

    const doneAfter = new Set(doneBefore);
    if (done) doneAfter.add(subtopicId);
    else doneAfter.delete(subtopicId);
    const nextStatus = deriveTopicStatus(
      topicSubtopics.map((child) => ({ done: doneAfter.has(child.id) })),
    );

    const now = new Date();
    await tx
      .insert(userSubtopicState)
      .values({
        ownerId,
        subtopicId,
        done,
        doneAt: done ? now : null,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [userSubtopicState.ownerId, userSubtopicState.subtopicId],
        set: { done, doneAt: done ? now : null, updatedAt: now },
      });

    await tx
      .insert(userTopicState)
      .values({ ownerId, topicId: topic.id, status: nextStatus, updatedAt: now })
      .onConflictDoUpdate({
        target: [userTopicState.ownerId, userTopicState.topicId],
        set: { status: nextStatus, updatedAt: now },
      });

    const activityRows: Array<{
      ownerId: string;
      kind:
        "subtopic_checked" | "subtopic_unchecked" | "topic_completed" | "topic_reopened";
      topicId: string;
      subtopicId: string | null;
    }> = [
      {
        ownerId,
        kind: done ? "subtopic_checked" : "subtopic_unchecked",
        topicId: topic.id,
        subtopicId: subtopic.id,
      },
    ];

    if (nextStatus === "done" && previousStatus !== "done") {
      activityRows.push({
        ownerId,
        kind: "topic_completed",
        topicId: topic.id,
        subtopicId: null,
      });
    } else if (nextStatus !== "done" && previousStatus === "done") {
      activityRows.push({
        ownerId,
        kind: "topic_reopened",
        topicId: topic.id,
        subtopicId: null,
      });
    }

    await tx.insert(activity).values(activityRows);
  });

  return getRoadmapSnapshot(trackSlug);
}

export async function updateTopicState(
  topicId: string,
  input: { notes?: string; status?: TopicStatus; clearOverride?: boolean },
) {
  const ownerId = getOwnerId();
  const now = new Date();
  const nextStatus = input.clearOverride
    ? "not_started"
    : (input.status ?? "not_started");

  await db
    .insert(userTopicState)
    .values({
      ownerId,
      topicId,
      notes: input.notes ?? "",
      status: nextStatus,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [userTopicState.ownerId, userTopicState.topicId],
      set: {
        ...(input.notes !== undefined ? { notes: input.notes } : {}),
        ...(input.status !== undefined || input.clearOverride
          ? { status: nextStatus }
          : {}),
        updatedAt: now,
      },
    });

  return getRoadmapSnapshot(await trackSlugForTopic(topicId));
}

export async function setStartDate(trackSlug: string, startDate: string | null) {
  const [track] = await db.select().from(tracks).where(eq(tracks.slug, trackSlug));
  if (!track) {
    throw new RoadmapError(`Unknown track "${trackSlug}".`, 404, "TRACK_NOT_FOUND");
  }

  const now = new Date();
  await db
    .insert(trackSettings)
    .values({ ownerId: getOwnerId(), trackId: track.id, startDate, updatedAt: now })
    .onConflictDoUpdate({
      target: [trackSettings.ownerId, trackSettings.trackId],
      set: { startDate, updatedAt: now },
    });

  return getRoadmapSnapshot(track.slug);
}

export async function resetProgress(trackSlug: string) {
  const ownerId = getOwnerId();
  const [track] = await db.select().from(tracks).where(eq(tracks.slug, trackSlug));
  if (!track) {
    throw new RoadmapError(`Unknown track "${trackSlug}".`, 404, "TRACK_NOT_FOUND");
  }

  const phaseRows = await db
    .select({ id: phases.id })
    .from(phases)
    .where(eq(phases.trackId, track.id));
  const topicRows = await db
    .select({ id: topics.id })
    .from(topics)
    .where(
      inArray(
        topics.phaseId,
        phaseRows.map((phase) => phase.id),
      ),
    );
  const subtopicRows = await db
    .select({ id: subtopics.id })
    .from(subtopics)
    .where(
      inArray(
        subtopics.topicId,
        topicRows.map((topic) => topic.id),
      ),
    );

  await db.transaction(async (tx) => {
    if (topicRows.length > 0) {
      await tx.delete(userTopicState).where(
        and(
          eq(userTopicState.ownerId, ownerId),
          inArray(
            userTopicState.topicId,
            topicRows.map((topic) => topic.id),
          ),
        ),
      );
      await tx.delete(activity).where(
        and(
          eq(activity.ownerId, ownerId),
          inArray(
            activity.topicId,
            topicRows.map((topic) => topic.id),
          ),
        ),
      );
    }
    if (subtopicRows.length > 0) {
      await tx.delete(userSubtopicState).where(
        and(
          eq(userSubtopicState.ownerId, ownerId),
          inArray(
            userSubtopicState.subtopicId,
            subtopicRows.map((subtopic) => subtopic.id),
          ),
        ),
      );
    }
    await tx
      .insert(trackSettings)
      .values({ ownerId, trackId: track.id, startDate: null, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: [trackSettings.ownerId, trackSettings.trackId],
        set: { startDate: null, updatedAt: new Date() },
      });
  });

  return getRoadmapSnapshot(track.slug);
}

export async function importProgress(file: ProgressFile["data"]) {
  const ownerId = getOwnerId();
  const [track] = await db.select().from(tracks).where(eq(tracks.slug, file.trackSlug));
  if (!track) {
    throw new RoadmapError(`Unknown track "${file.trackSlug}".`, 404, "TRACK_NOT_FOUND");
  }

  const phaseRows = await db
    .select({ id: phases.id })
    .from(phases)
    .where(eq(phases.trackId, track.id));
  const topicRows = await db
    .select({ id: topics.id, linkedTopicId: topics.linkedTopicId })
    .from(topics)
    .where(
      inArray(
        topics.phaseId,
        phaseRows.map((phase) => phase.id),
      ),
    );
  const subtopicRows = await db
    .select({ id: subtopics.id, topicId: subtopics.topicId })
    .from(subtopics)
    .where(
      inArray(
        subtopics.topicId,
        topicRows.map((topic) => topic.id),
      ),
    );

  const knownTopicIds = new Set(topicRows.map((topic) => topic.id));
  const knownSubtopicIds = new Set(subtopicRows.map((subtopic) => subtopic.id));
  const importedTopicIds = new Set(file.topics.map((topic) => topic.id));
  const importedSubtopicIds = new Set(file.subtopics.map((subtopic) => subtopic.id));

  if (
    importedTopicIds.size !== file.topics.length ||
    [...importedTopicIds].some((id) => !knownTopicIds.has(id))
  ) {
    throw new RoadmapError(
      "The import does not match this track's topic list.",
      400,
      "INVALID_IMPORT",
    );
  }

  if (
    importedSubtopicIds.size !== file.subtopics.length ||
    [...importedSubtopicIds].some((id) => !knownSubtopicIds.has(id))
  ) {
    throw new RoadmapError(
      "The import does not match this track's subtopic list.",
      400,
      "INVALID_IMPORT",
    );
  }

  const topicBySubtopic = new Map(
    subtopicRows.map((row) => [row.id, row.topicId] as const),
  );
  const doneByTopic = new Map<string, boolean[]>();
  for (const topic of topicRows) doneByTopic.set(topic.id, []);
  for (const subtopic of file.subtopics) {
    doneByTopic.get(topicBySubtopic.get(subtopic.id) ?? "")?.push(subtopic.done);
  }

  const now = new Date();
  await db.transaction(async (tx) => {
    for (const subtopic of file.subtopics) {
      await tx
        .insert(userSubtopicState)
        .values({
          ownerId,
          subtopicId: subtopic.id,
          done: subtopic.done,
          doneAt: subtopic.done ? now : null,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: [userSubtopicState.ownerId, userSubtopicState.subtopicId],
          set: {
            done: subtopic.done,
            doneAt: subtopic.done ? now : null,
            updatedAt: now,
          },
        });
    }

    for (const topic of file.topics) {
      const states = doneByTopic.get(topic.id) ?? [];
      const status =
        states.length > 0
          ? deriveTopicStatus(states.map((done) => ({ done })))
          : topic.status;
      await tx
        .insert(userTopicState)
        .values({
          ownerId,
          topicId: topic.id,
          status,
          notes: topic.notes,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: [userTopicState.ownerId, userTopicState.topicId],
          set: { status, notes: topic.notes, updatedAt: now },
        });
    }

    if (topicRows.length > 0) {
      await tx.delete(activity).where(
        and(
          eq(activity.ownerId, ownerId),
          inArray(
            activity.topicId,
            topicRows.map((topic) => topic.id),
          ),
        ),
      );
    }
    if (file.activity.length > 0) {
      await tx.insert(activity).values(
        file.activity.map((entry) => ({
          ownerId,
          kind: entry.kind,
          topicId: entry.topicId,
          subtopicId: entry.subtopicId,
          createdAt: new Date(entry.createdAt),
        })),
      );
    }

    await tx
      .insert(trackSettings)
      .values({ ownerId, trackId: track.id, startDate: file.startDate, updatedAt: now })
      .onConflictDoUpdate({
        target: [trackSettings.ownerId, trackSettings.trackId],
        set: { startDate: file.startDate, updatedAt: now },
      });
  });

  return getRoadmapSnapshot(track.slug);
}
