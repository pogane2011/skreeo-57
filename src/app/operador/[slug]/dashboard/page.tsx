import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Footer from '@/components/Footer';
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

export default async function DashboardPage({ params }: { params: { slug: string } }) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookies().get(name)?.value } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Obtener operador por slug
  const { data: operadora } = await supabase
    .from('operadoras')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!operadora) redirect('/operadores');

  // Verificar acceso
  const { data: access } = await supabase
    .from('operadora_pilotos')
    .select('id_rol')
    .eq('id_piloto', user.id)
    .eq('id_operadora', operadora.id)
    .single();

  if (!access) redirect('/operadores');

  // Consultar datos FILTRADOS por operador
  const { data: drones } = await supabase
    .from('drones')
    .select('*')
    .eq('id_operadora', operadora.id);

  const { data: vuelos } = await supabase
    .from('vuelos')
    .select('*')
    .eq('id_operadora', operadora.id);

  const { data: proyectos } = await supabase
    .from('proyectos')
    .select('*, clientes!inner(*)')
    .eq('clientes.id_operadora', operadora.id);

  const { data: pilotos } = await supabase
    .from('operadora_pilotos')
    .select('id_piloto')
    .eq('id_operadora', operadora.id);

  const uasActivos = drones?.filter(d => !d.eliminado)?.length || 0;
  const totalUAS = drones?.length || 0;
  const totalPilotos = pilotos?.length || 0;
  const proyectosActivos = proyectos?.filter(p => !p.eliminado)?.length || 0;
  const totalVuelos = vuelos?.length || 0;

  // Calcular TCO promedio (COH - Coste por Hora)
  const cohPromedio = drones?.length 
    ? (drones.reduce((sum, d) => sum + (d.tco_por_hora || 0), 0) / drones.length).toFixed(2)
    : "0.00";

  // Calcular disponibilidad
  const disponibilidad = totalUAS > 0 ? Math.round((uasActivos / totalUAS) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header de página */}
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Resumen de tu operación</p>
          </div>

          {/* Info Operadora */}
          <div className="skreeo-card px-4 py-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#DBEAFE] flex items-center justify-center">
              <span className="text-sm font-bold text-[#3B82F6]">
                {operadora.nombre?.substring(0, 2).toUpperCase() || "OP"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-[#0F172A]">
                {operadora.nombre}
              </p>
              <p className="text-xs text-[#64748B]">
                {operadora.num_aesa || "Sin número AESA"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Alertas */}
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

        {/* Disponibilidad */}
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

        {/* COH Promedio */}
        <div className="kpi-card">
          <div className="flex items-start justify-between">
            <div className="kpi-icon kpi-icon-info">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <p className="kpi-value">{cohPromedio} €/h</p>
          <p className="kpi-label">COH Promedio</p>
        </div>

        {/* Vida Útil */}
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

      {/* Stats Rápidos + Accesos directos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Grid */}
        <div className="lg:col-span-2">
          <div className="skreeo-card">
            <div className="skreeo-card-header">
              <h3 className="skreeo-card-title">Resumen Rápido</h3>
            </div>
            <div className="skreeo-card-body">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href={`/operador/${params.slug}/fleet`} className="group p-4 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <Plane className="h-5 w-5 text-[#3B82F6]" />
                    <ChevronRight className="h-4 w-4 text-[#94A3B8] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-2xl font-bold text-[#0F172A]">{uasActivos}</p>
                  <p className="text-sm text-[#64748B]">UAS Activos</p>
                </Link>

                <Link href={`/operador/${params.slug}/pilots`} className="group p-4 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-5 w-5 text-[#10B981]" />
                    <ChevronRight className="h-4 w-4 text-[#94A3B8] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-2xl font-bold text-[#0F172A]">{totalPilotos}</p>
                  <p className="text-sm text-[#64748B]">Pilotos</p>
                </Link>

                <Link href={`/operador/${params.slug}/projects`} className="group p-4 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <FolderKanban className="h-5 w-5 text-[#8B5CF6]" />
                    <ChevronRight className="h-4 w-4 text-[#94A3B8] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-2xl font-bold text-[#0F172A]">{proyectosActivos}</p>
                  <p className="text-sm text-[#64748B]">Proyectos Activos</p>
                </Link>

                <Link href={`/operador/${params.slug}/flights`} className="group p-4 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] transition-colors">
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

        {/* Acciones Rápidas */}
        <div className="skreeo-card">
          <div className="skreeo-card-header">
            <h3 className="skreeo-card-title">Acciones Rápidas</h3>
          </div>
          <div className="skreeo-card-body space-y-3">
            <Link 
              href={`/operador/${params.slug}/flights/new`}
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
              href={`/operador/${params.slug}/fleet/new`}
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
              href={`/operador/${params.slug}/projects/new`}
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

      {/* Info KPIs */}
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
