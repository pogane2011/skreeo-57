// src/app/api/auth/callback/route.ts
// Callback para OAuth (Google) que redirige a Stripe checkout

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Price IDs de Stripe
const priceIds: Record<string, { monthly: string; yearly: string }> = {
  despegue: {
    monthly: 'price_1SVt3bHcyKksEXpEej7xdg4P',
    yearly: 'price_1SVt3bHcyKksEXpE528LrsBy',
  },
  operador: {
    monthly: 'price_1SVsN3HcyKksEXpEBfACl6US',
    yearly: 'price_1SVsNeHcyKksEXpEd22ffINw',
  },
  controlador: {
    monthly: 'price_1SVsOnHcyKksEXpEQgN8VwHy',
    yearly: 'price_1SVsPQHcyKksEXpEAzZJh3q4',
  },
};

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const plan = requestUrl.searchParams.get('plan') || 'operador';
  const cycle = (requestUrl.searchParams.get('cycle') as 'monthly' | 'yearly') || 'monthly';
  const origin = requestUrl.origin;

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    // Intercambiar código por sesión
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Verificar si el usuario ya tiene suscripción activa
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('user_id', user.id)
          .in('status', ['trialing', 'active'])
          .single();

        if (existingSub) {
          // Ya tiene suscripción, ir a onboarding o dashboard
          return NextResponse.redirect(`${origin}/onboarding`);
        }

        // No tiene suscripción, redirigir a checkout
        // Guardar plan en cookie temporal para el checkout
        const response = NextResponse.redirect(`${origin}/checkout-redirect?plan=${plan}&cycle=${cycle}`);
        return response;
      }
    }
  }

  // Error, volver a login
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
