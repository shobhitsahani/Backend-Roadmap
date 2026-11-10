"use client";

import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRoadmapStore } from "@/store/roadmap-store";
import { useUiStore } from "@/store/ui-store";

export function StartDateDialog() {
  const open = useUiStore((state) => state.startDateOpen);
  const setOpen = useUiStore((state) => state.setStartDateOpen);
  const startDate = useRoadmapStore((state) => state.snapshot.settings.startDate);
  const totalWeeks = useRoadmapStore(
    (state) =>
      state.snapshot.tracks.find((track) => track.id === state.snapshot.track.id)
        ?.totalWeeks ?? 0,
  );
  const saveStartDate = useRoadmapStore((state) => state.saveStartDate);
  const pending = useRoadmapStore((state) => state.pending);

  const today = new Date();
  const todayValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(today.getDate()).padStart(2, "0")}`;

  async function save(value: string | null) {
    try {
      await saveStartDate(value);
      toast.success(value ? "Start date saved." : "Start date cleared.");
      setOpen(false);
    } catch (error) {
      toast.error("Could not save the start date.", {
        description: error instanceof Error ? error.message : "Try again.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <p className="font-mono text-micro tracking-[0.12em] text-phase-1 uppercase">
            Timeline calibration
          </p>
          <DialogTitle>Set start date</DialogTitle>
          <DialogDescription>
            The start date anchors the {totalWeeks}-week plan and marks today&apos;s
            expected position. Completion always comes from your checklist.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            const value = String(
              new FormData(event.currentTarget).get("startDate") ?? "",
            );
            void save(value === "" ? null : value);
          }}
        >
          <label
            htmlFor="start-date"
            className="font-mono text-micro tracking-[0.1em] text-ink-subtle uppercase"
          >
            Start date
          </label>
          <div className="relative mt-2">
            <CalendarIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-subtle"
            />
            <Input
              id="start-date"
              name="startDate"
              type="date"
              defaultValue={startDate ?? todayValue}
              className="pl-10"
            />
          </div>
          <p className="mt-2 font-sans text-caption text-ink-muted">
            Use the day you began, or the day you plan to begin. Expected progress starts
            at week one.
          </p>

          <div className="mt-6 flex flex-col-reverse gap-2 border-t border-hairline pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              disabled={pending !== null || startDate === null}
              onClick={() => void save(null)}
            >
              Clear date
            </Button>
            <Button type="submit" disabled={pending !== null}>
              {pending === null ? "Save start date" : "Saving…"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
