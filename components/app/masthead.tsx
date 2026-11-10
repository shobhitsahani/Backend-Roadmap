"use client";

import { BrandMark, Wordmark } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useRoadmapStore } from "@/store/roadmap-store";
import { useUiStore } from "@/store/ui-store";
import type { AppView } from "@/types/roadmap";

const navItems: Array<{ view: AppView; label: string }> = [
  { view: "roadmap", label: "Roadmap" },
  { view: "dashboard", label: "Field log" },
  { view: "timeline", label: "Timeline" },
];

export function Masthead() {
  const view = useUiStore((state) => state.view);
  const setView = useUiStore((state) => state.setView);
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);
  const trackSubtitle = useRoadmapStore((state) => state.snapshot.track.subtitle);

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-canvas">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-4 md:px-10">
        <button
          type="button"
          onClick={() => setView("roadmap")}
          className="flex items-center gap-3 self-stretch rounded-xs text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          <span className="sr-only">Go to roadmap — </span>
          <BrandMark />
          <Wordmark />
        </button>

        <nav aria-label="Primary" className="hidden self-stretch md:flex">
          {navItems.map((item) => {
            const active = view === item.view;
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => setView(item.view)}
                aria-current={active ? "page" : undefined}
                className={`relative min-w-24 border-b-2 px-4 font-mono text-micro tracking-[0.12em] uppercase transition-colors duration-150 ${
                  active
                    ? "border-phase-1 text-ink"
                    : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden font-mono text-micro tracking-[0.12em] text-ink-subtle uppercase lg:inline">
            {trackSubtitle}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="⌘K — open the command palette"
            title="Command palette (Ctrl+K)"
            className="px-2.5"
            onClick={() => setCommandOpen(true)}
          >
            <span
              aria-hidden="true"
              className="font-mono text-micro tracking-[0.08em] not-italic"
            >
              ⌘K
            </span>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
