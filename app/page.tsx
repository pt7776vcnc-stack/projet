import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-16 px-6 py-16">
      <header className="flex flex-col gap-4">
        <span className="text-sm font-semibold uppercase text-blue-600">
          RelancePro
        </span>
        <h1 className="text-4xl font-bold text-slate-900">
          Le SaaS simple pour relancer vos factures.
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Centralisez vos clients, vos factures et vos relances. Configurez vos
          règles et laissez RelancePro envoyer des emails polis en français.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Créer un compte
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Se connecter
          </Link>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Suivi clair',
            text: 'Toutes vos factures et relances dans un tableau de bord.'
          },
          {
            title: 'Relances automatiques',
            text: 'J+1, J+7, J+14 ou vos propres règles personnalisées.'
          },
          {
            title: 'Historique complet',
            text: 'Chaque email envoyé est journalisé avec son contenu.'
          }
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-800">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{item.text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
