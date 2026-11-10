import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  new URL("../drizzle/0001_zippy_riptide.sql", import.meta.url),
  "utf8",
);

describe("0001 track-model migration", () => {
  it("is additive: it never drops or truncates a content table", () => {
    expect(migration).not.toMatch(/DROP\s+TABLE/i);
    expect(migration).not.toMatch(/TRUNCATE/i);
    expect(migration).not.toMatch(/DROP\s+COLUMN/i);
  });

  it("inserts the Backend track before phases reference it", () => {
    const insertTrack = migration.indexOf('INSERT INTO "tracks"');
    const phaseForeignKey = migration.indexOf(
      'ADD CONSTRAINT "phases_track_id_tracks_id_fk"',
    );
    expect(insertTrack).toBeGreaterThan(-1);
    expect(phaseForeignKey).toBeGreaterThan(-1);
    expect(insertTrack).toBeLessThan(phaseForeignKey);
  });

  it("backfills legacy progress into owner-scoped state tables", () => {
    expect(migration).toMatch(
      /INSERT INTO "user_topic_state"[\s\S]*SELECT 'guest-local', "id", "status", "notes" FROM "topics"/,
    );
    expect(migration).toMatch(
      /INSERT INTO "user_subtopic_state"[\s\S]*SELECT 'guest-local', "id", "done"/,
    );
    expect(migration).toMatch(
      /INSERT INTO "track_settings"[\s\S]*SELECT 'guest-local', 'backend', "start_date"/,
    );
  });

  it("drops the temporary track_id default after the backfill", () => {
    const dropDefault = migration.indexOf(
      'ALTER TABLE "phases" ALTER COLUMN "track_id" DROP DEFAULT',
    );
    expect(dropDefault).toBeGreaterThan(-1);
    expect(migration.indexOf('ADD COLUMN "track_id"')).toBeLessThan(dropDefault);
  });
});
