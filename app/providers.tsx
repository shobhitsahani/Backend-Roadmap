"use client";

import { MotionConfig } from "motion/react";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="backend-roadmap-theme"
    >
      <MotionConfig reducedMotion="user">
        <TooltipProvider delay={350}>
          {children}
          <Toaster position="bottom-right" closeButton />
        </TooltipProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
