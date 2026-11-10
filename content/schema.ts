import { z } from "zod";

export const contentSubtopicSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  order: z.number().int().positive(),
});

export const contentResourceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  url: z.url(),
});

export const contentTopicSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().default(""),
  durationWeeks: z.number().int().nonnegative(),
  order: z.number().int().positive(),
  tip: z.string().default(""),
  outcome: z.string().nullable().default(null),
  flow: z.string().nullable().default(null),
  estimated: z.boolean().default(false),
  linkedTopicId: z.string().nullable().default(null),
  subtopics: z.array(contentSubtopicSchema).default([]),
  resources: z.array(contentResourceSchema).default([]),
});

export const contentPhaseSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().default(""),
  tip: z.string().default(""),
  order: z.number().int().positive(),
  topics: z.array(contentTopicSchema).min(1),
});

export const trackContentSchema = z.object({
  id: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Track slug must be kebab-case."),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  summary: z.string().min(1),
  footer: z.string().nullable().default(null),
  order: z.number().int().positive(),
  identityHue: z.number().int().min(0).max(360),
  sourceTitle: z.string().nullable().default(null),
  sourceUrl: z.url().nullable().default(null),
  phases: z.array(contentPhaseSchema).min(1),
});

export type TrackContent = z.infer<typeof trackContentSchema>;
export type ContentPhase = z.infer<typeof contentPhaseSchema>;
export type ContentTopic = z.infer<typeof contentTopicSchema>;
export type ContentSubtopic = z.infer<typeof contentSubtopicSchema>;
export type ContentResource = z.infer<typeof contentResourceSchema>;
