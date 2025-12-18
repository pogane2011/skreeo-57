'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, 
  User,
  Settings,
  Search,
  Filter,
  X,
  Mail,
  Shield,
} from "lucide-react";

type EstadoFilter = 'todos' | 'activo' | 'inactivo';
type RolFilter = 'todos' | '1' | '2' | '3';

export default function PilotsPage() {
  const router = useRouter();
  const [pilotos, setPilotos] = useState<any[]>([]);
  const [pilotosFiltered, setPilotosFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [operadorActivo, setOperadorActivo] = useState<string | null>(null);

  // Estados de búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<EstadoFilter>('todos');
  const [filtroRol, setFiltroRol] = useState<RolFilter>('todos');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filtroEstado, filtroRol, pilotos]);

  const loadData = async () => {
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

      if (!operadorData) return;

      setOperadorActivo(operadorData.id_operadora);

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
            };
          })
        );
        setPilotos(pilotosConDatos);
        setPilotosFiltered(pilotosConDatos);
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...pilotos];

    // Filtro de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.nombre?.toLowerCase().includes(term) ||
        p.email?.toLowerCase().includes(term)
      );
    }

    // Filtro de estado
    if (filtroEstado !== 'todos') {
      filtered = filtered.filter(p => p.estado_membresia === filtroEstado);
    }

    // Filtro de rol
    if (filtroRol !== 'todos') {
      filtered = filtered.filter(p => p.id_rol === parseInt(filtroRol));
    }

    setPilotosFiltered(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFiltroEstado('todos');
    setFiltroRol('todos');
    setShowFilters(false);
  };

  const hasActiveFilters = filtroEstado !== 'todos' || filtroRol !== 'todos';

  const getRolNombre = (idRol: number) => {
    switch (idRol) {
      case 1: return 'Admin';
      case 2: return 'Operador';
      case 3: return 'Visualizador';
      default: return '-';
    }
  };

  const getRolColor = (idRol: number) => {
    switch (idRol) {
      case 1: return 'bg-purple-100 text-purple-700';
      case 2: return 'bg-blue-100 text-blue-700';
      case 3: return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!operadorActivo) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Pilotos</h1>
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">No hay operador activo</p>
          <p className="text-gray-500">Selecciona un operador en el sidebar</p>
        </div>
      </div>
    );
  }

  const totalPilotos = pilotos.length;
  const pilotosActivos = pilotos.filter(p => p.estado_membresia === 'activo').length;
  const pilotosMostrados = pilotosFiltered.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pilotos</h1>
          <p className="text-gray-500 mt-1">
            {totalPilotos} {totalPilotos === 1 ? 'piloto' : 'pilotos'} · {pilotosActivos} activos
            {pilotosMostrados !== totalPilotos && ` · Mostrando ${pilotosMostrados}`}
          </p>
        </div>
        
        <button
          onClick={() => router.push('/pilots/new')}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Añadir Piloto</span>
        </button>
      </div>

      {/* Búsqueda y Filtros */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              hasActiveFilters 
                ? 'border-blue-600 bg-blue-50 text-blue-700' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
            {hasActiveFilters && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {(filtroEstado !== 'todos' ? 1 : 0) + (filtroRol !== 'todos' ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Panel de Filtros */}
        {showFilters && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Filtros</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Limpiar filtros
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Filtro Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value as EstadoFilter)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todos</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              {/* Filtro Rol */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                <select
                  value={filtroRol}
                  onChange={(e) => setFiltroRol(e.target.value as RolFilter)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todos</option>
                  <option value="1">Admin</option>
                  <option value="2">Operador</option>
                  <option value="3">Visualizador</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabla Desktop */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Piloto</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Email</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Rol</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Estado</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pilotosFiltered.map((piloto) => (
              <tr key={piloto.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-white">
                        {piloto.nombre?.substring(0, 2).toUpperCase() || '??'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{piloto.nombre}</p>
                      <p className="text-sm text-gray-500">
                        Miembro desde {piloto.created_at ? new Date(piloto.created_at).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }) : '-'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{piloto.email}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRolColor(piloto.id_rol)}`}>
                    {getRolNombre(piloto.id_rol)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    piloto.estado_membresia === 'activo' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {piloto.estado_membresia === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link 
                    href={`/pilots/${piloto.id_piloto}`}
                    className="p-2 hover:bg-gray-100 rounded-lg inline-flex"
                  >
                    <Settings className="h-4 w-4 text-gray-600" />
                  </Link>
                </td>
              </tr>
            ))}
            
            {pilotosFiltered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-900 font-medium">
                    {searchTerm || hasActiveFilters 
                      ? 'No se encontraron pilotos con esos criterios'
                      : 'No hay pilotos registrados'
                    }
                  </p>
                  {(searchTerm || hasActiveFilters) && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards Mobile */}
      <div className="md:hidden space-y-4">
        {pilotosFiltered.map((piloto) => (
          <Link 
            key={piloto.id} 
            href={`/pilots/${piloto.id_piloto}`}
            className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-white">
                    {piloto.nombre?.substring(0, 2).toUpperCase() || '??'}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 truncate">{piloto.nombre}</p>
                  <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {piloto.email}
                  </p>
                </div>
              </div>
              <Settings className="h-5 w-5 text-gray-400 flex-shrink-0" />
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRolColor(piloto.id_rol)}`}>
                {getRolNombre(piloto.id_rol)}
              </span>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                piloto.estado_membresia === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {piloto.estado_membresia === 'activo' ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Miembro desde {piloto.created_at ? new Date(piloto.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : '-'}
              </p>
            </div>
          </Link>
        ))}
        
        {pilotosFiltered.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-900 font-medium mb-1">
              {searchTerm || hasActiveFilters 
                ? 'No se encontraron pilotos'
                : 'No hay pilotos registrados'
              }
            </p>
            {(searchTerm || hasActiveFilters) && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 mt-2"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
