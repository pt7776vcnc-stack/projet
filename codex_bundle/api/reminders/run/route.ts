import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { buildReminderEmail } from '@/lib/reminder-email';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export async function POST() {
  const { user, response } = await requireUser();
  if (!user) return response;

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) {
    return NextResponse.json(
      { error: 'Clés email manquantes. Configurez RESEND_API_KEY et RESEND_FROM.' },
      { status: 500 }
    );
  }

  const settings = await prisma.reminderSettings.findUnique({
    where: { userId: user.id }
  });
  const ruleDays = settings?.ruleDays ?? [1, 7, 14];

  const invoices = await prisma.invoice.findMany({
    where: {
      userId: user.id,
      status: 'UNPAID',
      pauseReminders: false,
      dueDate: { lte: new Date() }
    },
    include: { client: true }
  });

  const resend = new Resend(process.env.RESEND_API_KEY);
  let sentCount = 0;

  for (const invoice of invoices) {
    const daysPastDue = Math.floor(
      (startOfDay(new Date()).getTime() - startOfDay(invoice.dueDate).getTime()) / DAY_IN_MS
    );

    for (const ruleDay of ruleDays) {
      if (daysPastDue < ruleDay) continue;

      const existingRuleReminder = await prisma.reminder.findFirst({
        where: { invoiceId: invoice.id, userId: user.id, ruleDay }
      });

      if (existingRuleReminder) continue;

      const lastReminder = await prisma.reminder.findFirst({
        where: { invoiceId: invoice.id, userId: user.id },
        orderBy: { sentAt: 'desc' }
      });

      if (lastReminder && Date.now() - lastReminder.sentAt.getTime() < DAY_IN_MS) {
        continue;
      }

      const { subject, body } = buildReminderEmail(invoice.client, invoice);

      await resend.emails.send({
        from: process.env.RESEND_FROM,
        to: invoice.client.email,
        subject,
        text: body
      });

      await prisma.reminder.create({
        data: {
          userId: user.id,
          invoiceId: invoice.id,
          subject,
          body,
          channel: 'email',
          ruleDay
        }
      });

      sentCount += 1;
    }
  }

  return NextResponse.json({ sentCount });
}
