import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';

export async function GET() {
  const { user, response } = await requireUser();
  if (!user) return response;

  const reminders = await prisma.reminder.findMany({
    where: { userId: user.id },
    orderBy: { sentAt: 'desc' },
    include: {
      invoice: {
        include: { client: true }
      }
    }
  });

  return NextResponse.json({ reminders });
}
