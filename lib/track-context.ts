import "server-only";

import { cookies, headers } from "next/headers";

import { defaultTrackSlug, getTrackContent } from "@/content/tracks";

export const LAST_TRACK_COOKIE = "last_track";

export function resolveTrackSlug(value: string | null | undefined): string | null {
  if (!value) return null;
  return getTrackContent(value) ? value : null;
}

/**
 * The proxy writes `x-track-slug` from the pathname (or the last-track cookie).
 * Reading the header keeps the first paint and the snapshot on the same track,
 * even on the request that sets a new cookie.
 */
export async function getRequestTrackSlug(): Promise<string> {
  const requestHeaders = await headers();
  const headerSlug = resolveTrackSlug(requestHeaders.get("x-track-slug"));
  if (headerSlug) return headerSlug;

  const cookieSlug = resolveTrackSlug((await cookies()).get(LAST_TRACK_COOKIE)?.value);
  return cookieSlug ?? defaultTrackSlug;
}
