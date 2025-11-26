import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Obtiene el operador activo del usuario logueado
 * Usar en Server Components
 */
export async function getActiveOperator() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookies().get(name)?.value } }
  );

  // Obtener usuario logueado
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Obtener piloto del usuario
  const { data: piloto } = await supabase
    .from('pilotos')
    .select('id_piloto')
    .eq('email', user.email)
    .single();

  if (!piloto) {
    return { error: 'NO_PILOTO', piloto: null, operador: null };
  }

  // Obtener operador activo
  const { data: operadorActivo } = await supabase
    .from('operadora_pilotos')
    .select('id_operadora, operadoras(*)')
    .eq('id_piloto', piloto.id_piloto)
    .eq('operador_activo', true)
    .eq('estado_solicitud', 'activo')
    .single();

  if (!operadorActivo) {
    return { error: 'NO_OPERADOR', piloto, operador: null };
  }

  return {
    error: null,
    piloto,
    operador: operadorActivo.operadoras,
    operadoraId: operadorActivo.id_operadora,
    supabase
  };
}

/**
 * Wrapper para páginas que requieren operador activo
 * Maneja errores automáticamente
 */
export async function withActiveOperator(
  callback: (data: {
    operadoraId: string;
    operador: any;
    piloto: any;
    supabase: any;
  }) => Promise<any>
) {
  const result = await getActiveOperator();

  if (result.error === 'NO_PILOTO') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-500">No tienes un perfil de piloto configurado</p>
        </div>
      </div>
    );
  }

  if (result.error === 'NO_OPERADOR') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-500">No tienes un operador activo</p>
          <p className="text-sm text-gray-400 mt-2">Busca un operador o solicita acceso</p>
        </div>
      </div>
    );
  }

  return callback({
    operadoraId: result.operadoraId!,
    operador: result.operador,
    piloto: result.piloto,
    supabase: result.supabase
  });
}
