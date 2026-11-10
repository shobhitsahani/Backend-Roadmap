"use client";

import nextDynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import React from "react";

import { shouldSkip3D, shouldRenderStatic, webglAvailable } from "@/lib/three-fallback";
import { useThreeStore } from "@/store/three-store";
import { TrackWorldPoster } from "./poster";
import { requestTrackWorldDolly } from "./track-world-events";

const TrackWorldCanvas = nextDynamic(() => import("./track-world-canvas"), {
  ssr: false,
});

const ENABLE_3D = process.env.NEXT_PUBLIC_ENABLE_3D;

/** Cached once at module load on the client; never changes after that. */
let cachedEnv: {
  prefersReducedMotion: boolean;
  saveData: boolean;
  hardwareConcurrency: number | undefined;
  webgl: boolean;
} | null = null;

function getEnv() {
  if (cachedEnv !== null) return cachedEnv;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
    .connection;
  cachedEnv = {
    prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: connection?.saveData ?? false,
    hardwareConcurrency: navigator.hardwareConcurrency ?? undefined,
    webgl: webglAvailable(),
  };
  return cachedEnv;
}

function computeSkip(preference: "on" | "reduced" | "off"): boolean {
  const env = getEnv();
  return (
    shouldSkip3D({
      enable3D: ENABLE_3D,
      prefersReducedMotion: env.prefersReducedMotion,
      saveData: env.saveData,
      hardwareConcurrency: env.hardwareConcurrency,
      userPreference: preference,
    }) || !env.webgl
  );
}

function skipReason(preference: "on" | "reduced" | "off"): string {
  if (typeof window === "undefined") return "ssr";
  const env = getEnv();
  if (ENABLE_3D === "false") return "env-disabled";
  if (preference === "off") return "user-off";
  if (env.saveData) return "save-data";
  if (!env.webgl) return "webgl-unavailable";
  return "unknown";
}

const subscribe = () => () => {};
const getServerSkipSnapshot = () => true;

/** Full-width brand band for the landing page; degrades to static SVG. */
export function TrackWorldSection() {
  const preference = useThreeStore((state) => state.preference);
  const preferenceRef = React.useRef(preference);
  React.useEffect(() => {
    preferenceRef.current = preference;
  }, [preference]);

  const getSkipSnapshot = React.useCallback(() => computeSkip(preferenceRef.current), []);
  const skip = useSyncExternalStore(subscribe, getSkipSnapshot, getServerSkipSnapshot);

  const env = typeof window === "undefined" ? null : getEnv();
  const staticFrame =
    !skip &&
    shouldRenderStatic({
      enable3D: ENABLE_3D,
      prefersReducedMotion: env?.prefersReducedMotion ?? false,
      saveData: env?.saveData ?? false,
      hardwareConcurrency: env?.hardwareConcurrency,
      userPreference: preference,
    });

  const canvasLive = !skip;

  React.useEffect(() => {
    if (skip) {
      console.info("3d_fallback_used", skipReason(preference));
    }
  }, [skip, preference]);

  const state = skip ? "fallback" : staticFrame ? "static" : "ready";

  return (
    <section
      aria-label="Track world"
      data-testid="track-world"
      data-state={state}
      data-fallback-reason={skip ? skipReason(preference) : undefined}
      className="relative my-8 w-full border border-hairline bg-panel"
      data-track-world={canvasLive ? "on" : "off"}
    >
      {canvasLive ? (
        <div className="h-[300px] w-full">
          <TrackWorldErrorBoundary>
            <TrackWorldCanvas staticFrame={staticFrame} />
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
