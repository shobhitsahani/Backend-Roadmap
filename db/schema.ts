import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

export const topicStatus = pgEnum("topic_status", ["not_started", "in_progress", "done"]);

export const activityKind = pgEnum("activity_kind", [
  "subtopic_checked",
  "subtopic_unchecked",
  "topic_completed",
  "topic_reopened",
]);

/** Content: a learning track. `id` is the stable slug used by content files. */
export const tracks = pgTable(
  "tracks",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    subtitle: text("subtitle").notNull(),
    summary: text("summary").notNull(),
    footer: text("footer"),
    order: integer("order").notNull(),
    identityHue: integer("identity_hue").notNull(),
    sourceTitle: text("source_title"),
    sourceUrl: text("source_url"),
  },
  (table) => [index("tracks_order_idx").on(table.order)],
);

/** Content: phases belong to exactly one track. */
export const phases = pgTable(
  "phases",
  {
    id: text("id").primaryKey(),
    trackId: text("track_id")
      .notNull()
      .references(() => tracks.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    subtitle: text("subtitle").notNull(),
    tip: text("tip").notNull().default(""),
    order: integer("order").notNull(),
  },
  (table) => [index("phases_track_order_idx").on(table.trackId, table.order)],
);

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
    estimated: boolean("estimated").notNull().default(false),
    linkedTopicId: text("linked_topic_id").references((): AnyPgColumn => topics.id, {
      onDelete: "set null",
    }),
    honestyNote: text("honesty_note"),
    /**
     * @deprecated Content/state split: read from `user_topic_state`.
     * Kept for one release as a rollback path.
     */
    status: topicStatus("status").notNull().default("not_started"),
    /** @deprecated Read from `user_topic_state`. */
    notes: text("notes").notNull().default(""),
  },
  (table) => [
    index("topics_phase_order_idx").on(table.phaseId, table.order),
    index("topics_linked_idx").on(table.linkedTopicId),
  ],
);

export const subtopics = pgTable(
  "subtopics",
  {
    id: text("id").primaryKey(),
    topicId: text("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    /** @deprecated Read from `user_subtopic_state`. */
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

/** State: one row per owner and topic. */
export const userTopicState = pgTable(
  "user_topic_state",
  {
    ownerId: text("owner_id").notNull(),
    topicId: text("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    status: topicStatus("status").notNull().default("not_started"),
    notes: text("notes").notNull().default(""),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.ownerId, table.topicId] }),
    index("user_topic_state_owner_idx").on(table.ownerId),
  ],
);

/** State: one row per owner and subtopic. */
export const userSubtopicState = pgTable(
  "user_subtopic_state",
  {
    ownerId: text("owner_id").notNull(),
    subtopicId: text("subtopic_id")
      .notNull()
      .references(() => subtopics.id, { onDelete: "cascade" }),
    done: boolean("done").notNull().default(false),
    doneAt: timestamp("done_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.ownerId, table.subtopicId] }),
    index("user_subtopic_state_owner_idx").on(table.ownerId),
  ],
);

/** State: one start date per owner and track. */
export const trackSettings = pgTable(
  "track_settings",
  {
    ownerId: text("owner_id").notNull(),
    trackId: text("track_id")
      .notNull()
      .references(() => tracks.id, { onDelete: "cascade" }),
    startDate: date("start_date", { mode: "string" }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.ownerId, table.trackId] })],
);

/**
 * @deprecated Single-user settings row. Superseded by `track_settings`.
 * Kept for one release as a rollback path.
 */
export const settings = pgTable("settings", {
  id: text("id").primaryKey().default("singleton"),
  startDate: date("start_date", { mode: "string" }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const activity = pgTable(
  "activity",
  {
    id: serial("id").primaryKey(),
    ownerId: text("owner_id").notNull().default("guest-local"),
    kind: activityKind("kind").notNull(),
    topicId: text("topic_id").references(() => topics.id, { onDelete: "cascade" }),
    subtopicId: text("subtopic_id").references(() => subtopics.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("activity_created_at_idx").on(table.createdAt),
    index("activity_owner_created_idx").on(table.ownerId, table.createdAt),
  ],
);

export const tracksRelations = relations(tracks, ({ many }) => ({
  phases: many(phases),
}));

export const phasesRelations = relations(phases, ({ one, many }) => ({
  track: one(tracks, {
    fields: [phases.trackId],
    references: [tracks.id],
  }),
  topics: many(topics),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  phase: one(phases, {
    fields: [topics.phaseId],
    references: [phases.id],
  }),
  linkedTopic: one(topics, {
    fields: [topics.linkedTopicId],
    references: [topics.id],
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

export type TrackRow = typeof tracks.$inferSelect;
export type PhaseRow = typeof phases.$inferSelect;
export type TopicRow = typeof topics.$inferSelect;
export type SubtopicRow = typeof subtopics.$inferSelect;
export type ResourceRow = typeof resources.$inferSelect;
export type SettingsRow = typeof settings.$inferSelect;
export type TrackSettingsRow = typeof trackSettings.$inferSelect;
export type UserTopicStateRow = typeof userTopicState.$inferSelect;
export type UserSubtopicStateRow = typeof userSubtopicState.$inferSelect;
export type ActivityRow = typeof activity.$inferSelect;
export type TopicStatus = (typeof topicStatus.enumValues)[number];
export type ActivityKind = (typeof activityKind.enumValues)[number];
