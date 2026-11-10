CREATE TABLE "track_settings" (
	"owner_id" text NOT NULL,
	"track_id" text NOT NULL,
	"start_date" date,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "track_settings_owner_id_track_id_pk" PRIMARY KEY("owner_id","track_id")
);
--> statement-breakpoint
CREATE TABLE "tracks" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text NOT NULL,
	"summary" text NOT NULL,
	"footer" text,
	"order" integer NOT NULL,
	"identity_hue" integer NOT NULL,
	"source_title" text,
	"source_url" text,
	CONSTRAINT "tracks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
INSERT INTO "tracks" ("id","slug","title","subtitle","summary","footer","order","identity_hue","source_title","source_url")
VALUES ('backend','backend','Backend Engineer','36 weeks / 4 phases','A field plan for moving from language fundamentals to systems that hold up in production.',NULL,1,150,NULL,NULL);
--> statement-breakpoint
CREATE TABLE "user_subtopic_state" (
	"owner_id" text NOT NULL,
	"subtopic_id" text NOT NULL,
	"done" boolean DEFAULT false NOT NULL,
	"done_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_subtopic_state_owner_id_subtopic_id_pk" PRIMARY KEY("owner_id","subtopic_id")
);
--> statement-breakpoint
CREATE TABLE "user_topic_state" (
	"owner_id" text NOT NULL,
	"topic_id" text NOT NULL,
	"status" "topic_status" DEFAULT 'not_started' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_topic_state_owner_id_topic_id_pk" PRIMARY KEY("owner_id","topic_id")
);
--> statement-breakpoint
ALTER TABLE "activity" ADD COLUMN "owner_id" text DEFAULT 'guest-local' NOT NULL;--> statement-breakpoint
ALTER TABLE "phases" ADD COLUMN "track_id" text DEFAULT 'backend' NOT NULL;--> statement-breakpoint
ALTER TABLE "phases" ADD COLUMN "tip" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "estimated" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "linked_topic_id" text;--> statement-breakpoint
ALTER TABLE "track_settings" ADD CONSTRAINT "track_settings_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subtopic_state" ADD CONSTRAINT "user_subtopic_state_subtopic_id_subtopics_id_fk" FOREIGN KEY ("subtopic_id") REFERENCES "public"."subtopics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_topic_state" ADD CONSTRAINT "user_topic_state_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tracks_order_idx" ON "tracks" USING btree ("order");--> statement-breakpoint
CREATE INDEX "user_subtopic_state_owner_idx" ON "user_subtopic_state" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "user_topic_state_owner_idx" ON "user_topic_state" USING btree ("owner_id");--> statement-breakpoint
ALTER TABLE "phases" ADD CONSTRAINT "phases_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_linked_topic_id_topics_id_fk" FOREIGN KEY ("linked_topic_id") REFERENCES "public"."topics"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activity_owner_created_idx" ON "activity" USING btree ("owner_id","created_at");--> statement-breakpoint
CREATE INDEX "phases_track_order_idx" ON "phases" USING btree ("track_id","order");--> statement-breakpoint
CREATE INDEX "topics_linked_idx" ON "topics" USING btree ("linked_topic_id");--> statement-breakpoint
ALTER TABLE "phases" ALTER COLUMN "track_id" DROP DEFAULT;--> statement-breakpoint
INSERT INTO "user_topic_state" ("owner_id","topic_id","status","notes")
SELECT 'guest-local', "id", "status", "notes" FROM "topics"
WHERE "status" <> 'not_started' OR "notes" <> ''
ON CONFLICT DO NOTHING;--> statement-breakpoint
INSERT INTO "user_subtopic_state" ("owner_id","subtopic_id","done","done_at")
SELECT 'guest-local', "id", "done", CASE WHEN "done" THEN now() ELSE NULL END FROM "subtopics"
WHERE "done" = true
ON CONFLICT DO NOTHING;--> statement-breakpoint
INSERT INTO "track_settings" ("owner_id","track_id","start_date","updated_at")
SELECT 'guest-local', 'backend', "start_date", "updated_at" FROM "settings"
WHERE "id" = 'singleton'
ON CONFLICT DO NOTHING;