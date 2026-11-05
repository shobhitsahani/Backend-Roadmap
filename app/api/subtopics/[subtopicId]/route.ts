import { handleRoute, jsonOk, readBody } from "@/lib/api";
import { setSubtopicDone } from "@/lib/roadmap-server";
import { updateSubtopicSchema } from "@/types/roadmap";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ subtopicId: string }> },
) {
  return handleRoute(async () => {
    const { subtopicId } = await params;
    const input = await readBody(request, updateSubtopicSchema);
    return jsonOk(await setSubtopicDone(subtopicId, input.done));
  });
}
