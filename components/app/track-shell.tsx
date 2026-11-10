import "server-only";

import { Suspense, type ReactNode } from "react";

import { FirstPaintSkeleton } from "@/components/skeletons/first-paint";
import { ProductShell } from "@/components/app/product-shell";
import { getRoadmapSnapshot } from "@/lib/roadmap-server";
import { getRequestTrackSlug } from "@/lib/track-context";
import { RoadmapStoreProvider } from "@/store/roadmap-store";

export async function TrackShell({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const snapshot = await getRoadmapSnapshot(slug);

  return (
    <RoadmapStoreProvider key={snapshot.track.slug} initialSnapshot={snapshot}>
      <ProductShell>{children}</ProductShell>
    </RoadmapStoreProvider>
  );
}

/** Streams the product shell while the first snapshot loads. */
export function TrackShellBoundary({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<FirstPaintSkeleton />}>
      <TrackShell slug={slug}>{children}</TrackShell>
    </Suspense>
  );
}

/** Journey and settings use the track remembered by the cookie. */
export async function ActiveTrackShell({ children }: { children: ReactNode }) {
  const slug = await getRequestTrackSlug();
  return <TrackShellBoundary slug={slug}>{children}</TrackShellBoundary>;
}
