import { handleRoute } from "@/lib/api";
import { getRoadmapSnapshot } from "@/lib/roadmap-server";
import { createProgressFile } from "@/lib/progress-file";

export async function GET() {
  return handleRoute(async () => {
    const snapshot = await getRoadmapSnapshot();
    const file = createProgressFile(snapshot);
    const date = new Date().toISOString().slice(0, 10);

    return new Response(JSON.stringify(file, null, 2), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="backend-roadmap-${date}.json"`,
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  });
}
