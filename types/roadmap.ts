import { z } from "zod";

export const topicStatusSchema = z.enum(["not_started", "in_progress", "done"]);
export type TopicStatus = z.infer<typeof topicStatusSchema>;

export const phaseSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  order: z.number().int(),
});

export const subtopicSchema = z.object({
  id: z.string(),
  topicId: z.string(),
  title: z.string(),
  done: z.boolean(),
  order: z.number().int(),
});

export const resourceSchema = z.object({
  id: z.string(),
  topicId: z.string(),
  title: z.string(),
  url: z.string().url(),
});

export const topicSchema = z.object({
  id: z.string(),
  phaseId: z.string(),
  title: z.string(),
  summary: z.string(),
  durationWeeks: z.number().int().positive(),
  order: z.number().int(),
  tip: z.string(),
  outcome: z.string().nullable(),
  flow: z.string().nullable(),
  status: topicStatusSchema,
  notes: z.string(),
  subtopics: z.array(subtopicSchema),
  resources: z.array(resourceSchema),
});

export const phaseWithTopicsSchema = phaseSchema.extend({
  topics: z.array(topicSchema),
});

export const settingsSchema = z.object({
  id: z.literal("singleton"),
  startDate: z.string().nullable(),
  updatedAt: z.string(),
});

export const activitySchema = z.object({
  id: z.number(),
  kind: z.enum([
    "subtopic_checked",
    "subtopic_unchecked",
    "topic_completed",
    "topic_reopened",
  ]),
  topicId: z.string().nullable(),
  subtopicId: z.string().nullable(),
  createdAt: z.string(),
});

export const roadmapSnapshotSchema = z.object({
  phases: z.array(phaseWithTopicsSchema),
  settings: settingsSchema,
  activity: z.array(activitySchema),
});

export type Phase = z.infer<typeof phaseSchema>;
export type Subtopic = z.infer<typeof subtopicSchema>;
export type Resource = z.infer<typeof resourceSchema>;
export type Topic = z.infer<typeof topicSchema>;
export type PhaseWithTopics = z.infer<typeof phaseWithTopicsSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type Activity = z.infer<typeof activitySchema>;
export type RoadmapSnapshot = z.infer<typeof roadmapSnapshotSchema>;

export type AppView = "roadmap" | "dashboard" | "timeline";
export type RoadmapView = "list" | "graph";

export type TopicWithPhase = Topic & {
  phase: Phase;
};

export type ProgressPayload = {
  settings: { startDate: string | null };
  topics: Array<{ id: string; status: TopicStatus; notes: string }>;
  subtopics: Array<{ id: string; done: boolean }>;
  activity: Array<{
    kind: z.infer<typeof activitySchema>["kind"];
    topicId: string | null;
    subtopicId: string | null;
    createdAt: string;
  }>;
};
