import { JourneyOverview } from "@/components/journey/journey-overview";
import { trackContents } from "@/content/tracks";
import { getRoadmapSnapshot } from "@/lib/roadmap-server";

export default async function JourneyPage() {
  const snapshots = await Promise.all(
    trackContents.map((track) => getRoadmapSnapshot(track.slug)),
  );

  return <JourneyOverview snapshots={snapshots} />;
}
