import { z } from "zod";

import { RoadmapError } from "@/lib/errors";

const NO_STORE = { "Cache-Control": "no-store" };

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return Response.json(
    { data },
    {
      ...init,
      headers: { ...NO_STORE, ...init?.headers },
    },
  );
}

export function jsonError(error: unknown) {
  if (error instanceof RoadmapError) {
    return Response.json(
      {
        error: {
          code: error.code,
          message: error.message,
        },
      },
      { status: error.status, headers: NO_STORE },
    );
  }

  console.error(error);
  return Response.json(
    {
      error: {
        code: "INTERNAL",
        message: "The request could not be completed.",
      },
    },
    { status: 500, headers: NO_STORE },
  );
}

export async function handleRoute(handler: () => Promise<Response>) {
  try {
    return await handler();
  } catch (error) {
    return jsonError(error);
  }
}

export async function readBody<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new RoadmapError("Request body must be valid JSON.", 400, "INVALID_JSON");
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
      .join("; ");
    throw new RoadmapError(message, 400, "INVALID_BODY");
  }

  return result.data;
}

const trackSlugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Track must be a kebab-case slug.");

/** Reads `?track=` and validates it. Track is never accepted from a body. */
export function readTrackSlug(request: Request, fallback = "backend"): string {
  const value = new URL(request.url).searchParams.get("track") ?? fallback;
  const result = trackSlugSchema.safeParse(value);
  if (!result.success) {
    throw new RoadmapError("Invalid track slug.", 400, "INVALID_TRACK");
  }
  return result.data;
}
