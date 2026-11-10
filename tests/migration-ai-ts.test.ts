import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  new URL("../drizzle/0002_ai_ts_only.sql", import.meta.url),
  "utf8",
);

describe("0002 ai ts-only migration", () => {
  it("is additive: never drops or truncates a content table", () => {
    expect(migration).not.toMatch(/DROP\s+TABLE/i);
    expect(migration).not.toMatch(/TRUNCATE/i);
    expect(migration).not.toMatch(/DROP\s+COLUMN/i);
  });

  it("adds the honesty_note column", () => {
    expect(migration).toMatch(/ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS\s+"honesty_note"/i);
  });

  it("maps ai-python state to typescript-for-ai-engineering", () => {
    expect(migration).toMatch(/'typescript-for-ai-engineering'[\s\S]*'ai-python'/);
    expect(migration).toMatch(/DELETE FROM "user_topic_state"[\s\S]*'ai-python'/);
  });

  it("copies pick-a-language state without deleting it", () => {
    expect(migration).toMatch(/'typescript-for-ai-engineering'[\s\S]*'pick-a-language'/);
    // pick-a-language must not appear in any DELETE.
    expect(migration).not.toMatch(/DELETE[\s\S]*'pick-a-language'/i);
  });

  it("maps the remaining removed topics to their successors", () => {
    expect(migration).toMatch(/'ai-rag'[\s\S]*'ai-embeddings'/);
    expect(migration).toMatch(/'ai-evals'[\s\S]*'ai-rag-eval'/);
    expect(migration).toMatch(/'ai-auth-payments'[\s\S]*'ai-architecture'/);
    expect(migration).toMatch(/'ai-guardrails'[\s\S]*'ai-safety'/);
  });

  it("remaps activity rows for removed topics", () => {
    expect(migration).toMatch(
      /UPDATE "activity" SET "topic_id" = 'typescript-for-ai-engineering'/,
    );
    expect(migration).toMatch(/UPDATE "activity" SET "subtopic_id" = CASE/);
  });
});
