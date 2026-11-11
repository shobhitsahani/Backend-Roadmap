"use client";

import {
  CalendarPlusIcon,
  CheckIcon,
  CompassIcon,
  ContrastIcon,
  DownloadIcon,
  HouseIcon,
  LineChartIcon,
  RouteIcon,
  RulerIcon,
  SettingsIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ShortcutsDialog } from "@/components/command/shortcuts-dialog";
import { useTheme } from "@/components/theme/theme-provider";
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
import { sectionHref, trackSwitchHref } from "@/lib/routes";
import { themeOptionLabels, themeSettings } from "@/lib/theme/config";
import { useRoadmapStore } from "@/store/roadmap-store";
import { useUiStore } from "@/store/ui-store";
import type { TrackSection } from "@/types/roadmap";

const sectionByEventKey: Record<string, TrackSection> = {
  "1": "roadmap",
  "2": "log",
  "3": "timeline",
};

const navItems: Array<{
  section: TrackSection;
  label: string;
  icon: typeof HouseIcon;
  shortcut: string;
}> = [
  { section: "roadmap", label: "Go to Roadmap", icon: HouseIcon, shortcut: "1" },
  { section: "log", label: "Go to Field log", icon: LineChartIcon, shortcut: "2" },
  { section: "timeline", label: "Go to Timeline", icon: RulerIcon, shortcut: "3" },
];

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

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const openTopic = useUiStore((state) => state.openTopic);
  const setStartDateOpen = useUiStore((state) => state.setStartDateOpen);
  const snapshot = useRoadmapStore((state) => state.snapshot);
  const phases = snapshot.phases;
  const tracks = snapshot.tracks;
  const slug = snapshot.track.slug;
  const replaceSnapshot = useRoadmapStore((state) => state.replaceSnapshot);
  const { theme, setTheme } = useTheme();

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

      if (event.altKey && !event.ctrlKey && !event.metaKey) {
        const target = tracks[Number(event.key) - 1];
        if (target) {
          event.preventDefault();
          router.push(
            trackSwitchHref(
              pathname,
              searchParams.toString(),
              target.slug,
              tracks.map((track) => track.slug),
            ),
          );
          return;
        }
      }

      const section = sectionByEventKey[event.key];
      if (section) {
        event.preventDefault();
        router.push(sectionHref(slug, section));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [helpOpen, open, pathname, router, searchParams, setOpen, slug, tracks]);

  const runCommand = useCallback(
    (run: () => void) => {
      close();
      run();
    },
    [close],
  );

  return (
    <>
      <CommandDialog
        title="Command palette"
        description="Jump to a track, view, or topic, or run a data command."
        open={open}
        onOpenChange={setOpen}
      >
        <CommandInput placeholder="Type a command or search topics…" />
        <CommandList>
          <CommandEmpty>No matching command.</CommandEmpty>

          <CommandGroup heading="Navigate">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.section}
                  value={`${item.label} ${item.section}`}
                  onSelect={() =>
                    runCommand(() => router.push(sectionHref(slug, item.section)))
                  }
                >
                  <Icon aria-hidden="true" />
                  {item.label}
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                </CommandItem>
              );
            })}
            <CommandItem
              value="Go to Journey journey"
              onSelect={() => runCommand(() => router.push("/journey"))}
            >
              <CompassIcon aria-hidden="true" />
              Go to Journey
            </CommandItem>
            <CommandItem
              value="Go to Settings settings"
              onSelect={() => runCommand(() => router.push("/settings"))}
            >
              <SettingsIcon aria-hidden="true" />
              Go to Settings
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Tracks">
            {tracks.map((track, index) => (
              <CommandItem
                key={track.id}
                value={`Switch to ${track.title}`}
                onSelect={() =>
                  runCommand(() =>
                    router.push(
                      trackSwitchHref(
                        pathname,
                        searchParams.toString(),
                        track.slug,
                        tracks.map((entry) => entry.slug),
                      ),
                    ),
                  )
                }
              >
                <RouteIcon aria-hidden="true" />
                Switch to {track.title}
                <CommandShortcut>Alt+{index + 1}</CommandShortcut>
              </CommandItem>
            ))}
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
                      if (pathname !== `/${slug}`) router.push(`/${slug}`);
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

          <CommandGroup heading="Theme">
            {themeSettings.map((setting) => (
              <CommandItem
                key={setting}
                value={`Theme: ${themeOptionLabels[setting]}`}
                onSelect={() => runCommand(() => setTheme(setting))}
              >
                <ContrastIcon aria-hidden="true" />
                Theme: {themeOptionLabels[setting]}
                {theme === setting ? (
                  <CheckIcon aria-hidden="true" className="ml-auto text-track-accent" />
                ) : null}
              </CommandItem>
            ))}
          </CommandGroup>

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
