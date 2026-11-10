import type { Metadata } from "next";

import { ActiveTrackShell } from "@/components/app/track-shell";

export const metadata: Metadata = {
  title: "Journey",
  description:
    "Compare the Backend and AI Engineer tracks, their progress, and the prerequisites that connect them.",
};

export default function JourneyLayout({ children }: { children: React.ReactNode }) {
  return <ActiveTrackShell>{children}</ActiveTrackShell>;
}
