import { Suspense } from "react";

import { FirstPaintSkeleton } from "@/components/skeletons/first-paint";
import { RoadmapApp } from "@/components/app/roadmap-app";
import { getRoadmapSnapshot } from "@/lib/roadmap-server";

export const dynamic = "force-dynamic";

async function SnapshotSource() {
  const snapshot = await getRoadmapSnapshot();
  return <RoadmapApp initialSnapshot={snapshot} />;
}

export default function Home() {
  return (
    <Suspense fallback={<FirstPaintSkeleton />}>
      <SnapshotSource />
    </Suspense>
  );
}
