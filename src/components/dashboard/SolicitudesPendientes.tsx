'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  UserPlus, 
  Check, 
  X, 
  Clock,
  Shield,
  User
} from 'lucide-react';

interface Solicitud {
  id: string;
  id_piloto: number;
  pilotos: {
    nombre: string;
    email: string;
    numero_licencia: string | null;
  };
  created_at: string;
}

export default function SolicitudesPendientes({ operadoraId }: { operadoraId: string }) {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadSolicitudes();
  }, [operadoraId]);

  const loadSolicitudes = async () => {
    const { data } = await supabase
      .from('operadora_pilotos')
      .select('*, pilotos(nombre, email, numero_licencia)')
      .eq('id_operadora', operadoraId)
      .eq('estado_solicitud', 'pendiente')
      .order('created_at', { ascending: false });
    
    setSolicitudes(data || []);
    setLoading(false);
  };

  const aceptarSolicitud = async (solicitudId: string) => {
    setLoading(true);
    
    await supabase
      .from('operadora_pilotos')
      .update({ 
        estado_solicitud: 'activo',
        estado_membresia: 'activo'
      })
      .eq('id', solicitudId);

    loadSolicitudes();
  };

  const rechazarSolicitud = async (solicitudId: string) => {
    setLoading(true);
    
    await supabase
      .from('operadora_pilotos')
      .update({ estado_solicitud: 'rechazado' })
      .eq('id', solicitudId);

    loadSolicitudes();
  };

  if (loading) {
    return (
      <div className="skreeo-card">
        <div className="p-8 text-center">
          <div className="inline-block h-8 w-8 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (solicitudes.length === 0) {
    return (
      <div className="skreeo-card">
        <div className="p-8 text-center">
          <Clock className="h-12 w-12 text-[#94A3B8] mx-auto mb-3" />
          <p className="text-sm text-[#64748B]">No hay solicitudes pendientes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="skreeo-card">
      <div className="skreeo-card-header">
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-[#3B82F6]" />
          <h3 className="skreeo-card-title">Solicitudes Pendientes</h3>
          <span className="ml-2 px-2 py-1 bg-[#FEF3C7] text-[#F59E0B] text-xs font-semibold rounded-full">
            {solicitudes.length}
          </span>
        </div>
      </div>

      <div className="divide-y divide-[#E2E8F0]">
        {solicitudes.map((solicitud) => (
          <div key={solicitud.id} className="p-4 hover:bg-[#F8FAFC] transition-colors">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-12 w-12 rounded-full bg-[#DBEAFE] flex items-center justify-center">
                  <User className="h-6 w-6 text-[#3B82F6]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {solicitud.pilotos.nombre}
                  </p>
                  <p className="text-xs text-[#64748B]">
                    {solicitud.pilotos.email}
                  </p>
                  {solicitud.pilotos.numero_licencia && (
                    <p className="text-xs text-[#64748B] mt-1">
                      Licencia: {solicitud.pilotos.numero_licencia}
                    </p>
                  )}
                  <p className="text-xs text-[#94A3B8] mt-1">
                    Solicitado: {new Date(solicitud.created_at).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => aceptarSolicitud(solicitud.id)}
                  disabled={loading}
                  className="p-2 text-[#10B981] hover:bg-[#D1FAE5] rounded-lg transition-colors"
                  title="Aceptar"
                >
                  <Check className="h-5 w-5" />
                </button>
                <button
                  onClick={() => rechazarSolicitud(solicitud.id)}
                  disabled={loading}
                  className="p-2 text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg transition-colors"
                  title="Rechazar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
