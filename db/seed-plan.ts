import { trackContents } from "@/content/tracks";
import type { phases, resources, subtopics, topics, tracks } from "@/db/schema";

export type SeedRows = {
  trackRows: (typeof tracks.$inferInsert)[];
  phaseRows: (typeof phases.$inferInsert)[];
  topicRows: (typeof topics.$inferInsert)[];
  subtopicRows: (typeof subtopics.$inferInsert)[];
  resourceRows: (typeof resources.$inferInsert)[];
};

/**
 * Pure content-to-row mapping. The seed script only upserts these rows by id,
 * so running it again updates copy and never touches progress tables.
 */
export function buildSeedRows(): SeedRows {
  const trackRows: SeedRows["trackRows"] = [];
  const phaseRows: SeedRows["phaseRows"] = [];
  const topicRows: SeedRows["topicRows"] = [];
  const subtopicRows: SeedRows["subtopicRows"] = [];
  const resourceRows: SeedRows["resourceRows"] = [];

  for (const track of trackContents) {
    trackRows.push({
      id: track.id,
      slug: track.slug,
      title: track.title,
      subtitle: track.subtitle,
      summary: track.summary,
      footer: track.footer,
      order: track.order,
      identityHue: track.identityHue,
      sourceTitle: track.sourceTitle,
      sourceUrl: track.sourceUrl,
    });

    for (const phase of track.phases) {
      phaseRows.push({
        id: phase.id,
        trackId: track.id,
        title: phase.title,
        subtitle: phase.subtitle,
        tip: phase.tip,
        order: phase.order,
      });

      for (const topic of phase.topics) {
        topicRows.push({
          id: topic.id,
          phaseId: phase.id,
          title: topic.title,
          summary: topic.summary,
          durationWeeks: topic.durationWeeks,
          order: topic.order,
          tip: topic.tip,
          outcome: topic.outcome,
          flow: topic.flow,
          estimated: topic.estimated,
          linkedTopicId: topic.linkedTopicId,
          honestyNote: topic.honestyNote,
        });

        for (const subtopic of topic.subtopics) {
          subtopicRows.push({
            id: subtopic.id,
            topicId: topic.id,
            title: subtopic.title,
            order: subtopic.order,
          });
        }

        for (const resource of topic.resources) {
          resourceRows.push({
            id: resource.id,
            topicId: topic.id,
            title: resource.title,
            url: resource.url,
          });
        }
      }
    }
  }

  return { trackRows, phaseRows, topicRows, subtopicRows, resourceRows };
}
