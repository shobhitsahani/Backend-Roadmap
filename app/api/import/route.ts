import { handleRoute, jsonOk, readBody } from "@/lib/api";
import { importProgress } from "@/lib/roadmap-server";
import { progressFileSchema } from "@/types/roadmap";

export async function POST(request: Request) {
  return handleRoute(async () => {
    const file = await readBody(request, progressFileSchema);
    return jsonOk(await importProgress(file.data));
  });
}
