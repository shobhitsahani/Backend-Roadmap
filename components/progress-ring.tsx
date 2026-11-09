"use client";

import { motion, useReducedMotion } from "motion/react";

import { TickingNumber } from "@/components/ticking-number";
import { cn } from "@/lib/utils";

type ProgressRingProps = {
  value: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  accent?: string;
  showValue?: boolean;
  className?: string;
};

export function ProgressRing({
  value,
  label,
  size = 44,
  strokeWidth = 2.5,
  accent = "var(--phase-1)",
  showValue = true,
  className,
}: ProgressRingProps) {
  const reduceMotion = useReducedMotion();
  const normalized = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(normalized)}
      aria-valuetext={`${Math.round(normalized)}% complete`}
      aria-label={label}
      className={cn("relative inline-grid shrink-0 place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        aria-hidden="true"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--hairline)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={accent}
          strokeWidth={strokeWidth}
          strokeLinecap="butt"
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset: normalized === 0 ? circumference : offset }}
          transition={
            reduceMotion ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
          }
        />
      </svg>
      {showValue ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center font-mono text-micro font-medium tracking-[-0.05em] text-ink"
        >
          <TickingNumber value={normalized} suffix="%" duration={0.4} />
        </span>
      ) : null}
    </div>
  );
}
