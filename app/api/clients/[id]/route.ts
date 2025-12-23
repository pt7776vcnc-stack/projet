import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { clientSchema } from '@/lib/validation';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

  const client = await prisma.client.updateMany({
    where: { id: params.id, userId: user.id },
    data: {
      name: parsed.data.name,
      email: parsed.data.email
    }
  });

  if (client.count === 0) {
    return NextResponse.json({ error: 'Client introuvable.' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const deleted = await prisma.client.deleteMany({
    where: { id: params.id, userId: user.id }
  });

  if (deleted.count === 0) {
    return NextResponse.json({ error: 'Client introuvable.' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
