import { NextResponse } from "next/server";

export function jsonOk(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 500, details?: unknown) {
  if (details) console.error("[api error]", details);
  return NextResponse.json({ error: message }, { status });
}
