import Link from 'next/link';

export default function AppHome() {
  return (
    <section className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Bienvenue dans RelancePro</h1>
        <p className="mt-2 text-slate-600">
          Gérez vos clients, vos factures et vos relances depuis ce tableau de bord.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href="/app/clients"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h2 className="font-semibold">Clients</h2>
          <p className="text-sm text-slate-600">Ajouter et modifier vos clients.</p>
        </Link>
        <Link
          href="/app/invoices"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h2 className="font-semibold">Factures</h2>
          <p className="text-sm text-slate-600">Suivre les paiements en attente.</p>
        </Link>
        <Link
          href="/app/reminders"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h2 className="font-semibold">Relances</h2>
          <p className="text-sm text-slate-600">Historique des emails envoyés.</p>
        </Link>
      </div>
    </section>
  );
}
