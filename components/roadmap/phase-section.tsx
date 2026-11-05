"use client";

import type { KeyboardEvent } from "react";
import { CheckIcon, ChevronRightIcon } from "lucide-react";

import { ProgressBar } from "@/components/progress-bar";
import { ProgressRing } from "@/components/progress-ring";
import { Badge } from "@/components/ui/badge";
import { topicStatusLabel } from "@/lib/format";
import { phaseProgress, topicProgress } from "@/lib/progress";
import type { PhaseWithTopics, Topic } from "@/types/roadmap";

type PhaseSectionProps = {
  phase: PhaseWithTopics;
  currentTopicId: string | null;
  onOpenTopic: (topicId: string) => void;
};

const phaseBadgeVariants = ["phase-1", "phase-2", "phase-3", "phase-4"] as const;

export function PhaseSection({ phase, currentTopicId, onOpenTopic }: PhaseSectionProps) {
  const progress = phaseProgress(phase);
  const badgeVariant = phaseBadgeVariants[(phase.order - 1) % 4] ?? "phase-1";

  return (
    <section
      aria-labelledby={`phase-${phase.id}`}
      style={
        {
          "--topic-accent": `var(--phase-${phase.order})`,
          "--topic-accent-contrast": "var(--phase-contrast)",
        } as React.CSSProperties
      }
      className="border-b border-hairline py-8 md:py-10"
    >
      <header className="grid gap-5 md:grid-cols-[64px_minmax(0,1fr)_240px] md:items-start md:gap-8">
        <p className="font-mono text-caption text-ink-subtle tabular-nums">
          {String(phase.order).padStart(2, "0")}
        </p>
        <div>
          <h2
            id={`phase-${phase.id}`}
            className="font-display text-title-sm font-semibold tracking-[-0.025em] md:text-title"
          >
            {phase.title}
          </h2>
          <p className="mt-2 max-w-xl text-caption leading-relaxed text-ink-muted">
            {phase.subtitle}
          </p>
        </div>
        <div className="w-full max-w-sm md:justify-self-end">
          <div className="flex items-baseline justify-between gap-4 font-mono text-caption">
            <span className="text-ink tabular-nums">
              {progress.completedWeeks.toFixed(1)} / {progress.totalWeeks} weeks
            </span>
            <span className="text-ink-subtle tabular-nums">
              {Math.round(progress.percent)}%
            </span>
          </div>
          <ProgressBar
            value={progress.percent}
            label={`${phase.title} progress`}
            accent={`var(--phase-${phase.order})`}
            trackClassName="mt-2"
          />
          <p className="mt-2 font-mono text-micro tracking-[0.08em] text-ink-subtle uppercase">
            {progress.completedTopics} / {progress.totalTopics} topics complete
          </p>
        </div>
      </header>

      <ul className="mt-6 border-t border-hairline md:ml-24">
        {phase.topics.map((topic) => (
          <TopicRow
            key={topic.id}
            topic={topic}
            phase={phase}
            badgeVariant={badgeVariant}
            isCurrent={topic.id === currentTopicId}
            onOpen={() => onOpenTopic(topic.id)}
          />
        ))}
      </ul>
    </section>
  );
}

function TopicRow({
  topic,
  phase,
  badgeVariant,
  isCurrent,
  onOpen,
}: {
  topic: Topic;
  phase: PhaseWithTopics;
  badgeVariant: (typeof phaseBadgeVariants)[number];
  isCurrent: boolean;
  onOpen: () => void;
}) {
  const progress = topicProgress(topic);
  const done = topic.status === "done";
  const statusTone =
    topic.status === "not_started" ? "text-ink-subtle" : "text-[var(--topic-accent)]";

  return (
    <li className="border-b border-hairline last:border-b-0">
      <button
        type="button"
        data-topic-row
        onClick={onOpen}
        onKeyDown={moveTopicFocus}
        aria-label={`Open topic ${phase.order}.${topic.order}: ${topic.title}. ${Math.round(
          progress.percent,
        )}% complete.`}
        className={`group grid min-h-20 w-full grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3 border-l-2 border-l-transparent py-4 pr-1 text-left transition-colors duration-150 outline-none hover:bg-raised focus-visible:bg-raised focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-inset ${
          isCurrent ? "border-l-[var(--topic-accent)] phase-wash" : ""
        }`}
      >
        <span className="self-start pt-1 font-mono text-caption text-ink-subtle tabular-nums">
          {phase.order}.{topic.order}
        </span>

        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {isCurrent ? (
              <span
                className="relative flex size-2 shrink-0 items-center justify-center"
                aria-hidden="true"
              >
                <span className="absolute inset-0 pulse-dot rounded-full bg-[var(--topic-accent)]/40" />
                <span className="size-1.5 rounded-full bg-[var(--topic-accent)]" />
              </span>
            ) : null}
            {done ? (
              <CheckIcon
                aria-hidden="true"
                className="size-4 shrink-0 text-[var(--topic-accent)]"
              />
            ) : null}
            <span className="font-display text-body-lg leading-tight font-semibold tracking-[-0.015em] text-ink">
              {topic.title}
            </span>
            {isCurrent ? (
              <Badge variant={badgeVariant}>
                {progress.percent > 0 ? "Current" : "Next"}
              </Badge>
            ) : null}
          </span>
          <span className="mt-1.5 line-clamp-2 block font-sans text-caption leading-relaxed text-ink-muted">
            {topic.summary}
          </span>
          <span className="mt-2 flex items-center gap-4 font-mono text-micro tracking-[0.08em] text-ink-subtle uppercase sm:hidden">
            <span>{topic.durationWeeks} weeks</span>
            <span className={statusTone}>{topicStatusLabel(topic.status)}</span>
          </span>
        </span>

        <span className="flex items-center gap-3 md:gap-5">
          <span className="hidden min-w-24 text-right sm:block">
            <span className="block font-mono text-caption text-ink tabular-nums">
              {topic.durationWeeks} weeks
            </span>
            <span
              className={`mt-1 block font-mono text-micro tracking-[0.08em] uppercase ${statusTone}`}
            >
              {topicStatusLabel(topic.status)}
            </span>
          </span>
          <ProgressRing
            value={progress.percent}
            label={`${topic.title} progress`}
            size={38}
            strokeWidth={2}
            accent="var(--topic-accent)"
          />
          <ChevronRightIcon
            aria-hidden="true"
            className="hidden size-4 shrink-0 text-ink-subtle transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-ink md:block"
          />
        </span>
      </button>
    </li>
  );
}

function moveTopicFocus(event: KeyboardEvent<HTMLButtonElement>) {
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;

  const rows = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-topic-row]"),
  );
  const index = rows.indexOf(event.currentTarget);
  if (index === -1) return;

  event.preventDefault();
  let nextIndex = index;
  if (event.key === "ArrowDown") nextIndex = Math.min(rows.length - 1, index + 1);
  if (event.key === "ArrowUp") nextIndex = Math.max(0, index - 1);
  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = rows.length - 1;
  rows[nextIndex]?.focus();
}
