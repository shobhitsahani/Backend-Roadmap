"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandMark, Wordmark } from "@/components/brand";
import { TrackSwitcher } from "@/components/app/track-switcher";
import { ThemePicker } from "@/components/theme/theme-picker";
import { Button, buttonVariants } from "@/components/ui/button";
import { GitHubIcon } from "@/components/icons/github-icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
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
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 md:gap-4 md:px-6 lg:gap-6 lg:px-10">
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
                className={`relative flex items-center justify-center border-b-2 px-2.5 font-mono text-micro tracking-[0.12em] uppercase transition-colors duration-150 md:min-w-18 md:px-3 lg:min-w-24 lg:px-4 ${
                  active
                    ? "border-focus-ring text-ink"
                    : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2 lg:gap-3">
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
          <ThemePicker />
          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View source on GitHub (opens in a new tab)"
                  data-testid="header-github-link"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "text-ink-muted hover:text-ink",
                  )}
                />
              }
            >
              <GitHubIcon aria-hidden="true" />
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={8}>
              GitHub
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
