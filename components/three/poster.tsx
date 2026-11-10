"use client";

/**
 * Fallback for when 3D is off by kill switch, reduced motion, Save-Data,
 * weak hardware, or WebGL missing. Pure SVG on a fixed-height container so
 * there is never layout shift or a canvas-only experience. It mirrors the
 * 3D layout: Backend lattice on the left, AI constellation on the right.
 */
export function TrackWorldPoster({ hint = "3D off — tap a caption to open the track." }) {
  return (
    <section
      role="region"
      aria-label="Track world"
      className="relative flex h-[300px] w-full items-center justify-center overflow-hidden border border-hairline bg-panel p-5 text-center text-ink-subtle"
    >
      <svg viewBox="0 0 640 200" className="h-full w-full opacity-90" aria-hidden="true">
        {/* Backend lattice — grid of dots with a single crossing diagonal */}
        {[0, 1, 2, 3, 4].map((row) =>
          [0, 1, 2, 3, 4].map((col) => (
            <circle
              key={`b-${row}-${col}`}
              cx={24 + col * 38}
              cy={26 + row * 37}
              r={row === 2 && col === 2 ? 3.4 : 2.6}
              style={{
                fill: "var(--phase-1)",
                opacity: row === 2 && col === 2 ? 1 : 0.45,
              }}
            />
          )),
        )}
        <line
          x1="32"
          y1="26"
          x2="176"
          y2="174"
          stroke="var(--phase-1)"
          strokeWidth="1.2"
          opacity="0.28"
        />
        <line
          x1="32"
          y1="174"
          x2="176"
          y2="26"
          stroke="var(--phase-1)"
          strokeWidth="1.2"
          opacity="0.28"
        />

        {/* separator */}
        <line
          x1="252"
          y1="24"
          x2="388"
          y2="24"
          stroke="var(--hairline-strong)"
          strokeWidth="1.5"
          strokeDasharray="2 8"
        />
        <line
          x1="252"
          y1="100"
          x2="388"
          y2="100"
          stroke="var(--hairline-strong)"
          strokeWidth="1.5"
          strokeDasharray="2 8"
        />
        <line
          x1="252"
          y1="176"
          x2="388"
          y2="176"
          stroke="var(--hairline-strong)"
          strokeWidth="1.5"
          strokeDasharray="2 8"
        />

        {/* AI constellation — copper points on gentle arcs */}
        <path
          d="M 432 96 Q 470 40 520 58 T 610 74"
          fill="none"
          stroke="var(--track-ai-engineer)"
          strokeWidth="1.2"
          opacity="0.48"
        />
        <path
          d="M 438 116 Q 474 140 522 124 T 598 118"
          fill="none"
          stroke="var(--track-ai-engineer)"
          strokeWidth="1.2"
          opacity="0.48"
        />
        {(
          [
            [432, 96, 3.2],
            [466, 58, 4.6],
            [520, 58, 5.8],
            [560, 66, 3.8],
            [610, 74, 2.8],
            [438, 116, 2.6],
            [486, 132, 3.4],
            [522, 124, 4.2],
            [566, 120, 2.8],
            [598, 118, 3.2],
          ] as const
        ).map(([cx, cy, r]) => (
          <circle
            key={`a-${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={r}
            style={{ fill: "var(--track-ai-engineer)" }}
            opacity={0.9}
          />
        ))}
      </svg>
      <p className="absolute right-4 bottom-3 font-mono text-micro tracking-[0.18em] uppercase">
        {hint}
      </p>
    </section>
  );
}
