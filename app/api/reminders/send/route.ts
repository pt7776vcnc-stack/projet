import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { sendReminderSchema } from '@/lib/validation';
import { buildReminderEmail } from '@/lib/reminder-email';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const body = await request.json();
  const parsed = sendReminderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'Données invalides.' },
      { status: 400 }
    );
  }

  const invoice = await prisma.invoice.findFirst({
    where: { id: parsed.data.invoiceId, userId: user.id },
    include: { client: true }
  });

  if (!invoice) {
    return NextResponse.json({ error: 'Facture introuvable.' }, { status: 404 });
  }

  if (invoice.status === 'PAID') {
    return NextResponse.json({ error: 'Impossible de relancer une facture payée.' }, { status: 400 });
  }

  if (invoice.pauseReminders) {
    return NextResponse.json({ error: 'Les relances sont en pause pour cette facture.' }, { status: 400 });
  }

  const lastReminder = await prisma.reminder.findFirst({
    where: { invoiceId: invoice.id, userId: user.id },
    orderBy: { sentAt: 'desc' }
  });

  if (lastReminder && Date.now() - lastReminder.sentAt.getTime() < DAY_IN_MS) {
    return NextResponse.json(
      { error: 'Une relance a déjà été envoyée dans les dernières 24h.' },
      { status: 429 }
    );
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) {
    return NextResponse.json(
      { error: 'Clés email manquantes. Configurez RESEND_API_KEY et RESEND_FROM.' },
      { status: 500 }
    );
  }

  const { subject, body: emailBody } = buildReminderEmail(invoice.client, invoice);
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.RESEND_FROM,
    to: invoice.client.email,
    subject,
    text: emailBody
  });

  await prisma.reminder.create({
    data: {
      userId: user.id,
      invoiceId: invoice.id,
      subject,
      body: emailBody,
      channel: 'email'
    }
  });

  return NextResponse.json({ success: true });
}
