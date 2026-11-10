import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { ProgressBar } from "@/components/progress-bar";
import { formatWeeks, topicStatusLabel } from "@/lib/format";
import { roadmapProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";
import type { RoadmapSnapshot, Topic } from "@/types/roadmap";

type PrerequisiteLink = {
  from: RoadmapSnapshot;
  fromTopic: Topic;
  to: RoadmapSnapshot;
  toTopic: Topic;
};

function buildPrerequisiteLinks(snapshots: RoadmapSnapshot[]): PrerequisiteLink[] {
  const index = new Map<string, { snapshot: RoadmapSnapshot; topic: Topic }>();
  for (const snapshot of snapshots) {
    for (const phase of snapshot.phases) {
      for (const topic of phase.topics) {
        index.set(topic.id, { snapshot, topic });
      }
    }
  }

  const links: PrerequisiteLink[] = [];
  for (const snapshot of snapshots) {
    for (const phase of snapshot.phases) {
      for (const topic of phase.topics) {
        if (!topic.linkedTopicId) continue;
        const linked = index.get(topic.linkedTopicId);
        if (!linked || linked.snapshot.track.slug === snapshot.track.slug) continue;
        links.push({
          from: snapshot,
          fromTopic: topic,
          to: linked.snapshot,
          toTopic: linked.topic,
        });
      }
    }
  }
  return links;
}

export function JourneyOverview({ snapshots }: { snapshots: RoadmapSnapshot[] }) {
  const links = buildPrerequisiteLinks(snapshots);
  const credited = snapshots.find((snapshot) => snapshot.track.sourceUrl);

  return (
    <div className="pt-8 md:pt-12">
      <header className="border-b border-hairline pb-10">
        <p className="font-mono text-micro tracking-[0.16em] text-phase-1 uppercase">
          Journey / both tracks
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-display-sm leading-[0.98] font-semibold tracking-[-0.045em] text-balance md:text-display">
          Two tracks, one field plan<span className="text-phase-1">.</span>
        </h1>
        <p className="mt-4 max-w-2xl font-sans text-body-lg leading-relaxed text-ink-muted">
          The Backend track builds the foundation. The AI track reuses it, then adds
          retrieval, evaluation, and production systems. Progress stays separate per
          track.
        </p>
      </header>

      <section
        aria-labelledby="tracks-heading"
        className="grid gap-4 border-b border-hairline py-8 md:grid-cols-2"
      >
        <h2 id="tracks-heading" className="sr-only">
          Tracks
        </h2>
        {snapshots.map((snapshot, index) => {
          const progress = roadmapProgress(snapshot.phases);
          return (
            <article
              key={snapshot.track.id}
              className="rounded-sm border border-hairline bg-panel p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-micro tracking-[0.12em] text-ink-subtle uppercase">
                    Track {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-display text-title-sm font-semibold tracking-[-0.025em]">
                    {snapshot.track.title}
                  </h3>
                  <p className="mt-1 font-sans text-caption text-ink-muted">
                    {snapshot.track.subtitle}
                  </p>
                </div>
                <p className="shrink-0 pr-1 font-mono text-display-sm leading-none font-medium tracking-[-0.05em] text-ink">
                  {Math.round(progress.percent)}
                  <span className="text-caption text-ink-subtle">%</span>
                </p>
              </div>

              <ProgressBar
                value={progress.percent}
                label={`${snapshot.track.title} progress`}
                accent={`var(--track-${snapshot.track.slug}, var(--phase-1))`}
                className="mt-6"
              />

              <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-hairline pt-4 font-mono text-micro tracking-[0.1em] uppercase">
                <div>
                  <dt className="text-ink-subtle">Topics</dt>
                  <dd className="mt-1 text-caption text-ink tabular-nums">
                    {progress.completedTopics} / {progress.totalTopics}
                  </dd>
                </div>
                <div className="text-right">
                  <dt className="text-ink-subtle">Weeks</dt>
                  <dd className="mt-1 text-caption text-ink tabular-nums">
                    {formatWeeks(progress.completedWeeks)} / {progress.totalWeeks}
                  </dd>
                </div>
              </dl>

              <Link
                href={`/${snapshot.track.slug}`}
                className="mt-5 inline-flex min-h-11 items-center gap-2 font-mono text-micro tracking-[0.1em] text-ink uppercase underline-offset-4 transition-colors hover:text-phase-1 hover:underline"
              >
                Open {snapshot.track.title}
                <ArrowRightIcon aria-hidden="true" className="size-3.5" />
              </Link>
            </article>
          );
        })}
      </section>

      {links.length > 0 ? (
        <section aria-labelledby="bridge-heading" className="py-8">
          <h2
            id="bridge-heading"
            className="font-display text-title-sm font-semibold tracking-[-0.025em]"
          >
            Prerequisite bridge
          </h2>
          <p className="mt-2 max-w-2xl font-sans text-caption leading-relaxed text-ink-muted">
            AI prerequisites mirror the matching Backend topic. Finish it once and both
            tracks agree; override any item you already know from the AI roadmap.
          </p>

          <ul className="mt-4 flex flex-col border-t border-hairline">
            {links.map((link) => (
              <li
                key={`${link.from.track.slug}-${link.fromTopic.id}`}
                className="grid gap-2 border-b border-hairline py-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto] sm:items-center sm:gap-4"
              >
                <span className="min-w-0 truncate font-sans text-body text-ink">
                  {link.fromTopic.title}
                </span>
                <span className="hidden font-mono text-micro tracking-[0.1em] text-ink-subtle uppercase sm:inline">
                  requires
                </span>
                <Link
                  href={`/${link.to.track.slug}`}
                  className="min-w-0 truncate font-sans text-body text-ink-muted underline-offset-4 hover:text-ink hover:underline"
                >
                  {link.toTopic.title}
                </Link>
                <span
                  className={cn(
                    "font-mono text-micro tracking-[0.08em] uppercase",
                    link.fromTopic.status === "done" ? "text-phase-1" : "text-ink-subtle",
                  )}
                >
                  {topicStatusLabel(link.fromTopic.status)}
                  {link.fromTopic.mirrored ? " / mirrored" : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {credited ? (
        <footer className="mt-6 border-t border-hairline pt-6">
          <a
            href={credited.track.sourceUrl ?? "#"}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex min-h-11 items-center font-mono text-micro tracking-[0.08em] text-ink-subtle uppercase underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Source / {credited.track.sourceTitle ?? "Original curriculum"}
          </a>
        </footer>
      ) : null}
    </div>
  );
}
