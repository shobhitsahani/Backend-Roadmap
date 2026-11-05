import "dotenv/config";
import { db } from "./index";
import { activity, phases, resources, settings, subtopics, topics } from "./schema";
import {
  activitySeeds,
  phaseSeeds,
  resourceSeeds,
  subtopicSeeds,
  topicSeeds,
} from "./seed-data";

async function seed() {
  await db.transaction(async (tx) => {
    await tx.delete(activity);
    await tx.delete(resources);
    await tx.delete(subtopics);
    await tx.delete(topics);
    await tx.delete(phases);
    await tx.delete(settings);

    await tx.insert(phases).values(phaseSeeds);
    await tx.insert(topics).values(topicSeeds);
    await tx.insert(subtopics).values(subtopicSeeds);
    await tx.insert(resources).values(resourceSeeds);
    await tx.insert(settings).values({ id: "singleton", startDate: null });
    if (activitySeeds.length > 0) {
      await tx.insert(activity).values(activitySeeds);
    }
  });

  console.log(
    `Seeded ${phaseSeeds.length} phases, ${topicSeeds.length} topics, ${subtopicSeeds.length} subtopics and ${resourceSeeds.length} resources.`,
  );
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
