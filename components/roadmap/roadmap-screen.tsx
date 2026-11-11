"use client";

import { CalendarIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

import { RoadmapOverview } from "@/components/roadmap/overview";
import { PhaseSection } from "@/components/roadmap/phase-section";
import { GraphScreen } from "@/components/graph/graph-screen";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { duration, ease } from "@/lib/motion";
import { formatDate, formatWeeks } from "@/lib/format";
import { currentTopic, phaseProgress, roadmapProgress } from "@/lib/progress";
import { parseRoadmapView, roadmapViewHref } from "@/lib/routes";
import { buildTimeline } from "@/lib/timeline";
import { useRoadmapStore } from "@/store/roadmap-store";
import { useUiStore } from "@/store/ui-store";

export function RoadmapScreen() {
  const phases = useRoadmapStore((state) => state.snapshot.phases);
  const track = useRoadmapStore((state) => state.snapshot.track);
  const startDate = useRoadmapStore((state) => state.snapshot.settings.startDate);
  const openTopic = useUiStore((state) => state.openTopic);
  const setStartDateOpen = useUiStore((state) => state.setStartDateOpen);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const roadmapView = parseRoadmapView(searchParams.get("view"));

  const progress = roadmapProgress(phases);
  const current = currentTopic(phases);
  const timeline = buildTimeline(phases, startDate);
  const phaseWeeks = new Map(
    phases.map((phase) => [phase.id, phaseProgress(phase).totalWeeks]),
  );

  return (
    <div className="pt-8 md:pt-12">
      <RoadmapOverview
        phases={phases}
        progress={progress}
        current={current}
        expectedWeek={timeline.expectedWeek}
        currentWeek={timeline.currentWeek}
        phaseWeeks={phaseWeeks}
        onOpenTopic={openTopic}
      />

      <div className="flex flex-col gap-3 border-b border-hairline py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="font-mono text-micro tracking-[0.1em] text-ink-subtle uppercase">
          The plan / {progress.completedTopics} of {progress.totalTopics} topics /{" "}
          {formatWeeks(progress.completedWeeks)} weeks logged
        </p>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <ToggleGroup
            value={[roadmapView] as string[]}
            onValueChange={(next) => {
              const view = next[0];
              if (view === "list" || view === "graph" || view === "journey") {
                router.replace(roadmapViewHref(pathname, view), { scroll: false });
              }
            }}
            aria-label="Roadmap view"
          >
            <ToggleGroupItem value="list">
              <span className="sr-only">List view</span>
              <span aria-hidden="true">List</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="graph">
              <span className="sr-only">Map view</span>
              <span aria-hidden="true">Map</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="journey">
              <span className="sr-only">3D Journey view</span>
              <span aria-hidden="true">3D</span>
            </ToggleGroupItem>
          </ToggleGroup>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setStartDateOpen(true)}
          >
            <CalendarIcon data-icon="inline-start" aria-hidden="true" />
            {startDate ? `Start ${formatDate(startDate)}` : "Set start date"}
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {roadmapView === "graph" ? (
          <motion.div
            key="graph"
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: duration.base, ease: ease.out },
            }}
            exit={{
              opacity: 0,
              transition: { duration: duration.fast, ease: ease.inOut },
            }}
          >
            <GraphScreen />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: duration.base, ease: ease.out },
            }}
            exit={{
              opacity: 0,
              transition: { duration: duration.fast, ease: ease.inOut },
            }}
          >
            {phases.map((phase) => (
              <PhaseSection
                key={phase.id}
                phase={phase}
                currentTopicId={current?.topic.id ?? null}
                onOpenTopic={openTopic}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-14 grid gap-6 border-t border-hairline pt-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          {track.footer ? (
            <blockquote className="max-w-2xl font-display text-title-sm leading-snug font-medium tracking-[-0.02em] text-balance text-ink">
              “{track.footer}”
            </blockquote>
          ) : null}
          {track.sourceUrl ? (
            <a
              href={track.sourceUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 inline-flex min-h-11 items-center font-mono text-micro tracking-[0.08em] text-ink-subtle uppercase underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              Source / {track.sourceTitle ?? "Original curriculum"}
            </a>
          ) : null}
        </div>
        <p className="font-mono text-micro tracking-[0.1em] text-ink-subtle uppercase">
          Field manual / v0.1.0
        </p>
      </footer>
    </div>
  );
}
