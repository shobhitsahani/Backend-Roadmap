"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { trackSlugFromPathname } from "@/lib/routes";

/**
 * The root layout cannot re-render on a client-side track change, so the
 * document attribute follows the pathname after navigation. Non-track routes
 * (journey, settings) keep the last server-rendered track.
 */
export function TrackAttribute({
  initialSlug,
  trackSlugs,
}: {
  initialSlug: string;
  trackSlugs: string[];
}) {
  const pathname = usePathname();
  const pathSlug = trackSlugFromPathname(pathname, trackSlugs);

  useEffect(() => {
    if (pathSlug && document.documentElement.dataset.track !== pathSlug) {
      document.documentElement.dataset.track = pathSlug;
    }
  }, [pathSlug]);

  useEffect(() => {
    if (document.documentElement.dataset.track === undefined) {
      document.documentElement.dataset.track = initialSlug;
    }
  }, [initialSlug]);

  return null;
}
