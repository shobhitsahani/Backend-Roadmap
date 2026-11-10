import { handleRoute, readTrackSlug } from "@/lib/api";
import { createProgressFile } from "@/lib/progress-file";
import { getRoadmapSnapshot } from "@/lib/roadmap-server";

export async function GET(request: Request) {
  return handleRoute(async () => {
    const trackSlug = readTrackSlug(request);
    const snapshot = await getRoadmapSnapshot(trackSlug);
    const file = createProgressFile(snapshot);
    const date = new Date().toISOString().slice(0, 10);

    return new Response(JSON.stringify(file, null, 2), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="${trackSlug}-roadmap-${date}.json"`,
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  });
}
