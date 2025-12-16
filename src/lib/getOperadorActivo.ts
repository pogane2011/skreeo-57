import { createClient } from '@/lib/supabase/client';

/**
 * Obtiene el ID del operador activo del usuario actual
 * @returns {Promise<number | null>} ID del operador activo o null si no hay
 */
export async function getOperadorActivo(): Promise<number | null> {
  try {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('operadora_pilotos')
      .select('id_operadora')
      .eq('id_piloto', user.id)
      .eq('operador_activo', true)
      .single();

    if (error) {
      console.error('Error obteniendo operador activo:', error);
      return null;
    }

    return data?.id_operadora || null;
  } catch (error) {
    console.error('Error en getOperadorActivo:', error);
    return null;
  }
}

/**
 * Obtiene información completa del operador activo
 * @returns {Promise<object | null>} Datos del operador activo
 */
export async function getOperadorActivoFull() {
  try {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('operadora_pilotos')
      .select('id_operadora, id_rol, operadoras(id, nombre, slug, num_aesa, logo_url)')
      .eq('id_piloto', user.id)
      .eq('operador_activo', true)
      .single();

    if (error) {
      console.error('Error obteniendo operador activo:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error en getOperadorActivoFull:', error);
    return null;
  }
}
