import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, User, Mail, Phone, Award } from "lucide-react";

export default async function PilotsPage() {
  const supabase = createServerClient(
    'https://wbrepnefggojyolspxzj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndicmVwbmVmZ2dvanlvbHNweHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NzEwMTEsImV4cCI6MjA3OTE0NzAxMX0.XLIXEyMw9k4uZbwI_q2KNd0bleKXJYH7lG2s-nZMTxg',
    { cookies: { get: (name) => cookies().get(name)?.value } }
  );

  const { data: pilotos } = await supabase
    .from('pilotos')
    .select('*')
    .order('nombre', { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pilotos</h1>
          <p className="text-gray-500 mt-1">{pilotos?.length || 0} pilotos registrados</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Añadir Piloto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pilotos?.map((piloto) => (
          <Card key={piloto.id_piloto}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-700">
                    {piloto.nombre?.substring(0, 2).toUpperCase() || "??"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{piloto.nombre}</h3>
                  <div className="mt-2 space-y-1">
                    {piloto.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{piloto.email}</span>
                      </div>
                    )}
                    {piloto.telefono && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Phone className="h-4 w-4" />
                        <span>{piloto.telefono}</span>
                      </div>
                    )}
                    {piloto.numero_licencia && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Award className="h-4 w-4" />
                        <span>{piloto.numero_licencia}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${piloto.plan_activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {piloto.plan_activo ? 'Activo' : 'Inactivo'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {piloto.vuelos_restantes || 0} vuelos restantes
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!pilotos || pilotos.length === 0) && (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center text-gray-500">
              No hay pilotos registrados
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
