"use client";

import { toast } from "sonner";

import { apiRequest } from "@/lib/client-api";
import { createProgressFile } from "@/lib/progress-file";
import type { RoadmapSnapshot } from "@/types/roadmap";

const UNDO_DURATION = 10_000;
const IMPORT_HINT =
  "Use a file exported from this app (format backend-roadmap-progress, version 1 or 2).";

async function postProgressFile(body: string) {
  return apiRequest<RoadmapSnapshot>("/api/import", {
    method: "POST",
    body,
  });
}

function restoreSnapshot(snapshot: RoadmapSnapshot): Promise<RoadmapSnapshot> {
  return postProgressFile(JSON.stringify(createProgressFile(snapshot)));
}

function reportUndoFailure(error: unknown) {
  toast.error("Undo failed. Restore your data with a progress file.", {
    description: error instanceof Error ? error.message : undefined,
  });
}

/** Triggers the browser download of the current state as a JSON progress file. */
export function exportSnapshot(trackSlug: string) {
  // Intentional: /api/export is a download endpoint, not app navigation.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign(`/api/export?track=${encodeURIComponent(trackSlug)}`);
  toast.success("Progress file saved.", {
    description: "Format backend-roadmap-progress, version 2.",
  });
}

/** Imports a parsed progress file and offers a one-click undo back to `previous`. */
export async function importSnapshot(
  body: unknown,
  previous: RoadmapSnapshot,
  replaceSnapshot: (snapshot: RoadmapSnapshot) => void,
) {
  if (typeof body !== "object" || body === null) {
    toast.error("That file isn't a progress export.", { description: IMPORT_HINT });
    return;
  }
  try {
    const next = await postProgressFile(JSON.stringify(body));
    replaceSnapshot(next);
    toast.success("Progress imported.", {
      description: `Start date ${next.settings.startDate ?? "not set"}, ${next.activity.length} log entries.`,
      duration: UNDO_DURATION,
      action: {
        label: "Undo",
        onClick: () => {
          restoreSnapshot(previous)
            .then((restored) => {
              replaceSnapshot(restored);
              toast.info("Restored the previous progress.", { duration: 5_000 });
            })
            .catch(reportUndoFailure);
        },
      },
    });
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : "The import couldn't be completed.",
      {
        description:
          error instanceof Error && error.message !== "" ? undefined : IMPORT_HINT,
      },
    );
  }
}

/** Reads a supplied file and runs the import; parse errors are reported. */
export async function importProgressFile(
  file: File,
  previous: RoadmapSnapshot,
  replaceSnapshot: (snapshot: RoadmapSnapshot) => void,
) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    toast.error("That file isn't valid JSON.", { description: IMPORT_HINT });
    return;
  }
  await importSnapshot(parsed, previous, replaceSnapshot);
}

/** Resets all progress (start date included) and offers a one-click undo. */
export async function resetAllProgress(
  previous: RoadmapSnapshot,
  replaceSnapshot: (snapshot: RoadmapSnapshot) => void,
) {
  try {
    const next = await apiRequest<RoadmapSnapshot>(
      `/api/reset?track=${encodeURIComponent(previous.track.slug)}`,
      {
        method: "POST",
      },
    );
    replaceSnapshot(next);
    toast.success("Progress reset.", {
      duration: UNDO_DURATION,
      action: {
        label: "Undo",
        onClick: () => {
          restoreSnapshot(previous)
            .then((restored) => {
              replaceSnapshot(restored);
              toast.info("Restored the previous progress.", { duration: 5_000 });
            })
            .catch(reportUndoFailure);
        },
      },
    });
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : "The reset couldn't be completed.",
    );
  }
}
