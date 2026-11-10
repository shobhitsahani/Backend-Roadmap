import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { defaultTrackSlug, getTrackContent } from "@/content/tracks";
import { LAST_TRACK_COOKIE } from "@/lib/track-context";

export const dynamic = "force-dynamic";

export default async function Home() {
  const lastTrack = (await cookies()).get(LAST_TRACK_COOKIE)?.value;
  const slug = lastTrack && getTrackContent(lastTrack) ? lastTrack : defaultTrackSlug;
  redirect(`/${slug}`);
}
