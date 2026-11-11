"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ActivityIcon, CalendarRangeIcon, MapIcon } from "lucide-react";

import { TrackSwitcher } from "@/components/app/track-switcher";
import { sectionFromPathname, sectionHref } from "@/lib/routes";
import { useRoadmapStore } from "@/store/roadmap-store";
import type { TrackSection } from "@/types/roadmap";

const items: Array<{
  section: TrackSection;
  label: string;
  icon: typeof MapIcon;
}> = [
  { section: "roadmap", label: "Roadmap", icon: MapIcon },
  { section: "log", label: "Field log", icon: ActivityIcon },
  { section: "timeline", label: "Timeline", icon: CalendarRangeIcon },
];

export function MobileNav() {
  const pathname = usePathname();
  const track = useRoadmapStore((state) => state.snapshot.track);
  const activeSection = sectionFromPathname(pathname, track.slug);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div className="border-t border-hairline bg-canvas px-4 py-2">
        <TrackSwitcher variant="mobile" />
      </div>
      <nav
        aria-label="Primary mobile"
        className="border-t border-hairline bg-canvas pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-3">
          {items.map((item) => {
            const active = activeSection === item.section;
            const Icon = item.icon;
            return (
              <Link
                key={item.section}
                href={sectionHref(track.slug, item.section)}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-16 flex-col items-center justify-center gap-1 font-mono text-micro tracking-[0.1em] uppercase transition-colors duration-150 ${
                  active ? "text-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                <Icon
                  aria-hidden="true"
                  className={`size-5 ${active ? "text-focus-ring" : "text-ink-subtle"}`}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
