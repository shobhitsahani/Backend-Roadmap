import type { ProgressFile, RoadmapSnapshot } from "@/types/roadmap";

export const PROGRESS_FILE_FORMAT = "backend-roadmap-progress";
export const PROGRESS_FILE_VERSION = 2;

export function createProgressFile(
  snapshot: RoadmapSnapshot,
  exportedAt = new Date(),
): ProgressFile {
  return {
    format: PROGRESS_FILE_FORMAT,
    version: PROGRESS_FILE_VERSION,
    exportedAt: exportedAt.toISOString(),
    data: {
      trackSlug: snapshot.track.slug,
      startDate: snapshot.settings.startDate,
      topics: snapshot.phases.flatMap((phase) =>
        phase.topics.map((topic) => ({
          id: topic.id,
          // A mirrored prerequisite has no override of its own. Exporting the
          // mirrored status would silently create one on import.
          status: topic.mirrored ? "not_started" : topic.status,
          notes: topic.notes,
        })),
      ),
      subtopics: snapshot.phases.flatMap((phase) =>
        phase.topics.flatMap((topic) =>
          topic.subtopics.map((subtopic) => ({
            id: subtopic.id,
            done: subtopic.done,
          })),
        ),
      ),
      activity: snapshot.activity.map((entry) => ({
        kind: entry.kind,
        topicId: entry.topicId,
        subtopicId: entry.subtopicId,
        createdAt: entry.createdAt,
      })),
    },
  };
}
