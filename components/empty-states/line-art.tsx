import { cn } from "@/lib/utils";

/**
 * Line-art marks for empty states (DESIGN.md §8): built from crosshairs and
 * rulers only — no mascots, no filled shapes.
 */

const strokeProps = {
  fill: "none",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function RulerMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cn("size-12 text-ink-muted", className)}
    >
      <g stroke="currentColor" {...strokeProps}>
        <rect x="10" y="22" width="44" height="20" />
        <path d="M10 48V16m44 32V16" />
        {/* tick marks along the top edge of the ruler */}
        <path d="M18 22v-6m8 6v-9m8 9v-6m8 6v-9m8 9v-6" />
        {/* water level tick on the face */}
        <path d="M18 42h6M18 36h10" />
      </g>
    </svg>
  );
}

export function CrosshairMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cn("size-12 text-ink-muted", className)}
    >
      <g stroke="currentColor" {...strokeProps}>
        {/* crosshair */}
        <circle cx="26" cy="26" r="12" />
        <path d="M26 8v10m0 16v10m-18-18h10m16 0h10" />
        <circle r="1.5" cx="26" cy="26" />
        {/* ruler segment running below */}
        <path d="M24 56h32m-4-4v4h4v-4m-12 0v4m-8-4v4" />
      </g>
    </svg>
  );
}
