"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandMark, Wordmark } from "@/components/brand";
import { TrackSwitcher } from "@/components/app/track-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { sectionFromPathname, sectionHref } from "@/lib/routes";
import { useRoadmapStore } from "@/store/roadmap-store";
import { useUiStore } from "@/store/ui-store";
import type { TrackSection } from "@/types/roadmap";

const navItems: Array<{ section: TrackSection; label: string }> = [
  { section: "roadmap", label: "Roadmap" },
  { section: "log", label: "Field log" },
  { section: "timeline", label: "Timeline" },
];

export function Masthead() {
  const pathname = usePathname();
  const track = useRoadmapStore((state) => state.snapshot.track);
  const setCommandOpen = useUiStore((state) => state.setCommandOpen);
  const activeSection = sectionFromPathname(pathname, track.slug);

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-canvas">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 md:px-6 lg:gap-6 lg:px-10">
        <Link
          href={`/${track.slug}`}
          className="flex shrink-0 items-center gap-3 self-stretch rounded-xs text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          <span className="sr-only">Go to {track.title} roadmap — </span>
          <BrandMark />
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="hidden self-stretch md:flex">
          {navItems.map((item) => {
            const active = activeSection === item.section;
            return (
              <Link
                key={item.section}
                href={sectionHref(track.slug, item.section)}
                aria-current={active ? "page" : undefined}
                className={`relative flex min-w-20 items-center justify-center border-b-2 px-3 font-mono text-micro tracking-[0.12em] uppercase transition-colors duration-150 lg:min-w-24 lg:px-4 ${
                  active
                    ? "border-phase-1 text-ink"
                    : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex min-w-0 items-center gap-2 lg:gap-3">
          <TrackSwitcher className="hidden w-[176px] md:flex xl:w-[252px]" />
          <span className="hidden max-w-48 truncate font-mono text-micro tracking-[0.12em] text-ink-subtle uppercase 2xl:inline">
            {track.subtitle}
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
