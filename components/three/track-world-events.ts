/**
 * Minimal imperative bridge: a DOM caption asks the canvas to dolly the
 * camera toward the requested cluster. The canvas consumes the request once;
 * navigation is gated by the link's own onClick timing, not the 3D clock.
 */
export type TrackWorldDolly = {
  slug: "backend" | "ai-engineer";
  started: number;
};

let pending: TrackWorldDolly | null = null;

export function requestTrackWorldDolly(slug: TrackWorldDolly["slug"]) {
  pending = { slug, started: performance.now() };
}

export function consumeTrackWorldDolly(): TrackWorldDolly | null {
  const next = pending;
  pending = null;
  return next;
}
