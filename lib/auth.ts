import { NextResponse } from 'next/server';
import { createSupabaseRouteClient } from './supabase/route';

export async function requireUser() {
  const supabase = createSupabaseRouteClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, response: NextResponse.json({ error: 'Non autorisé.' }, { status: 401 }) };
  }

  return { user, response: null };
}
