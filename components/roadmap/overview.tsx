"use client";

import { ArrowRightIcon } from "lucide-react";

import { ProgressRing } from "@/components/progress-ring";
import { TickingNumber } from "@/components/ticking-number";
import { Badge } from "@/components/ui/badge";
import { WeekRuler } from "@/components/week-ruler";
import { formatWeeks } from "@/lib/format";
import type { ProgressStats } from "@/lib/progress";
import { useRoadmapStore } from "@/store/roadmap-store";
import type { PhaseWithTopics, Topic } from "@/types/roadmap";

type RoadmapOverviewProps = {
  phases: PhaseWithTopics[];
  progress: ProgressStats;
  current: { topic: Topic; phase: PhaseWithTopics } | null;
  expectedWeek: number | null;
  currentWeek: number | null;
  phaseWeeks: Map<string, number>;
  onOpenTopic: (topicId: string) => void;
};

export function RoadmapOverview({
  phases,
  progress,
  current,
  expectedWeek,
  currentWeek,
  phaseWeeks,
  onOpenTopic,
}: RoadmapOverviewProps) {
  const track = useRoadmapStore((state) => state.snapshot.track);

  return (
    <section className="grid gap-10 border-b border-hairline pb-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
      <div>
        <h1 className="max-w-3xl font-display text-display-sm leading-[0.98] font-semibold tracking-[-0.045em] text-balance md:text-display">
          {track.title} roadmap<span className="text-phase-1">.</span>
          {track.slug === "ai-engineer" ? (
            <span className="ml-3 align-middle font-mono text-micro tracking-[0.14em] text-ink-subtle uppercase">
              TypeScript
            </span>
          ) : null}
        </h1>
        <p className="mt-4 font-mono text-micro tracking-[0.16em] text-phase-1 uppercase">
          Field manual / {progress.totalWeeks} weeks /{" "}
          {phases.length === 1 ? "One phase" : `${phases.length} phases`}
        </p>
        <p className="mt-5 max-w-xl font-sans text-body-lg leading-relaxed text-ink-muted">
          {track.summary}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-2">
          {phases.map((phase) => (
            <Badge
              key={phase.id}
              variant={
                `phase-${phase.order}` as
                  "phase-1" | "phase-2" | "phase-3" | "phase-4" | "phase-5"
              }
            >
              {String(phase.order).padStart(2, "0")} {phase.title} /{" "}
              {phaseWeeks.get(phase.id) ?? 0}w
            </Badge>
          ))}
        </div>

        <div className="mt-8 border-t border-hairline pt-5">
          {current ? (
            <button
              type="button"
              onClick={() => onOpenTopic(current.topic.id)}
              className="group flex w-full max-w-xl items-start gap-3 rounded-xs py-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
            >
              <span className="relative mt-1.5 flex size-3 shrink-0 items-center justify-center">
                <span className="absolute inset-0 pulse-dot rounded-full bg-phase-1/40" />
                <span className="size-1.5 rounded-full bg-phase-1" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-micro tracking-[0.1em] text-phase-1 uppercase">
                  Current focus / {phaseLabel(current.phase, current.topic)}
                </span>
                <span className="mt-1 block font-display text-body-lg leading-tight font-semibold tracking-[-0.01em] text-ink">
                  {current.topic.title}
                </span>
              </span>
              <ArrowRightIcon
                aria-hidden="true"
                className="mt-1 size-4 shrink-0 text-ink-subtle transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-ink"
              />
            </button>
          ) : (
            <p className="font-mono text-micro tracking-[0.1em] text-phase-1 uppercase">
              Field manual complete / {progress.totalWeeks} weeks logged
            </p>
          )}
        </div>
      </div>

      <div className="rounded-sm border border-hairline bg-panel p-5">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-mono text-micro tracking-[0.14em] text-ink-subtle uppercase">
              Overall progress
            </p>
            <p className="mt-3 flex items-baseline gap-1 font-mono text-[3.5rem] leading-none font-medium tracking-[-0.07em] text-ink">
              <TickingNumber value={progress.percent} />
              <span className="text-title text-ink-subtle">%</span>
            </p>
          </div>
          <ProgressRing
            value={progress.percent}
            label="Overall roadmap progress"
            size={52}
          />
        </div>

        <div className="mt-6 border-t border-hairline pt-5">
          <WeekRuler
            segments={phases.map((phase) => ({
              phase: phase.order as 1 | 2 | 3 | 4 | 5,
              weeks: phaseWeeks.get(phase.id) ?? 0,
            }))}
            completedWeeks={progress.completedWeeks}
            expectedWeek={expectedWeek}
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-hairline pt-4 font-mono text-micro tracking-[0.1em] uppercase">
          <div>
            <p className="text-ink-subtle">Weeks complete</p>
            <p className="mt-1 text-caption text-ink tabular-nums">
              {formatWeeks(progress.completedWeeks)} / {progress.totalWeeks}
            </p>
          </div>
          <div className="text-right">
            <p className="text-ink-subtle">Current week</p>
            <p className="mt-1 text-caption text-ink tabular-nums">
              {currentWeek === null ? "Not set" : String(currentWeek).padStart(2, "0")}
            </p>
          </div>
        </div>

        {expectedWeek === null ? (
          <p className="mt-3 font-sans text-caption leading-relaxed text-ink-subtle">
            Set a start date to plot expected progress.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function phaseLabel(phase: PhaseWithTopics, topic: Topic) {
  return `${String(phase.order).padStart(2, "0")}.${String(topic.order).padStart(2, "0")}`;
}
