import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTrackContent } from "@/content/tracks";
import { TrackShellBoundary } from "@/components/app/track-shell";

type TrackLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ track: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: string }>;
}): Promise<Metadata> {
  const { track } = await params;
  const content = getTrackContent(track);
  if (!content) return {};
  return {
    title: content.title,
    description: content.summary,
  };
}

export default async function TrackLayout({ children, params }: TrackLayoutProps) {
  const { track } = await params;
  if (!getTrackContent(track)) notFound();

  return <TrackShellBoundary slug={track}>{children}</TrackShellBoundary>;
}
