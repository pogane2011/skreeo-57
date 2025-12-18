'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { createClient } from '@/lib/supabase/client';
import { 
  Plus,
  Drone, 
  Plane, 
  Settings,
  Search,
  Filter,
  X,
  Battery
} from "lucide-react";

type TabType = 'uas' | 'accesorios';
type EstadoFilter = 'todos' | 'activo' | 'inactivo';

export default function FleetPage() {
  const [activeTab, setActiveTab] = useState<TabType>('uas');
  const [drones, setDrones] = useState<any[]>([]);
  const [dronesFiltered, setDronesFiltered] = useState<any[]>([]);
  const [accesorios, setAccesorios] = useState<any[]>([]);
  const [accesoriosFiltered, setAccesoriosFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [operadorActivo, setOperadorActivo] = useState<string | null>(null);

  // Estados de búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<EstadoFilter>('todos');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');

  const categorias = ['C0', 'C1', 'C2', 'C3', 'C4'];
  const categoriasAccesorios = ['Batería', 'Hélice', 'Cámara', 'Control', 'Otro'];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filtroEstado, filtroCategoria, drones, accesorios, activeTab]);

  const loadData = async () => {
    try {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: operadorData } = await supabase
        .from('operadora_pilotos')
        .select('id_operadora')
        .eq('id_piloto', user.id)
        .eq('operador_activo', true)
        .single();

      if (!operadorData) return;

      setOperadorActivo(operadorData.id_operadora);

      // Cargar drones
      const { data: dronesData } = await supabase
        .from('drones')
        .select('*')
        .eq('id_operadora', operadorData.id_operadora)
        .eq('eliminado', false)
        .order('marca_modelo', { ascending: true });

      setDrones(dronesData || []);
      setDronesFiltered(dronesData || []);

      // Cargar accesorios
      const { data: accesoriosData } = await supabase
        .from('accesorios')
        .select('*')
        .eq('id_operadora', operadorData.id_operadora)
        .eq('eliminado', false)
        .order('alias', { ascending: true });

      setAccesorios(accesoriosData || []);
      setAccesoriosFiltered(accesoriosData || []);

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (activeTab === 'uas') {
      let filtered = [...drones];

      // Filtro de búsqueda
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(d => 
          d.marca_modelo?.toLowerCase().includes(term) ||
          d.num_matricula?.toLowerCase().includes(term) ||
          d.alias?.toLowerCase().includes(term) ||
          d.num_serie?.toLowerCase().includes(term)
        );
      }

      // Filtro de estado
      if (filtroEstado !== 'todos') {
        filtered = filtered.filter(d => d.estado === filtroEstado);
      }

      // Filtro de categoría
      if (filtroCategoria !== 'todas') {
        filtered = filtered.filter(d => d.categoria === filtroCategoria);
      }

      setDronesFiltered(filtered);
    } else {
      let filtered = [...accesorios];

      // Filtro de búsqueda
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(a => 
          a.alias?.toLowerCase().includes(term) ||
          a.marca_modelo?.toLowerCase().includes(term) ||
          a.categoria?.toLowerCase().includes(term)
        );
      }

      // Filtro de estado
      if (filtroEstado !== 'todos') {
        filtered = filtered.filter(a => a.estado === filtroEstado);
      }

      // Filtro de categoría
      if (filtroCategoria !== 'todas') {
        filtered = filtered.filter(a => a.categoria === filtroCategoria);
      }

      setAccesoriosFiltered(filtered);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFiltroEstado('todos');
    setFiltroCategoria('todas');
    setShowFilters(false);
  };

  const hasActiveFilters = filtroEstado !== 'todos' || filtroCategoria !== 'todas';

  const getSaludColor = (usado: number, total: number) => {
    if (!total || total === 0) return { percent: 0, color: 'bg-green-500', textColor: 'text-green-600' };
    const percent = Math.round((usado / total) * 100);
    const restante = 100 - percent;
    if (restante <= 20) return { percent, color: 'bg-red-500', textColor: 'text-red-600' };
    if (restante <= 50) return { percent, color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    return { percent, color: 'bg-green-500', textColor: 'text-green-600' };
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
        <h1 className="text-2xl font-bold text-gray-900">Mi Flota</h1>
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Plane className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">No hay operador activo</p>
          <p className="text-gray-500">Selecciona un operador en el sidebar</p>
        </div>
      </div>
    );
  }

  const itemsActuales = activeTab === 'uas' ? dronesFiltered : accesoriosFiltered;
  const itemsOriginales = activeTab === 'uas' ? drones : accesorios;
  const totalItems = itemsOriginales.length;
  const itemsActivos = itemsOriginales.filter(i => i.estado === 'activo').length;
  const itemsMostrados = itemsActuales.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Flota</h1>
          <p className="text-gray-500 mt-1">
            {totalItems} {activeTab === 'uas' ? 'UAS' : 'accesorios'} · {itemsActivos} activos
            {itemsMostrados !== totalItems && ` · Mostrando ${itemsMostrados}`}
          </p>
        </div>
        
        <Link 
          href={activeTab === 'uas' ? '/fleet/new' : '/fleet/accessories/new'}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Añadir {activeTab === 'uas' ? 'UAS' : 'Accesorio'}</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          onClick={() => {
            setActiveTab('uas');
            clearFilters();
          }}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${
            activeTab === 'uas'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          UAS ({drones.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('accesorios');
            clearFilters();
          }}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${
            activeTab === 'accesorios'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Accesorios ({accesorios.length})
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
              placeholder={activeTab === 'uas' 
                ? 'Buscar por modelo, matrícula, alias...' 
                : 'Buscar por categoría, alias, modelo...'}
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
                {(filtroEstado !== 'todos' ? 1 : 0) + (filtroCategoria !== 'todas' ? 1 : 0)}
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

              {/* Filtro Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todas">Todas</option>
                  {(activeTab === 'uas' ? categorias : categoriasAccesorios).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contenido según tab */}
      {activeTab === 'uas' && (
        <>
          {/* Tabla Desktop - UAS */}
          <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">UAS</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Matrícula</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">TCO/Hora</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Horas</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Salud</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Estado</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dronesFiltered.map((uas) => {
                  const salud = getSaludColor(uas.horas_voladas || 0, uas.vida_util || 0);
                  const saludRestante = 100 - salud.percent;
                  
                  return (
                    <tr key={uas.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Drone className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{uas.marca_modelo}</p>
                            <p className="text-sm text-gray-500">{uas.alias || 'Sin alias'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-gray-900">{uas.num_matricula}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-green-600">
                          {(uas.tco_por_hora || 0).toFixed(2)} €
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900">{(uas.horas_voladas || 0).toFixed(1)}h</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[100px]">
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${salud.color}`}
                                style={{ width: `${saludRestante}%` }}
                              />
                            </div>
                          </div>
                          <span className={`text-sm font-medium ${salud.textColor}`}>
                            {saludRestante}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          uas.estado === 'activo' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {uas.estado === 'activo' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link 
                          href={`/fleet/${uas.id}`}
                          className="p-2 hover:bg-gray-100 rounded-lg inline-flex"
                        >
                          <Settings className="h-4 w-4 text-gray-600" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                
                {dronesFiltered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Plane className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-900 font-medium">
                        {searchTerm || hasActiveFilters 
                          ? 'No se encontraron UAS con esos criterios'
                          : 'No hay UAS registrados'
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

          {/* Cards Mobile - UAS */}
          <div className="md:hidden space-y-4">
            {dronesFiltered.map((uas) => {
              const salud = getSaludColor(uas.horas_voladas || 0, uas.vida_util || 0);
              const saludRestante = 100 - salud.percent;
              
              return (
                <Link 
                  key={uas.id} 
                  href={`/fleet/${uas.id}`}
                  className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Plane className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 truncate">{uas.marca_modelo}</p>
                        <p className="text-sm text-gray-500">{uas.num_matricula}</p>
                      </div>
                    </div>
                    <Settings className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">TCO/Hora</p>
                      <p className="text-sm font-semibold text-green-600">{(uas.tco_por_hora || 0).toFixed(2)} €</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Horas Voladas</p>
                      <p className="text-sm font-semibold text-gray-900">{(uas.horas_voladas || 0).toFixed(1)}h</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Salud</span>
                      <span className={`text-xs font-medium ${salud.textColor}`}>{saludRestante}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${salud.color}`} style={{ width: `${saludRestante}%` }} />
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      uas.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {uas.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </Link>
              );
            })}
            
            {dronesFiltered.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Plane className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-900 font-medium mb-1">
                  {searchTerm || hasActiveFilters 
                    ? 'No se encontraron UAS'
                    : 'No hay UAS registrados'
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
        </>
      )}

      {activeTab === 'accesorios' && (
        <>
          {/* Tabla Desktop - Accesorios */}
          <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Accesorio</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Categoría</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">TCO/Ciclo</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Ciclos</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Salud</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Estado</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {accesoriosFiltered.map((acc) => {
                  const salud = getSaludColor(acc.ciclos_usados || 0, acc.vida_util || 0);
                  const saludRestante = 100 - salud.percent;
                  
                  return (
                    <tr key={acc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Battery className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{acc.alias}</p>
                            <p className="text-sm text-gray-500">{acc.marca_modelo || 'Sin modelo'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{acc.categoria}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-green-600">
                          {(acc.tco_por_ciclo || 0).toFixed(2)} €
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900">{acc.ciclos_usados || 0} / {acc.vida_util || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[100px]">
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className={`h-full ${salud.color}`} style={{ width: `${saludRestante}%` }} />
                            </div>
                          </div>
                          <span className={`text-sm font-medium ${salud.textColor}`}>{saludRestante}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          acc.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {acc.estado === 'activo' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link 
                          href={`/fleet/accessories/${acc.id}`}
                          className="p-2 hover:bg-gray-100 rounded-lg inline-flex"
                        >
                          <Settings className="h-4 w-4 text-gray-600" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                
                {accesoriosFiltered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Battery className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-900 font-medium">
                        {searchTerm || hasActiveFilters 
                          ? 'No se encontraron accesorios con esos criterios'
                          : 'No hay accesorios registrados'
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

          {/* Cards Mobile - Accesorios */}
          <div className="md:hidden space-y-4">
            {accesoriosFiltered.map((acc) => {
              const salud = getSaludColor(acc.ciclos_usados || 0, acc.vida_util || 0);
              const saludRestante = 100 - salud.percent;
              
              return (
                <Link 
                  key={acc.id}
                  href={`/fleet/accessories/${acc.id}`}
                  className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Battery className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 truncate">{acc.alias}</p>
                        <p className="text-sm text-gray-500">{acc.categoria}</p>
                      </div>
                    </div>
                    <Settings className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">TCO/Ciclo</p>
                      <p className="text-sm font-semibold text-green-600">{(acc.tco_por_ciclo || 0).toFixed(2)} €</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Ciclos</p>
                      <p className="text-sm font-semibold text-gray-900">{acc.ciclos_usados || 0}/{acc.vida_util || 0}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Salud</span>
                      <span className={`text-xs font-medium ${salud.textColor}`}>{saludRestante}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${salud.color}`} style={{ width: `${saludRestante}%` }} />
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      acc.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {acc.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </Link>
              );
            })}
            
            {accesoriosFiltered.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Battery className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-900 font-medium mb-1">
                  {searchTerm || hasActiveFilters 
                    ? 'No se encontraron accesorios'
                    : 'No hay accesorios registrados'
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
        </>
      )}
    </div>
  );
}
