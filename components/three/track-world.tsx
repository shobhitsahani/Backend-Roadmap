"use client";

import nextDynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import React from "react";

import { shouldSkip3D, webglAvailable } from "@/lib/three-fallback";
import { TrackWorldPoster } from "./poster";
import { requestTrackWorldDolly } from "./track-world-events";

const TrackWorldCanvas = nextDynamic(() => import("./track-world-canvas"), {
  ssr: false,
});

const ENABLE_3D = process.env.NEXT_PUBLIC_ENABLE_3D;

/** Cached once at module load on the client; never changes after that. */
let cachedSkip: boolean | null = null;

function getSkipValue(): boolean {
  if (cachedSkip !== null) return cachedSkip;
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean };
    }
  ).connection;
  cachedSkip =
    shouldSkip3D({
      enable3D: ENABLE_3D,
      prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      saveData: connection?.saveData ?? false,
      hardwareConcurrency: navigator.hardwareConcurrency ?? undefined,
    }) || !webglAvailable();
  return cachedSkip;
}

const subscribe = () => () => {};
const getSkipSnapshot = () => getSkipValue();
const getServerSkipSnapshot = () => true;

/** Full-width brand band for the landing page; degrades to static SVG. */
export function TrackWorldSection() {
  const skip = useSyncExternalStore(subscribe, getSkipSnapshot, getServerSkipSnapshot);

  // frameloop="demand" means the canvas never animates after its first
  // frames, so there is nothing to pause when the band is off screen.
  const canvasLive = !skip;

  return (
    <section
      aria-label="Track world"
      className="relative my-8 w-full border border-hairline bg-panel"
      data-track-world={canvasLive ? "on" : "off"}
    >
      {canvasLive ? (
        <div className="h-[300px] w-full">
          <TrackWorldErrorBoundary>
            <TrackWorldCanvas />
          </TrackWorldErrorBoundary>
        </div>
      ) : (
        <TrackWorldPoster hint="3D off — tap a caption to open the track." />
      )}

      <div className="grid grid-cols-2 overflow-hidden">
        <Link
          href="/backend"
          className="border-r border-hairline bg-raised py-3 text-center font-mono text-micro tracking-[0.14em] text-ink-muted uppercase transition-colors hover:bg-field hover:text-ink"
          onClick={() => requestTrackWorldDolly("backend")}
        >
          Layered lattice — Backend
        </Link>
        <Link
          href="/ai-engineer"
          className="bg-raised py-3 text-center font-mono text-micro tracking-[0.14em] text-ink-muted uppercase transition-colors hover:bg-field hover:text-ink"
          onClick={() => requestTrackWorldDolly("ai-engineer")}
        >
          Constellation — AI Engineer
        </Link>
      </div>
    </section>
  );
}

class TrackWorldErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.error("[TrackWorld] Scene failed to render:", error);
  }
  render() {
    return this.state.hasError ? (
      <TrackWorldPoster hint="3D hit an error — tap a caption to open the track." />
    ) : (
      this.props.children
    );
  }
}
