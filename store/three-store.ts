"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ThreePreference } from "@/lib/three-fallback";

type ThreeState = {
  preference: ThreePreference;
  setPreference: (preference: ThreePreference) => void;
};

export const useThreeStore = create<ThreeState>()(
  persist(
    (set) => ({
      preference: "on",
      setPreference: (preference) => set({ preference }),
    }),
    { name: "backend-roadmap-3d" },
  ),
);
