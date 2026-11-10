import { describe, expect, it } from "vitest";

import {
  CONSTELLATION_ANCHORS,
  CONSTELLATION_EDGES,
  CONSTELLATION_POINTS,
  LATTICE_EDGES,
  LATTICE_NODES,
  TOTAL_POINTS,
} from "@/components/three/track-world-data";

const insideBox = (p: [number, number, number], extent: number) =>
  p.every((c) => Number.isFinite(c) && Math.abs(c) <= extent);

describe("track-world geometry", () => {
  it("ladders to ~2,900 visible points across both clusters", () => {
    expect(TOTAL_POINTS).toBeGreaterThanOrEqual(2500);
    expect(TOTAL_POINTS).toBeLessThanOrEqual(3500);
  });

  it("lattice forms a 12x10x6 regular grid inside a fixed box", () => {
    expect(LATTICE_NODES).toHaveLength(720);
    expect(LATTICE_NODES.every((p) => insideBox(p, 4))).toBe(true);
  });

  it("every lattice edge connects two valid lattice nodes", () => {
    LATTICE_EDGES.forEach(([a, b]) => {
      expect(a).toBeLessThan(LATTICE_NODES.length);
      expect(b).toBeLessThan(LATTICE_NODES.length);
      expect(LATTICE_NODES[a]).toBeDefined();
      expect(LATTICE_NODES[b]).toBeDefined();
    });
  });

  it("constellation forms anchor ring + point cloud inside a fixed radius", () => {
    expect(CONSTELLATION_ANCHORS).toHaveLength(24);
    expect(CONSTELLATION_POINTS.length).toBeGreaterThanOrEqual(2000);
    expect(insideBox([0, 0, 0], 6)).toBe(true);
    CONSTELLATION_POINTS.forEach((p) => {
      expect(insideBox(p, 4.5)).toBe(true);
    });
  });

  it("capacities edges to a predictable count so the scene stays light", () => {
    expect(LATTICE_EDGES).toHaveLength(48);
    expect(CONSTELLATION_EDGES).toHaveLength(48);
    const latticePairs = new Set(
      LATTICE_EDGES.map(([a, b]) => `${Math.min(a, b)}-${Math.max(a, b)}`),
    );
    const constellationPairs = new Set(
      CONSTELLATION_EDGES.map(([a, b]) => `${Math.min(a, b)}-${Math.max(a, b)}`),
    );
    expect(latticePairs.size).toBe(48);
    expect(constellationPairs.size).toBe(48);
  });
});
