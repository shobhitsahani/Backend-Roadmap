"use client";

import { useMemo, useState } from "react";
import { ArrowUpRightIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { ProgressRing } from "@/components/progress-ring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { topicStatusLabel } from "@/lib/format";
import { findTopic, topicProgress } from "@/lib/progress";
import { buildTimeline } from "@/lib/timeline";
import { useRoadmapStore } from "@/store/roadmap-store";
import { useUiStore } from "@/store/ui-store";
import type { Topic } from "@/types/roadmap";

const phaseBadgeVariants = ["phase-1", "phase-2", "phase-3", "phase-4"] as const;

export function TopicPanel() {
  const selectedTopicId = useUiStore((state) => state.selectedTopicId);
  const closeTopic = useUiStore((state) => state.closeTopic);
  const toggleSubtopic = useRoadmapStore((state) => state.toggleSubtopic);
  const pending = useRoadmapStore((state) => state.pending);

  const phases = useRoadmapStore((state) => state.snapshot.phases);
  const startDate = useRoadmapStore((state) => state.snapshot.settings.startDate);
  const found = useMemo(
    () => (selectedTopicId ? findTopic(phases, selectedTopicId) : null),
    [phases, selectedTopicId],
  );

  const timeline = useMemo(() => buildTimeline(phases, startDate), [phases, startDate]);

  if (!found) {
    return null;
  }

  const { topic, phase } = found;
  const entry = timeline.entries.find((item) => item.topic.id === topic.id);
  const badgeVariant = phaseBadgeVariants[(phase.order - 1) % 4] ?? "phase-1";
  const progress = topicProgress(topic);
  const isPending = pending !== null;

  return (
    <Sheet open onOpenChange={(open) => !open && closeTopic()}>
      <SheetContent
        aria-describedby={`topic-${topic.id}-description`}
        className="flex flex-col"
        style={
          {
            "--topic-accent": `var(--phase-${phase.order})`,
            "--topic-accent-contrast": "var(--phase-contrast)",
          } as React.CSSProperties
        }
      >
        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-hairline-strong sm:hidden" />

        <header className="shrink-0 border-b border-hairline px-5 pt-5 pb-5 md:px-7 md:pt-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={badgeVariant}>
                Phase {String(phase.order).padStart(2, "0")}
              </Badge>
              <span className="font-mono text-micro tracking-[0.08em] text-ink-subtle uppercase">
                {phase.title}
              </span>
            </div>
            <SheetClose
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close topic panel"
                />
              }
            >
              <XIcon />
            </SheetClose>
          </div>

          <SheetHeader className="mt-5">
            <SheetTitle className="text-balance">{topic.title}</SheetTitle>
            <SheetDescription id={`topic-${topic.id}-description`}>
              {topic.summary}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-5 flex items-center gap-4 border-t border-hairline pt-5">
            <ProgressRing
              value={progress.percent}
              label={`${topic.title} progress`}
              size={56}
              strokeWidth={2.5}
              accent={`var(--phase-${phase.order})`}
            />
            <dl className="grid flex-1 grid-cols-3 gap-3">
              <div>
                <dt className="font-mono text-micro tracking-[0.08em] text-ink-subtle uppercase">
                  Status
                </dt>
                <dd className="mt-1 font-mono text-caption text-ink">
                  {topicStatusLabel(topic.status)}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-micro tracking-[0.08em] text-ink-subtle uppercase">
                  Weeks
                </dt>
                <dd className="mt-1 font-mono text-caption text-ink tabular-nums">
                  {entry
                    ? `W${String(entry.startWeek).padStart(2, "0")}–W${String(
                        entry.endWeek,
                      ).padStart(2, "0")}`
                    : topic.durationWeeks}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-micro tracking-[0.08em] text-ink-subtle uppercase">
                  Checks
                </dt>
                <dd className="mt-1 font-mono text-caption text-ink tabular-nums">
                  {progress.completedSubtopics}/{progress.totalSubtopics}
                </dd>
              </div>
            </dl>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-6 pb-10 md:px-7">
          <section aria-labelledby="subtopic-checklist-heading">
            <div className="flex items-baseline justify-between gap-4">
              <h3
                id="subtopic-checklist-heading"
                className="font-mono text-micro tracking-[0.12em] text-ink-subtle uppercase"
              >
                Subtopic checklist
              </h3>
              <span className="font-mono text-micro text-ink-subtle tabular-nums">
                {String(progress.completedSubtopics).padStart(2, "0")} /{" "}
                {String(progress.totalSubtopics).padStart(2, "0")}
              </span>
            </div>

            <ul className="mt-2 border-t border-hairline">
              {topic.subtopics.map((subtopic) => (
                <li key={subtopic.id} className="border-b border-hairline">
                  <label className="group flex min-h-11 cursor-pointer items-start gap-3 py-3">
                    <Checkbox
                      checked={subtopic.done}
                      disabled={isPending}
                      onCheckedChange={(checked) => {
                        void toggleSubtopic(subtopic.id, checked).catch(
                          (error: unknown) => {
                            toast.error("Could not update the checklist.", {
                              description:
                                error instanceof Error ? error.message : "Try again.",
                            });
                          },
                        );
                      }}
                      className="mt-0.5"
                    />
                    <span
                      className={`font-sans text-body leading-relaxed transition-colors ${
                        subtopic.done
                          ? "text-ink-subtle line-through decoration-hairline-strong/70"
                          : "text-ink-muted group-hover:text-ink"
                      }`}
                    >
                      {subtopic.title}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </section>

          {topic.tip ? (
            <aside className="mt-8 border-l-2 border-[var(--topic-accent)] pl-4">
              <p className="font-mono text-micro tracking-[0.12em] text-ink-subtle uppercase">
                Field note
              </p>
              <p className="mt-2 font-display text-body-lg leading-snug font-medium tracking-[-0.01em] text-ink">
                {topic.tip}
              </p>
            </aside>
          ) : null}

          {topic.outcome ? (
            <section className="mt-8 border-t border-hairline pt-6">
              <h3 className="font-mono text-micro tracking-[0.12em] text-ink-subtle uppercase">
                Outcome
              </h3>
              <p className="mt-2 font-sans text-body leading-relaxed text-ink-muted">
                {topic.outcome}
              </p>
            </section>
          ) : null}

          {topic.flow ? (
            <section className="mt-6">
              <h3 className="font-mono text-micro tracking-[0.12em] text-ink-subtle uppercase">
                Flow
              </h3>
              <p className="mt-2 overflow-x-auto rounded-xs border border-hairline bg-canvas px-3 py-2 font-mono text-caption whitespace-nowrap text-ink-muted">
                {topic.flow}
              </p>
            </section>
          ) : null}

          <NotesEditor key={topic.id} topic={topic} disabled={isPending} />

          <section aria-labelledby="resources-heading" className="mt-8">
            <h3
              id="resources-heading"
              className="font-mono text-micro tracking-[0.12em] text-ink-subtle uppercase"
            >
              Resources
            </h3>
            {topic.resources.length > 0 ? (
              <ul className="mt-2 border-t border-hairline">
                {topic.resources.map((resource) => (
                  <li key={resource.id} className="border-b border-hairline">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex min-h-11 items-center gap-3 py-3 font-sans text-body text-ink-muted transition-colors hover:text-ink"
                    >
                      <span className="min-w-0 flex-1">{resource.title}</span>
                      <ArrowUpRightIcon
                        aria-hidden="true"
                        className="size-4 shrink-0 text-ink-subtle transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 font-sans text-caption text-ink-muted">
                No external resources attached to this topic.
              </p>
            )}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function NotesEditor({ topic, disabled }: { topic: Topic; disabled: boolean }) {
  const saveNotes = useRoadmapStore((state) => state.saveNotes);
  const [notes, setNotes] = useState(topic.notes);
  const dirty = notes !== topic.notes;

  async function save() {
    if (!dirty || disabled) return;
    try {
      await saveNotes(topic.id, notes);
      toast.success("Notes saved.");
    } catch (error) {
      toast.error("Could not save notes.", {
        description: error instanceof Error ? error.message : "Try again.",
      });
    }
  }

  return (
    <section
      aria-labelledby="notes-heading"
      className="mt-8 border-t border-hairline pt-6"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3
          id="notes-heading"
          className="font-mono text-micro tracking-[0.12em] text-ink-subtle uppercase"
        >
          Working notes
        </h3>
        <span
          aria-live="polite"
          className={`font-mono text-micro tracking-[0.08em] uppercase ${
            dirty ? "text-phase-4" : "text-ink-subtle"
          }`}
        >
          {dirty ? "Unsaved" : "Saved"}
        </span>
      </div>
      <Textarea
        id="topic-notes"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        disabled={disabled}
        maxLength={20_000}
        placeholder="Commands, decisions, questions to resolve."
        className="mt-2 min-h-32 bg-canvas"
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault();
            void save();
          }
        }}
      />
      <div className="mt-3 flex items-center justify-between gap-4">
        <p className="font-mono text-micro text-ink-subtle tabular-nums">
          {notes.length} / 20,000
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!dirty || disabled}
          onClick={() => void save()}
        >
          Save notes
        </Button>
      </div>
    </section>
  );
}
