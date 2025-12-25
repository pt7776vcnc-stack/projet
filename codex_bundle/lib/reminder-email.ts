import { Invoice, Client } from '@prisma/client';

export type ReminderEmail = {
  subject: string;
  body: string;
};

export function buildReminderEmail(
  client: Client,
  invoice: Invoice
): ReminderEmail {
  const amount = Number(invoice.amount).toFixed(2);
  const dueDate = invoice.dueDate.toLocaleDateString('fr-FR');
  const paymentLine = invoice.paymentLink
    ? `\nVous pouvez régler votre facture ici : ${invoice.paymentLink}`
    : '';

  const subject = `Rappel de paiement - Facture ${invoice.number}`;
  const body = `Bonjour ${client.name},\n\nNous espérons que vous allez bien. Nous nous permettons de vous rappeler que la facture ${invoice.number} d'un montant de ${amount} ${invoice.currency}, arrivée à échéance le ${dueDate}, n'a pas encore été réglée.\n\nSi le paiement a déjà été effectué, merci d'ignorer ce message.${paymentLine}\n\nNous restons à votre disposition pour toute question.\n\nBien cordialement,\nL'équipe RelancePro`;

  return { subject, body };
}
