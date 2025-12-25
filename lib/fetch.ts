export async function fetchJson<T>(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);

  const ct = res.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");

  const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

  if (!res.ok) {
    const msg =
      (typeof body === "object" && body && (body as any).error) ||
      (typeof body === "object" && body && (body as any).message) ||
      (typeof body === "string" && body) ||
      `Erreur (${res.status})`;
    throw new Error(msg);
  }

  return body as T;
}
