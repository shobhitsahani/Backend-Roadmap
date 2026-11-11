import { ImageResponse } from "next/og";

import { getTrackContent } from "@/content/tracks";
import { hexPalette } from "@/lib/theme/config";
import { phaseLines, trackStats } from "@/lib/track-stats";
import type { TrackSlug } from "@/lib/theme/tokens";

export const alt = "Roadmap Tracker track card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track } = await params;
  const content = getTrackContent(track) ?? getTrackContent("backend")!;
  const slug = content.slug as TrackSlug;
  const palette = hexPalette("purple");
  const accent = palette.trackAccent[slug] ?? palette.brand;
  const stats = trackStats(content);
  const phases = phaseLines(content);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: palette.bg,
        color: palette.text,
        padding: 72,
        fontFamily: "Geist",
        borderTop: `10px solid ${accent}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 22,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: palette.textMuted,
        }}
      >
        <span>Roadmap Tracker / {content.title}</span>
        <span>
          {stats.totalWeeks} weeks / {String(stats.phases).padStart(2, "0")} phases
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            display: "flex",
            fontSize: 82,
            lineHeight: 1,
            letterSpacing: "-0.045em",
          }}
        >
          {content.title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            lineHeight: 1.4,
            color: palette.textMuted,
            maxWidth: 860,
          }}
        >
          {content.summary}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 12,
            borderBottom: `1px solid ${palette.border}`,
            fontSize: 19,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: palette.textMuted,
          }}
        >
          <span>{content.subtitle}</span>
          <span>{stats.topics} topics</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {phases.slice(0, 5).map((phase, index) => (
            <div
              key={phase.id}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                width: 196,
                padding: 16,
                background: palette.surface1,
                border: `1px solid ${palette.border}`,
              }}
            >
              <span
                style={{
                  display: "flex",
                  fontSize: 18,
                  letterSpacing: "0.12em",
                  color: accent,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  display: "flex",
                  fontSize: 22,
                  lineHeight: 1.2,
                  color: palette.text,
                }}
              >
                {phase.title}
              </span>
              <span style={{ display: "flex", fontSize: 18, color: palette.textMuted }}>
                {phase.prerequisite ? "Prerequisite" : `${phase.weeks} weeks`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    { ...size },
  );
}
