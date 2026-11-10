"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

import { ProgressRing } from "@/components/progress-ring";
import { ease } from "@/lib/motion";
import { trackSlugFromPathname, trackSwitchHref } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { useRoadmapStore } from "@/store/roadmap-store";

const shortLabels: Record<string, string> = {
  backend: "Backend",
  "ai-engineer": "AI Engineer",
};

type TrackSwitcherProps = {
  variant?: "masthead" | "mobile";
  className?: string;
};

export function TrackSwitcher({ variant = "masthead", className }: TrackSwitcherProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tracks = useRoadmapStore((state) => state.snapshot.tracks);
  const snapshotSlug = useRoadmapStore((state) => state.snapshot.track.slug);
  const reduceMotion = useReducedMotion();

  const slugs = tracks.map((track) => track.slug);
  const pathSlug = trackSlugFromPathname(pathname, slugs);
  const activeSlug = pathSlug ?? snapshotSlug;
  const activeTrack = tracks.find((track) => track.slug === activeSlug) ?? tracks[0];

  return (
    <div
      role="group"
      aria-label="Tracks"
      className={cn(
        "relative flex w-full shrink-0 rounded-sm border border-hairline bg-panel p-0.5",
        variant === "mobile" ? "h-12" : "h-10",
        className,
      )}
    >
      {tracks.map((track, index) => {
        const active = track.slug === activeSlug;
        const href = trackSwitchHref(
          pathname,
          searchParams.toString(),
          track.slug,
          slugs,
        );
        const shortLabel = shortLabels[track.slug] ?? track.title;

        return (
          <Link
            key={track.slug}
            href={href}
            aria-current={active ? "page" : undefined}
            aria-label={
              active ? `${track.title}, current track` : `Switch to ${track.title}`
            }
            className={cn(
              "relative z-10 flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-[3px] px-2 font-mono text-micro tracking-[0.08em] uppercase transition-colors duration-150",
              variant === "mobile" ? "h-11" : "h-9",
              active ? "text-ink" : "text-ink-muted hover:text-ink",
            )}
          >
            {active ? (
              <motion.span
                aria-hidden="true"
                layoutId={`track-switcher-indicator-${variant}`}
                className="absolute inset-y-0.5 rounded-[3px] bg-raised"
                style={{
                  left: `calc(${index * 50}% + 2px)`,
                  width: "calc(50% - 4px)",
                }}
                transition={
                  reduceMotion ? { duration: 0 } : { duration: 0.15, ease: ease.out }
                }
              />
            ) : null}

            <ProgressRing
              value={track.percent}
              label={`${track.title} progress`}
              size={16}
              strokeWidth={2}
              showValue={false}
              accent={`var(--track-${track.slug}, var(--phase-1))`}
              className="relative z-10"
            />
            <span className="relative z-10 min-w-0 truncate">
              {variant === "mobile" ? track.title : shortLabel}
            </span>
          </Link>
        );
      })}

      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {activeTrack ? `Viewing ${activeTrack.title}` : ""}
      </span>
    </div>
  );
}
