type RequestJsonOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
};

export async function requestJson<TResponse>(
  url: string,
  options: RequestJsonOptions = {},
): Promise<TResponse> {
  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const responseBody = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      responseBody && typeof responseBody.message === "string"
        ? responseBody.message
        : "Request failed.";

    throw new Error(message);
  }

  return responseBody as TResponse;
}
