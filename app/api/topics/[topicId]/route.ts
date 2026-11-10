import { handleRoute, jsonOk, readBody } from "@/lib/api";
import { updateTopicState } from "@/lib/roadmap-server";
import { updateTopicSchema } from "@/types/roadmap";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ topicId: string }> },
) {
  return handleRoute(async () => {
    const { topicId } = await params;
    const input = await readBody(request, updateTopicSchema);
    return jsonOk(await updateTopicState(topicId, input));
  });
}
