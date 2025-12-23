import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { invoiceSchema } from '@/lib/validation';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const body = await request.json();
  const parsed = invoiceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'Données invalides.' },
      { status: 400 }
    );
  }

  const existing = await prisma.invoice.findFirst({
    where: { id: params.id, userId: user.id }
  });

  if (!existing) {
    return NextResponse.json({ error: 'Facture introuvable.' }, { status: 404 });
  }

  const client = await prisma.client.findFirst({
    where: { id: parsed.data.clientId, userId: user.id }
  });

  if (!client) {
    return NextResponse.json({ error: 'Client introuvable.' }, { status: 404 });
  }

  await prisma.invoice.update({
    where: { id: params.id },
    data: {
      clientId: client.id,
      number: parsed.data.number,
      amount: parsed.data.amount,
      issueDate: new Date(parsed.data.issueDate),
      dueDate: new Date(parsed.data.dueDate),
      status: parsed.data.status,
      paymentLink: parsed.data.paymentLink || null,
      pauseReminders: parsed.data.pauseReminders ?? false
    }
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const deleted = await prisma.invoice.deleteMany({
    where: { id: params.id, userId: user.id }
  });

  if (deleted.count === 0) {
    return NextResponse.json({ error: 'Facture introuvable.' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
