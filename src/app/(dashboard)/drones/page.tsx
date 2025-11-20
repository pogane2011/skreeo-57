import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings, MoreHorizontal, Plane } from "lucide-react";

const drones = [
  { id: 1, marca_modelo: "DJI FPV", matricula: "GC2226RPA", tco_por_hora: 5.14, horas_uso: 2.83, salud: 1, categoria: "C1" },
  { id: 2, marca_modelo: "DJI Mavic 2", matricula: "GC2044RPA", tco_por_hora: 3.38, horas_uso: 11.50, salud: 3, categoria: "C1" },
];

export default function DronesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">UAS y TCO</h1>
          <p className="text-gray-500 mt-1">{drones.length} drones registrados</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Añadir Drone
        </Button>
      </div>

      <Card className="hidden md:block">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Marca/Modelo</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Matrícula</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">TCO/Hora</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Horas</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Salud</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {drones.map((drone) => (
                <tr key={drone.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Plane className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{drone.marca_modelo}</p>
                        <p className="text-xs text-gray-500">{drone.categoria}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{drone.matricula}</td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">{drone.tco_por_hora.toFixed(2)} €</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{drone.horas_uso.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${drone.salud}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{drone.salud}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm"><Settings className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="md:hidden space-y-4">
        {drones.map((drone) => (
          <Card key={drone.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Plane className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{drone.marca_modelo}</p>
                    <p className="text-sm text-gray-500">{drone.matricula}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon"><MoreHorizontal className="h-5 w-5" /></Button>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">TCO/Hora</p>
                  <p className="text-sm font-medium text-green-600">{drone.tco_por_hora.toFixed(2)} €</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Horas</p>
                  <p className="text-sm font-medium text-gray-900">{drone.horas_uso.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Salud</p>
                  <p className="text-sm font-medium text-gray-900">{drone.salud}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
