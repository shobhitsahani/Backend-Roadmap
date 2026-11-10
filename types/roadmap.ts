import { z } from "zod";

export const topicStatusSchema = z.enum(["not_started", "in_progress", "done"]);
export type TopicStatus = z.infer<typeof topicStatusSchema>;

export const trackSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  subtitle: z.string(),
  summary: z.string(),
  footer: z.string().nullable(),
  order: z.number().int(),
  identityHue: z.number().int(),
  sourceTitle: z.string().nullable(),
  sourceUrl: z.string().nullable(),
});

export const phaseSchema = z.object({
  id: z.string(),
  trackId: z.string(),
  title: z.string(),
  subtitle: z.string(),
  tip: z.string(),
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
  durationWeeks: z.number().int().nonnegative(),
  order: z.number().int(),
  tip: z.string(),
  outcome: z.string().nullable(),
  flow: z.string().nullable(),
  estimated: z.boolean(),
  linkedTopicId: z.string().nullable(),
  honestyNote: z.string().nullable(),
  status: topicStatusSchema,
  notes: z.string(),
  /** True when the status comes from the linked Backend topic, not this track. */
  mirrored: z.boolean(),
  subtopics: z.array(subtopicSchema),
  resources: z.array(resourceSchema),
});

export const phaseWithTopicsSchema = phaseSchema.extend({
  topics: z.array(topicSchema),
});

export const trackSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  identityHue: z.number().int(),
  percent: z.number(),
  completedWeeks: z.number(),
  totalWeeks: z.number(),
  completedTopics: z.number().int(),
  totalTopics: z.number().int(),
});

export const settingsSchema = z.object({
  trackId: z.string(),
  startDate: z.string().nullable(),
  updatedAt: z.string(),
});

export const activityKindSchema = z.enum([
  "subtopic_checked",
  "subtopic_unchecked",
  "topic_completed",
  "topic_reopened",
]);

export const activitySchema = z.object({
  id: z.number(),
  kind: activityKindSchema,
  topicId: z.string().nullable(),
  subtopicId: z.string().nullable(),
  createdAt: z.string(),
});

export const roadmapSnapshotSchema = z.object({
  track: trackSchema,
  tracks: z.array(trackSummarySchema),
  phases: z.array(phaseWithTopicsSchema),
  settings: settingsSchema,
  activity: z.array(activitySchema),
});

export type Track = z.infer<typeof trackSchema>;
export type TrackSummary = z.infer<typeof trackSummarySchema>;
export type Phase = z.infer<typeof phaseSchema>;
export type Subtopic = z.infer<typeof subtopicSchema>;
export type Resource = z.infer<typeof resourceSchema>;
export type Topic = z.infer<typeof topicSchema>;
export type PhaseWithTopics = z.infer<typeof phaseWithTopicsSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type Activity = z.infer<typeof activitySchema>;
export type ActivityKind = z.infer<typeof activityKindSchema>;
export type RoadmapSnapshot = z.infer<typeof roadmapSnapshotSchema>;

export type TrackSection = "roadmap" | "log" | "timeline";
export type RoadmapView = "list" | "graph" | "journey";

export type TopicWithPhase = Topic & {
  phase: Phase;
};

export type ProgressPayload = {
  trackSlug: string;
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

export const isoDateSchema = z.iso.date();

export const updateSubtopicSchema = z.object({
  done: z.boolean(),
});

export const updateTopicSchema = z.object({
  notes: z.string().max(20_000).optional(),
  status: topicStatusSchema.optional(),
  clearOverride: z.boolean().optional(),
});

export const updateSettingsSchema = z.object({
  trackSlug: z.string().min(1),
  startDate: isoDateSchema.nullable(),
});

export const progressFileSchema = z.object({
  format: z.literal("backend-roadmap-progress"),
  version: z.union([z.literal(1), z.literal(2)]),
  exportedAt: z.iso.datetime(),
  data: z.object({
    trackSlug: z.string().min(1).default("backend"),
    startDate: isoDateSchema.nullable(),
    topics: z
      .array(
        z.object({
          id: z.string(),
          status: topicStatusSchema,
          notes: z.string().max(20_000),
        }),
      )
      .max(500),
    subtopics: z
      .array(
        z.object({
          id: z.string(),
          done: z.boolean(),
        }),
      )
      .max(5_000),
    activity: z
      .array(
        z.object({
          kind: activityKindSchema,
          topicId: z.string().nullable(),
          subtopicId: z.string().nullable(),
          createdAt: z.iso.datetime(),
        }),
      )
      .max(5_000),
  }),
});

export type ProgressFile = z.infer<typeof progressFileSchema>;
export type UpdateSubtopicInput = z.infer<typeof updateSubtopicSchema>;
export type UpdateTopicInput = z.infer<typeof updateTopicSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
