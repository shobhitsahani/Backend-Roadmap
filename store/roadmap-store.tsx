"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { createStore, useStore } from "zustand";

import { apiRequest } from "@/lib/client-api";
import { deriveTopicStatus, roadmapProgress } from "@/lib/progress";
import type { RoadmapSnapshot, TopicStatus } from "@/types/roadmap";

type PendingMutation =
  | { kind: "subtopic"; id: string }
  | { kind: "notes"; id: string }
  | { kind: "topic-status"; id: string }
  | { kind: "start-date" };

type RoadmapState = {
  snapshot: RoadmapSnapshot;
  pending: PendingMutation | null;
  toggleSubtopic: (subtopicId: string, done: boolean) => Promise<void>;
  saveNotes: (topicId: string, notes: string) => Promise<void>;
  saveTopicStatus: (topicId: string, status: TopicStatus | null) => Promise<void>;
  saveStartDate: (startDate: string | null) => Promise<void>;
  replaceSnapshot: (snapshot: RoadmapSnapshot) => void;
};

/** Keeps the switcher's progress ring honest after an optimistic change. */
function withDerivedTrackSummary(snapshot: RoadmapSnapshot): RoadmapSnapshot {
  const progress = roadmapProgress(snapshot.phases);
  return {
    ...snapshot,
    tracks: snapshot.tracks.map((track) =>
      track.id === snapshot.track.id
        ? {
            ...track,
            percent: progress.percent,
            completedWeeks: progress.completedWeeks,
            totalWeeks: progress.totalWeeks,
            completedTopics: progress.completedTopics,
            totalTopics: progress.totalTopics,
          }
        : track,
    ),
  };
}

function applySubtopicState(
  snapshot: RoadmapSnapshot,
  subtopicId: string,
  done: boolean,
): RoadmapSnapshot {
  return withDerivedTrackSummary({
    ...snapshot,
    phases: snapshot.phases.map((phase) => ({
      ...phase,
      topics: phase.topics.map((topic) => {
        if (!topic.subtopics.some((subtopic) => subtopic.id === subtopicId)) {
          return topic;
        }
        const subtopics = topic.subtopics.map((subtopic) =>
          subtopic.id === subtopicId ? { ...subtopic, done } : subtopic,
        );
        return { ...topic, subtopics, status: deriveTopicStatus(subtopics) };
      }),
    })),
  });
}

function applyNotes(
  snapshot: RoadmapSnapshot,
  topicId: string,
  notes: string,
): RoadmapSnapshot {
  return {
    ...snapshot,
    phases: snapshot.phases.map((phase) => ({
      ...phase,
      topics: phase.topics.map((topic) =>
        topic.id === topicId ? { ...topic, notes } : topic,
      ),
    })),
  };
}

function applyTopicStatus(
  snapshot: RoadmapSnapshot,
  topicId: string,
  status: TopicStatus | null,
): RoadmapSnapshot {
  return withDerivedTrackSummary({
    ...snapshot,
    phases: snapshot.phases.map((phase) => ({
      ...phase,
      topics: phase.topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              status: status ?? "not_started",
              mirrored: status === null ? topic.linkedTopicId !== null : false,
            }
          : topic,
      ),
    })),
  });
}

function applyStartDate(
  snapshot: RoadmapSnapshot,
  startDate: string | null,
): RoadmapSnapshot {
  return {
    ...snapshot,
    settings: { ...snapshot.settings, startDate },
  };
}

function createRoadmapStore(initialSnapshot: RoadmapSnapshot) {
  return createStore<RoadmapState>()((set, get) => ({
    snapshot: initialSnapshot,
    pending: null,

    toggleSubtopic: async (subtopicId, done) => {
      const { snapshot, pending } = get();
      if (pending !== null) return;
      const previous = snapshot;
      set({
        snapshot: applySubtopicState(snapshot, subtopicId, done),
        pending: { kind: "subtopic", id: subtopicId },
      });

      try {
        const next = await apiRequest<RoadmapSnapshot>(
          `/api/subtopics/${encodeURIComponent(subtopicId)}`,
          {
            method: "PATCH",
            body: JSON.stringify({ done }),
          },
        );
        set({ snapshot: next, pending: null });
      } catch (error) {
        set({ snapshot: previous, pending: null });
        throw error;
      }
    },

    saveNotes: async (topicId, notes) => {
      const { snapshot, pending } = get();
      if (pending !== null) return;
      const previous = snapshot;
      set({
        snapshot: applyNotes(snapshot, topicId, notes),
        pending: { kind: "notes", id: topicId },
      });

      try {
        const next = await apiRequest<RoadmapSnapshot>(
          `/api/topics/${encodeURIComponent(topicId)}`,
          {
            method: "PATCH",
            body: JSON.stringify({ notes }),
          },
        );
        set({ snapshot: next, pending: null });
      } catch (error) {
        set({ snapshot: previous, pending: null });
        throw error;
      }
    },

    saveTopicStatus: async (topicId, status) => {
      const { snapshot, pending } = get();
      if (pending !== null) return;
      const previous = snapshot;
      set({
        snapshot: applyTopicStatus(snapshot, topicId, status),
        pending: { kind: "topic-status", id: topicId },
      });

      try {
        const next = await apiRequest<RoadmapSnapshot>(
          `/api/topics/${encodeURIComponent(topicId)}`,
          {
            method: "PATCH",
            body: JSON.stringify(status === null ? { clearOverride: true } : { status }),
          },
        );
        set({ snapshot: next, pending: null });
      } catch (error) {
        set({ snapshot: previous, pending: null });
        throw error;
      }
    },

    saveStartDate: async (startDate) => {
      const { snapshot, pending } = get();
      if (pending !== null) return;
      const previous = snapshot;
      set({
        snapshot: applyStartDate(snapshot, startDate),
        pending: { kind: "start-date" },
      });

      try {
        const next = await apiRequest<RoadmapSnapshot>("/api/settings", {
          method: "PATCH",
          body: JSON.stringify({ trackSlug: snapshot.track.slug, startDate }),
        });
        set({ snapshot: next, pending: null });
      } catch (error) {
        set({ snapshot: previous, pending: null });
        throw error;
      }
    },

    replaceSnapshot: (snapshot) => set({ snapshot, pending: null }),
  }));
}

type RoadmapStore = ReturnType<typeof createRoadmapStore>;

const RoadmapStoreContext = createContext<RoadmapStore | null>(null);

export function RoadmapStoreProvider({
  initialSnapshot,
  children,
}: {
  initialSnapshot: RoadmapSnapshot;
  children: ReactNode;
}) {
  const [store] = useState(() => createRoadmapStore(initialSnapshot));

  return (
    <RoadmapStoreContext.Provider value={store}>{children}</RoadmapStoreContext.Provider>
  );
}

export function useRoadmapStore<T>(selector: (state: RoadmapState) => T) {
  const store = useContext(RoadmapStoreContext);
  if (!store) {
    throw new Error("useRoadmapStore must be used inside RoadmapStoreProvider.");
  }
  return useStore(store, selector);
}
