"use client";

import { CalendarIcon } from "lucide-react";
import { motion } from "motion/react";

import { CrosshairMark } from "@/components/empty-states/line-art";
import { revealContainer, revealItem } from "@/lib/motion";
import { TimelineMeasure } from "@/components/timeline/measure";
import { TickingNumber } from "@/components/ticking-number";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { formatDate } from "@/lib/format";
import {
  buildTimeline,
  parseLocalDate,
  type PlanStatus,
  type TopicTimelineStatus,
} from "@/lib/timeline";
import { cn } from "@/lib/utils";
import { useRoadmapStore } from "@/store/roadmap-store";
import { useUiStore } from "@/store/ui-store";

const planStatusMeta = {
  unset: { label: "Start date unset", tone: "text-ink-subtle" },
  not_started: { label: "Scheduled", tone: "text-ink-subtle" },
  on_track: { label: "On track", tone: "text-phase-1" },
  behind: { label: "Behind", tone: "text-phase-4" },
  complete: { label: "Complete", tone: "text-phase-1" },
} satisfies Record<PlanStatus, { label: string; tone: string }>;

const bandStatusMeta: Record<TopicTimelineStatus, { label: string; tone: string }> = {
  complete: { label: "DONE", tone: "text-phase-1" },
  active: { label: "ACTIVE", tone: "text-phase-1" },
  behind: { label: "BEHIND", tone: "text-phase-4" },
  upcoming: { label: "", tone: "text-ink-subtle" },
};

function weekToDate(startDate: string, week: number) {
  const target = parseLocalDate(startDate);
  target.setDate(target.getDate() + Math.round(week * 7));
  return target;
}

function formatMilestoneDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function weekRange(startWeek: number, endWeek: number) {
  return `W${String(startWeek).padStart(2, "0")}–W${String(endWeek).padStart(2, "0")}`;
}

type Milestone = { label: string; date: string };

export function TimelineScreen() {
  const phases = useRoadmapStore((state) => state.snapshot.phases);
  const startDate = useRoadmapStore((state) => state.snapshot.settings.startDate);
  const openTopic = useUiStore((state) => state.openTopic);
  const setStartDateOpen = useUiStore((state) => state.setStartDateOpen);

  const timeline = buildTimeline(phases, startDate);
  const windows = timeline.phases.map((entry) => ({
    phase: entry.phase,
    startWeek: entry.startWeek,
    endWeek: entry.endWeek,
  }));

  const delta =
    timeline.elapsedWeeks === null
      ? null
      : timeline.overall.completedWeeks - timeline.elapsedWeeks;
  const status = planStatusMeta[timeline.planStatus];

  const deltaLabel = (() => {
    if (delta === null || timeline.planStatus === "complete") return null;
    if (delta > 0.05) return `${delta.toFixed(1)}w ahead`;
    if (delta < -0.05) return `${Math.abs(delta).toFixed(1)}w behind`;
    return "on pace";
  })();

  const milestones: Milestone[] = (() => {
    if (startDate === null) return [];
    const dates: Milestone[] = [];
    const nextEntry = timeline.entries.find((entry) => entry.status !== "complete");
    if (nextEntry) {
      dates.push({
        label: `Next topic · ${nextEntry.topic.title}`,
        date: formatMilestoneDate(weekToDate(startDate, nextEntry.endWeek)),
      });
      const nextPhase = timeline.phases.find(
        (entry) => entry.startWeek > nextEntry.startWeek,
      );
      if (nextPhase) {
        dates.push({
          label: `Phase ${String(nextPhase.phase.order).padStart(2, "0")} · ${nextPhase.phase.title}`,
          date: formatMilestoneDate(weekToDate(startDate, nextPhase.startWeek)),
        });
      }
      dates.push({
        label: `Final week · W${timeline.totalWeeks}`,
        date: formatMilestoneDate(
          weekToDate(startDate, timeline.phases.at(-1)?.endWeek ?? timeline.totalWeeks),
        ),
      });
    } else {
      dates.push({
        label: "All topics complete",
        date: formatMilestoneDate(
          weekToDate(startDate, timeline.phases.at(-1)?.endWeek ?? timeline.totalWeeks),
        ),
      });
    }
    return dates.slice(0, 3);
  })();

  return (
    <div className="pt-8 md:pt-12">
      <section className="border-b border-hairline pb-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-display-sm leading-[0.98] font-semibold tracking-[-0.045em] text-ink md:text-display">
              Timeline<span className="text-phase-1">.</span>
            </h1>
            <p className="mt-4 font-mono text-micro tracking-[0.16em] text-phase-1 uppercase">
              Field log / {timeline.totalWeeks}-week measure
            </p>
            <p className="mt-5 max-w-xl font-sans text-body-lg leading-relaxed text-ink-muted">
              One ruler for the whole plan. The crosshair marks where the calendar says
              you should be.
            </p>
          </div>

          <div className="flex items-baseline gap-3 font-mono">
            <span className={cn("text-caption tracking-[0.14em] uppercase", status.tone)}>
              {status.label}
            </span>
            {deltaLabel ? (
              <span className="text-caption tracking-[0.1em] text-ink-subtle uppercase">
                {deltaLabel}
              </span>
            ) : null}
          </div>
        </div>

        <motion.div
          variants={revealContainer}
          initial="hidden"
          animate="visible"
          className="mt-8 grid grid-cols-2 gap-4 border-t border-hairline pt-5 font-mono text-micro tracking-[0.1em] uppercase md:grid-cols-4"
        >
          <motion.div variants={revealItem}>
            <p className="text-ink-subtle">Weeks logged</p>
            <p className="mt-1 flex items-baseline gap-1 text-title-sm leading-none font-medium text-ink">
              <TickingNumber value={timeline.overall.completedWeeks} decimals={1} />
              <span className="text-caption text-ink-subtle">/ 36</span>
            </p>
          </motion.div>
          <motion.div variants={revealItem}>
            <p className="text-ink-subtle">Expected week</p>
            <p className="mt-1 text-title-sm leading-none font-medium text-ink">
              {timeline.expectedWeek === null ? (
                <span className="text-ink-subtle">Not set</span>
              ) : (
                <TickingNumber
                  value={Math.ceil(timeline.expectedWeek)}
                  aria-label={`Expected week ${Math.ceil(timeline.expectedWeek)}`}
                />
              )}
            </p>
          </motion.div>
          <motion.div variants={revealItem}>
            <p className="text-ink-subtle">Calendar week</p>
            <p className="mt-1 text-title-sm leading-none font-medium text-ink">
              {timeline.currentWeek === null ? (
                <span className="text-ink-subtle">Not set</span>
              ) : (
                <TickingNumber value={timeline.currentWeek} />
              )}
            </p>
          </motion.div>
          <motion.div variants={revealItem}>
            <p className="text-ink-subtle">Start date</p>
            <p className="mt-1 text-title-sm leading-none font-medium text-ink">
              {startDate ? (
                <span className="font-display text-title-sm tracking-[-0.02em] normal-case">
                  {formatDate(startDate)}
                </span>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStartDateOpen(true)}
                >
                  <CalendarIcon data-icon="inline-start" aria-hidden="true" />
                  Set start date
                </Button>
              )}
            </p>
          </motion.div>
        </motion.div>
      </section>

      <section className="border-b border-hairline py-8">
        <TimelineMeasure
          windows={windows}
          totalWeeks={36}
          completedWeeks={timeline.overall.completedWeeks}
          expectedWeek={timeline.expectedWeek}
        />
      </section>

      <section className="py-8">
        <ol className="flex flex-col">
          {timeline.entries.map((entry) => {
            const statusMeta = bandStatusMeta[entry.status];
            return (
              <li
                key={entry.topic.id}
                className="grid grid-cols-1 items-center gap-y-2 border-b border-hairline py-3 md:min-h-11 md:grid-cols-[minmax(15rem,19rem)_minmax(0,1fr)_5.5rem] md:gap-x-8 md:gap-y-1 md:py-1.5"
              >
                <button
                  type="button"
                  onClick={() => openTopic(entry.topic.id)}
                  className="flex min-h-11 w-full min-w-0 flex-col justify-center self-stretch text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                >
                  <span className="flex items-center gap-2">
                    <span className="sr-only">Open topic · </span>
                    {entry.status === "active" ? (
                      <span
                        className="size-2 shrink-0 pulse-dot rounded-full bg-phase-1"
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className="font-mono text-micro tracking-[0.1em] text-ink-subtle tabular-nums">
                      {String(entry.phase.order).padStart(2, "0")}.
                      {String(entry.topic.order).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-micro tracking-[0.1em] text-ink-subtle tabular-nums">
                      {entry.topic.durationWeeks}w
                    </span>
                  </span>
                  <span className="mt-0.5 line-clamp-2 block font-sans text-body leading-snug font-medium text-ink md:line-clamp-1">
                    {entry.topic.title}
                  </span>
                </button>

                <div
                  className="grid h-6 w-full"
                  style={{ gridTemplateColumns: "repeat(36, minmax(0, 1fr))" }}
                  role="img"
                  aria-label={`${entry.topic.title}: ${weekRange(entry.startWeek, entry.endWeek)}, ${Math.round(entry.progress.percent)}% complete`}
                >
                  <div
                    className={cn(
                      "relative flex h-full items-center overflow-hidden rounded-xs border border-hairline transition-colors duration-200",
                      entry.status === "behind" &&
                        "border-[color-mix(in_oklch,var(--phase-4)_38%,transparent)]",
                      entry.status === "active" &&
                        "border-[color-mix(in_oklch,var(--phase-1)_40%,transparent)]",
                    )}
                    style={{
                      gridColumn: `${entry.startWeek} / span ${entry.endWeek - entry.startWeek + 1}`,
                      backgroundColor: `color-mix(in oklch, var(--phase-${entry.phase.order}) 10%, transparent)`,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-y-0 left-0 transition-[width] duration-500 ease-out",
                        entry.status === "behind"
                          ? "bg-phase-4/70"
                          : `bg-phase-${entry.phase.order}`,
                      )}
                      style={{
                        width: `${Math.max(0, Math.min(100, entry.progress.percent))}%`,
                      }}
                    />
                    {statusMeta.label || entry.progress.percent > 0 ? (
                      <span
                        className={cn(
                          "relative z-10 pl-1.5 font-mono text-micro tracking-[0.08em] tabular-nums",
                          entry.status === "complete"
                            ? "text-phase-contrast"
                            : "text-ink-subtle",
                        )}
                      >
                        {Math.round(entry.progress.percent)}%
                      </span>
                    ) : null}
                  </div>
                </div>

                <span
                  className={cn(
                    "text-left font-mono text-micro tracking-[0.1em] uppercase md:text-right",
                    statusMeta.tone,
                  )}
                >
                  {statusMeta.label || weekRange(entry.startWeek, entry.endWeek)}
                  {statusMeta.label ? (
                    <span className="mt-0.5 block text-ink-subtle">
                      {weekRange(entry.startWeek, entry.endWeek)}
                    </span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ol>

        {startDate !== null && milestones.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {milestones.map((milestone) => (
              <div
                key={milestone.label}
                className="rounded-sm border border-hairline bg-panel p-4"
              >
                <p className="font-mono text-micro tracking-[0.14em] text-ink-subtle uppercase">
                  Target
                </p>
                <p className="mt-2 truncate font-display text-body-lg leading-tight font-semibold text-ink">
                  {milestone.label}
                </p>
                <p className="mt-1 font-mono text-label text-ink-muted tabular-nums">
                  {milestone.date}
                </p>
              </div>
            ))}
          </div>
        ) : startDate === null ? (
          <Empty className="mt-8 rounded-sm border border-hairline bg-panel">
            <EmptyMedia>
              <CrosshairMark />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle className="font-display text-title-sm font-semibold tracking-[-0.02em] text-ink">
                No projection without a start date.
              </EmptyTitle>
              <EmptyContent className="font-sans text-body text-ink-muted">
                Set the date you began (or begin) the plan to project the crosshair and
                milestone targets.
              </EmptyContent>
            </EmptyHeader>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStartDateOpen(true)}
            >
              Set start date
            </Button>
          </Empty>
        ) : null}
      </section>
    </div>
  );
}
