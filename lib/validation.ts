import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(1, 'Le nom est requis.'),
  email: z.string().email('Email invalide.')
});

export const invoiceSchema = z.object({
  clientId: z.string().uuid('Client invalide.'),
  number: z.string().min(1, 'Numéro requis.'),
  amount: z
    .string()
    .or(z.number())
    .transform((value) => Number(value))
    .refine((value) => !Number.isNaN(value) && value > 0, 'Montant invalide.'),
  issueDate: z.string().min(1, 'Date facture requise.'),
  dueDate: z.string().min(1, 'Date échéance requise.'),
  status: z.enum(['PAID', 'UNPAID']),
  paymentLink: z.string().url('Lien de paiement invalide.').optional().or(z.literal('')),
  pauseReminders: z.boolean().optional()
});

export const sendReminderSchema = z.object({
  invoiceId: z.string().uuid('Facture invalide.')
});

export const reminderSettingsSchema = z.object({
  ruleDays: z.string().min(1, 'Règles requises.')
});
