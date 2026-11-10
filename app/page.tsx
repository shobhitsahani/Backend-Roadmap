import { cookies } from "next/headers";

import { LandingPage, type LandingTrack } from "@/components/landing/landing-page";
import { trackContents } from "@/content/tracks";
import { getRoadmapSnapshot } from "@/lib/roadmap-server";
import { phaseLines, trackStats } from "@/lib/track-stats";
import { LAST_TRACK_COOKIE } from "@/lib/track-context";
import type { RoadmapSnapshot } from "@/types/roadmap";

export default async function Home() {
  const lastTrack = (await cookies()).get(LAST_TRACK_COOKIE)?.value;
  const returning = Boolean(lastTrack);

  const tracks: LandingTrack[] = trackContents.map((track) => ({
    slug: track.slug,
    title: track.title,
    subtitle: track.subtitle,
    summary: track.summary,
    estimated: track.phases.some((phase) =>
      phase.topics.some((topic) => topic.estimated),
    ),
    sourceTitle: track.sourceTitle,
    sourceUrl: track.sourceUrl,
    stats: trackStats(track),
    phases: phaseLines(track),
  }));

  let snapshots: RoadmapSnapshot[] = [];
  if (returning) {
    try {
      snapshots = await Promise.all(
        trackContents.map((track) => getRoadmapSnapshot(track.slug)),
      );
    } catch {
      // Falling back to the picker keeps a flaky local DB from taking
      // down the front door for a returning guest.
      snapshots = [];
    }
  }

  return (
    <LandingPage
      mode={returning && snapshots.length > 0 ? "progress" : "picker"}
      tracks={tracks}
      snapshots={snapshots}
    />
  );
}
