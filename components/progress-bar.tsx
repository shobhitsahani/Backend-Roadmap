import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  label: string;
  accent?: string;
  className?: string;
  trackClassName?: string;
};

export function ProgressBar({
  value,
  label,
  accent = "var(--phase-1)",
  className,
  trackClassName,
}: ProgressBarProps) {
  const normalized = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(normalized)}
      aria-valuetext={`${Math.round(normalized)}% complete`}
      className={cn(
        "relative h-1 w-full overflow-hidden bg-hairline",
        className,
        trackClassName,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-left transition-transform duration-300 ease-out will-change-transform"
        style={{
          backgroundColor: accent,
          transform: `scaleX(${normalized / 100})`,
        }}
      />
    </div>
  );
}
