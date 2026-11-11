import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";

import { trackSlugs } from "@/content/tracks";
import { TrackAttribute } from "@/components/app/track-attribute";
import { themeColors } from "@/lib/theme/config";
import { themeInitScript } from "@/lib/theme/theme-script";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
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
  themeColor: themeColors.black,
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
      <head>
        {/*
         * Parser-blocking inline script in the head: it runs before the body
         * paints, so a stored theme never flashes the default palette. It also
         * keeps the metadata API's <head> tags intact. Kept dependency-free.
         */}
        <script id="theme-init" dangerouslySetInnerHTML={{ __html: themeInitScript() }} />
      </head>
      <body className="min-h-dvh bg-canvas text-ink antialiased">
        <Providers>
          <TrackAttribute initialSlug={trackSlug} trackSlugs={trackSlugs} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
