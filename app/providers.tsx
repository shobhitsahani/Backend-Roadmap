"use client";

import { MotionConfig } from "motion/react";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <TooltipProvider delay={350}>
          {children}
          <Toaster position="bottom-right" closeButton />
        </TooltipProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
