'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';

export async function createServerSupabaseClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          const cookie = cookies().get(name);
          return cookie?.value;
        },
        set(name, value, options) {
          cookies().set({ name, value, ...options });
        },
        remove(name, options) {
          cookies().set({ name, value: '', ...options });
        },
      }
    }
  );
}

export async function requireAuth() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Auth error:', error);
      redirect('/auth');
    }

    if (!session) {
      console.log('No session found, redirecting to /auth');
      redirect('/auth');
    }

    console.log('Session found for user:', session.user.email);
    return session;
  } catch (err) {
    console.error('Unexpected auth error:', err);
    redirect('/auth');
  }
}
