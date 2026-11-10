import { describe, expect, it } from "vitest";

import { getTrackContent } from "@/content/tracks";

const LEAK = /python|\bpip\b|\.py\b|fastapi|flask|django|jupyter|pytorch/i;

function collectStrings(value: unknown, key: string | null, out: string[]) {
  if (typeof value === "string") {
    if (key !== "honestyNote") out.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, null, out);
    return;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      collectStrings(v, k, out);
    }
  }
}

describe("AI track is TypeScript-only", () => {
  it("has no Python-flavored strings anywhere except honestyNote", () => {
    const ai = getTrackContent("ai-engineer");
    expect(ai).not.toBeNull();
    if (!ai) return;

    const strings: string[] = [];
    collectStrings(ai, null, strings);
    const leaks = strings.filter((s) => LEAK.test(s));
    expect(leaks).toEqual([]);
  });

  it("keeps every AI topic marked as estimated", () => {
    const ai = getTrackContent("ai-engineer");
    expect(ai).not.toBeNull();
    if (!ai) return;
    const topics = ai.phases.flatMap((phase) => phase.topics);
    expect(topics.every((topic) => topic.estimated)).toBe(true);
  });

  it("keeps the honestyNote exception on the Fine-tuning topic", () => {
    const ai = getTrackContent("ai-engineer");
    expect(ai).not.toBeNull();
    if (!ai) return;
    const fineTuning = ai.phases
      .flatMap((phase) => phase.topics)
      .find((topic) => topic.id === "ai-fine-tuning");
    expect(fineTuning?.honestyNote).toMatch(/python/i);
  });
});
