import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="none"
      className={cn("size-8", className)}
    >
      <rect
        x="0.75"
        y="0.75"
        width="30.5"
        height="30.5"
        rx="4.25"
        className="fill-panel"
      />
      <rect
        x="0.75"
        y="0.75"
        width="30.5"
        height="30.5"
        rx="4.25"
        className="stroke-hairline-strong"
        strokeWidth="1.5"
      />
      <path
        d="M7 8.5h18M7 16h12M7 23.5h7"
        className="stroke-phase-1"
        strokeWidth="1.75"
        strokeLinecap="square"
      />
      <path
        d="M23.5 16v7.5"
        className="stroke-ink-subtle"
        strokeWidth="1.75"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className="font-display text-[1.05rem] leading-none font-semibold tracking-[-0.03em] text-ink">
        Backend
      </span>
      <span className="hidden font-mono text-micro leading-none tracking-[0.16em] text-ink-subtle uppercase sm:inline">
        Field manual
      </span>
    </span>
  );
}
