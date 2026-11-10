"use client";

import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRoadmapStore } from "@/store/roadmap-store";

type EstimatedBadgeProps = {
  sourceTitle?: string | null;
  className?: string;
};

/**
 * Marks a duration the curriculum only estimates. The badge is deliberately
 * non-interactive: it lives inside the topic row button, and a nested button
 * would break both hydration and the accessibility tree. The native title and
 * the screen-reader sentence still name the source.
 */
export function EstimatedBadge({ sourceTitle, className }: EstimatedBadgeProps) {
  const trackSource = useRoadmapStore((state) => state.snapshot.track.sourceTitle);
  const source = sourceTitle ?? trackSource;
  const from = source ? ` from ${source}` : "";
  const explanation = `Duration is an estimate${from}. Edit it in the content file.`;

  return (
    <span
      title={explanation}
      className={cn(
        badgeVariants({ variant: "outline" }),
        "cursor-help border-phase-2/30 bg-phase-2/10 text-phase-2",
        className,
      )}
    >
      Estimated
      <span className="sr-only"> — {explanation}</span>
    </span>
  );
}
