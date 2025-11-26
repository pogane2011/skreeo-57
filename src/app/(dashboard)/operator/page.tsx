import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Footer from '@/components/Footer';
import OperatorSelector from '@/components/dashboard/OperatorSelector';
import { 
  AlertTriangle, 
  Percent, 
  Clock, 
  TrendingUp, 
  Plane, 
  Users, 
  FolderKanban, 
  PlaneTakeoff,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
export const dynamic = 'force-dynamic';

export default async function OperatorPage() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookies().get(name)?.value } }
  );

  // Obtener usuario logueado
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Obtener piloto del usuario (por email)
  const { data: piloto } = await supabase
    .from('pilotos')
    .select('id_piloto')
    .eq('email', user.email)
    .single();

  if (!piloto) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-500">No tienes un perfil de piloto configurado</p>
          <Link href="/profile/setup" className="text-blue-600 hover:underline mt-2 inline-block">
            Configurar perfil
          </Link>
        </div>
      </div>
    );
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
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-500">No tienes un operador activo</p>
          <p className="text-sm text-gray-400 mt-2">Busca un operador o solicita acceso</p>
        </div>
      </div>
    );
  }

  const operadora = operadorActivo.operadoras;
  const operadoraId = operadorActivo.id_operadora;

  // Consultar datos del operador activo
  const { data: drones } = await supabase
    .from('drones')
    .select('*')
    .eq('id_operadora', operadoraId);

  const { data: pilotos } = await supabase
    .from('operadora_pilotos')
    .select('pilotos(*)')
    .eq('id_operadora', operadoraId)
    .eq('estado_solicitud', 'activo');

  const { data: proyectos } = await supabase
    .from('proyectos')
    .select('*')
    .eq('id_operadora', operadoraId)
    .eq('estado', 'PENDIENTE');

  const { data: vuelos } = await supabase
    .from('vuelos')
    .select('*, proyectos!inner(id_operadora)')
    .eq('proyectos.id_operadora', operadoraId);

  const uasActivos = drones?.filter(d => d.activo)?.length || 0;
  const totalUAS = drones?.length || 0;
  const totalPilotos = pilotos?.length || 0;
  const proyectosActivos = proyectos?.length || 0;
  const totalVuelos = vuelos?.length || 0;

  const cohPromedio = drones?.length 
    ? (drones.reduce((sum, d) => sum + (d.tco_por_hora || 0), 0) / drones.length).toFixed(2)
    : "0.00";

  const disponibilidad = totalUAS > 0 ? Math.round((uasActivos / totalUAS) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header con selector de operador */}
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Resumen de tu operación</p>
          </div>
          
          <OperatorSelector 
            currentOperator={operadora}
            pilotoId={piloto.id_piloto}
          />
        </div>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="kpi-card">
          <div className="flex items-start justify-between">
            <div className="kpi-icon kpi-icon-success">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <span className="skreeo-badge skreeo-badge-success">OK</span>
          </div>
          <p className="kpi-value">0</p>
          <p className="kpi-label">Alertas Críticas</p>
        </div>

        <div className="kpi-card">
          <div className="flex items-start justify-between">
            <div className="kpi-icon kpi-icon-warning">
              <Percent className="h-6 w-6" />
            </div>
            {disponibilidad >= 80 ? (
              <span className="skreeo-badge skreeo-badge-success">Óptimo</span>
            ) : disponibilidad >= 50 ? (
              <span className="skreeo-badge skreeo-badge-warning">Medio</span>
            ) : (
              <span className="skreeo-badge skreeo-badge-error">Bajo</span>
            )}
          </div>
          <p className="kpi-value">{disponibilidad}%</p>
          <p className="kpi-label">Disponibilidad Flota</p>
        </div>

        <div className="kpi-card">
          <div className="flex items-start justify-between">
            <div className="kpi-icon kpi-icon-info">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <p className="kpi-value">{cohPromedio} €/h</p>
          <p className="kpi-label">COH Promedio</p>
        </div>

        <div className="kpi-card">
          <div className="flex items-start justify-between">
            <div className="kpi-icon kpi-icon-purple">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <p className="kpi-value">0%</p>
          <p className="kpi-label">Vida Útil Consumida</p>
        </div>
      </div>

      {/* Stats Rápidos + Acciones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="skreeo-card">
            <div className="skreeo-card-header">
              <h3 className="skreeo-card-title">Resumen Rápido</h3>
            </div>
            <div className="skreeo-card-body">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/fleet" className="group p-4 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <Plane className="h-5 w-5 text-[#3B82F6]" />
                    <ChevronRight className="h-4 w-4 text-[#94A3B8] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-2xl font-bold text-[#0F172A]">{uasActivos}</p>
                  <p className="text-sm text-[#64748B]">UAS Activos</p>
                </Link>

                <Link href="/pilots" className="group p-4 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-5 w-5 text-[#10B981]" />
                    <ChevronRight className="h-4 w-4 text-[#94A3B8] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-2xl font-bold text-[#0F172A]">{totalPilotos}</p>
                  <p className="text-sm text-[#64748B]">Pilotos</p>
                </Link>

                <Link href="/projects" className="group p-4 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <FolderKanban className="h-5 w-5 text-[#8B5CF6]" />
                    <ChevronRight className="h-4 w-4 text-[#94A3B8] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-2xl font-bold text-[#0F172A]">{proyectosActivos}</p>
                  <p className="text-sm text-[#64748B]">Proyectos Activos</p>
                </Link>

                <Link href="/flights" className="group p-4 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <PlaneTakeoff className="h-5 w-5 text-[#F59E0B]" />
                    <ChevronRight className="h-4 w-4 text-[#94A3B8] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-2xl font-bold text-[#0F172A]">{totalVuelos}</p>
                  <p className="text-sm text-[#64748B]">Vuelos Total</p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="skreeo-card">
          <div className="skreeo-card-header">
            <h3 className="skreeo-card-title">Acciones Rápidas</h3>
          </div>
          <div className="skreeo-card-body space-y-3">
            <Link 
              href="/flights/new"
              className="flex items-center gap-3 p-3 rounded-lg border border-[#E2E8F0] hover:border-[#3B82F6] hover:bg-[#EFF6FF] transition-all group"
            >
              <div className="h-10 w-10 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                <PlaneTakeoff className="h-5 w-5 text-[#3B82F6]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#0F172A]">Registrar Vuelo</p>
                <p className="text-xs text-[#64748B]">Añadir nueva operación</p>
              </div>
              <ChevronRight className="h-5 w-5 text-[#94A3B8] group-hover:text-[#3B82F6]" />
            </Link>

            <Link 
              href="/fleet/new"
              className="flex items-center gap-3 p-3 rounded-lg border border-[#E2E8F0] hover:border-[#3B82F6] hover:bg-[#EFF6FF] transition-all group"
            >
              <div className="h-10 w-10 rounded-lg bg-[#D1FAE5] flex items-center justify-center">
                <Plane className="h-5 w-5 text-[#10B981]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#0F172A]">Añadir UAS</p>
                <p className="text-xs text-[#64748B]">Registrar nuevo equipo</p>
              </div>
              <ChevronRight className="h-5 w-5 text-[#94A3B8] group-hover:text-[#3B82F6]" />
            </Link>

            <Link 
              href="/projects/new"
              className="flex items-center gap-3 p-3 rounded-lg border border-[#E2E8F0] hover:border-[#3B82F6] hover:bg-[#EFF6FF] transition-all group"
            >
              <div className="h-10 w-10 rounded-lg bg-[#EDE9FE] flex items-center justify-center">
                <FolderKanban className="h-5 w-5 text-[#8B5CF6]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#0F172A]">Nuevo Proyecto</p>
                <p className="text-xs text-[#64748B]">Crear trabajo</p>
              </div>
              <ChevronRight className="h-5 w-5 text-[#94A3B8] group-hover:text-[#3B82F6]" />
            </Link>
          </div>
        </div>
      </div>

      <div className="skreeo-card">
        <div className="skreeo-card-body">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-4 w-4 text-[#3B82F6]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#0F172A]">Acerca de estos KPIs</p>
              <p className="text-sm text-[#64748B] mt-1">
                <strong>COH (Coste por Hora):</strong> Calculado automáticamente basado en depreciación, 
                mantenimiento y uso de cada UAS. 
                <strong> Disponibilidad:</strong> Porcentaje de UAS activos respecto al total de la flota.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
