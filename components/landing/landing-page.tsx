import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { BrandMark, Wordmark } from "@/components/brand";
import { ProgressBar } from "@/components/progress-bar";
import { formatWeeks, formatPercent } from "@/lib/format";
import { roadmapProgress } from "@/lib/progress";
import type { PhaseLine, TrackStats } from "@/lib/track-stats";
import type { RoadmapSnapshot } from "@/types/roadmap";

export type LandingTrack = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  estimated: boolean;
  sourceTitle: string | null;
  sourceUrl: string | null;
  stats: TrackStats;
  phases: PhaseLine[];
};

type LandingPageProps = {
  mode: "picker" | "progress";
  tracks: LandingTrack[];
  snapshots: RoadmapSnapshot[];
};

function accentFor(slug: string) {
  return `var(--track-${slug}, var(--track-accent))`;
}

function TrackPanel({
  track,
  index,
  mode,
  snapshot,
}: {
  track: LandingTrack;
  index: number;
  mode: LandingPageProps["mode"];
  snapshot: RoadmapSnapshot | undefined;
}) {
  const accent = accentFor(track.slug);
  const number = String(index + 1).padStart(2, "0");
  const progress = snapshot ? roadmapProgress(snapshot.phases) : null;

  return (
    <article
      aria-labelledby={`track-${track.slug}-title`}
      className="flex flex-col border border-hairline bg-panel p-6 sm:p-7"
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-micro tracking-[0.2em] text-ink-subtle">
          {number}
        </span>
        <span className="font-mono text-micro tracking-[0.16em] text-ink-subtle uppercase">
          {track.stats.totalWeeks} weeks{track.estimated ? "*" : ""}
        </span>
      </div>

      <h2
        id={`track-${track.slug}-title`}
        className="mt-3 font-display text-title leading-[1.15] font-semibold tracking-[-0.025em] text-ink"
      >
        {track.title}
      </h2>
      <p className="mt-2 font-sans text-caption leading-relaxed text-ink-muted">
        {track.subtitle}
      </p>

      <ol className="mt-6 border-t border-hairline">
        {track.phases.map((phase) => (
          <li
            key={phase.id}
            className="flex items-baseline justify-between gap-4 border-b border-hairline py-2.5"
          >
            <span className="font-sans text-caption text-ink">
              <span className="mr-2 font-mono text-micro text-ink-subtle">
                {String(phase.order).padStart(2, "0")}
              </span>
              {phase.title}
              {phase.prerequisite ? (
                <span
                  className="ml-2 align-[1px] font-mono text-micro tracking-[0.12em] uppercase"
                  style={{ color: accent }}
                >
                  Prereq
                </span>
              ) : null}
            </span>
            <span className="font-mono text-caption text-ink-muted tabular-nums">
              {phase.prerequisite ? "0w" : `${formatWeeks(phase.weeks)}w`}
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-4 font-mono text-micro tracking-[0.14em] text-ink-subtle uppercase">
        {track.stats.phases} phases · {track.stats.topics} topics ·{" "}
        {track.stats.subtopics} subtopics
      </p>

      {progress ? (
        <div className="mt-5">
          <div className="flex items-baseline justify-between gap-4">
            <span className="font-mono text-micro tracking-[0.14em] text-ink-muted uppercase">
              {progress.completedSubtopics}/{progress.totalSubtopics} subtopics
            </span>
            <span className="font-mono text-body text-ink tabular-nums">
              {formatPercent(progress.percent)}
            </span>
          </div>
          <ProgressBar
            value={progress.percent}
            label={`${track.title} progress`}
            accent={accent}
            className="mt-2"
          />
        </div>
      ) : null}

      <div className="mt-auto pt-6">
        <Link
          href={`/${track.slug}`}
          className="inline-flex min-h-11 items-center gap-2 font-mono text-label tracking-[0.1em] uppercase underline-offset-4"
          style={{ color: accent }}
        >
          {mode === "progress" ? `Continue ${track.title}` : `Start ${track.title}`}
          <ArrowRightIcon aria-hidden="true" className="size-4" strokeWidth={1.75} />
        </Link>
      </div>
    </article>
  );
}

export function LandingPage({ mode, tracks, snapshots }: LandingPageProps) {
  const snapshotBySlug = new Map(
    snapshots.map((snapshot) => [snapshot.track.slug, snapshot]),
  );
  const combinedWeeks = tracks.reduce((sum, track) => sum + track.stats.totalWeeks, 0);
  const [backendTrack, aiTrack] = tracks;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between gap-4 border-b border-hairline py-4">
        <Link href="/" className="inline-flex min-h-11 items-center gap-3">
          <BrandMark className="size-7" />
          <Wordmark />
        </Link>
        <Link
          href="/journey"
          className="font-mono text-micro tracking-[0.16em] text-ink-muted uppercase underline-offset-4 hover:text-ink hover:underline"
        >
          How the tracks connect
        </Link>
      </header>

      <main className="flex-1">
        <section
          aria-labelledby="landing-title"
          className="grid gap-10 pt-12 pb-14 sm:pt-16 lg:grid-cols-12 lg:gap-16"
        >
          <div className="lg:col-span-7">
            <p className="font-mono text-micro tracking-[0.2em] text-ink-subtle uppercase">
              Two tracks · One path
            </p>
            <h1
              id="landing-title"
              className="mt-4 font-display text-display-sm leading-[0.98] font-semibold tracking-[-0.045em] text-balance sm:text-display"
            >
              Two tracks,
              <br />
              one field plan<span className="text-phase-1">.</span>
            </h1>
            <p className="mt-6 max-w-xl font-sans text-body-lg leading-relaxed text-ink-muted">
              Backend Engineer is the fixed curriculum: language, APIs, data, production.
              AI Engineer starts where that foundation ends — Python, retrieval, agents,
              and the systems you will actually be asked to ship. Take them in order, or
              jump in where you already stand.
            </p>
            <p className="mt-5 font-mono text-micro tracking-[0.16em] text-ink-subtle uppercase">
              Backend, then AI — the recommended path
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#tracks"
                className="inline-flex h-10 items-center bg-ink px-5 font-mono text-label tracking-[0.08em] text-canvas uppercase"
                style={{ borderRadius: "var(--radius-sm)" }}
              >
                Choose your track
              </a>
              <Link
                href="/journey"
                className="inline-flex min-h-11 items-center gap-2 font-mono text-label tracking-[0.08em] text-ink uppercase underline-offset-4 hover:underline"
              >
                See how they connect
                <ArrowRightIcon
                  aria-hidden="true"
                  className="size-4"
                  strokeWidth={1.75}
                />
              </Link>
            </div>
          </div>

          <aside
            aria-label="The recommended path"
            className="self-start border border-hairline bg-panel p-6 lg:col-span-5"
          >
            <p className="font-mono text-micro tracking-[0.2em] text-ink-subtle uppercase">
              Recommended path
            </p>
            <ol className="mt-5">
              <li className="flex items-baseline gap-4">
                <span
                  className="font-mono text-readout leading-none font-medium"
                  style={{ color: "var(--track-backend)" }}
                >
                  1
                </span>
                <span>
                  <span className="block font-sans text-body font-semibold text-ink">
                    Backend Engineer
                  </span>
                  <span className="mt-1 block font-sans text-caption text-ink-muted">
                    Ship services first. Every later topic assumes it.
                  </span>
                </span>
              </li>
              <li
                aria-hidden="true"
                className="my-4 ml-6 border-l border-hairline-strong pl-4 font-mono text-micro tracking-[0.2em] text-ink-subtle"
              >
                THEN
              </li>
              <li className="flex items-baseline gap-4">
                <span
                  className="font-mono text-readout leading-none font-medium"
                  style={{ color: "var(--track-ai-engineer)" }}
                >
                  2
                </span>
                <span>
                  <span className="block font-sans text-body font-semibold text-ink">
                    AI Engineer
                  </span>
                  <span className="mt-1 block font-sans text-caption text-ink-muted">
                    Phase 01 mirrors your Backend progress and adds nothing new. Phases
                    02–05 are the part that is actually AI.
                  </span>
                </span>
              </li>
            </ol>
          </aside>
        </section>

        <section
          id="tracks"
          aria-labelledby="tracks-heading"
          className="scroll-mt-6 pb-16"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-hairline-strong pt-6">
            <h2
              id="tracks-heading"
              className="font-mono text-micro tracking-[0.2em] text-ink-subtle uppercase"
            >
              Index of tracks
            </h2>
            <p className="font-mono text-micro tracking-[0.16em] text-ink-subtle uppercase">
              {combinedWeeks} weeks combined
            </p>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {backendTrack ? (
              <TrackPanel
                track={backendTrack}
                index={0}
                mode={mode}
                snapshot={snapshotBySlug.get(backendTrack.slug)}
              />
            ) : null}
            {aiTrack ? (
              <TrackPanel
                track={aiTrack}
                index={1}
                mode={mode}
                snapshot={snapshotBySlug.get(aiTrack.slug)}
              />
            ) : null}
          </div>
          {aiTrack?.estimated ? (
            <p className="mt-4 font-mono text-micro tracking-[0.08em] text-ink-subtle">
              * All AI Engineer durations are estimates. Phase 01 is a zero-week
              prerequisite mirrored from the Backend track.
            </p>
          ) : null}
        </section>
      </main>

      <footer className="border-t border-hairline py-6">
        <p className="font-sans text-caption text-ink-muted">
          Frameworks change every week. The concepts underneath don&apos;t. Learn those.
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-micro tracking-[0.1em] text-ink-subtle uppercase">
            Source:{" "}
            {aiTrack?.sourceUrl ? (
              <a
                href={aiTrack.sourceUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-ink underline-offset-4 hover:underline"
              >
                {aiTrack.sourceTitle ?? "AI Engineer Roadmap 2027"}
              </a>
            ) : (
              aiTrack?.sourceTitle
            )}
          </p>
          <p className="font-mono text-micro tracking-[0.1em] text-ink-subtle uppercase">
            Guest-first · progress stored on this device
          </p>
        </div>
      </footer>
    </div>
  );
}
