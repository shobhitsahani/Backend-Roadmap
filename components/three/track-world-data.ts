/**
 * Deterministic geometry for TrackWorld. Pure data, no three.js imports, so
 * the counts and connectivity stay unit-testable. The scene component only
 * renders what this module decides.
 */

export type Point3 = [number, number, number];
export type EdgeIndex = [number, number];

const mulberry32 = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Backend lattice — a 12 x 10 x 6 box grid around the origin. */
const LATTICE_COLS = 12;
const LATTICE_ROWS = 10;
const LATTICE_DEPTH = 6;
const LATTICE_SPACING = 0.34;

export const LATTICE_NODES: Point3[] = [];
for (let x = 0; x < LATTICE_COLS; x += 1) {
  for (let y = 0; y < LATTICE_ROWS; y += 1) {
    for (let z = 0; z < LATTICE_DEPTH; z += 1) {
      LATTICE_NODES.push([
        (x - (LATTICE_COLS - 1) / 2) * LATTICE_SPACING,
        (y - (LATTICE_ROWS - 1) / 2) * LATTICE_SPACING * 0.72,
        (z - (LATTICE_DEPTH - 1) / 2) * LATTICE_SPACING,
      ]);
    }
  }
}

/** Lattice edges — a sparse subset of grid neighbours, capped at 48. */
export const LATTICE_EDGES: EdgeIndex[] = [];
const latticeIndex = (x: number, y: number, z: number) =>
  x * (LATTICE_ROWS * LATTICE_DEPTH) + y * LATTICE_DEPTH + z;
const edgeCandidates: EdgeIndex[] = [];
for (let x = 0; x < LATTICE_COLS; x += 1) {
  for (let y = 0; y < LATTICE_ROWS; y += 1) {
    for (let z = 0; z < LATTICE_DEPTH; z += 1) {
      if (x < LATTICE_COLS - 1)
        edgeCandidates.push([latticeIndex(x, y, z), latticeIndex(x + 1, y, z)]);
      if (y < LATTICE_ROWS - 1)
        edgeCandidates.push([latticeIndex(x, y, z), latticeIndex(x, y + 1, z)]);
      if (z < LATTICE_DEPTH - 1)
        edgeCandidates.push([latticeIndex(x, y, z), latticeIndex(x, y, z + 1)]);
    }
  }
}
{
  const rand = mulberry32(20270601);
  const step = Math.floor(edgeCandidates.length / 48);
  for (let i = 0; i < edgeCandidates.length && LATTICE_EDGES.length < 48; i += step) {
    // deterministic-ish sparse selection: every `step`n-th candidate, cycling from a random offset
    const edge = edgeCandidates[(i + Math.floor(rand() * 0)) % edgeCandidates.length];
    if (edge) LATTICE_EDGES.push(edge);
  }
}

/** AI constellation — 24 anchor stars in a tilted ring; ~1700 points around it. */
export const CONSTELLATION_ANCHORS: Point3[] = [];
const constellationAnchors = 24;
{
  const rand = mulberry32(20270701);
  for (let i = 0; i < constellationAnchors; i += 1) {
    const angle = (i / constellationAnchors) * Math.PI * 2;
    const jitterRadius = 0.82 + rand() * 0.34;
    CONSTELLATION_ANCHORS.push([
      Math.cos(angle) * jitterRadius * 3.6,
      (Math.sin(angle * 2) * 0.4 + 0.08) * 1.35,
      Math.sin(angle) * jitterRadius * 3.6,
    ]);
  }
}

export const CONSTELLATION_EDGES: EdgeIndex[] = [];
{
  // Inner ring (i → i+1) plus a longer-range chord (i → i+9) ≈ 48 edges.
  for (let i = 0; i < constellationAnchors; i += 1) {
    CONSTELLATION_EDGES.push([i, (i + 1) % constellationAnchors]);
  }
  for (let i = 0; i < constellationAnchors; i += 1) {
    CONSTELLATION_EDGES.push([i, (i + 9) % constellationAnchors]);
  }
}

/** Star-cloud points scattered in a flat elliptical disc around the anchors. */
export const CONSTELLATION_POINTS: Point3[] = [];
{
  const rand = mulberry32(20270702);
  const target = 2200;
  for (let i = 0; i < target; i += 1) {
    const angle = rand() * Math.PI * 2;
    const radius = Math.pow(rand(), 0.55) * 3.9;
    CONSTELLATION_POINTS.push([
      Math.cos(angle) * radius,
      (rand() - 0.5) * 1.05 + Math.sin(angle * 2) * 0.12,
      Math.sin(angle) * radius,
    ]);
  }
}

export const TOTAL_POINTS = LATTICE_NODES.length + CONSTELLATION_POINTS.length;
