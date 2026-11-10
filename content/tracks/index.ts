import { aiEngineerTrack } from "./ai-engineer";
import { backendTrack } from "./backend";
import type { TrackContent } from "@/content/schema";

export const trackContents: TrackContent[] = [backendTrack, aiEngineerTrack];

export const trackSlugs = trackContents.map((track) => track.slug);

export const trackBySlug = new Map(trackContents.map((track) => [track.slug, track]));

export function getTrackContent(slug: string): TrackContent | null {
  return trackBySlug.get(slug) ?? null;
}

export const defaultTrackSlug = trackContents[0]?.slug ?? "backend";
