"use client";

import { ActivityIcon, CalendarRangeIcon, MapIcon } from "lucide-react";

import { useUiStore } from "@/store/ui-store";
import type { AppView } from "@/types/roadmap";

const items: Array<{
  view: AppView;
  label: string;
  icon: typeof MapIcon;
}> = [
  { view: "roadmap", label: "Roadmap", icon: MapIcon },
  { view: "dashboard", label: "Field log", icon: ActivityIcon },
  { view: "timeline", label: "Timeline", icon: CalendarRangeIcon },
];

export function MobileNav() {
  const view = useUiStore((state) => state.view);
  const setView = useUiStore((state) => state.setView);

  return (
    <nav
      aria-label="Primary mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-canvas pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div className="grid grid-cols-3">
        {items.map((item) => {
          const active = view === item.view;
          const Icon = item.icon;
          return (
            <button
              key={item.view}
              type="button"
              onClick={() => {
                setView(item.view);
                window.scrollTo({ top: 0 });
              }}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-16 flex-col items-center justify-center gap-1 font-mono text-micro tracking-[0.1em] uppercase transition-colors duration-150 ${
                active ? "text-ink" : "text-ink-muted hover:text-ink"
              }`}
            >
              <Icon
                aria-hidden="true"
                className={`size-5 ${active ? "text-phase-1" : "text-ink-subtle"}`}
              />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
