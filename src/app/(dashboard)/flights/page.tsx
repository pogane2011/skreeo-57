import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, PlaneTakeoff, Calendar, Clock } from "lucide-react";

export default async function FlightsPage() {
  const supabase = createServerClient(
    'https://wbrepnefggojyolspxzj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndicmVwbmVmZ2dvanlvbHNweHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NzEwMTEsImV4cCI6MjA3OTE0NzAxMX0.XLIXEyMw9k4uZbwI_q2KNd0bleKXJYH7lG2s-nZMTxg',
    { cookies: { get: (name) => cookies().get(name)?.value } }
  );

  const { data: vuelos } = await supabase
    .from('vuelos')
    .select('*, drones(marca_modelo), proyectos(nombre_proyecto), pilotos(nombre)')
    .order('fecha_vuelo', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vuelos</h1>
          <p className="text-gray-500 mt-1">{vuelos?.length || 0} vuelos registrados</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Registrar Vuelo
        </Button>
      </div>

      <Card className="hidden md:block">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Fecha</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Drone</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Proyecto</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Piloto</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Duración</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Coste</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vuelos?.map((vuelo) => (
                <tr key={vuelo.id_vuelo} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {new Date(vuelo.fecha_vuelo).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{vuelo.drones?.marca_modelo || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{vuelo.proyectos?.nombre_proyecto || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{vuelo.pilotos?.nombre || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{vuelo.duracion_vuelo || 0} min</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">
                    {(vuelo.coste_calculado || 0).toFixed(2)} €
                  </td>
                </tr>
              ))}
              {(!vuelos || vuelos.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No hay vuelos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="md:hidden space-y-4">
        {vuelos?.map((vuelo) => (
          <Card key={vuelo.id_vuelo}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <PlaneTakeoff className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{vuelo.proyectos?.nombre_proyecto || 'Sin proyecto'}</p>
                  <p className="text-sm text-gray-500">{new Date(vuelo.fecha_vuelo).toLocaleDateString('es-ES')}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Drone</p>
                  <p className="text-sm font-medium text-gray-900">{vuelo.drones?.marca_modelo || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duración</p>
                  <p className="text-sm font-medium text-gray-900">{vuelo.duracion_vuelo || 0} min</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Coste</p>
                  <p className="text-sm font-medium text-green-600">{(vuelo.coste_calculado || 0).toFixed(2)} €</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!vuelos || vuelos.length === 0) && (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              No hay vuelos registrados
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
