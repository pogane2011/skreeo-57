import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Cliente con service_role para poder actualizar la tabla
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { code, telegramChatId, telegramUsername, botSecret } = await request.json();

    // Verificar botSecret
    if (botSecret !== process.env.TELEGRAM_BOT_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validar que vengan los datos necesarios
    if (!code || !telegramChatId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Buscar el código de vinculación
    const { data: linkCode, error: codeError } = await supabase
      .from('telegram_link_codes')
      .select('*')
      .eq('code', code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (codeError || !linkCode) {
      return NextResponse.json(
        { error: 'Invalid or expired code' },
        { status: 400 }
      );
    }

    // Actualizar o crear piloto con telegram_chat_id
    const { data: existingPilot } = await supabase
      .from('pilotos')
      .select('id_piloto')
      .eq('id_piloto', linkCode.user_id)
      .single();

    if (existingPilot) {
      // Actualizar piloto existente con las columnas CORRECTAS
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
        return NextResponse.json(
          { error: 'Failed to link Telegram account' },
          { status: 500 }
        );
      }
    } else {
      // Crear nuevo piloto si no existe
      const { data: userData } = await supabase.auth.admin.getUserById(linkCode.user_id);
      
      const { error: insertError } = await supabase
        .from('pilotos')
        .insert({
          id_piloto: linkCode.user_id,
          nombre: userData.user?.user_metadata?.nombre || userData.user?.email || 'Usuario',
          email: userData.user?.email || '',
          id_telegram: telegramChatId.toString(),
          nombre_telegram: telegramUsername || null,
          telegram_verificado: true,
          plan_activo: true,
          vuelos_restantes: 99999,
        });

      if (insertError) {
        console.error('Error creating pilot:', insertError);
        return NextResponse.json(
          { error: 'Failed to create pilot' },
          { status: 500 }
        );
      }
    }

    // Marcar el código como usado
    await supabase
      .from('telegram_link_codes')
      .update({ used: true })
      .eq('code', code);

    return NextResponse.json({
      success: true,
      message: 'Telegram account linked successfully',
    });
  } catch (error) {
    console.error('Error in telegram link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
