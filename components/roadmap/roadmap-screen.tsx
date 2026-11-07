"use client";

import { CalendarIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { RoadmapOverview } from "@/components/roadmap/overview";
import { PhaseSection } from "@/components/roadmap/phase-section";
import { GraphScreen } from "@/components/graph/graph-screen";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { duration, ease } from "@/lib/motion";
import { formatDate, formatWeeks } from "@/lib/format";
import { currentTopic, phaseProgress, roadmapProgress } from "@/lib/progress";
import { buildTimeline } from "@/lib/timeline";
import { useRoadmapStore } from "@/store/roadmap-store";
import { useUiStore } from "@/store/ui-store";

export function RoadmapScreen() {
  const phases = useRoadmapStore((state) => state.snapshot.phases);
  const startDate = useRoadmapStore((state) => state.snapshot.settings.startDate);
  const openTopic = useUiStore((state) => state.openTopic);
  const roadmapView = useUiStore((state) => state.roadmapView);
  const setRoadmapView = useUiStore((state) => state.setRoadmapView);
  const setStartDateOpen = useUiStore((state) => state.setStartDateOpen);

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

      <div className="flex flex-col gap-4 border-b border-hairline py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-micro tracking-[0.1em] text-ink-subtle uppercase">
          The plan / {progress.completedTopics} of {progress.totalTopics} topics /{" "}
          {formatWeeks(progress.completedWeeks)} weeks logged
        </p>
        <ToggleGroup
          value={[roadmapView] as string[]}
          onValueChange={(next) => {
            const view = next[0];
            if (view === "list" || view === "graph") setRoadmapView(view);
          }}
          aria-label="Roadmap view"
        >
          <ToggleGroupItem value="list">
            <span className="sr-only">List view</span>
            <span className="hidden md:inline">List</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="graph">
            <span className="sr-only">Map view</span>
            <span className="hidden md:inline">Map</span>
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
        <blockquote className="max-w-2xl font-display text-title-sm leading-snug font-medium tracking-[-0.02em] text-balance text-ink">
          “Backend isn&apos;t about memorizing tools — it&apos;s about solving problems
          under constraints.”
        </blockquote>
        <p className="font-mono text-micro tracking-[0.1em] text-ink-subtle uppercase">
          Field manual / v0.1.0
        </p>
      </footer>
    </div>
  );
}
