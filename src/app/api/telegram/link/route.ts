// src/app/api/telegram/link/route.ts
// Endpoint que el bot de Telegram llama para vincular cuenta

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Secret para autenticar las llamadas del bot
const BOT_SECRET = process.env.TELEGRAM_BOT_SECRET || 'skreeo_bot_secret_2025';

export async function POST(req: Request) {
  try {
    const { code, telegramChatId, telegramUsername, botSecret } = await req.json();

    // Verificar secreto del bot
    if (botSecret !== BOT_SECRET) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Validar parámetros
    if (!code || !telegramChatId) {
      return NextResponse.json(
        { error: 'Faltan parámetros: code y telegramChatId requeridos' },
        { status: 400 }
      );
    }

    // Buscar código válido
    const { data: linkCode, error: codeError } = await supabase
      .from('telegram_link_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (codeError || !linkCode) {
      return NextResponse.json(
        { error: 'Código inválido o expirado' },
        { status: 400 }
      );
    }

    // Actualizar piloto con telegram_chat_id
    const { error: updateError } = await supabase
      .from('pilotos')
      .upsert({
        id_piloto: linkCode.user_id,
        telegram_chat_id: telegramChatId.toString(),
        telegram_username: telegramUsername || null,
      }, {
        onConflict: 'id_piloto',
      });

    if (updateError) {
      console.error('Error updating piloto:', updateError);
      return NextResponse.json(
        { error: 'Error vinculando cuenta' },
        { status: 500 }
      );
    }

    // Marcar código como usado
    await supabase
      .from('telegram_link_codes')
      .update({ used: true })
      .eq('id', linkCode.id);

    return NextResponse.json({
      success: true,
      message: 'Telegram vinculado correctamente',
    });

  } catch (error: any) {
    console.error('Error linking telegram:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
