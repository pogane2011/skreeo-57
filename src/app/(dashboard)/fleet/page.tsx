import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from "next/link";
import { 
  Plus, 
  Plane, 
  MoreHorizontal,
  Search,
  Filter,
  ChevronRight
} from "lucide-react";

export default async function FleetPage() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookies().get(name)?.value } }
  );

  const { data: drones } = await supabase
    .from('drones')
    .select('*')
    .order('marca_modelo', { ascending: true });

  const totalUAS = drones?.length || 0;
  const uasActivos = drones?.filter(d => d.activo)?.length || 0;

  // Función para calcular el color de salud
  const getSaludColor = (horasUso: number, vidaUtil: number) => {
    if (!vidaUtil || vidaUtil === 0) return { percent: 0, color: 'skreeo-progress-success' };
    const percent = Math.round((horasUso / vidaUtil) * 100);
    if (percent >= 80) return { percent, color: 'skreeo-progress-error' };
    if (percent >= 50) return { percent, color: 'skreeo-progress-warning' };
    return { percent, color: 'skreeo-progress-success' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Mi Flota</h1>
            <p className="page-subtitle">
              {totalUAS} UAS registrados · {uasActivos} activos
            </p>
          </div>
          
          <Link href="/fleet/new" className="skreeo-btn-primary">
            <Plus className="h-4 w-4" />
            <span>Añadir UAS</span>
          </Link>
        </div>
      </div>

      {/* Tabs UAS / Accesorios */}
      <div className="skreeo-tabs w-fit">
        <button className="skreeo-tab skreeo-tab-active">
          UAS ({totalUAS})
        </button>
        <Link href="/fleet/accessories" className="skreeo-tab">
          Accesorios
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
          <input 
            type="text"
            placeholder="Buscar por modelo, matrícula..."
            className="skreeo-input pl-10"
          />
        </div>
        <button className="skreeo-btn-secondary">
          <Filter className="h-4 w-4" />
          <span>Filtros</span>
        </button>
      </div>

      {/* Tabla Desktop */}
      <div className="skreeo-card hidden md:block overflow-hidden">
        <table className="skreeo-table">
          <thead className="skreeo-table-header">
            <tr>
              <th className="skreeo-table-th">UAS</th>
              <th className="skreeo-table-th">Matrícula</th>
              <th className="skreeo-table-th">TCO/Hora</th>
              <th className="skreeo-table-th">Horas Voladas</th>
              <th className="skreeo-table-th">Salud</th>
              <th className="skreeo-table-th">Estado</th>
              <th className="skreeo-table-th w-12"></th>
            </tr>
          </thead>
          <tbody>
            {drones?.map((uas) => {
              const salud = getSaludColor(uas.horas_uso || 0, uas.vida_util_estimada || 0);
              return (
                <tr key={uas.id_drone} className="skreeo-table-row">
                  <td className="skreeo-table-td">
                    <Link href={`/fleet/${uas.id_drone}`} className="flex items-center gap-3 group">
                      <div className="h-10 w-10 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                        <Plane className="h-5 w-5 text-[#3B82F6]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#0F172A] group-hover:text-[#3B82F6]">
                          {uas.marca_modelo}
                        </p>
                        <p className="text-xs text-[#64748B]">
                          {uas.alias || uas.categoria || 'Sin alias'}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="skreeo-table-td">
                    <span className="font-mono text-sm">{uas.matricula}</span>
                  </td>
                  <td className="skreeo-table-td">
                    <span className="font-semibold text-[#10B981]">
                      {(uas.tco_por_hora || 0).toFixed(2)} €
                    </span>
                  </td>
                  <td className="skreeo-table-td">
                    {(uas.horas_uso || 0).toFixed(1)}h
                  </td>
                  <td className="skreeo-table-td">
                    <div className="flex items-center gap-3">
                      <div className="skreeo-progress w-20">
                        <div 
                          className={`skreeo-progress-bar ${salud.color}`}
                          style={{ width: `${100 - salud.percent}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#64748B]">{100 - salud.percent}%</span>
                    </div>
                  </td>
                  <td className="skreeo-table-td">
                    <span className={`skreeo-badge ${uas.activo ? 'skreeo-badge-success' : 'skreeo-badge-neutral'}`}>
                      {uas.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="skreeo-table-td">
                    <div className="relative group">
                      <button className="skreeo-btn-icon">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                      {/* Dropdown - Se activaría con JS/Estado */}
                    </div>
                  </td>
                </tr>
              );
            })}
            {(!drones || drones.length === 0) && (
              <tr>
                <td colSpan={7} className="px-6 py-12">
                  <div className="empty-state">
                    <Plane className="empty-state-icon" />
                    <p className="empty-state-title">No hay UAS registrados</p>
                    <p className="empty-state-description">
                      Añade tu primer UAS para empezar a gestionar tu flota
                    </p>
                    <Link href="/fleet/new" className="skreeo-btn-primary">
                      <Plus className="h-4 w-4" />
                      <span>Añadir UAS</span>
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards Móvil */}
      <div className="md:hidden space-y-3">
        {drones?.map((uas) => {
          const salud = getSaludColor(uas.horas_uso || 0, uas.vida_util_estimada || 0);
          return (
            <Link 
              key={uas.id_drone} 
              href={`/fleet/${uas.id_drone}`}
              className="skreeo-card-hover block"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-[#DBEAFE] flex items-center justify-center">
                      <Plane className="h-6 w-6 text-[#3B82F6]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0F172A]">{uas.marca_modelo}</p>
                      <p className="text-sm text-[#64748B] font-mono">{uas.matricula}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[#94A3B8]" />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-[#64748B]">TCO/Hora</p>
                    <p className="text-sm font-semibold text-[#10B981]">
                      {(uas.tco_por_hora || 0).toFixed(2)} €
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B]">Horas</p>
                    <p className="text-sm font-semibold text-[#0F172A]">
                      {(uas.horas_uso || 0).toFixed(1)}h
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B]">Salud</p>
                    <div className="flex items-center gap-2">
                      <div className="skreeo-progress flex-1">
                        <div 
                          className={`skreeo-progress-bar ${salud.color}`}
                          style={{ width: `${100 - salud.percent}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{100 - salud.percent}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        
        {(!drones || drones.length === 0) && (
          <div className="skreeo-card">
            <div className="p-8">
              <div className="empty-state">
                <Plane className="empty-state-icon" />
                <p className="empty-state-title">No hay UAS registrados</p>
                <p className="empty-state-description">
                  Añade tu primer UAS para empezar
                </p>
                <Link href="/fleet/new" className="skreeo-btn-primary">
                  <Plus className="h-4 w-4" />
                  <span>Añadir UAS</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
