"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";

function DrawCheck() {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className="size-3.5 overflow-visible"
    >
      <motion.path
        d="M3 8.5 6.4 11.8 13 4.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="square"
        strokeLinejoin="miter"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-5 shrink-0 items-center justify-center rounded-xs border border-hairline-strong bg-transparent text-transparent transition-[border-color,background-color,color,box-shadow] duration-150 outline-none before:absolute before:-inset-3 before:content-[''] hover:border-ink/45 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-45 aria-invalid:border-destructive data-checked:border-[var(--topic-accent,var(--phase-1))] data-checked:bg-[var(--topic-accent,var(--phase-1))] data-checked:text-[var(--topic-accent-contrast,var(--phase-contrast))] data-checked:hover:border-[var(--topic-accent,var(--phase-1))]",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center"
      >
        <DrawCheck />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
