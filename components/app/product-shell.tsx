"use client";

import type { ReactNode } from "react";

import { Masthead } from "@/components/app/masthead";
import { MobileNav } from "@/components/app/mobile-nav";
import { StartDateDialog } from "@/components/app/start-date-dialog";
import { CommandPalette } from "@/components/command/command-palette";
import { TopicPanel } from "@/components/roadmap/topic-panel";

/**
 * Chrome shared by every product route. The screen itself is a real page in
 * `children`, so navigation, back/forward, and deep links behave like URLs.
 */
export function ProductShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-sm focus:border focus:border-hairline-strong focus:bg-panel focus:px-4 focus:py-2 focus:font-mono focus:text-label focus:text-ink focus:uppercase"
      >
        Skip to content
      </a>
      <Masthead />
      <main id="main" className="mx-auto max-w-[1440px] px-4 pb-44 md:px-10 md:pb-16">
        {children}
      </main>
      <MobileNav />
      <CommandPalette />
      <TopicPanel />
      <StartDateDialog />
    </div>
  );
}
