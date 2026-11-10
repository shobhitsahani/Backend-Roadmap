-- 0002: TypeScript-only AI track + honesty_note column.
-- Additive only: never drops or wipes a progress table; re-seeds by id.

-- New content field: optional honesty note per topic (used by the
-- Fine-tuning topic to flag the Python-only open-weight training reality).
ALTER TABLE "topics" ADD COLUMN IF NOT EXISTS "honesty_note" text;

-- Copy topic-level state from removed AI topics into their TypeScript
-- successors. pick-a-language is copied only (it stays live for Backend).
INSERT INTO "user_topic_state" ("owner_id", "topic_id", "status", "notes", "updated_at")
SELECT "owner_id", 'typescript-for-ai-engineering', "status", "notes", "updated_at"
FROM "user_topic_state" WHERE "topic_id" = 'ai-python'
ON CONFLICT ("owner_id", "topic_id") DO NOTHING;

INSERT INTO "user_topic_state" ("owner_id", "topic_id", "status", "notes", "updated_at")
SELECT "owner_id", 'typescript-for-ai-engineering', "status", "notes", "updated_at"
FROM "user_topic_state" WHERE "topic_id" = 'pick-a-language'
ON CONFLICT ("owner_id", "topic_id") DO NOTHING;

INSERT INTO "user_topic_state" ("owner_id", "topic_id", "status", "notes", "updated_at")
SELECT "owner_id", 'ai-rag', "status", "notes", "updated_at"
FROM "user_topic_state" WHERE "topic_id" = 'ai-embeddings'
ON CONFLICT ("owner_id", "topic_id") DO NOTHING;

INSERT INTO "user_topic_state" ("owner_id", "topic_id", "status", "notes", "updated_at")
SELECT "owner_id", 'ai-evals', "status", "notes", "updated_at"
FROM "user_topic_state" WHERE "topic_id" = 'ai-rag-eval'
ON CONFLICT ("owner_id", "topic_id") DO NOTHING;

INSERT INTO "user_topic_state" ("owner_id", "topic_id", "status", "notes", "updated_at")
SELECT "owner_id", 'ai-auth-payments', "status", "notes", "updated_at"
FROM "user_topic_state" WHERE "topic_id" = 'ai-architecture'
ON CONFLICT ("owner_id", "topic_id") DO NOTHING;

INSERT INTO "user_topic_state" ("owner_id", "topic_id", "status", "notes", "updated_at")
SELECT "owner_id", 'ai-guardrails', "status", "notes", "updated_at"
FROM "user_topic_state" WHERE "topic_id" = 'ai-safety'
ON CONFLICT ("owner_id", "topic_id") DO NOTHING;

-- Drop topic-level state for the removed (non-Backend) topics.
DELETE FROM "user_topic_state"
WHERE "topic_id" IN ('ai-python', 'ai-embeddings', 'ai-rag-eval', 'ai-architecture', 'ai-safety');

-- Copy subtopic-level state by position (OR-merge when both sources hit the
-- same target subtopic; done wins).
INSERT INTO "user_subtopic_state" ("owner_id", "subtopic_id", "done", "done_at", "updated_at")
SELECT "owner_id", 'ts-ai-1', "done", "done_at", "updated_at" FROM "user_subtopic_state" WHERE "subtopic_id" = 'ai-python-1'
ON CONFLICT ("owner_id", "subtopic_id") DO UPDATE SET
  "done" = "user_subtopic_state"."done" OR EXCLUDED."done",
  "done_at" = CASE WHEN EXCLUDED."done" THEN EXCLUDED."done_at" ELSE "user_subtopic_state"."done_at" END,
  "updated_at" = GREATEST("user_subtopic_state"."updated_at", EXCLUDED."updated_at");

INSERT INTO "user_subtopic_state" ("owner_id", "subtopic_id", "done", "done_at", "updated_at")
SELECT "owner_id", 'ts-ai-2', "done", "done_at", "updated_at" FROM "user_subtopic_state" WHERE "subtopic_id" = 'ai-python-2'
ON CONFLICT ("owner_id", "subtopic_id") DO UPDATE SET
  "done" = "user_subtopic_state"."done" OR EXCLUDED."done",
  "done_at" = CASE WHEN EXCLUDED."done" THEN EXCLUDED."done_at" ELSE "user_subtopic_state"."done_at" END,
  "updated_at" = GREATEST("user_subtopic_state"."updated_at", EXCLUDED."updated_at");

INSERT INTO "user_subtopic_state" ("owner_id", "subtopic_id", "done", "done_at", "updated_at")
SELECT "owner_id", 'ts-ai-3', "done", "done_at", "updated_at" FROM "user_subtopic_state" WHERE "subtopic_id" = 'ai-python-3'
ON CONFLICT ("owner_id", "subtopic_id") DO UPDATE SET
  "done" = "user_subtopic_state"."done" OR EXCLUDED."done",
  "done_at" = CASE WHEN EXCLUDED."done" THEN EXCLUDED."done_at" ELSE "user_subtopic_state"."done_at" END,
  "updated_at" = GREATEST("user_subtopic_state"."updated_at", EXCLUDED."updated_at");

INSERT INTO "user_subtopic_state" ("owner_id", "subtopic_id", "done", "done_at", "updated_at")
SELECT "owner_id", 'ts-ai-4', "done", "done_at", "updated_at" FROM "user_subtopic_state" WHERE "subtopic_id" = 'ai-python-4'
ON CONFLICT ("owner_id", "subtopic_id") DO UPDATE SET
  "done" = "user_subtopic_state"."done" OR EXCLUDED."done",
  "done_at" = CASE WHEN EXCLUDED."done" THEN EXCLUDED."done_at" ELSE "user_subtopic_state"."done_at" END,
  "updated_at" = GREATEST("user_subtopic_state"."updated_at", EXCLUDED."updated_at");

-- pick-a-language -> typescript-for-ai-engineering (positional, additive).
INSERT INTO "user_subtopic_state" ("owner_id", "subtopic_id", "done", "done_at", "updated_at")
SELECT "owner_id", 'ts-ai-1', "done", "done_at", "updated_at" FROM "user_subtopic_state" WHERE "subtopic_id" = 'pick-a-language-1'
ON CONFLICT ("owner_id", "subtopic_id") DO UPDATE SET
  "done" = "user_subtopic_state"."done" OR EXCLUDED."done",
  "done_at" = CASE WHEN EXCLUDED."done" THEN EXCLUDED."done_at" ELSE "user_subtopic_state"."done_at" END,
  "updated_at" = GREATEST("user_subtopic_state"."updated_at", EXCLUDED."updated_at");

INSERT INTO "user_subtopic_state" ("owner_id", "subtopic_id", "done", "done_at", "updated_at")
SELECT "owner_id", 'ts-ai-2', "done", "done_at", "updated_at" FROM "user_subtopic_state" WHERE "subtopic_id" = 'pick-a-language-2'
ON CONFLICT ("owner_id", "subtopic_id") DO UPDATE SET
  "done" = "user_subtopic_state"."done" OR EXCLUDED."done",
  "done_at" = CASE WHEN EXCLUDED."done" THEN EXCLUDED."done_at" ELSE "user_subtopic_state"."done_at" END,
  "updated_at" = GREATEST("user_subtopic_state"."updated_at", EXCLUDED."updated_at");

-- ai-embeddings -> ai-rag (positional)
INSERT INTO "user_subtopic_state" ("owner_id", "subtopic_id", "done", "done_at", "updated_at")
SELECT "owner_id", 'rag-1', "done", "done_at", "updated_at" FROM "user_subtopic_state" WHERE "subtopic_id" = 'ai-embeddings-1'
ON CONFLICT ("owner_id", "subtopic_id") DO UPDATE SET
  "done" = "user_subtopic_state"."done" OR EXCLUDED."done",
  "done_at" = CASE WHEN EXCLUDED."done" THEN EXCLUDED."done_at" ELSE "user_subtopic_state"."done_at" END,
  "updated_at" = GREATEST("user_subtopic_state"."updated_at", EXCLUDED."updated_at");

INSERT INTO "user_subtopic_state" ("owner_id", "subtopic_id", "done", "done_at", "updated_at")
SELECT "owner_id", 'rag-2', "done", "done_at", "updated_at" FROM "user_subtopic_state" WHERE "subtopic_id" = 'ai-embeddings-2'
ON CONFLICT ("owner_id", "subtopic_id") DO UPDATE SET
  "done" = "user_subtopic_state"."done" OR EXCLUDED."done",
  "done_at" = CASE WHEN EXCLUDED."done" THEN EXCLUDED."done_at" ELSE "user_subtopic_state"."done_at" END,
  "updated_at" = GREATEST("user_subtopic_state"."updated_at", EXCLUDED."updated_at");

INSERT INTO "user_subtopic_state" ("owner_id", "subtopic_id", "done", "done_at", "updated_at")
SELECT "owner_id", 'rag-3', "done", "done_at", "updated_at" FROM "user_subtopic_state" WHERE "subtopic_id" = 'ai-embeddings-3'
ON CONFLICT ("owner_id", "subtopic_id") DO UPDATE SET
  "done" = "user_subtopic_state"."done" OR EXCLUDED."done",
  "done_at" = CASE WHEN EXCLUDED."done" THEN EXCLUDED."done_at" ELSE "user_subtopic_state"."done_at" END,
  "updated_at" = GREATEST("user_subtopic_state"."updated_at", EXCLUDED."updated_at");

INSERT INTO "user_subtopic_state" ("owner_id", "subtopic_id", "done", "done_at", "updated_at")
SELECT "owner_id", 'rag-4', "done", "done_at", "updated_at" FROM "user_subtopic_state" WHERE "subtopic_id" = 'ai-embeddings-4'
ON CONFLICT ("owner_id", "subtopic_id") DO UPDATE SET
  "done" = "user_subtopic_state"."done" OR EXCLUDED."done",
  "done_at" = CASE WHEN EXCLUDED."done" THEN EXCLUDED."done_at" ELSE "user_subtopic_state"."done_at" END,
  "updated_at" = GREATEST("user_subtopic_state"."updated_at", EXCLUDED."updated_at");

-- ai-rag-eval -> ai-evals (positional)
INSERT INTO "user_subtopic_state" ("owner_id", "subtopic_id", "done", "done_at", "updated_at")
SELECT "owner_id", 'eval-1', "done", "done_at", "updated_at" FROM "user_subtopic_state" WHERE "subtopic_id" = 'ai-rag-eval-1'
ON CONFLICT ("owner_id", "subtopic_id") DO UPDATE SET
  "done" = "user_subtopic_state"."done" OR EXCLUDED."done",
  "done_at" = CASE WHEN EXCLUDED."done" THEN EXCLUDED."done_at" ELSE "user_subtopic_state"."done_at" END,
  "updated_at" = GREATEST("user_subtopic_state"."updated_at", EXCLUDED."updated_at");

INSERT INTO "user_subtopic_state" ("owner_id", "subtopic_id", "done", "done_at", "updated_at")
SELECT "owner_id", 'eval-2', "done", "done_at", "updated_at" FROM "user_subtopic_state" WHERE "subtopic_id" = 'ai-rag-eval-2'
ON CONFLICT ("owner_id", "subtopic_id") DO UPDATE SET
  "done" = "user_subtopic_state"."done" OR EXCLUDED."done",
  "done_at" = CASE WHEN EXCLUDED."done" THEN EXCLUDED."done_at" ELSE "user_subtopic_state"."done_at" END,
  "updated_at" = GREATEST("user_subtopic_state"."updated_at", EXCLUDED."updated_at");

INSERT INTO "user_subtopic_state" ("owner_id", "subtopic_id", "done", "done_at", "updated_at")
SELECT "owner_id", 'eval-3', "done", "done_at", "updated_at" FROM "user_subtopic_state" WHERE "subtopic_id" = 'ai-rag-eval-3'
ON CONFLICT ("owner_id", "subtopic_id") DO UPDATE SET
  "done" = "user_subtopic_state"."done" OR EXCLUDED."done",
  "done_at" = CASE WHEN EXCLUDED."done" THEN EXCLUDED."done_at" ELSE "user_subtopic_state"."done_at" END,
  "updated_at" = GREATEST("user_subtopic_state"."updated_at", EXCLUDED."updated_at");

INSERT INTO "user_subtopic_state" ("owner_id", "subtopic_id", "done", "done_at", "updated_at")
SELECT "owner_id", 'eval-4', "done", "done_at", "updated_at" FROM "user_subtopic_state" WHERE "subtopic_id" = 'ai-rag-eval-4'
ON CONFLICT ("owner_id", "subtopic_id") DO UPDATE SET
  "done" = "user_subtopic_state"."done" OR EXCLUDED."done",
  "done_at" = CASE WHEN EXCLUDED."done" THEN EXCLUDED."done_at" ELSE "user_subtopic_state"."done_at" END,
  "updated_at" = GREATEST("user_subtopic_state"."updated_at", EXCLUDED."updated_at");

-- ai-architecture -> ai-auth-payments (positional)
INSERT INTO "user_subtopic_state" ("owner_id", "subtopic_id", "done", "done_at", "updated_at")
SELECT "owner_id", 'authpay-1', "done", "done_at", "updated_at" FROM "user_subtopic_state" WHERE "subtopic_id" = 'ai-arch-1'
ON CONFLICT ("owner_id", "subtopic_id") DO UPDATE SET
  "done" = "user_subtopic_state"."done" OR EXCLUDED."done",
  "done_at" = CASE WHEN EXCLUDED."done" THEN EXCLUDED."done_at" ELSE "user_subtopic_state"."done_at" END,
  "updated_at" = GREATEST("user_subtopic_state"."updated_at", EXCLUDED."updated_at");

INSERT INTO "user_subtopic_state" ("owner_id", "subtopic_id", "done", "done_at", "updated_at")
SELECT "owner_id", 'authpay-2', "done", "done_at", "updated_at" FROM "user_subtopic_state" WHERE "subtopic_id" = 'ai-arch-2'
ON CONFLICT ("owner_id", "subtopic_id") DO UPDATE SET
  "done" = "user_subtopic_state"."done" OR EXCLUDED."done",
  "done_at" = CASE WHEN EXCLUDED."done" THEN EXCLUDED."done_at" ELSE "user_subtopic_state"."done_at" END,
  "updated_at" = GREATEST("user_subtopic_state"."updated_at", EXCLUDED."updated_at");

INSERT INTO "user_subtopic_state" ("owner_id", "subtopic_id", "done", "done_at", "updated_at")
SELECT "owner_id", 'authpay-3', "done", "done_at", "updated_at" FROM "user_subtopic_state" WHERE "subtopic_id" = 'ai-arch-3'
ON CONFLICT ("owner_id", "subtopic_id") DO UPDATE SET
  "done" = "user_subtopic_state"."done" OR EXCLUDED."done",
  "done_at" = CASE WHEN EXCLUDED."done" THEN EXCLUDED."done_at" ELSE "user_subtopic_state"."done_at" END,
  "updated_at" = GREATEST("user_subtopic_state"."updated_at", EXCLUDED."updated_at");

INSERT INTO "user_subtopic_state" ("owner_id", "subtopic_id", "done", "done_at", "updated_at")
SELECT "owner_id", 'authpay-4', "done", "done_at", "updated_at" FROM "user_subtopic_state" WHERE "subtopic_id" = 'ai-arch-4'
ON CONFLICT ("owner_id", "subtopic_id") DO UPDATE SET
  "done" = "user_subtopic_state"."done" OR EXCLUDED."done",
  "done_at" = CASE WHEN EXCLUDED."done" THEN EXCLUDED."done_at" ELSE "user_subtopic_state"."done_at" END,
  "updated_at" = GREATEST("user_subtopic_state"."updated_at", EXCLUDED."updated_at");

-- ai-safety -> ai-guardrails (positional)
INSERT INTO "user_subtopic_state" ("owner_id", "subtopic_id", "done", "done_at", "updated_at")
SELECT "owner_id", 'guard-1', "done", "done_at", "updated_at" FROM "user_subtopic_state" WHERE "subtopic_id" = 'ai-safety-1'
ON CONFLICT ("owner_id", "subtopic_id") DO UPDATE SET
  "done" = "user_subtopic_state"."done" OR EXCLUDED."done",
  "done_at" = CASE WHEN EXCLUDED."done" THEN EXCLUDED."done_at" ELSE "user_subtopic_state"."done_at" END,
  "updated_at" = GREATEST("user_subtopic_state"."updated_at", EXCLUDED."updated_at");

INSERT INTO "user_subtopic_state" ("owner_id", "subtopic_id", "done", "done_at", "updated_at")
SELECT "owner_id", 'guard-2', "done", "done_at", "updated_at" FROM "user_subtopic_state" WHERE "subtopic_id" = 'ai-safety-2'
ON CONFLICT ("owner_id", "subtopic_id") DO UPDATE SET
  "done" = "user_subtopic_state"."done" OR EXCLUDED."done",
  "done_at" = CASE WHEN EXCLUDED."done" THEN EXCLUDED."done_at" ELSE "user_subtopic_state"."done_at" END,
  "updated_at" = GREATEST("user_subtopic_state"."updated_at", EXCLUDED."updated_at");

INSERT INTO "user_subtopic_state" ("owner_id", "subtopic_id", "done", "done_at", "updated_at")
SELECT "owner_id", 'guard-3', "done", "done_at", "updated_at" FROM "user_subtopic_state" WHERE "subtopic_id" = 'ai-safety-3'
ON CONFLICT ("owner_id", "subtopic_id") DO UPDATE SET
  "done" = "user_subtopic_state"."done" OR EXCLUDED."done",
  "done_at" = CASE WHEN EXCLUDED."done" THEN EXCLUDED."done_at" ELSE "user_subtopic_state"."done_at" END,
  "updated_at" = GREATEST("user_subtopic_state"."updated_at", EXCLUDED."updated_at");

INSERT INTO "user_subtopic_state" ("owner_id", "subtopic_id", "done", "done_at", "updated_at")
SELECT "owner_id", 'guard-4', "done", "done_at", "updated_at" FROM "user_subtopic_state" WHERE "subtopic_id" = 'ai-safety-4'
ON CONFLICT ("owner_id", "subtopic_id") DO UPDATE SET
  "done" = "user_subtopic_state"."done" OR EXCLUDED."done",
  "done_at" = CASE WHEN EXCLUDED."done" THEN EXCLUDED."done_at" ELSE "user_subtopic_state"."done_at" END,
  "updated_at" = GREATEST("user_subtopic_state"."updated_at", EXCLUDED."updated_at");

-- Drop subtopic-level state for removed source subtopics.
DELETE FROM "user_subtopic_state"
WHERE "subtopic_id" IN (
  'ai-python-1','ai-python-2','ai-python-3','ai-python-4',
  'ai-embeddings-1','ai-embeddings-2','ai-embeddings-3','ai-embeddings-4',
  'ai-rag-eval-1','ai-rag-eval-2','ai-rag-eval-3','ai-rag-eval-4',
  'ai-arch-1','ai-arch-2','ai-arch-3','ai-arch-4',
  'ai-safety-1','ai-safety-2','ai-safety-3','ai-safety-4','ai-safety-5'
);

-- Remap activity rows for removed AI topics (topic_id only; pick-a-language
-- activity is left alone because it is shared with the Backend track).
UPDATE "activity" SET "topic_id" = 'typescript-for-ai-engineering'
WHERE "topic_id" = 'ai-python';

UPDATE "activity" SET "topic_id" = 'ai-rag'
WHERE "topic_id" = 'ai-embeddings';

UPDATE "activity" SET "topic_id" = 'ai-evals'
WHERE "topic_id" = 'ai-rag-eval';

UPDATE "activity" SET "topic_id" = 'ai-auth-payments'
WHERE "topic_id" = 'ai-architecture';

UPDATE "activity" SET "topic_id" = 'ai-guardrails'
WHERE "topic_id" = 'ai-safety';

-- Remap activity subtopic ids for the removed topics (paired by position).
UPDATE "activity" SET "subtopic_id" = CASE "subtopic_id"
  WHEN 'ai-python-1' THEN 'ts-ai-1'
  WHEN 'ai-python-2' THEN 'ts-ai-2'
  WHEN 'ai-python-3' THEN 'ts-ai-3'
  WHEN 'ai-python-4' THEN 'ts-ai-4'
  WHEN 'ai-embeddings-1' THEN 'rag-1'
  WHEN 'ai-embeddings-2' THEN 'rag-2'
  WHEN 'ai-embeddings-3' THEN 'rag-3'
  WHEN 'ai-embeddings-4' THEN 'rag-4'
  WHEN 'ai-rag-eval-1' THEN 'eval-1'
  WHEN 'ai-rag-eval-2' THEN 'eval-2'
  WHEN 'ai-rag-eval-3' THEN 'eval-3'
  WHEN 'ai-rag-eval-4' THEN 'eval-4'
  WHEN 'ai-arch-1' THEN 'authpay-1'
  WHEN 'ai-arch-2' THEN 'authpay-2'
  WHEN 'ai-arch-3' THEN 'authpay-3'
  WHEN 'ai-arch-4' THEN 'authpay-4'
  WHEN 'ai-safety-1' THEN 'guard-1'
  WHEN 'ai-safety-2' THEN 'guard-2'
  WHEN 'ai-safety-3' THEN 'guard-3'
  WHEN 'ai-safety-4' THEN 'guard-4'
  ELSE "subtopic_id"
END
WHERE "subtopic_id" IN (
  'ai-python-1','ai-python-2','ai-python-3','ai-python-4',
  'ai-embeddings-1','ai-embeddings-2','ai-embeddings-3','ai-embeddings-4',
  'ai-rag-eval-1','ai-rag-eval-2','ai-rag-eval-3','ai-rag-eval-4',
  'ai-arch-1','ai-arch-2','ai-arch-3','ai-arch-4',
  'ai-safety-1','ai-safety-2','ai-safety-3','ai-safety-4'
);
