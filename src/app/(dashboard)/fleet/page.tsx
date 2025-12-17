import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from "next/link";
import { 
  Plus, 
  Plane, 
  MoreHorizontal,
  Search,
  Filter,
  ChevronRight,
  AlertCircle
} from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function FleetPage() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookies().get(name)?.value } }
  );

  // OBTENER USUARIO ACTUAL
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Debes iniciar sesión</p>
      </div>
    );
  }

  // OBTENER OPERADOR ACTIVO
  const { data: operadorActivoData } = await supabase
    .from('operadora_pilotos')
    .select('id_operadora')
    .eq('id_piloto', user.id)
    .eq('operador_activo', true)
    .single();

  const operadorActivo = operadorActivoData?.id_operadora;

  if (!operadorActivo) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Flota</h1>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <div className="text-center">
            <Plane className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">No hay operador activo</p>
            <p className="text-gray-500">
              Selecciona un operador en el sidebar para ver su flota
            </p>
          </div>
        </div>
      </div>
    );
  }

  // FILTRAR DRONES POR OPERADOR ACTIVO
  const { data: drones } = await supabase
    .from('drones')
    .select('*')
    .eq('id_operadora', operadorActivo)
    .eq('eliminado', false)
    .order('marca_modelo', { ascending: true });

  const totalUAS = drones?.length || 0;
  const uasActivos = drones?.filter(d => d.estado === 'activo')?.length || 0;

  // Función para calcular el color de salud
  const getSaludColor = (horasVoladas: number, vidaUtil: number) => {
    if (!vidaUtil || vidaUtil === 0) return { percent: 0, color: 'bg-green-500', textColor: 'text-green-600' };
    const percent = Math.round((horasVoladas / vidaUtil) * 100);
    if (percent >= 80) return { percent, color: 'bg-red-500', textColor: 'text-red-600' };
    if (percent >= 50) return { percent, color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    return { percent, color: 'bg-green-500', textColor: 'text-green-600' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Flota</h1>
          <p className="text-gray-500 mt-1">
            {totalUAS} UAS registrados · {uasActivos} activos
          </p>
        </div>
        
        <Link 
          href="/fleet/new" 
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Añadir UAS</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium">
          UAS ({totalUAS})
        </button>
        <button className="px-4 py-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
          Accesorios
        </button>
      </div>

      {/* Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por modelo, matrícula..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Filter className="h-4 w-4" />
          <span>Filtros</span>
        </button>
      </div>

      {/* Tabla Desktop */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">UAS</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Matrícula</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">TCO/Hora</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Horas Voladas</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Salud</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Estado</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {drones?.map((uas) => {
              const salud = getSaludColor(uas.horas_voladas || 0, uas.vida_util || 0);
              const saludRestante = 100 - salud.percent;
              
              return (
                <tr key={uas.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link href={`/fleet/${uas.id}`} className="flex items-center gap-3 group">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Plane className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-blue-600">{uas.marca_modelo}</p>
                        <p className="text-sm text-gray-500">{uas.alias || 'Sin alias'}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-gray-900">{uas.num_matricula}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-green-600">
                      {(uas.tco_por_hora || 0).toFixed(2)} €
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">{(uas.horas_voladas || 0).toFixed(1)}h</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[120px]">
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${salud.color}`}
                            style={{ width: `${saludRestante}%` }}
                          />
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${salud.textColor}`}>
                        {saludRestante}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      uas.estado === 'activo' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {uas.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              );
            })}
            
            {(!drones || drones.length === 0) && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Plane className="h-12 w-12 text-gray-300" />
                    <div>
                      <p className="text-gray-900 font-medium mb-1">No hay UAS registrados</p>
                      <p className="text-sm text-gray-500">Añade tu primer UAS para empezar</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards Mobile */}
      <div className="md:hidden space-y-4">
        {drones?.map((uas) => {
          const salud = getSaludColor(uas.horas_voladas || 0, uas.vida_util || 0);
          const saludRestante = 100 - salud.percent;
          
          return (
            <Link 
              key={uas.id} 
              href={`/fleet/${uas.id}`}
              className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Plane className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 truncate">{uas.marca_modelo}</p>
                    <p className="text-sm text-gray-500">{uas.num_matricula}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-500">TCO/Hora</p>
                  <p className="text-sm font-semibold text-green-600">{(uas.tco_por_hora || 0).toFixed(2)} €</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Horas Voladas</p>
                  <p className="text-sm font-semibold text-gray-900">{(uas.horas_voladas || 0).toFixed(1)}h</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Salud</span>
                  <span className={`text-xs font-medium ${salud.textColor}`}>{saludRestante}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${salud.color}`}
                    style={{ width: `${saludRestante}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  uas.estado === 'activo' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {uas.estado === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </Link>
          );
        })}
        
        {(!drones || drones.length === 0) && (
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <div className="text-center">
              <Plane className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-900 font-medium mb-1">No hay UAS registrados</p>
              <p className="text-sm text-gray-500">Añade tu primer UAS para empezar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
