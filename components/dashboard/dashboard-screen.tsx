"use client";

import Link from "next/link";
import React from "react";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import { motion } from "motion/react";

import { revealContainer, revealItem } from "@/lib/motion";

import { DataSection } from "@/components/data/data-section";
import { ProgressCore } from "@/components/three/progress-core";
import { RulerMark } from "@/components/empty-states/line-art";
import { TickingNumber } from "@/components/ticking-number";
import { buttonVariants } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  buildHeatmap,
  calculateStreak,
  phaseProgress,
  roadmapProgress,
  startOfLocalDay,
} from "@/lib/progress";
import { cn } from "@/lib/utils";
import { useRoadmapStore } from "@/store/roadmap-store";
import type { ActivityKind, PhaseWithTopics, Topic } from "@/types/roadmap";

const phaseChartConfig = {
  percent: { label: "Complete" },
} satisfies ChartConfig;

const heatLevelClass: Record<string, string> = {
  0: "bg-hairline",
  1: "bg-[color-mix(in_oklch,var(--phase-1)_30%,transparent)]",
  2: "bg-[color-mix(in_oklch,var(--phase-1)_62%,transparent)]",
  3: "bg-phase-1",
};

const verbByKind: Record<ActivityKind, string> = {
  subtopic_checked: "Checked",
  subtopic_unchecked: "Unchecked",
  topic_completed: "Topic complete",
  topic_reopened: "Topic reopened",
};

const feedToneByKind: Record<ActivityKind, string> = {
  subtopic_checked: "bg-phase-1",
  subtopic_unchecked: "bg-ink-subtle",
  topic_completed: "bg-phase-1",
  topic_reopened: "bg-phase-3",
};

function dayLabel(value: string, today: Date) {
  const date = new Date(`${value}T00:00:00`);
  const diffDays = Math.round(
    (startOfLocalDay(today).getTime() - startOfLocalDay(date).getTime()) / 86_400_000,
  );
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yest";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function DashboardScreen() {
  const snapshot = useRoadmapStore((state) => state.snapshot);

  const phases = snapshot.phases;
  const activity = snapshot.activity;
  const startDate = snapshot.settings.startDate;

  const progress = React.useMemo(() => roadmapProgress(phases), [phases]);
  const streak = React.useMemo(() => calculateStreak(activity), [activity]);
  const heatmap = React.useMemo(() => buildHeatmap(activity), [activity]);
  const today = React.useMemo(() => startOfLocalDay(new Date()), []);

  const topicIndex = React.useMemo(() => {
    const map = new Map<string, { topic: Topic; phase: PhaseWithTopics }>();
    phases.forEach((phase) =>
      phase.topics.forEach((topic) => map.set(topic.id, { topic, phase })),
    );
    return map;
  }, [phases]);

  const phaseBars = React.useMemo(
    () =>
      phases.map((phase) => ({
        phase: String(phase.order).padStart(2, "0"),
        title: phase.title,
        percent: Math.round(phaseProgress(phase).percent),
        fill: `var(--phase-${phase.order})`,
      })),
    [phases],
  );

  const feed = React.useMemo(
    () =>
      [...activity]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 8)
        .map((entry) => {
          const found = entry.topicId ? topicIndex.get(entry.topicId) : undefined;
          const topicTitle = found ? found.topic.title : null;
          const subtopicTitle =
            found && entry.subtopicId
              ? (found.topic.subtopics.find(
                  (subtopic) => subtopic.id === entry.subtopicId,
                )?.title ?? null)
              : null;
          return {
            id: entry.id,
            kind: entry.kind,
            title: subtopicTitle ?? topicTitle ?? "Unassigned entry",
            day: dayLabel(new Date(entry.createdAt).toISOString().slice(0, 10), today),
          };
        }),
    [activity, today, topicIndex],
  );

  const heatmapWeeks = 12;
  const columns = Array.from({ length: heatmapWeeks }, (_, week) =>
    heatmap.slice(week * 7, week * 7 + 7),
  );
  const monthGroups = columns.reduce<{ label: string; start: number; span: number }[]>(
    (groups, column, index) => {
      const first = column.at(0);
      if (!first) return groups;
      const label = new Date(`${first.date}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
      });
      const last = groups.at(-1);
      if (last && last.label === label) {
        last.span += 1;
      } else {
        groups.push({ label, start: index + 1, span: 1 });
      }
      return groups;
    },
    [],
  );

  const activeDays = heatmap.filter((day) => day.count > 0).length;
  const hasPhaseProgress = phaseBars.some((bar) => bar.percent > 0);

  return (
    <div className="pt-8 md:pt-12">
      <section className="border-b border-hairline pb-10">
        <h1 className="font-display text-display-sm leading-[0.98] font-semibold tracking-[-0.045em] text-ink md:text-display">
          Field log<span className="text-phase-1">.</span>
        </h1>
        <p className="mt-4 font-mono text-micro tracking-[0.16em] text-phase-1 uppercase">
          Field log / progress ledger
        </p>
        <p className="mt-5 max-w-xl font-sans text-body-lg leading-relaxed text-ink-muted">
          What the log says: streak, recent entries, and how each phase is moving.
        </p>

        <motion.div
          variants={revealContainer}
          initial="hidden"
          animate="visible"
          className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
        >
          <motion.div
            variants={revealItem}
            className="rounded-sm border border-hairline bg-panel p-4"
          >
            <p className="font-mono text-micro tracking-[0.14em] text-ink-subtle uppercase">
              Streak
            </p>
            <p className="mt-3 flex items-baseline gap-1.5 font-mono text-title font-medium tracking-[-0.025em] text-ink">
              <TickingNumber value={streak} aria-label={`Streak of ${streak} days`} />
              <span className="text-label text-ink-subtle">DAYS</span>
            </p>
          </motion.div>
          <motion.div
            variants={revealItem}
            className="rounded-sm border border-hairline bg-panel p-4"
          >
            <p className="font-mono text-micro tracking-[0.14em] text-ink-subtle uppercase">
              Weeks logged
            </p>
            <p className="mt-3 flex items-baseline gap-1.5 font-mono text-title font-medium tracking-[-0.025em] text-ink">
              <TickingNumber
                value={progress.completedWeeks}
                decimals={1}
                aria-label={`${progress.completedWeeks.toFixed(1)} weeks complete`}
              />
              <span className="text-label text-ink-subtle">/ {progress.totalWeeks}</span>
            </p>
          </motion.div>
          <motion.div
            variants={revealItem}
            className="rounded-sm border border-hairline bg-panel p-4"
          >
            <p className="font-mono text-micro tracking-[0.14em] text-ink-subtle uppercase">
              Topics complete
            </p>
            <p className="mt-3 flex items-baseline gap-1.5 font-mono text-title font-medium tracking-[-0.025em] text-ink">
              <TickingNumber value={progress.completedTopics} />
              <span className="text-label text-ink-subtle">/ {progress.totalTopics}</span>
            </p>
          </motion.div>
          <motion.div
            variants={revealItem}
            className="rounded-sm border border-hairline bg-panel p-4"
          >
            <p className="font-mono text-micro tracking-[0.14em] text-ink-subtle uppercase">
              Log entries
            </p>
            <p className="mt-3 font-mono text-title font-medium tracking-[-0.025em] text-ink">
              <TickingNumber value={activity.length} />
            </p>
          </motion.div>
        </motion.div>
      </section>

      <section className="border-b border-hairline py-8">
        <div className="flex items-baseline justify-between">
          <h2 className="font-mono text-caption tracking-[0.14em] text-ink uppercase">
            Activity / last 12 weeks
          </h2>
          <span className="hidden font-mono text-micro text-ink-subtle uppercase sm:inline">
            {startDate ? `${activeDays} active days` : "Start date not set"}
          </span>
        </div>

        <div className="mt-5 flex items-start gap-2">
          <div className="hidden shrink-0 flex-col gap-[3px] pt-[17px] font-mono text-micro text-ink-subtle sm:flex">
            {["M", "", "W", "", "F", "", ""].map((label, index) => (
              <span
                key={index}
                aria-hidden="true"
                className="flex size-6 items-center leading-none"
              >
                {label}
              </span>
            ))}
          </div>

          <div className="min-w-0 flex-1">
            <div className="-mx-1 overflow-x-auto px-1 pb-1">
              <div className="inline-block">
                <div
                  className="mb-1 grid gap-[3px] font-mono text-micro text-ink-subtle"
                  style={{
                    gridTemplateColumns: `repeat(${heatmapWeeks}, 24px)`,
                  }}
                  aria-hidden="true"
                >
                  {monthGroups.map((group) => (
                    <span
                      key={`${group.label}-${group.start}`}
                      className="truncate leading-[13px] tracking-[0.08em]"
                      style={{ gridColumn: `${group.start} / span ${group.span}` }}
                    >
                      {group.label}
                    </span>
                  ))}
                </div>

                <div
                  className="grid gap-[3px]"
                  style={{
                    gridTemplateColumns: `repeat(${heatmapWeeks}, 24px)`,
                  }}
                  role="img"
                  aria-label={`Activity heatmap for the last 12 weeks: ${activeDays} active days${streak > 0 ? `, current streak ${streak} days` : ""}`}
                >
                  {columns.map((column, columnIndex) => (
                    <div key={columnIndex} className="flex flex-col gap-[3px]">
                      {column.map((day) => (
                        <span
                          key={day.date}
                          title={`${day.label} · ${day.count} ${day.count === 1 ? "entry" : "entries"}`}
                          className={cn(
                            "size-6 rounded-xs transition-colors duration-200",
                            heatLevelClass[day.level],
                          )}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 font-mono text-micro tracking-[0.1em] text-ink-subtle uppercase">
              <span>Less</span>
              {[0, 1, 2, 3].map((level) => (
                <span
                  key={level}
                  aria-hidden="true"
                  className={cn("size-3 rounded-xs", heatLevelClass[level])}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <h2 className="font-mono text-caption tracking-[0.14em] text-ink uppercase">
          Progress core
        </h2>
        <div className="mt-5">
          <ProgressCore phases={phases} trackSlug={snapshot.track.slug} />
        </div>
      </section>

      <section className="grid gap-8 py-8 md:grid-cols-2 md:gap-10">
        <div className="min-w-0">
          <h2 className="font-mono text-caption tracking-[0.14em] text-ink uppercase">
            Phases / percent complete
          </h2>
          <div className="mt-5 rounded-sm border border-hairline bg-panel p-4">
            {hasPhaseProgress ? (
              <ChartContainer
                config={phaseChartConfig}
                className="aspect-auto h-44 font-mono [&_.recharts-cartesian-axis-tick_text]:font-mono [&_.recharts-cartesian-axis-tick_text]:tracking-[0.1em]"
              >
                <BarChart
                  data={phaseBars}
                  margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
                >
                  <XAxis
                    dataKey="phase"
                    tickLine={false}
                    axisLine={{ stroke: "var(--hairline)" }}
                    tick={{ fontSize: 10, fill: "var(--ink-subtle)" }}
                    dy={4}
                  />
                  <YAxis domain={[0, 100]} width={0} />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                  <Bar
                    dataKey="percent"
                    radius={[2, 2, 0, 0]}
                    maxBarSize={44}
                    isAnimationActive={false}
                  >
                    {phaseBars.map((bar) => (
                      <Cell key={bar.phase} fill={bar.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-44 flex-col items-center justify-center gap-2 px-4 text-center">
                <p className="font-display text-title-sm font-semibold tracking-[-0.02em] text-ink">
                  No progress logged yet.
                </p>
                <p className="max-w-[28ch] font-sans text-caption leading-relaxed text-ink-muted">
                  Check a subtopic in the roadmap to start the phase bars.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <h2 className="font-mono text-caption tracking-[0.14em] text-ink uppercase">
            Recent activity
          </h2>
          {feed.length === 0 ? (
            <Empty className="mt-3 rounded-sm border border-hairline bg-panel">
              <EmptyMedia>
                <RulerMark />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle className="font-display text-title-sm font-semibold tracking-[-0.02em] text-ink">
                  No entries in the log.
                </EmptyTitle>
                <EmptyContent className="font-sans text-body text-ink-muted">
                  Check a subtopic in the roadmap to start the field log.
                </EmptyContent>
              </EmptyHeader>
              <Link
                href={`/${snapshot.track.slug}`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Go to Roadmap
              </Link>
            </Empty>
          ) : (
            <motion.ul
              variants={revealContainer}
              initial="hidden"
              animate="visible"
              className="mt-3 flex flex-col"
            >
              {feed.map((entry) => (
                <motion.li
                  variants={revealItem}
                  key={entry.id}
                  className="flex min-h-10 min-w-0 items-center justify-between gap-4 border-b border-hairline py-2"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-1.5 shrink-0 rounded-full",
                        feedToneByKind[entry.kind],
                      )}
                    />
                    <span className="hidden shrink-0 font-mono text-micro tracking-[0.08em] text-ink-subtle uppercase sm:inline">
                      {verbByKind[entry.kind]}
                    </span>
                    <span className="min-w-0 truncate font-sans text-body text-ink">
                      {entry.title}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-micro tracking-[0.1em] text-ink-subtle uppercase tabular-nums">
                    {entry.day}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </div>
      </section>

      <DataSection />
    </div>
  );
}
