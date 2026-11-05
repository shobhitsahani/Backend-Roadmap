"use client";

import { AppShell } from "@/components/app/app-shell";
import { RoadmapStoreProvider } from "@/store/roadmap-store";
import type { RoadmapSnapshot } from "@/types/roadmap";

export function RoadmapApp({ initialSnapshot }: { initialSnapshot: RoadmapSnapshot }) {
  return (
    <RoadmapStoreProvider initialSnapshot={initialSnapshot}>
      <AppShell />
    </RoadmapStoreProvider>
  );
}
