import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[health/db]", e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? "DB error" },
      { status: 500 }
    );
  }
}
