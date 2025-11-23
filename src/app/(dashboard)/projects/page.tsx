import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FolderKanban, TrendingUp, TrendingDown, Calendar } from "lucide-react";
export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const supabase = createServerClient(
    'https://wbrepnefggojyolspxzj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndicmVwbmVmZ2dvanlvbHNweHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NzEwMTEsImV4cCI6MjA3OTE0NzAxMX0.XLIXEyMw9k4uZbwI_q2KNd0bleKXJYH7lG2s-nZMTxg',
    { cookies: { get: (name) => cookies().get(name)?.value } }
  );

  const { data: proyectos } = await supabase
    .from('proyectos')
    .select('*, clientes(nombre)')
    .order('fecha_creacion', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
          <p className="text-gray-500 mt-1">{proyectos?.length || 0} proyectos</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proyecto
        </Button>
      </div>

      <Card className="hidden md:block">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Proyecto</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Cliente</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Ingreso</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Margen Neto</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {proyectos?.map((proyecto) => (
                <tr key={proyecto.id_proyecto} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <FolderKanban className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{proyecto.nombre_proyecto}</p>
                        <p className="text-xs text-gray-500">{proyecto.tipo_trabajo || 'Sin tipo'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{proyecto.clientes?.nombre || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{(proyecto.ingreso_total || 0).toFixed(2)} €</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {(proyecto.margen_neto || 0) >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${(proyecto.margen_neto || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(proyecto.margen_neto || 0).toFixed(2)} €
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      proyecto.estado === 'FINALIZADO' ? 'bg-green-100 text-green-700' :
                      proyecto.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {proyecto.estado || 'Sin estado'}
                    </span>
                  </td>
                </tr>
              ))}
              {(!proyectos || proyectos.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No hay proyectos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="md:hidden space-y-4">
        {proyectos?.map((proyecto) => (
          <Card key={proyecto.id_proyecto}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <FolderKanban className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{proyecto.nombre_proyecto}</p>
                    <p className="text-sm text-gray-500">{proyecto.clientes?.nombre || 'Sin cliente'}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  proyecto.estado === 'FINALIZADO' ? 'bg-green-100 text-green-700' :
                  proyecto.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {proyecto.estado || 'Sin estado'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Ingreso Total</p>
                  <p className="text-sm font-medium text-gray-900">{(proyecto.ingreso_total || 0).toFixed(2)} €</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Margen Neto</p>
                  <p className={`text-sm font-medium ${(proyecto.margen_neto || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(proyecto.margen_neto || 0).toFixed(2)} €
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!proyectos || proyectos.length === 0) && (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              No hay proyectos registrados
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
