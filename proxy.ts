import { NextResponse, type NextRequest } from "next/server";

import { defaultTrackSlug, trackSlugs } from "@/content/tracks";
import { pickActiveTrackSlug } from "@/lib/routes";

const LAST_TRACK_COOKIE = "last_track";
const knownTracks = new Set(trackSlugs);

function firstSegment(pathname: string) {
  return pathname.split("/")[1] ?? "";
}

/**
 * Track is the URL's source of truth. The proxy mirrors the pathname into a
 * request header for this render and into a cookie for the next visit, so the
 * server can paint the right accent without a client-side flash.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathSlug = firstSegment(pathname);
  const cookieSlug = request.cookies.get(LAST_TRACK_COOKIE)?.value;
  const slug = pickActiveTrackSlug(pathname, cookieSlug, trackSlugs, defaultTrackSlug);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-track-slug", slug);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (knownTracks.has(pathSlug)) {
    response.cookies.set(LAST_TRACK_COOKIE, slug, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
