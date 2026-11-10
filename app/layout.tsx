import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";

import { trackSlugs } from "@/content/tracks";
import { TrackAttribute } from "@/components/app/track-attribute";
import { getRequestTrackSlug } from "@/lib/track-context";

import { Providers } from "./providers";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Roadmap Tracker",
    template: "%s — Roadmap Tracker",
  },
  description:
    "A field manual for backend and AI engineering roadmaps: phases, topics, subtopics, and progress you can check off.",
  applicationName: "Roadmap Tracker",
  keywords: ["backend", "ai engineer", "roadmap", "engineering", "career", "syllabus"],
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#141813" },
    { media: "(prefers-color-scheme: light)", color: "#f4f6f1" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const trackSlug = await getRequestTrackSlug();

  return (
    <html
      lang="en"
      data-track={trackSlug}
      suppressHydrationWarning
      className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-dvh bg-canvas text-ink antialiased">
        <Providers>
          <TrackAttribute initialSlug={trackSlug} trackSlugs={trackSlugs} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
