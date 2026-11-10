import "dotenv/config";

import { eq } from "drizzle-orm";

import { db } from "./index";
import { phases, resources, subtopics, topics, tracks } from "./schema";
import { buildSeedRows } from "./seed-plan";

async function seed() {
  const { trackRows, phaseRows, topicRows, subtopicRows, resourceRows } = buildSeedRows();

  await db.transaction(async (tx) => {
    for (const track of trackRows) {
      await tx
        .insert(tracks)
        .values(track)
        .onConflictDoUpdate({
          target: tracks.id,
          set: {
            slug: track.slug,
            title: track.title,
            subtitle: track.subtitle,
            summary: track.summary,
            footer: track.footer,
            order: track.order,
            identityHue: track.identityHue,
            sourceTitle: track.sourceTitle,
            sourceUrl: track.sourceUrl,
          },
        });
    }

    for (const phase of phaseRows) {
      await tx
        .insert(phases)
        .values(phase)
        .onConflictDoUpdate({
          target: phases.id,
          set: {
            trackId: phase.trackId,
            title: phase.title,
            subtitle: phase.subtitle,
            tip: phase.tip,
            order: phase.order,
          },
        });
    }

    // First pass writes content fields without the self-reference, so a linked
    // topic can point at a row that is inserted later in the same transaction.
    for (const topic of topicRows) {
      await tx
        .insert(topics)
        .values({ ...topic, linkedTopicId: null })
        .onConflictDoUpdate({
          target: topics.id,
          set: {
            phaseId: topic.phaseId,
            title: topic.title,
            summary: topic.summary,
            durationWeeks: topic.durationWeeks,
            order: topic.order,
            tip: topic.tip,
            outcome: topic.outcome,
            flow: topic.flow,
            estimated: topic.estimated,
            honestyNote: topic.honestyNote,
          },
        });
    }

    for (const topic of topicRows) {
      if (!topic.linkedTopicId) continue;
      await tx
        .update(topics)
        .set({ linkedTopicId: topic.linkedTopicId })
        .where(eq(topics.id, topic.id));
    }

    for (const subtopic of subtopicRows) {
      await tx
        .insert(subtopics)
        .values(subtopic)
        .onConflictDoUpdate({
          target: subtopics.id,
          set: {
            topicId: subtopic.topicId,
            title: subtopic.title,
            order: subtopic.order,
          },
        });
    }

    for (const resource of resourceRows) {
      await tx
        .insert(resources)
        .values(resource)
        .onConflictDoUpdate({
          target: resources.id,
          set: {
            topicId: resource.topicId,
            title: resource.title,
            url: resource.url,
          },
        });
    }
  });

  console.log(
    `Seeded ${trackRows.length} tracks, ${phaseRows.length} phases, ${topicRows.length} topics, ${subtopicRows.length} subtopics and ${resourceRows.length} resources. Progress rows were not touched.`,
  );
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
