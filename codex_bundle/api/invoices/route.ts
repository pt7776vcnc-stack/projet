import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { invoiceSchema } from '@/lib/validation';

export async function GET() {
  const { user, response } = await requireUser();
  if (!user) return response;

  const invoices = await prisma.invoice.findMany({
    where: { userId: user.id },
    include: { client: true },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ invoices });
}

export async function POST(request: Request) {
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

  const client = await prisma.client.findFirst({
    where: { id: parsed.data.clientId, userId: user.id }
  });

  if (!client) {
    return NextResponse.json({ error: 'Client introuvable.' }, { status: 404 });
  }

  const invoice = await prisma.invoice.create({
    data: {
      userId: user.id,
      clientId: client.id,
      number: parsed.data.number,
      amount: parsed.data.amount,
      issueDate: new Date(parsed.data.issueDate),
      dueDate: new Date(parsed.data.dueDate),
      status: parsed.data.status,
      paymentLink: parsed.data.paymentLink || null,
      pauseReminders: parsed.data.pauseReminders ?? false
    },
    include: { client: true }
  });

  return NextResponse.json({ invoice });
}
