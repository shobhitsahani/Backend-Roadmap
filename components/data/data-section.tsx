"use client";

import { useRef } from "react";
import { DownloadIcon, FolderInputIcon, RotateCcwIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { exportSnapshot, importProgressFile, resetAllProgress } from "@/lib/data-actions";
import { cn } from "@/lib/utils";
import { useRoadmapStore } from "@/store/roadmap-store";

const inputClass =
  "absolute size-px overflow-hidden whitespace-nowrap opacity-0 [clip-path:inset(50%)]";

export function DataSection() {
  const snapshot = useRoadmapStore((state) => state.snapshot);
  const replaceSnapshot = useRoadmapStore((state) => state.replaceSnapshot);
  const inputRef = useRef<HTMLInputElement>(null);

  const subtopicCount = snapshot.phases.reduce(
    (total, phase) =>
      total + phase.topics.reduce((acc, topic) => acc + topic.subtopics.length, 0),
    0,
  );

  return (
    <section className="border-b border-hairline py-8">
      <h2 className="font-mono text-caption tracking-[0.14em] text-ink uppercase">
        Data / progress file
      </h2>

      <div className="mt-5 rounded-sm border border-hairline bg-panel p-5">
        <p className="font-mono text-micro tracking-[0.1em] text-ink-subtle uppercase">
          Format backend-roadmap-progress · v2 · {snapshot.track.title} ·{" "}
          {snapshot.phases.length} phases ·{" "}
          {snapshot.phases.reduce((total, phase) => total + phase.topics.length, 0)}{" "}
          topics · {subtopicCount} subtopics · {snapshot.activity.length} log entries
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a
            href={`/api/export?track=${encodeURIComponent(snapshot.track.slug)}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            onClick={() => exportSnapshot(snapshot.track.slug)}
          >
            <DownloadIcon data-icon="inline-start" aria-hidden="true" />
            Export JSON
          </a>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            <FolderInputIcon data-icon="inline-start" aria-hidden="true" />
            Import JSON
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="application/json,.json"
            className={inputClass}
            tabIndex={-1}
            aria-hidden="true"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) {
                void importProgressFile(file, snapshot, replaceSnapshot);
              }
            }}
          />

          <AlertDialog>
            <AlertDialogTrigger
              render={(props) => (
                <Button type="button" variant="destructive" size="sm" {...props}>
                  <RotateCcwIcon data-icon="inline-start" aria-hidden="true" />
                  Reset progress
                </Button>
              )}
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset all progress?</AlertDialogTitle>
                <AlertDialogDescription>
                  Clears every check, note, log entry and the start date. This prepares
                  the tracker for a fresh start.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => {
                    void resetAllProgress(snapshot, replaceSnapshot);
                  }}
                >
                  Reset progress
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <p className="mt-4 font-mono text-micro leading-relaxed text-ink-subtle">
          Export snapshots the full ledger. Import replaces it and undo reverts to this
          state. Reset clears everything — undo is offered after each change.
        </p>
      </div>
    </section>
  );
}
