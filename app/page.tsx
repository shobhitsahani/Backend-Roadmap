import { RoadmapApp } from "@/components/app/roadmap-app";
import { getRoadmapSnapshot } from "@/lib/roadmap-server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const snapshot = await getRoadmapSnapshot();
  return <RoadmapApp initialSnapshot={snapshot} />;
}
