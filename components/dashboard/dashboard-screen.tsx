"use client";

import React from "react";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

import { DataSection } from "@/components/data/data-section";
import { TickingNumber } from "@/components/ticking-number";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
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
  const monthLabels = columns.map((column, index) => {
    const first = column.at(0);
    const previous = columns[index - 1]?.at(0);
    if (!first) return "";
    const firstDate = new Date(`${first.date}T00:00:00`);
    if (index === 0 || !previous) {
      return firstDate.toLocaleDateString("en-US", { month: "short" });
    }
    const previousDate = new Date(`${previous.date}T00:00:00`);
    return firstDate.getMonth() === previousDate.getMonth()
      ? ""
      : firstDate.toLocaleDateString("en-US", { month: "short" });
  });

  const activeDays = heatmap.filter((day) => day.count > 0).length;

  return (
    <div className="pt-8 md:pt-12">
      <section className="border-b border-hairline pb-10">
        <p className="font-mono text-micro tracking-[0.16em] text-phase-1 uppercase">
          Field log / progress ledger
        </p>
        <h1 className="mt-5 font-display text-display-sm leading-[0.98] font-semibold tracking-[-0.045em] text-ink md:text-display">
          Field log<span className="text-phase-1">.</span>
        </h1>
        <p className="mt-6 max-w-xl font-sans text-body-lg leading-relaxed text-ink-muted">
          What the log says: streak, recent entries, and how each phase is moving.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <div className="rounded-sm border border-hairline bg-panel p-4">
            <p className="font-mono text-micro tracking-[0.14em] text-ink-subtle uppercase">
              Streak
            </p>
            <p className="mt-3 flex items-baseline gap-1.5 font-mono text-title font-medium tracking-[-0.025em] text-ink">
              <TickingNumber value={streak} aria-label={`Streak of ${streak} days`} />
              <span className="text-label text-ink-subtle">DAYS</span>
            </p>
          </div>
          <div className="rounded-sm border border-hairline bg-panel p-4">
            <p className="font-mono text-micro tracking-[0.14em] text-ink-subtle uppercase">
              Weeks logged
            </p>
            <p className="mt-3 flex items-baseline gap-1.5 font-mono text-title font-medium tracking-[-0.025em] text-ink">
              <TickingNumber
                value={progress.completedWeeks}
                decimals={1}
                aria-label={`${progress.completedWeeks.toFixed(1)} weeks complete`}
              />
              <span className="text-label text-ink-subtle">/ 36</span>
            </p>
          </div>
          <div className="rounded-sm border border-hairline bg-panel p-4">
            <p className="font-mono text-micro tracking-[0.14em] text-ink-subtle uppercase">
              Topics complete
            </p>
            <p className="mt-3 flex items-baseline gap-1.5 font-mono text-title font-medium tracking-[-0.025em] text-ink">
              <TickingNumber value={progress.completedTopics} />
              <span className="text-label text-ink-subtle">/ {progress.totalTopics}</span>
            </p>
          </div>
          <div className="rounded-sm border border-hairline bg-panel p-4">
            <p className="font-mono text-micro tracking-[0.14em] text-ink-subtle uppercase">
              Log entries
            </p>
            <p className="mt-3 font-mono text-title font-medium tracking-[-0.025em] text-ink">
              <TickingNumber value={activity.length} />
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-hairline py-8">
        <div className="flex items-baseline justify-between">
          <h2 className="font-mono text-caption tracking-[0.14em] text-ink uppercase">
            Activity / last 12 weeks
          </h2>
          <span className="hidden font-mono text-micro text-ink-subtle sm:inline">
            {startDate ? `${activeDays} active days` : "start date not set"}
          </span>
        </div>

        <div className="mt-5 flex items-start gap-2">
          <div className="hidden shrink-0 flex-col gap-[3px] pt-[14px] font-mono text-micro text-ink-subtle sm:flex">
            <span className="h-[13px] leading-[13px]">M</span>
            <span className="h-[13px] leading-[13px]"> </span>
            <span className="h-[13px] leading-[13px]">W</span>
            <span className="h-[13px] leading-[13px]"> </span>
            <span className="h-[13px] leading-[13px]">F</span>
            <span className="h-[13px] leading-[13px]"> </span>
            <span className="h-[13px] leading-[13px]"> </span>
          </div>

          <div className="min-w-0 flex-1">
            <div
              className="mb-1 flex gap-[3px] font-mono text-micro text-ink-subtle"
              aria-hidden="true"
            >
              {monthLabels.map((label, index) => (
                <span
                  key={index}
                  className="flex-1 truncate leading-[13px] tracking-[0.08em]"
                >
                  {label}
                </span>
              ))}
            </div>

            <div
              className="flex flex-col gap-[3px]"
              role="img"
              aria-label={`Activity heatmap for the last 12 weeks: ${activeDays} active days${streak > 0 ? `, current streak ${streak} days` : ""}`}
            >
              <div className="flex gap-[3px]">
                {columns.map((column, columnIndex) => (
                  <div
                    key={columnIndex}
                    className="flex min-w-0 flex-1 flex-col gap-[3px]"
                  >
                    {column.map((day) => (
                      <span
                        key={day.date}
                        title={`${day.label} · ${day.count} ${day.count === 1 ? "entry" : "entries"}`}
                        className={cn(
                          "h-[13px] rounded-xs transition-colors duration-200",
                          heatLevelClass[day.level],
                        )}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 font-mono text-micro tracking-[0.1em] text-ink-subtle uppercase">
              <span>Less</span>
              {[0, 1, 2, 3].map((level) => (
                <span
                  key={level}
                  aria-hidden="true"
                  className={cn("size-[13px] rounded-xs", heatLevelClass[level])}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 py-8 md:grid-cols-2 md:gap-10">
        <div className="min-w-0">
          <h2 className="font-mono text-caption tracking-[0.14em] text-ink uppercase">
            Phases / percent complete
          </h2>
          <div className="mt-5 rounded-sm border border-hairline bg-panel p-4">
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
          </div>
        </div>

        <div className="min-w-0">
          <h2 className="font-mono text-caption tracking-[0.14em] text-ink uppercase">
            Recent activity
          </h2>
          <ul className="mt-3 flex flex-col">
            {feed.length === 0 ? (
              <li className="border-b border-hairline py-4 font-mono text-label text-ink-subtle">
                No entries yet. Check a subtopic to start the log.
              </li>
            ) : (
              feed.map((entry) => (
                <li
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
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      <DataSection />
    </div>
  );
}
