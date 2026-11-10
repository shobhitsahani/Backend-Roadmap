"use client";

import { cn } from "@/lib/utils";
import type { PhaseWithTopics } from "@/types/roadmap";

export type PhaseWindow = {
  phase: PhaseWithTopics;
  startWeek: number;
  endWeek: number;
};

type TimelineMeasureProps = {
  windows: PhaseWindow[];
  totalWeeks: number;
  completedWeeks: number;
  expectedWeek: number | null;
  className?: string;
};

const phaseTint = {
  1: "bg-phase-1/10",
  2: "bg-phase-2/10",
  3: "bg-phase-3/10",
  4: "bg-phase-4/10",
} satisfies Record<1 | 2 | 3 | 4, string>;

const phaseFill = {
  1: "bg-phase-1",
  2: "bg-phase-2",
  3: "bg-phase-3",
  4: "bg-phase-4",
} satisfies Record<1 | 2 | 3 | 4, string>;

const phaseText = {
  1: "text-phase-1",
  2: "text-phase-2",
  3: "text-phase-3",
  4: "text-phase-4",
} satisfies Record<1 | 2 | 3 | 4, string>;

/**
 * The signature 36-week measure: a per-week cell block with a "water level"
 * progress fill, a phase index strip, week ticks, and an expected-week crosshair.
 */
export function TimelineMeasure({
  windows,
  totalWeeks,
  completedWeeks,
  expectedWeek,
  className,
}: TimelineMeasureProps) {
  const phaseAt = (week: number) =>
    windows.find((entry) => week >= entry.startWeek && week <= entry.endWeek);

  const expectedPercent =
    expectedWeek === null
      ? 0
      : Math.max(0, Math.min(100, (expectedWeek / totalWeeks) * 100));
  const expectedLabel =
    expectedWeek === null
      ? "unset"
      : `W${String(Math.max(1, Math.ceil(expectedWeek))).padStart(2, "0")}`;

  const cellCount = windows.reduce(
    (total, entry) => total + (entry.endWeek - entry.startWeek + 1),
    0,
  );

  return (
    <div
      className={cn("relative font-mono select-none", className)}
      role="img"
      aria-label={`36-week measure, ${completedWeeks.toFixed(1)} of ${totalWeeks} weeks complete${
        expectedWeek !== null
          ? `, expected position week ${Math.ceil(expectedWeek)}`
          : ", no start date set"
      }`}
    >
      {/* Phase index strip */}
      <div
        className="grid gap-[2px]"
        style={{ gridTemplateColumns: `repeat(${cellCount}, minmax(0, 1fr))` }}
      >
        {windows.map((entry) => (
          <span
            key={entry.phase.id}
            title={`Phase ${entry.phase.order} · ${entry.phase.title} · W${String(entry.startWeek).padStart(2, "0")}–W${String(entry.endWeek).padStart(2, "0")}`}
            className={cn(
              "flex h-6 min-w-0 items-center overflow-hidden border-b px-1 whitespace-nowrap",
              `border-[color-mix(in_oklch,var(--phase-${entry.phase.order})_50%,transparent)]`,
              phaseText[entry.phase.order as 1 | 2 | 3 | 4],
            )}
            style={{
              gridColumn: `${entry.startWeek} / span ${entry.endWeek - entry.startWeek + 1}`,
            }}
          >
            <span className="truncate text-micro tracking-[0.14em] uppercase">
              {String(entry.phase.order).padStart(2, "0")}
              <span className="hidden text-micro tracking-[-0.02em] xl:inline">
                {" "}
                {entry.phase.title}
              </span>
            </span>
          </span>
        ))}
      </div>

      {/* Weekly cells with water-level fill */}
      <div className="relative mt-[2px] flex h-20 gap-[2px] md:h-24" aria-hidden="true">
        {Array.from({ length: cellCount }, (_, index) => {
          const week = index + 1;
          const window = phaseAt(week);
          const order = (window?.phase.order ?? 1) as 1 | 2 | 3 | 4;
          const fillRatio = Math.max(0, Math.min(1, completedWeeks - index));
          return (
            <span
              key={week}
              className={cn("relative min-w-0 flex-1 overflow-hidden", phaseTint[order])}
            >
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 transition-[height] duration-500 ease-out",
                  phaseFill[order],
                )}
                style={{ height: `${fillRatio * 100}%` }}
              />
            </span>
          );
        })}

        {/* Expected-week crosshair */}
        {expectedWeek !== null ? (
          <span
            className="absolute inset-y-0 z-10 -translate-x-1/2"
            style={{ left: `${expectedPercent}%` }}
          >
            <span className="block h-full w-0 border-l border-dashed border-ink" />
            <span className="absolute -top-[7px] left-1/2 -translate-x-1/2">
              <span className="block h-0 w-0 border-x-[4px] border-t-[6px] border-x-transparent border-t-ink" />
            </span>
          </span>
        ) : null}
      </div>

      {/* Week ticks */}
      <div className="relative mt-1 flex gap-[2px]" aria-hidden="true">
        {Array.from({ length: cellCount }, (_, index) => {
          const week = index + 1;
          const nearCrosshair =
            expectedWeek !== null && Math.abs(week - expectedWeek) < 3.2;
          return (
            <span key={index} className="relative min-w-0 flex-1">
              {week % 4 === 0 && !nearCrosshair ? (
                <>
                  <span className="block h-1.5 w-px bg-ink-subtle" />
                  <span className="absolute top-2 left-1/2 -translate-x-1/2 text-micro tracking-[0.1em] text-ink-subtle">
                    W{String(week).padStart(2, "0")}
                  </span>
                </>
              ) : (
                <span className="block h-1 w-px bg-hairline" />
              )}
            </span>
          );
        })}

        {expectedWeek !== null ? (
          <span
            className="pointer-events-none absolute top-2 -translate-x-1/2 text-micro tracking-[0.1em] text-ink uppercase"
            style={{ left: `${expectedPercent}%` }}
          >
            EXP {expectedLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
