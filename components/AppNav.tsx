'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase/client';

const navItems = [
  { href: '/app/clients', label: 'Clients' },
  { href: '/app/invoices', label: 'Factures' },
  { href: '/app/reminders', label: 'Relances' },
  { href: '/app/settings', label: 'Paramètres' }
];

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
      <Link href="/app" className="text-lg font-bold text-blue-600">
        RelancePro
      </Link>
      <div className="flex flex-wrap gap-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-md px-3 py-2 text-sm font-medium ${
              pathname === item.href
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
      >
        Déconnexion
      </button>
    </nav>
  );
}
