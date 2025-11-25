import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    
    // Crear cliente de Supabase con cookies
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
    
    // Obtener usuario autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { linked: false },
        { status: 401 }
      );
    }
    
    // Buscar piloto
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
    
    // Verificar vinculación
    const isLinked = piloto.telegram_verificado === true && piloto.id_telegram !== null;
    
    return NextResponse.json({
      linked: isLinked,
      telegramChatId: piloto.id_telegram,
      telegramUsername: piloto.nombre_telegram,
    });
  } catch (error) {
    console.error('Error checking telegram link:', error);
    return NextResponse.json(
      { linked: false },
      { status: 500 }
    );
  }
}
