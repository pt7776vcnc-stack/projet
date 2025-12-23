import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { reminderSettingsSchema } from '@/lib/validation';

function parseRuleDays(input: string) {
  const days = input
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => Number(value));

  if (days.length === 0 || days.some((value) => Number.isNaN(value) || value <= 0)) {
    return null;
  }

  return Array.from(new Set(days)).sort((a, b) => a - b);
}

export async function GET() {
  const { user, response } = await requireUser();
  if (!user) return response;

  const settings = await prisma.reminderSettings.findUnique({
    where: { userId: user.id }
  });

  if (!settings) {
    return NextResponse.json({ ruleDays: [1, 7, 14] });
  }

  return NextResponse.json({ ruleDays: settings.ruleDays });
}

export async function PUT(request: Request) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const body = await request.json();
  const parsed = reminderSettingsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'Données invalides.' },
      { status: 400 }
    );
  }

  const days = parseRuleDays(parsed.data.ruleDays);

  if (!days) {
    return NextResponse.json({ error: 'Format des règles invalide.' }, { status: 400 });
  }

  const settings = await prisma.reminderSettings.upsert({
    where: { userId: user.id },
    update: { ruleDays: days },
    create: { userId: user.id, ruleDays: days }
  });

  return NextResponse.json({ ruleDays: settings.ruleDays });
}
