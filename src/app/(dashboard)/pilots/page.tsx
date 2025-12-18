'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Plus, Search, UserPlus, Mail, Shield, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function PilotsPage() {
  const router = useRouter();
  const [pilotos, setPilotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPilotos();
  }, []);

  const loadPilotos = async () => {
    try {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: operadorData } = await supabase
        .from('operadora_pilotos')
        .select('id_operadora')
        .eq('id_piloto', user.id)
        .eq('operador_activo', true)
        .single();

      if (!operadorData?.id_operadora) {
        setLoading(false);
        return;
      }

      const { data: pilotosData } = await supabase
        .from('operadora_pilotos')
        .select('*')
        .eq('id_operadora', operadorData.id_operadora)
        .order('created_at', { ascending: false });

      if (pilotosData) {
        const pilotosConDatos = await Promise.all(
          pilotosData.map(async (piloto) => {
            const { data: userData } = await supabase.auth.admin.getUserById(piloto.id_piloto);
            return {
              ...piloto,
              email: userData?.user?.email || '',
              nombre: userData?.user?.user_metadata?.nombre || userData?.user?.email?.split('@')[0] || 'Sin nombre',
              avatar_url: userData?.user?.user_metadata?.avatar_url || null,
            };
          })
        );
        setPilotos(pilotosConDatos);
      }

    } catch (error) {
      console.error('Error loading pilotos:', error);
    } finally {
      setLoading(false);
    }
  };

  const pilotosFiltrados = pilotos.filter((piloto) =>
    piloto.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    piloto.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRolBadge = (idRol: number) => {
    switch (idRol) {
      case 1:
        return <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">Admin</span>;
      case 2:
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Operador</span>;
      case 3:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">Visualizador</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">-</span>;
    }
  };

  const getEstadoBadge = (estado: string, estadoSolicitud: string) => {
    if (estadoSolicitud === 'pendiente') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
          <Clock className="h-3 w-3" />
          Pendiente
        </span>
      );
    }
    if (estado === 'activo') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
          <CheckCircle className="h-3 w-3" />
          Activo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
        <XCircle className="h-3 w-3" />
        Inactivo
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pilotos</h1>
          <p className="text-gray-500 mt-1">{pilotos.length} {pilotos.length === 1 ? 'piloto' : 'pilotos'} en tu equipo</p>
        </div>
        <button
          onClick={() => router.push('/pilots/new')}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Añadir Piloto</span>
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Lista de pilotos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pilotosFiltrados.map((piloto) => (
          <Link
            key={piloto.id}
            href={`/pilots/${piloto.id_piloto}`}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-white">
                  {piloto.nombre?.substring(0, 2).toUpperCase() || '??'}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{piloto.nombre}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <Mail className="h-3 w-3 text-gray-400" />
                  <p className="text-sm text-gray-500 truncate">{piloto.email}</p>
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  {getRolBadge(piloto.id_rol)}
                  {getEstadoBadge(piloto.estado_membresia, piloto.estado_solicitud)}
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* Empty state */}
        {pilotosFiltrados.length === 0 && (
          <div className="col-span-full bg-white border border-gray-200 rounded-lg p-12 text-center">
            <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No se encontraron pilotos' : 'No hay pilotos en tu equipo'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? 'Intenta con otro término de búsqueda'
                : 'Añade pilotos a tu equipo para empezar a trabajar juntos'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={() => router.push('/pilots/new')}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                <Plus className="h-5 w-5" />
                <span>Añadir Primer Piloto</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
