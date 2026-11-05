import { handleRoute, jsonOk } from "@/lib/api";
import { getRoadmapSnapshot } from "@/lib/roadmap-server";

export async function GET() {
  return handleRoute(async () => jsonOk(await getRoadmapSnapshot()));
}
