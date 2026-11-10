import type { RoadmapView, TrackSection } from "@/types/roadmap";

/** The three real screens that belong to a track. */
export const trackSections = ["roadmap", "log", "timeline"] as const;

export function sectionHref(slug: string, section: TrackSection): string {
  return section === "roadmap" ? `/${slug}` : `/${slug}/${section}`;
}

/** Returns the section only when the pathname is exactly a track screen. */
export function sectionFromPathname(pathname: string, slug: string): TrackSection | null {
  const [first, second, third] = pathname.split("/").filter(Boolean);
  if (first !== slug) return null;
  if (second === undefined) return "roadmap";
  if ((second === "log" || second === "timeline") && third === undefined) {
    return second;
  }
  return null;
}

export function trackSlugFromPathname(
  pathname: string,
  slugs: readonly string[],
): string | null {
  const first = pathname.split("/").filter(Boolean)[0];
  return first && slugs.includes(first) ? first : null;
}

/**
 * Resolves the track for a request: the pathname wins, then the remembered
 * cookie, then the product default. Shared by the proxy and unit tests.
 */
export function pickActiveTrackSlug(
  pathname: string,
  cookieSlug: string | null | undefined,
  slugs: readonly string[],
  fallback: string,
): string {
  const pathSlug = trackSlugFromPathname(pathname, slugs);
  if (pathSlug) return pathSlug;
  if (cookieSlug && slugs.includes(cookieSlug)) return cookieSlug;
  return fallback;
}

/**
 * Track switching keeps the reader on the same screen. On a roadmap it also
 * keeps the current list/map view; journey and settings fall back to the
 * track's roadmap because they are not owned by a single track.
 */
export function trackSwitchHref(
  pathname: string,
  search: string,
  targetSlug: string,
  slugs: readonly string[],
): string {
  const activeSlug = trackSlugFromPathname(pathname, slugs);
  if (!activeSlug) return `/${targetSlug}`;

  const section = sectionFromPathname(pathname, activeSlug);
  if (section === "log" || section === "timeline") {
    return `/${targetSlug}/${section}`;
  }
  if (section === "roadmap") {
    const view = new URLSearchParams(search).get("view");
    if (view === "list" || view === "graph") {
      return `/${targetSlug}?view=${view}`;
    }
    return `/${targetSlug}`;
  }
  return `/${targetSlug}`;
}

/**
 * B1 renders the map for `?view=journey` until the 3D journey view lands.
 * Keeping the parser here means the fallback is tested in one place.
 */
export function parseRoadmapView(value: string | null): "list" | "graph" {
  return value === "graph" || value === "journey" ? "graph" : "list";
}

export function roadmapViewHref(pathname: string, view: "list" | "graph"): string {
  return view === "graph" ? `${pathname}?view=graph` : pathname;
}

export function isRoadmapView(value: string | null): value is RoadmapView {
  return value === "list" || value === "graph" || value === "journey";
}
