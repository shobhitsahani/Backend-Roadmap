"use client";

import { badgeVariants } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useRoadmapStore } from "@/store/roadmap-store";

type EstimatedBadgeProps = {
  sourceTitle?: string | null;
  className?: string;
};

/**
 * Marks a duration the curriculum only estimates. The tooltip names the source
 * so the number is never presented as measured fact.
 */
export function EstimatedBadge({ sourceTitle, className }: EstimatedBadgeProps) {
  const trackSource = useRoadmapStore((state) => state.snapshot.track.sourceTitle);
  const source = sourceTitle ?? trackSource;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label="Estimated duration"
            className={cn(
              badgeVariants({ variant: "outline" }),
              "cursor-help border-phase-2/30 bg-phase-2/10 text-phase-2",
              className,
            )}
          />
        }
      >
        Estimated
      </TooltipTrigger>
      <TooltipContent side="top">
        Duration is an estimate
        {source ? ` from ${source}` : ""}. Edit it in the content file.
      </TooltipContent>
    </Tooltip>
  );
}
