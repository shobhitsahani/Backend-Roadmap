"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarIcon,
  DownloadIcon,
  MoonIcon,
  RotateCcwIcon,
  SunIcon,
  UploadIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore, type ChangeEvent } from "react";

import { SHORTCUTS } from "@/components/command/shortcuts-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { exportSnapshot, importProgressFile, resetAllProgress } from "@/lib/data-actions";
import { formatDate, formatWeeks } from "@/lib/format";
import { roadmapProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { useRoadmapStore } from "@/store/roadmap-store";
import { useThreeStore } from "@/store/three-store";
import { useUiStore } from "@/store/ui-store";

export function SettingsScreen() {
  const snapshot = useRoadmapStore((state) => state.snapshot);
  const replaceSnapshot = useRoadmapStore((state) => state.replaceSnapshot);
  const pending = useRoadmapStore((state) => state.pending);
  const setStartDateOpen = useUiStore((state) => state.setStartDateOpen);
  const threePreference = useThreeStore((state) => state.preference);
  const setThreePreference = useThreeStore((state) => state.setPreference);
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const isDark = mounted ? resolvedTheme !== "light" : true;
  const progress = roadmapProgress(snapshot.phases);
  const track = snapshot.track;

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    void importProgressFile(file, snapshot, replaceSnapshot);
    event.target.value = "";
  }

  return (
    <div className="pt-8 md:pt-12">
      <header className="border-b border-hairline pb-10">
        <p className="font-mono text-micro tracking-[0.16em] text-phase-1 uppercase">
          Settings / {track.title}
        </p>
        <h1 className="mt-3 font-display text-display-sm leading-[0.98] font-semibold tracking-[-0.045em] md:text-display">
          Settings<span className="text-phase-1">.</span>
        </h1>
        <p className="mt-4 max-w-2xl font-sans text-body-lg leading-relaxed text-ink-muted">
          One ledger per track. Change the plan&apos;s anchor, move your data, or reset
          the checkboxes without touching the curriculum.
        </p>
      </header>

      <section
        aria-labelledby="track-settings"
        className="grid gap-6 border-b border-hairline py-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10"
      >
        <div>
          <p className="font-mono text-micro tracking-[0.12em] text-ink-subtle uppercase">
            01 / Track
          </p>
          <h2
            id="track-settings"
            className="mt-2 font-display text-title-sm font-semibold tracking-[-0.02em]"
          >
            {track.title}
          </h2>
        </div>
        <div className="flex flex-col gap-5">
          <p className="max-w-xl font-sans text-body text-ink-muted">
            {track.subtitle}. {formatWeeks(progress.completedWeeks)} of{" "}
            {progress.totalWeeks} weeks logged across {progress.totalTopics} topics.
          </p>

          <dl className="grid gap-4 border-t border-hairline pt-4 font-mono text-micro tracking-[0.1em] uppercase sm:grid-cols-2">
            <div>
              <dt className="text-ink-subtle">Start date</dt>
              <dd className="mt-1 text-caption text-ink">
                {formatDate(snapshot.settings.startDate)}
              </dd>
            </div>
            <div>
              <dt className="text-ink-subtle">Completion</dt>
              <dd className="mt-1 text-caption text-ink tabular-nums">
                {Math.round(progress.percent)}%
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStartDateOpen(true)}
            >
              <CalendarIcon data-icon="inline-start" aria-hidden="true" />
              Set start date
            </Button>
            <Link
              href={`/${track.slug}/timeline`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Open timeline
            </Link>
            <Link
              href="/journey"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Journey
              <ArrowRightIcon aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="three-d-settings"
        className="grid gap-6 border-b border-hairline py-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10"
      >
        <div>
          <p className="font-mono text-micro tracking-[0.12em] text-ink-subtle uppercase">
            02 / 3D effects
          </p>
          <h2
            id="three-d-settings"
            className="mt-2 font-display text-title-sm font-semibold tracking-[-0.02em]"
          >
            3D effects
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          <p className="max-w-xl font-sans text-body text-ink-muted">
            3D is on by default. Choose reduced motion or off if your device struggles or
            you prefer a static view.
          </p>
          <div role="group" aria-label="3D effects" className="flex flex-wrap gap-2">
            {(["on", "reduced", "off"] as const).map((value) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={threePreference === value ? "default" : "outline"}
                aria-pressed={threePreference === value}
                onClick={() => setThreePreference(value)}
              >
                {value === "on" ? "On" : value === "reduced" ? "Reduced" : "Off"}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="appearance-settings"
        className="grid gap-6 border-b border-hairline py-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10"
      >
        <div>
          <p className="font-mono text-micro tracking-[0.12em] text-ink-subtle uppercase">
            03 / Appearance
          </p>
          <h2
            id="appearance-settings"
            className="mt-2 font-display text-title-sm font-semibold tracking-[-0.02em]"
          >
            Theme
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          <p className="max-w-xl font-sans text-body text-ink-muted">
            Dark is the default field mode. Both themes keep the same contrast targets.
          </p>
          <div role="group" aria-label="Theme" className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={isDark ? "default" : "outline"}
              aria-pressed={isDark}
              onClick={() => setTheme("dark")}
            >
              <MoonIcon data-icon="inline-start" aria-hidden="true" />
              Dark
            </Button>
            <Button
              type="button"
              size="sm"
              variant={!isDark ? "default" : "outline"}
              aria-pressed={!isDark}
              onClick={() => setTheme("light")}
            >
              <SunIcon data-icon="inline-start" aria-hidden="true" />
              Light
            </Button>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="data-settings"
        className="grid gap-6 border-b border-hairline py-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10"
      >
        <div>
          <p className="font-mono text-micro tracking-[0.12em] text-ink-subtle uppercase">
            04 / Data
          </p>
          <h2
            id="data-settings"
            className="mt-2 font-display text-title-sm font-semibold tracking-[-0.02em]"
          >
            Progress file
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          <p className="max-w-xl font-sans text-body text-ink-muted">
            Export a JSON file for this track, import it on another browser, or clear the
            checkboxes. Every data action offers an undo toast.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => exportSnapshot(track.slug)}
            >
              <DownloadIcon data-icon="inline-start" aria-hidden="true" />
              Export progress
            </Button>
            <label
              htmlFor="import-progress"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "cursor-pointer",
              )}
            >
              <UploadIcon data-icon="inline-start" aria-hidden="true" />
              Import progress
            </label>
            <input
              id="import-progress"
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={handleFile}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={pending !== null}
              onClick={() => void resetAllProgress(snapshot, replaceSnapshot)}
            >
              <RotateCcwIcon data-icon="inline-start" aria-hidden="true" />
              Reset progress
            </Button>
          </div>
          <p className="font-mono text-micro tracking-[0.08em] text-ink-subtle uppercase">
            Format backend-roadmap-progress / version 1 or 2
          </p>
        </div>
      </section>

      <section
        aria-labelledby="keyboard-settings"
        className="grid gap-6 py-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10"
      >
        <div>
          <p className="font-mono text-micro tracking-[0.12em] text-ink-subtle uppercase">
            05 / Keyboard
          </p>
          <h2
            id="keyboard-settings"
            className="mt-2 font-display text-title-sm font-semibold tracking-[-0.02em]"
          >
            Shortcuts
          </h2>
        </div>
        <dl className="flex flex-col border-t border-hairline">
          {SHORTCUTS.map((shortcut) => (
            <div
              key={shortcut.keys}
              className="flex min-h-11 items-center justify-between gap-6 border-b border-hairline py-1.5"
            >
              <dt className="font-sans text-body text-ink-muted">
                {shortcut.description}
              </dt>
              <dd className="shrink-0 rounded-xs border border-hairline px-1.5 py-0.5 font-mono text-micro tracking-[0.08em] text-ink">
                {shortcut.keys}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
