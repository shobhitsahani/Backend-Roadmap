"use client";

import { create } from "zustand";

type UiState = {
  selectedTopicId: string | null;
  startDateOpen: boolean;
  commandOpen: boolean;
  openTopic: (topicId: string) => void;
  closeTopic: () => void;
  setStartDateOpen: (open: boolean) => void;
  setCommandOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>()((set) => ({
  selectedTopicId: null,
  startDateOpen: false,
  commandOpen: false,
  openTopic: (selectedTopicId) => set({ selectedTopicId }),
  closeTopic: () => set({ selectedTopicId: null }),
  setStartDateOpen: (startDateOpen) => set({ startDateOpen }),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
}));
