'use client';

import { useEffect, useState } from 'react';

type Reminder = {
  id: string;
  sentAt: string;
  subject: string;
  body: string;
  invoice: {
    number: string;
    client: {
      name: string;
    };
  };
};

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const fetchReminders = async () => {
    const response = await fetch('/api/reminders');
    if (!response.ok) return;
    const data = await response.json();
    setReminders(data.reminders ?? []);
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <section className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Historique des relances</h1>
        <p className="mt-2 text-sm text-slate-600">
          Retrouvez ici chaque email envoyé avec son contenu.
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {reminder.invoice.client.name} · Facture {reminder.invoice.number}
                  </p>
                  <p className="text-xs text-slate-500">
                    Envoyé le {new Date(reminder.sentAt).toLocaleString('fr-FR')}
                  </p>
                </div>
                <span className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">
                  Email
                </span>
              </div>
              <div className="mt-3 text-sm text-slate-700">
                <p className="font-semibold">{reminder.subject}</p>
                <p className="mt-2 whitespace-pre-line">{reminder.body}</p>
              </div>
            </div>
          ))}
          {reminders.length === 0 && (
            <p className="text-sm text-slate-500">Aucune relance envoyée.</p>
          )}
        </div>
      </div>
    </section>
  );
}
