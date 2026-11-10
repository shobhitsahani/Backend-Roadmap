import { handleRoute, jsonOk, readTrackSlug } from "@/lib/api";
import { getRoadmapSnapshot } from "@/lib/roadmap-server";

export async function GET(request: Request) {
  return handleRoute(async () =>
    jsonOk(await getRoadmapSnapshot(readTrackSlug(request))),
  );
}
