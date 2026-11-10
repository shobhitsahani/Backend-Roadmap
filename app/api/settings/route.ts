import { handleRoute, jsonOk, readBody } from "@/lib/api";
import { setStartDate } from "@/lib/roadmap-server";
import { updateSettingsSchema } from "@/types/roadmap";

export async function PATCH(request: Request) {
  return handleRoute(async () => {
    const input = await readBody(request, updateSettingsSchema);
    return jsonOk(await setStartDate(input.trackSlug, input.startDate));
  });
}
