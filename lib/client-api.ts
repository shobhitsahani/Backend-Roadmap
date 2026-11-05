type ApiEnvelope<T> = { data: T } | { error: { code: string; message: string } };

export async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  let payload: ApiEnvelope<T>;
  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    throw new Error("The server returned an unreadable response.");
  }

  if (!response.ok || "error" in payload) {
    throw new Error(
      "error" in payload ? payload.error.message : "The request could not be completed.",
    );
  }

  return payload.data;
}
