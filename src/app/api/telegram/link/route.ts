import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Cliente con service_role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { code, telegramChatId, telegramUsername, botSecret } = await request.json();

    // Verificar botSecret
    if (botSecret !== process.env.TELEGRAM_BOT_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!code || !telegramChatId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Buscar código de vinculación
    const { data: linkCode, error: codeError } = await supabase
      .from('telegram_link_codes')
      .select('*')
      .eq('code', code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (codeError || !linkCode) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
    }

    // Actualizar piloto con Telegram vinculado
    const { error: updateError } = await supabase
      .from('pilotos')
      .update({
        id_telegram: telegramChatId.toString(),
        nombre_telegram: telegramUsername || null,
        telegram_verificado: true,
      })
      .eq('id_piloto', linkCode.user_id);

    if (updateError) {
      console.error('Error updating pilot:', updateError);
      return NextResponse.json({ error: 'Failed to link Telegram' }, { status: 500 });
    }

    // Marcar código como usado
    await supabase
      .from('telegram_link_codes')
      .update({ used: true })
      .eq('code', code);

    return NextResponse.json({
      success: true,
      message: 'Telegram linked successfully',
    });
  } catch (error) {
    console.error('Error in telegram link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
