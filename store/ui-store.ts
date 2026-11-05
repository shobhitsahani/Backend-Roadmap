"use client";

import { create } from "zustand";

import type { AppView, RoadmapView } from "@/types/roadmap";

type UiState = {
  view: AppView;
  roadmapView: RoadmapView;
  selectedTopicId: string | null;
  startDateOpen: boolean;
  setView: (view: AppView) => void;
  setRoadmapView: (view: RoadmapView) => void;
  openTopic: (topicId: string) => void;
  closeTopic: () => void;
  setStartDateOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>()((set) => ({
  view: "roadmap",
  roadmapView: "list",
  selectedTopicId: null,
  startDateOpen: false,
  setView: (view) => set({ view }),
  setRoadmapView: (roadmapView) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("backend-roadmap-view", roadmapView);
    }
    set({ roadmapView });
  },
  openTopic: (selectedTopicId) => set({ selectedTopicId }),
  closeTopic: () => set({ selectedTopicId: null }),
  setStartDateOpen: (startDateOpen) => set({ startDateOpen }),
}));
