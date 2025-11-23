// src/app/api/telegram/check-link/route.ts
// Verifica si el usuario ya vinculó su Telegram

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET(req: Request) {
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

    // Verificar si el piloto tiene telegram_chat_id
    const { data: piloto } = await supabase
      .from('pilotos')
      .select('telegram_chat_id')
      .eq('id_piloto', user.id)
      .single();

    const isLinked = !!piloto?.telegram_chat_id;

    return NextResponse.json({
      linked: isLinked,
      telegramChatId: piloto?.telegram_chat_id || null,
    });

  } catch (error: any) {
    console.error('Error checking telegram link:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
