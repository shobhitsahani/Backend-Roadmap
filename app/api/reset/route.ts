import { handleRoute, jsonOk, readTrackSlug } from "@/lib/api";
import { resetProgress } from "@/lib/roadmap-server";

export async function POST(request: Request) {
  return handleRoute(async () => jsonOk(await resetProgress(readTrackSlug(request))));
}
