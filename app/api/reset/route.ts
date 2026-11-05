import { handleRoute, jsonOk } from "@/lib/api";
import { resetProgress } from "@/lib/roadmap-server";

export async function POST() {
  return handleRoute(async () => jsonOk(await resetProgress()));
}
