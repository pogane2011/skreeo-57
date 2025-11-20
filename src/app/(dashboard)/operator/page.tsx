import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Percent, Clock, TrendingUp, Plane, Users, FolderKanban, PlaneTakeoff } from "lucide-react";

export default async function OperatorPage() {
  const supabase = createServerComponentClient({ cookies });

  // Consultar datos reales
  const { data: drones } = await supabase.from('drones').select('*');
  const { data: pilotos } = await supabase.from('pilotos').select('*');
  const { data: proyectos } = await supabase.from('proyectos').select('*').eq('estado', 'PENDIENTE');
  const { data: vuelos } = await supabase.from('vuelos').select('*');
  const { data: operadora } = await supabase.from('operadoras').select('*').single();

  const dronesActivos = drones?.filter(d => d.activo)?.length || 0;
  const totalPilotos = pilotos?.length || 0;
  const proyectosActivos = proyectos?.length || 0;
  const totalVuelos = vuelos?.length || 0;

  // Calcular TCO promedio
  const tcoPromedio = drones?.length 
    ? (drones.reduce((sum, d) => sum + (d.tco_por_hora || 0), 0) / drones.length).toFixed(2)
    : "0.00";

  const stats = [
    { name: "Alertas Críticas", value: "0", icon: AlertTriangle, color: "text-green-600", bgColor: "bg-green-50" },
    { name: "Disponibilidad Flota", value: `${dronesActivos > 0 ? Math.round((dronesActivos / (drones?.length || 1)) * 100) : 0}%`, icon: Percent, color: "text-orange-600", bgColor: "bg-orange-50" },
    { name: "COH Promedio", value: `${tcoPromedio} €/h`, icon: Clock, color: "text-blue-600", bgColor: "bg-blue-50" },
    { name: "Vida Útil Consumida", value: "0%", icon: TrendingUp, color: "text-purple-600", bgColor: "bg-purple-50" },
  ];

  const quickStats = [
    { name: "Drones Activos", value: dronesActivos.toString(), icon: Plane },
    { name: "Pilotos", value: totalPilotos.toString(), icon: Users },
    { name: "Proyectos Activos", value: proyectosActivos.toString(), icon: FolderKanban },
    { name: "Vuelos Total", value: totalVuelos.toString(), icon: PlaneTakeoff },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Operadora</h1>
        <p className="text-gray-500 mt-1">Resumen de tu flota y operaciones</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xl font-bold text-blue-700">
                {operadora?.nombre?.substring(0, 2).toUpperCase() || "MI"}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{operadora?.nombre || "Mi Operador"}</h2>
              <p className="text-gray-500">{operadora?.numero_aesa || "Sin número AESA"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Rápido</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat) => (
            <Card key={stat.name}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <stat.icon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
