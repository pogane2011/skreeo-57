// src/app/api/telegram/generate-code/route.ts
// Genera código único para vincular Telegram

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Verificar usuario autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Generar código único de 6 caracteres
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Usar service role para insertar
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { get: () => undefined } }
    );

    // Expiración: 10 minutos
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Insertar código
    const { error } = await supabaseAdmin
      .from('telegram_link_codes')
      .insert({
        user_id: user.id,
        code,
        expires_at: expiresAt,
      });

    if (error) {
      console.error('Error creating code:', error);
      return NextResponse.json(
        { error: 'Error generando código' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      code,
      expiresAt,
    });

  } catch (error: any) {
    console.error('Error generating code:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
