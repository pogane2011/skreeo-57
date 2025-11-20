import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Percent, Clock, TrendingUp, Plane, Users, FolderKanban, PlaneTakeoff } from "lucide-react";

const stats = [
  { name: "Alertas Críticas", value: "0", icon: AlertTriangle, color: "text-green-600", bgColor: "bg-green-50" },
  { name: "Disponibilidad Flota", value: "50%", icon: Percent, color: "text-orange-600", bgColor: "bg-orange-50" },
  { name: "COH Promedio", value: "24.26 €/h", icon: Clock, color: "text-blue-600", bgColor: "bg-blue-50" },
  { name: "Vida Útil Consumida", value: "0%", icon: TrendingUp, color: "text-purple-600", bgColor: "bg-purple-50" },
];

const quickStats = [
  { name: "Drones Activos", value: "2", icon: Plane },
  { name: "Pilotos", value: "2", icon: Users },
  { name: "Proyectos Activos", value: "2", icon: FolderKanban },
  { name: "Vuelos Este Mes", value: "13", icon: PlaneTakeoff },
];

export default function OperatorPage() {
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
              <span className="text-xl font-bold text-blue-700">MI</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Mi Operador</h2>
              <p className="text-gray-500">ESP123456789 • privada</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Últimos vuelos y eventos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <PlaneTakeoff className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Vuelo registrado - Proyecto Delta</p>
                <p className="text-xs text-gray-500">DJI Mavic 3 • 2.5 horas • Hace 2 horas</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
