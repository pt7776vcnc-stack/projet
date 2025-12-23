'use client';

import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [ruleDays, setRuleDays] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchSettings = async () => {
    const response = await fetch('/api/reminder-settings');
    if (!response.ok) return;
    const data = await response.json();
    setRuleDays((data.ruleDays ?? []).join(', '));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const response = await fetch('/api/reminder-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ruleDays })
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? 'Impossible de mettre à jour.');
      return;
    }

    setSuccess('Règles mises à jour.');
  };

  return (
    <section className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Paramètres</h1>
        <p className="mt-2 text-sm text-slate-600">
          Définissez les jours de relance après échéance (ex: 1,7,14).
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="rules">Règles de relance (jours)</label>
            <input
              id="rules"
              value={ruleDays}
              onChange={(event) => setRuleDays(event.target.value)}
              placeholder="1, 7, 14"
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white">
            Enregistrer
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
        </form>
      </div>
    </section>
  );
}
