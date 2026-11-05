import { ArrowUpRightIcon } from "lucide-react";

import { BrandMark, Wordmark } from "@/components/brand";
import { DemoChecklist } from "@/components/demo-checklist";
import { ProgressRing } from "@/components/progress-ring";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { WeekRuler } from "@/components/week-ruler";
import { phaseSeeds, topicSeeds } from "@/db/seed-data";

export default function Home() {
  const weeksByPhase = new Map(
    phaseSeeds.map((phase) => [
      phase.id,
      topicSeeds
        .filter((topic) => topic.phaseId === phase.id)
        .reduce((total, topic) => total + topic.durationWeeks, 0),
    ]),
  );

  return (
    <main className="min-h-dvh bg-canvas text-ink">
      <header className="sticky top-0 z-30 border-b border-hairline bg-canvas">
        <div className="mx-auto flex min-h-16 max-w-[1440px] items-center justify-between gap-4 px-4 md:px-10">
          <div className="flex items-center gap-3">
            <BrandMark />
            <Wordmark />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Design review</Badge>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 pt-10 pb-20 md:px-10 md:pt-16">
        <section className="grid gap-10 border-b border-hairline pb-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
          <div>
            <p className="font-mono text-micro tracking-[0.16em] text-phase-1 uppercase">
              Field manual / 36 weeks / Four phases
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-display-sm leading-[0.98] font-semibold tracking-[-0.045em] text-balance md:text-display">
              Backend roadmap<span className="text-phase-1">.</span>
            </h1>
            <p className="mt-6 max-w-xl font-sans text-body-lg leading-relaxed text-ink-muted">
              A field plan for moving from language fundamentals to systems that hold up
              in production.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Badge variant="phase-1">Foundation</Badge>
              <Badge variant="phase-2">Core backend</Badge>
              <Badge variant="phase-3">Production</Badge>
              <Badge variant="phase-4">Hard core</Badge>
            </div>
          </div>

          <div className="rounded-sm border border-hairline bg-panel p-5">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-mono text-micro tracking-[0.14em] text-ink-subtle uppercase">
                  Overall progress
                </p>
                <p className="mt-3 font-mono tnum text-[3.5rem] leading-none font-medium tracking-[-0.07em] text-ink">
                  0<span className="text-title text-ink-subtle">%</span>
                </p>
              </div>
              <ProgressRing value={0} label="Overall roadmap progress" size={52} />
            </div>
            <div className="mt-6 border-t border-hairline pt-5">
              <WeekRuler
                segments={phaseSeeds.map((phase) => ({
                  phase: phase.order as 1 | 2 | 3 | 4,
                  weeks: weeksByPhase.get(phase.id) ?? 0,
                }))}
                completedWeeks={0}
                expectedWeek={6}
              />
            </div>
            <div className="mt-5 flex items-center justify-between font-mono text-micro tracking-[0.1em] text-ink-subtle uppercase">
              <span>Weeks complete</span>
              <span className="text-ink">00 / 36</span>
            </div>
          </div>
        </section>

        <section aria-labelledby="phase-index" className="pt-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-micro tracking-[0.14em] text-ink-subtle uppercase">
                Index
              </p>
              <h2
                id="phase-index"
                className="mt-2 font-display text-title font-semibold tracking-[-0.03em]"
              >
                Four phases
              </h2>
            </div>
            <span className="font-mono text-micro text-ink-subtle">01—04</span>
          </div>

          <div className="mt-8 border-t border-hairline">
            {phaseSeeds.map((phase, index) => {
              const weeks = weeksByPhase.get(phase.id) ?? 0;
              return (
                <article
                  key={phase.id}
                  className="grid gap-5 border-b border-hairline py-7 md:grid-cols-[64px_minmax(0,1fr)_auto] md:items-start md:gap-8"
                  style={
                    {
                      "--topic-accent": `var(--phase-${phase.order})`,
                      "--topic-accent-contrast": "var(--phase-contrast)",
                    } as React.CSSProperties
                  }
                >
                  <span className="font-mono text-caption text-ink-subtle tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-title-sm font-semibold tracking-[-0.025em] md:text-title">
                      {phase.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-caption text-ink-muted">
                      {phase.subtitle}
                    </p>
                    {phase.order === 1 ? (
                      <div className="mt-5 max-w-lg">
                        <DemoChecklist />
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-5 md:justify-end">
                    <div className="text-right">
                      <p className="font-mono text-caption text-ink tabular-nums">
                        {weeks} weeks
                      </p>
                      <p className="mt-1 font-mono text-micro tracking-[0.08em] text-ink-subtle uppercase">
                        {topicSeeds.filter((topic) => topic.phaseId === phase.id).length}{" "}
                        topics
                      </p>
                    </div>
                    <ProgressRing
                      value={0}
                      label={`${phase.title} progress`}
                      accent={`var(--phase-${phase.order})`}
                      size={48}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <footer className="mt-16 grid gap-6 border-t border-hairline pt-8 md:grid-cols-[1fr_auto] md:items-end">
          <blockquote className="max-w-2xl font-display text-title-sm leading-snug font-medium tracking-[-0.02em] text-ink">
            “Backend isn&apos;t about memorizing tools — it&apos;s about solving problems
            under constraints.”
          </blockquote>
          <a
            href="https://github.com"
            className="inline-flex min-h-11 items-center gap-2 font-mono text-label tracking-[0.08em] text-ink-muted uppercase transition-colors hover:text-ink"
          >
            Field manual / v0.1
            <ArrowUpRightIcon className="size-4" aria-hidden="true" />
          </a>
        </footer>
      </div>
    </main>
  );
}
