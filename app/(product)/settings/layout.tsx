import type { Metadata } from "next";

import { ActiveTrackShell } from "@/components/app/track-shell";

export const metadata: Metadata = {
  title: "Settings",
  description: "Track settings, appearance, progress files, and keyboard shortcuts.",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <ActiveTrackShell>{children}</ActiveTrackShell>;
}
