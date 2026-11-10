"use client";

import {
  CalendarPlusIcon,
  ContrastIcon,
  DownloadIcon,
  HouseIcon,
  LineChartIcon,
  RulerIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

import { ShortcutsDialog } from "@/components/command/shortcuts-dialog";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { resetAllProgress, exportSnapshot } from "@/lib/data-actions";
import { useRoadmapStore } from "@/store/roadmap-store";
import { useUiStore } from "@/store/ui-store";
import type { AppView } from "@/types/roadmap";

const navByEventKey: Record<string, AppView> = {
  "1": "roadmap",
  "2": "dashboard",
  "3": "timeline",
};

const iconByView = {
  roadmap: HouseIcon,
  dashboard: LineChartIcon,
  timeline: RulerIcon,
} satisfies Record<AppView, typeof HouseIcon>;

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT")
  );
}

export function CommandPalette() {
  const open = useUiStore((state) => state.commandOpen);
  const setOpen = useUiStore((state) => state.setCommandOpen);
  const [helpOpen, setHelpOpen] = useState(false);

  const view = useUiStore((state) => state.view);
  const setView = useUiStore((state) => state.setView);
  const openTopic = useUiStore((state) => state.openTopic);
  const setStartDateOpen = useUiStore((state) => state.setStartDateOpen);
  const phases = useRoadmapStore((state) => state.snapshot.phases);
  const snapshot = useRoadmapStore((state) => state.snapshot);
  const replaceSnapshot = useRoadmapStore((state) => state.replaceSnapshot);
  const { resolvedTheme, setTheme } = useTheme();

  const close = useCallback(() => setOpen(false), [setOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(!open);
        return;
      }
      if (open || helpOpen || isTypingTarget(event.target)) return;
      if (event.key === "?") {
        event.preventDefault();
        setHelpOpen(true);
        return;
      }
      const navView = navByEventKey[event.key];
      if (navView && navView !== view) {
        event.preventDefault();
        setView(navView);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [helpOpen, open, setOpen, setView, view]);

  const runCommand = useCallback(
    (run: () => void) => {
      close();
      run();
    },
    [close],
  );

  const nextTheme = resolvedTheme === "light" ? "dark" : "light";

  return (
    <>
      <CommandDialog
        title="Command palette"
        description="Jump to a view, open a topic or run a data command."
        open={open}
        onOpenChange={setOpen}
      >
        <CommandInput placeholder="Type a command or search topics…" />
        <CommandList>
          <CommandEmpty>No matching command.</CommandEmpty>

          <CommandGroup heading="Navigate">
            {(
              [
                { label: "Go to Roadmap", view: "roadmap" },
                { label: "Go to Field log", view: "dashboard" },
                { label: "Go to Timeline", view: "timeline" },
              ] as Array<{ label: string; view: AppView }>
            ).map((item) => {
              const Icon = iconByView[item.view];
              return (
                <CommandItem
                  key={item.view}
                  value={`${item.label} ${item.view}`}
                  onSelect={() => runCommand(() => setView(item.view))}
                >
                  <Icon aria-hidden="true" />
                  {item.label}
                  <CommandShortcut>
                    {item.view === "roadmap"
                      ? "1"
                      : item.view === "dashboard"
                        ? "2"
                        : "3"}
                  </CommandShortcut>
                </CommandItem>
              );
            })}
          </CommandGroup>

          <CommandSeparator />

          {phases.map((phase) => (
            <CommandGroup
              key={phase.id}
              heading={`Phase ${String(phase.order).padStart(2, "0")} · ${phase.title}`}
            >
              {phase.topics.map((topic) => (
                <CommandItem
                  key={topic.id}
                  value={`${String(phase.order).padStart(2, "0")}_${String(topic.order).padStart(2, "0")} ${topic.title}`}
                  onSelect={() =>
                    runCommand(() => {
                      setView("roadmap");
                      openTopic(topic.id);
                    })
                  }
                >
                  <span className="font-mono text-micro tracking-[0.08em] text-ink-subtle tabular-nums">
                    {String(phase.order).padStart(2, "0")}.
                    {String(topic.order).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 truncate">{topic.title}</span>
                  <CommandShortcut>{topic.durationWeeks}w</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}

          <CommandSeparator />

          <CommandGroup heading="Data & system">
            <CommandItem
              value="Export progress JSON"
              onSelect={() => runCommand(() => exportSnapshot(snapshot.track.slug))}
            >
              <DownloadIcon aria-hidden="true" />
              Export progress JSON
            </CommandItem>
            <CommandItem
              value="Set start date"
              onSelect={() => runCommand(() => setStartDateOpen(true))}
            >
              <CalendarPlusIcon aria-hidden="true" />
              Set start date
            </CommandItem>
            <CommandItem
              value={`Switch theme ${nextTheme}`}
              onSelect={() => runCommand(() => setTheme(nextTheme))}
            >
              <ContrastIcon aria-hidden="true" />
              Switch to {nextTheme} theme
            </CommandItem>
            <CommandItem
              value="Reset progress"
              onSelect={() =>
                runCommand(() => {
                  void resetAllProgress(snapshot, replaceSnapshot);
                })
              }
            >
              <TriangleAlertIcon aria-hidden="true" />
              <span className="text-phase-4">Reset progress</span>
              <CommandShortcut>undo toast</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <ShortcutsDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </>
  );
}
