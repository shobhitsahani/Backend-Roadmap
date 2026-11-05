"use client";

import { useEffect, useState } from "react";
import { animate, useMotionValue, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type TickingNumberProps = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  animateOnMount?: boolean;
  className?: string;
  "aria-label"?: string;
};

const format = (value: number, decimals: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

export function TickingNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 0.45,
  animateOnMount = false,
  className,
  "aria-label": ariaLabel,
}: TickingNumberProps) {
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(animateOnMount ? 0 : value);
  const [display, setDisplay] = useState(animateOnMount ? 0 : value);

  useEffect(() => {
    if (reduceMotion) return;

    const controls = animate(motionValue, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(latest),
    });

    return () => controls.stop();
  }, [duration, motionValue, reduceMotion, value]);

  const shown = reduceMotion ? value : display;

  return (
    <span className={cn("tnum", className)} aria-label={ariaLabel}>
      {prefix}
      {format(shown, decimals)}
      {suffix}
    </span>
  );
}
