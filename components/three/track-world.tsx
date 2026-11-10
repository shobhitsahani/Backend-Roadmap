"use client";

import nextDynamic from "next/dynamic";
import { useRouter } from "next/navigation";
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

function skipReason(preference: "on" | "reduced" | "off"): string {
  if (typeof window === "undefined") return "ssr";
  const env = getEnv();
  if (ENABLE_3D === "false") return "env-disabled";
  if (preference === "off") return "user-off";
  if (env.saveData) return "save-data";
  if (!env.webgl) return "webgl-unavailable";
  return "unknown";
}

export type TrackWorldProps = {
  activeTrack?: "both" | "backend" | "ai-engineer";
  tilt?: boolean;
  dollyThenNavigate?: boolean;
  height?: number;
};

export function TrackWorldSection({
  activeTrack = "both",
  tilt = false,
  dollyThenNavigate = false,
  height = 300,
}: TrackWorldProps) {
  const preference = useThreeStore((state) => state.preference);
  const router = useRouter();

  const [mounted, setMounted] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), []);

  const env = mounted && typeof window !== "undefined" ? getEnv() : null;
  const skip =
    !mounted ||
    shouldSkip3D({
      enable3D: ENABLE_3D,
      prefersReducedMotion: env?.prefersReducedMotion ?? false,
      saveData: env?.saveData ?? false,
      hardwareConcurrency: env?.hardwareConcurrency,
      userPreference: preference,
    }) ||
    !(env?.webgl ?? true);

  const staticFrame =
    mounted &&
    !skip &&
    shouldRenderStatic({
      enable3D: ENABLE_3D,
      prefersReducedMotion: env?.prefersReducedMotion ?? false,
      saveData: env?.saveData ?? false,
      hardwareConcurrency: env?.hardwareConcurrency,
      userPreference: preference,
    });

  const canvasLive = mounted && !skip;

  const [tiltState, setTiltState] = React.useState({ x: 0, y: 0 });
  const touchRef = React.useRef(false);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!tilt || touchRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    setTiltState({ x: x * 6, y: -y * 6 });
  };
  const handlePointerLeave = () => setTiltState({ x: 0, y: 0 });
  const handlePointerDown = (event: React.PointerEvent) => {
    if (event.pointerType === "touch") touchRef.current = true;
  };

  React.useEffect(() => {
    if (mounted && skip) console.info("3d_fallback_used", skipReason(preference));
  }, [mounted, skip, preference]);

  const state = !mounted
    ? "loading"
    : skip
      ? "fallback"
      : staticFrame
        ? "static"
        : "ready";

  function handleCaptionClick(
    slug: "backend" | "ai-engineer",
    href: string,
    event: React.MouseEvent,
  ) {
    requestTrackWorldDolly(slug);
    if (dollyThenNavigate) {
      event.preventDefault();
      window.setTimeout(() => router.push(href), 650);
    }
  }

  return (
    <section
      aria-label="Track world"
      data-testid="track-world"
      data-state={state}
      data-fallback-reason={mounted && skip ? skipReason(preference) : undefined}
      className="relative w-full border border-hairline bg-panel"
      data-track-world={canvasLive ? "on" : "off"}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      style={
        tilt
          ? {
              transform: `perspective(900px) rotateY(${tiltState.x}deg) rotateX(${tiltState.y}deg)`,
              transition: "transform 240ms cubic-bezier(0.22, 1, 0.36, 1)",
            }
          : undefined
      }
    >
      {canvasLive ? (
        <div style={{ height }} className="w-full">
          <TrackWorldErrorBoundary>
            <TrackWorldCanvas staticFrame={staticFrame} activeTrack={activeTrack} />
          </TrackWorldErrorBoundary>
        </div>
      ) : (
        <div style={{ height }}>
          <TrackWorldPoster hint="3D off — tap a caption to open the track." />
        </div>
      )}

      <div className="grid grid-cols-2 overflow-hidden">
        <Link
          href="/backend"
          className="border-r border-hairline bg-raised py-3 text-center font-mono text-micro tracking-[0.14em] text-ink-muted uppercase transition-colors hover:bg-field hover:text-ink"
          onClick={(e) => handleCaptionClick("backend", "/backend", e)}
        >
          Layered lattice — Backend
        </Link>
        <Link
          href="/ai-engineer"
          className="bg-raised py-3 text-center font-mono text-micro tracking-[0.14em] text-ink-muted uppercase transition-colors hover:bg-field hover:text-ink"
          onClick={(e) => handleCaptionClick("ai-engineer", "/ai-engineer", e)}
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

export function TrackHeaderScene({
  activeTrack,
}: {
  activeTrack: "backend" | "ai-engineer";
}) {
  return (
    <TrackWorldSection activeTrack={activeTrack} height={160} dollyThenNavigate={false} />
  );
}
