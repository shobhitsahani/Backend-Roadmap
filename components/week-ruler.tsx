import { cn } from "@/lib/utils";

export type PhaseNumber = 1 | 2 | 3 | 4 | 5;

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
  5: "bg-phase-5",
} satisfies Record<PhaseNumber, string>;

const phaseTickMuted = {
  1: "bg-phase-1/20",
  2: "bg-phase-2/20",
  3: "bg-phase-3/20",
  4: "bg-phase-4/20",
  5: "bg-phase-5/20",
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
  const whole = Math.floor(completed);
  const fraction = completed - whole;
  const expectedPercent =
    expectedWeek === null ? 0 : Math.max(0, Math.min(100, (expectedWeek / total) * 100));

  return (
    <div
      className={cn("relative select-none", className)}
      role="img"
      aria-label={`${completed.toFixed(1)} of ${total} weeks complete${
        expectedWeek !== null ? `, expected week ${Math.ceil(expectedWeek)}` : ""
      }`}
    >
      <div
        className={cn("grid gap-[2px]", compact ? "h-2" : "h-3")}
        style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
      >
        {weeks.map((week, index) => {
          const done = index < whole;
          const partial = index === whole ? fraction : 0;
          return (
            <span
              key={`${week.phase}-${week.ordinal}`}
              title={`Week ${index + 1} · Phase ${week.phase}${
                done
                  ? " · complete"
                  : partial > 0
                    ? ` · ${Math.round(partial * 100)}% complete`
                    : ""
              }`}
              className={cn(
                "relative min-w-0 overflow-hidden transition-colors duration-200",
                done ? phaseTick[week.phase] : phaseTickMuted[week.phase],
              )}
            >
              {partial > 0 ? (
                <span
                  aria-hidden="true"
                  className={cn("absolute inset-y-0 left-0", phaseTick[week.phase])}
                  style={{ width: `${partial * 100}%` }}
                />
              ) : null}
            </span>
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
          <span className="hidden sm:inline">
            {total} weeks / {segments.length} phases
          </span>
          <span>W{String(total).padStart(2, "0")}</span>
        </div>
      ) : null}
    </div>
  );
}
