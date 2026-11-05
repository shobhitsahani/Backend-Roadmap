import type { Variants } from "motion/react";

export const duration = {
  fast: 0.15,
  base: 0.22,
  slow: 0.3,
} as const;

export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};

export const spring = {
  panel: { type: "spring", stiffness: 320, damping: 34, mass: 0.9 },
  layout: { type: "spring", stiffness: 380, damping: 38, mass: 0.7 },
  soft: { type: "spring", stiffness: 210, damping: 28, mass: 1 },
} as const;

export const stagger = 0.04;

export const revealContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.05,
    },
  },
};

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.out },
  },
};

export const drawerContent: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: stagger, delayChildren: 0.06 },
  },
  exit: {
    opacity: 0,
    transition: { duration: duration.fast },
  },
};

export const drawerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.out },
  },
  exit: { opacity: 0, y: 4, transition: { duration: duration.fast } },
};
