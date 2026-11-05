"use client";

import { Masthead } from "@/components/app/masthead";
import { MobileNav } from "@/components/app/mobile-nav";
import { PendingScreen } from "@/components/app/pending-screen";
import { StartDateDialog } from "@/components/app/start-date-dialog";
import { RoadmapScreen } from "@/components/roadmap/roadmap-screen";
import { TopicPanel } from "@/components/roadmap/topic-panel";
import { useUiStore } from "@/store/ui-store";

export function AppShell() {
  const view = useUiStore((state) => state.view);

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-sm focus:border focus:border-hairline-strong focus:bg-panel focus:px-4 focus:py-2 focus:font-mono focus:text-label focus:text-ink focus:uppercase"
      >
        Skip to content
      </a>
      <Masthead />
      <main id="main" className="mx-auto max-w-[1440px] px-4 pb-28 md:px-10 md:pb-16">
        {view === "roadmap" ? <RoadmapScreen /> : null}
        {view === "dashboard" ? (
          <PendingScreen eyebrow="Field log / checkpoint 07" title="Field log" />
        ) : null}
        {view === "timeline" ? (
          <PendingScreen eyebrow="Field log / checkpoint 07" title="Timeline" />
        ) : null}
      </main>
      <MobileNav />
      <TopicPanel />
      <StartDateDialog />
    </div>
  );
}
