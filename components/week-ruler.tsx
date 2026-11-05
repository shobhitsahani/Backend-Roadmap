import { cn } from "@/lib/utils";

export type PhaseNumber = 1 | 2 | 3 | 4;

export type WeekSegment = {
  phase: PhaseNumber;
  weeks: number;
};

type WeekRulerProps = {
  segments: WeekSegment[];
  completedWeeks: number;
  expectedWeek?: number | null;
  className?: string;
  compact?: boolean;
};

const phaseTick = {
  1: "bg-phase-1",
  2: "bg-phase-2",
  3: "bg-phase-3",
  4: "bg-phase-4",
} satisfies Record<PhaseNumber, string>;

const phaseTickMuted = {
  1: "bg-phase-1/20",
  2: "bg-phase-2/20",
  3: "bg-phase-3/20",
  4: "bg-phase-4/20",
} satisfies Record<PhaseNumber, string>;

export function WeekRuler({
  segments,
  completedWeeks,
  expectedWeek = null,
  className,
  compact = false,
}: WeekRulerProps) {
  const weeks = segments.flatMap((segment) =>
    Array.from({ length: segment.weeks }, (_, index) => ({
      phase: segment.phase,
      ordinal: index,
    })),
  );
  const total = weeks.length;
  const completed = Math.max(0, Math.min(total, completedWeeks));
  const expectedPercent =
    expectedWeek === null ? 0 : Math.max(0, Math.min(100, (expectedWeek / total) * 100));

  return (
    <div
      className={cn("relative select-none", className)}
      role="img"
      aria-label={`${completed} of ${total} weeks complete${
        expectedWeek !== null ? `, expected week ${expectedWeek}` : ""
      }`}
    >
      <div
        className={cn("grid gap-[2px]", compact ? "h-2" : "h-3")}
        style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
      >
        {weeks.map((week, index) => {
          const done = index < completed;
          return (
            <span
              key={`${week.phase}-${week.ordinal}`}
              title={`Week ${index + 1} · Phase ${week.phase}${
                done ? " · complete" : ""
              }`}
              className={cn(
                "min-w-0 transition-colors duration-200",
                done ? phaseTick[week.phase] : phaseTickMuted[week.phase],
              )}
            />
          );
        })}
      </div>

      {expectedWeek !== null ? (
        <span
          aria-hidden="true"
          className="absolute -top-1 z-10 -translate-x-1/2"
          style={{ left: `${expectedPercent}%` }}
        >
          <span className="block h-0 w-0 border-x-[4px] border-t-[6px] border-x-transparent border-t-ink" />
        </span>
      ) : null}

      {!compact ? (
        <div className="mt-2 flex items-center justify-between font-mono text-micro tracking-[0.12em] text-ink-subtle">
          <span>W01</span>
          <span className="hidden sm:inline">36 WEEKS / 4 PHASES</span>
          <span>W36</span>
        </div>
      ) : null}
    </div>
  );
}
