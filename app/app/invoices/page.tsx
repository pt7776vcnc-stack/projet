'use client';

import { useEffect, useState } from 'react';

type Client = {
  id: string;
  name: string;
};

type Invoice = {
  id: string;
  number: string;
  amount: string;
  currency: string;
  issueDate: string;
  dueDate: string;
  status: 'PAID' | 'UNPAID';
  pauseReminders: boolean;
  paymentLink?: string | null;
  client: Client;
};

export default function InvoicesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [form, setForm] = useState({
    clientId: '',
    number: '',
    amount: '',
    issueDate: '',
    dueDate: '',
    status: 'UNPAID',
    paymentLink: '',
    pauseReminders: false
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const [clientsRes, invoicesRes] = await Promise.all([
      fetch('/api/clients'),
      fetch('/api/invoices')
    ]);
    if (clientsRes.ok) {
      const data = await clientsRes.json();
      setClients(data.clients ?? []);
    }
    if (invoicesRes.ok) {
      const data = await invoicesRes.json();
      setInvoices(data.invoices ?? []);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateField = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({
      clientId: '',
      number: '',
      amount: '',
      issueDate: '',
      dueDate: '',
      status: 'UNPAID',
      paymentLink: '',
      pauseReminders: false
    });
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch(editingId ? `/api/invoices/${editingId}` : '/api/invoices', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? 'Une erreur est survenue.');
      return;
    }

    resetForm();
    fetchData();
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingId(invoice.id);
    setForm({
      clientId: invoice.client.id,
      number: invoice.number,
      amount: invoice.amount,
      issueDate: invoice.issueDate.slice(0, 10),
      dueDate: invoice.dueDate.slice(0, 10),
      status: invoice.status,
      paymentLink: invoice.paymentLink ?? '',
      pauseReminders: invoice.pauseReminders
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette facture ?')) return;
    await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const sendReminder = async (id: string) => {
    setError(null);
    const response = await fetch('/api/reminders/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId: id })
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? 'Impossible d\'envoyer la relance.');
      return;
    }

    fetchData();
  };

  return (
    <section className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Factures</h1>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="client">Client</label>
            <select
              id="client"
              value={form.clientId}
              onChange={(event) => updateField('clientId', event.target.value)}
              required
            >
              <option value="">Sélectionner</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="number">Numéro</label>
            <input
              id="number"
              value={form.number}
              onChange={(event) => updateField('number', event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="amount">Montant</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              value={form.amount}
              onChange={(event) => updateField('amount', event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="issueDate">Date facture</label>
            <input
              id="issueDate"
              type="date"
              value={form.issueDate}
              onChange={(event) => updateField('issueDate', event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="dueDate">Échéance</label>
            <input
              id="dueDate"
              type="date"
              value={form.dueDate}
              onChange={(event) => updateField('dueDate', event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="status">Statut</label>
            <select
              id="status"
              value={form.status}
              onChange={(event) => updateField('status', event.target.value)}
            >
              <option value="UNPAID">Non payée</option>
              <option value="PAID">Payée</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="paymentLink">Lien de paiement (optionnel)</label>
            <input
              id="paymentLink"
              value={form.paymentLink}
              onChange={(event) => updateField('paymentLink', event.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="pauseReminders"
              type="checkbox"
              checked={form.pauseReminders}
              onChange={(event) => updateField('pauseReminders', event.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="pauseReminders">Pause relances</label>
          </div>
          <div className="flex items-end gap-2 md:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white disabled:opacity-70"
            >
              {editingId ? 'Mettre à jour' : 'Ajouter'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="border border-slate-300">
                Annuler
              </button>
            )}
          </div>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Liste</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="py-2">Facture</th>
                <th>Client</th>
                <th>Montant</th>
                <th>Échéance</th>
                <th>Statut</th>
                <th>Relances</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b">
                  <td className="py-2 font-medium text-slate-800">{invoice.number}</td>
                  <td>{invoice.client.name}</td>
                  <td>
                    {Number(invoice.amount).toFixed(2)} {invoice.currency}
                  </td>
                  <td>{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</td>
                  <td>
                    {invoice.status === 'PAID' ? (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                        Payée
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">
                        Non payée
                      </span>
                    )}
                  </td>
                  <td>
                    {invoice.pauseReminders ? (
                      <span className="text-xs text-slate-500">En pause</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => sendReminder(invoice.id)}
                        className="border border-blue-200 text-blue-700"
                      >
                        Envoyer une relance
                      </button>
                    )}
                  </td>
                  <td className="flex justify-end gap-2 py-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(invoice)}
                      className="border border-slate-300"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(invoice.id)}
                      className="border border-red-200 text-red-600"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-slate-500">
                    Aucune facture pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
