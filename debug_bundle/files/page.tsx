'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createSupabaseClient();

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    alert('Email de confirmation envoyé. Vérifiez votre boîte mail.');
    router.push('/login');
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col 
justify-center gap-8 px-6 py-16">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Créer un compte</h1>
        <p className="text-sm text-slate-600">
          Démarrez avec RelancePro en quelques secondes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl 
bg-white p-6 shadow">
        <div className="space-y-2">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded border px-3 py-2"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 py-2 text-white 
disabled:opacity-70"
        >
          {loading ? 'Création...' : 'Créer le compte'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Déjà un compte ?{' '}
        <Link href="/login" className="font-semibold text-blue-600">
          Se connecter
        </Link>
      </p>
    </main>
  );
}

