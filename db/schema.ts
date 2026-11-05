import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const topicStatus = pgEnum("topic_status", ["not_started", "in_progress", "done"]);

export const activityKind = pgEnum("activity_kind", [
  "subtopic_checked",
  "subtopic_unchecked",
  "topic_completed",
  "topic_reopened",
]);

export const phases = pgTable("phases", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  order: integer("order").notNull(),
});

export const topics = pgTable(
  "topics",
  {
    id: text("id").primaryKey(),
    phaseId: text("phase_id")
      .notNull()
      .references(() => phases.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    summary: text("summary").notNull().default(""),
    durationWeeks: integer("duration_weeks").notNull(),
    order: integer("order").notNull(),
    tip: text("tip").notNull().default(""),
    outcome: text("outcome"),
    flow: text("flow"),
    status: topicStatus("status").notNull().default("not_started"),
    notes: text("notes").notNull().default(""),
  },
  (table) => [index("topics_phase_order_idx").on(table.phaseId, table.order)],
);

export const subtopics = pgTable(
  "subtopics",
  {
    id: text("id").primaryKey(),
    topicId: text("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    done: boolean("done").notNull().default(false),
    order: integer("order").notNull(),
  },
  (table) => [index("subtopics_topic_order_idx").on(table.topicId, table.order)],
);

export const resources = pgTable(
  "resources",
  {
    id: text("id").primaryKey(),
    topicId: text("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    url: text("url").notNull(),
  },
  (table) => [index("resources_topic_idx").on(table.topicId)],
);

export const settings = pgTable("settings", {
  id: text("id").primaryKey().default("singleton"),
  startDate: date("start_date", { mode: "string" }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const activity = pgTable(
  "activity",
  {
    id: serial("id").primaryKey(),
    kind: activityKind("kind").notNull(),
    topicId: text("topic_id").references(() => topics.id, { onDelete: "cascade" }),
    subtopicId: text("subtopic_id").references(() => subtopics.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("activity_created_at_idx").on(table.createdAt)],
);

export const phasesRelations = relations(phases, ({ many }) => ({
  topics: many(topics),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  phase: one(phases, {
    fields: [topics.phaseId],
    references: [phases.id],
  }),
  subtopics: many(subtopics),
  resources: many(resources),
}));

export const subtopicsRelations = relations(subtopics, ({ one }) => ({
  topic: one(topics, {
    fields: [subtopics.topicId],
    references: [topics.id],
  }),
}));

export const resourcesRelations = relations(resources, ({ one }) => ({
  topic: one(topics, {
    fields: [resources.topicId],
    references: [topics.id],
  }),
}));

export type PhaseRow = typeof phases.$inferSelect;
export type TopicRow = typeof topics.$inferSelect;
export type SubtopicRow = typeof subtopics.$inferSelect;
export type ResourceRow = typeof resources.$inferSelect;
export type SettingsRow = typeof settings.$inferSelect;
export type ActivityRow = typeof activity.$inferSelect;
export type TopicStatus = (typeof topicStatus.enumValues)[number];
export type ActivityKind = (typeof activityKind.enumValues)[number];
