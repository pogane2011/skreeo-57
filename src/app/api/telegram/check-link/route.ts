import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Crear cliente con las cookies del usuario
    const cookieStore = cookies();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Obtener usuario autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Buscar piloto por user_id con las columnas CORRECTAS
    const { data: piloto, error: pilotoError } = await supabase
      .from('pilotos')
      .select('id_telegram, nombre_telegram, telegram_verificado')
      .eq('id_piloto', user.id)
      .single();

    if (pilotoError || !piloto) {
      return NextResponse.json({
        linked: false,
        telegramChatId: null,
      });
    }

    // Verificar si tiene Telegram vinculado
    const isLinked = piloto.telegram_verificado === true && piloto.id_telegram !== null;

    return NextResponse.json({
      linked: isLinked,
      telegramChatId: piloto.id_telegram,
      telegramUsername: piloto.nombre_telegram,
    });
  } catch (error) {
    console.error('Error checking telegram link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
