import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { clientSchema } from '@/lib/validation';

export async function GET() {
  const { user, response } = await requireUser();
  if (!user) return response;

  const clients = await prisma.client.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ clients });
}

export async function POST(request: Request) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const body = await request.json();
  const parsed = clientSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'Données invalides.' },
      { status: 400 }
    );
  }

  const client = await prisma.client.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      email: parsed.data.email
    }
  });

  return NextResponse.json({ client });
}
