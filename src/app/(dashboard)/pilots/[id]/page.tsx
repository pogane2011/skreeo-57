'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { 
  ArrowLeft,
  Info,
  BarChart3,
  Edit,
  Trash2,
  Check,
  X,
  AlertTriangle,
  PlaneTakeoff,
  Clock,
  User,
} from 'lucide-react';

type Tab = 'info' | 'operacional' | 'editar' | 'eliminar';

export default function PilotDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pilotoId = params.id as string;

  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [piloto, setPiloto] = useState<any>(null);
  const [vuelos, setVuelos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    id_rol: 2,
    estado_membresia: 'activo',
  });

  useEffect(() => {
    loadData();
  }, [pilotoId]);

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

      if (!operadorData) {
        router.push('/pilots');
        return;
      }

      const { data: pilotoData, error: pilotoError } = await supabase
        .from('operadora_pilotos')
        .select('*')
        .eq('id_piloto', pilotoId)
        .eq('id_operadora', operadorData.id_operadora)
        .single();

      if (pilotoError || !pilotoData) {
        router.push('/pilots');
        return;
      }

      const { data: userData } = await supabase.auth.admin.getUserById(pilotoId);
      
      const pilotoCompleto = {
        ...pilotoData,
        email: userData?.user?.email || '',
        nombre: userData?.user?.user_metadata?.nombre || userData?.user?.email?.split('@')[0] || 'Sin nombre',
      };

      setPiloto(pilotoCompleto);
      setFormData({
        id_rol: pilotoCompleto.id_rol || 2,
        estado_membresia: pilotoCompleto.estado_membresia || 'activo',
      });

      const { data: vuelosData } = await supabase
        .from('vuelos')
        .select('*')
        .eq('id_piloto_auth', pilotoId)
        .eq('id_operadora', operadorData.id_operadora)
        .order('fecha', { ascending: false })
        .limit(50);

      setVuelos(vuelosData || []);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('operadora_pilotos')
        .update({
          id_rol: formData.id_rol,
          estado_membresia: formData.estado_membresia,
        })
        .eq('id_piloto', pilotoId);

      if (error) throw error;

      alert('Piloto actualizado correctamente');
      setActiveTab('info');
      loadData();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar piloto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar este piloto del equipo? Esta acción es irreversible.')) {
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('operadora_pilotos')
        .delete()
        .eq('id_piloto', pilotoId);

      if (error) throw error;

      alert('Piloto eliminado del equipo correctamente');
      router.push('/pilots');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar piloto');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'info', label: 'Información', icon: Info },
    { id: 'operacional', label: 'Operacional', icon: BarChart3 },
    { id: 'editar', label: 'Editar', icon: Edit },
    { id: 'eliminar', label: 'Eliminar', icon: Trash2 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!piloto) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Piloto no encontrado</p>
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/pilots" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1 flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-white">
              {piloto.nombre?.substring(0, 2).toUpperCase() || '??'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{piloto.nombre}</h1>
            <p className="text-gray-500">{piloto.email}</p>
          </div>
        </div>
      </div>

      {/* Tabs - Desktop */}
      <div className="hidden md:flex border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isDelete = tab.id === 'eliminar';
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : isDelete
                  ? 'border-transparent text-red-600 hover:border-red-200'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tabs - Mobile */}
      <div className="md:hidden">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as Tab)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* INFORMACIÓN */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Nombre</p>
                <p className="text-base font-semibold text-gray-900">{piloto.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="text-base font-semibold text-gray-900">{piloto.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Rol</p>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getRolColor(piloto.id_rol)}`}>
                  {getRolNombre(piloto.id_rol)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Estado</p>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                  piloto.estado_membresia === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {piloto.estado_membresia === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Miembro desde</p>
                <p className="text-base font-semibold text-gray-900">
                  {piloto.created_at ? new Date(piloto.created_at).toLocaleDateString('es-ES') : '-'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* OPERACIONAL */}
        {activeTab === 'operacional' && (
          <div className="space-y-8">
            {/* Tarjetas de métricas */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                <BarChart3 className="h-5 w-5" />
                Métricas de Actividad
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <PlaneTakeoff className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Total Vuelos</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{vuelos.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Vuelos registrados</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Horas Totales</p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    {vuelos.reduce((sum, v) => sum + (v.duracion || 0), 0).toFixed(1)} h
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Tiempo de vuelo</p>
                </div>
              </div>
            </div>

            {/* Historial de vuelos */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                <PlaneTakeoff className="h-5 w-5" />
                Historial de Vuelos (Últimos 10)
              </h3>
              
              {vuelos.length > 0 ? (
                <div className="space-y-3">
                  {vuelos.slice(0, 10).map((vuelo) => (
                    <div key={vuelo.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <PlaneTakeoff className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Vuelo #{vuelo.id}</p>
                          <p className="text-sm text-gray-500">{vuelo.actividad || 'Sin actividad'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {vuelo.fecha ? new Date(vuelo.fecha).toLocaleDateString('es-ES') : '-'}
                        </p>
                        <p className="text-xs text-gray-500">{vuelo.duracion?.toFixed(1) || 0} h</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-gray-200 rounded-lg bg-gray-50">
                  <PlaneTakeoff className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Sin vuelos registrados</p>
                  <p className="text-sm text-gray-400 mt-1">Los vuelos aparecerán aquí cuando se registren</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* EDITAR */}
        {activeTab === 'editar' && (
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <Edit className="h-5 w-5" />
              Editar Piloto
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.id_rol}
                  onChange={(e) => setFormData({...formData, id_rol: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value={1}>Admin</option>
                  <option value={2}>Operador</option>
                  <option value={3}>Visualizador</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.estado_membresia}
                  onChange={(e) => setFormData({...formData, estado_membresia: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5" />
                    <span>Guardar Cambios</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className="inline-flex items-center gap-2 border border-gray-200 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="h-5 w-5" />
                <span>Cancelar</span>
              </button>
            </div>
          </div>
        )}

        {/* ELIMINAR */}
        {activeTab === 'eliminar' && (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    ¿Eliminar piloto del equipo?
                  </h3>
                  <p className="text-sm text-red-700 mb-4">
                    Esta acción es <strong>irreversible</strong>. El piloto será removido del equipo pero sus vuelos registrados se mantendrán en el sistema.
                  </p>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>El piloto ya no tendrá acceso a esta operadora</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>Sus vuelos históricos permanecerán en el sistema</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>Podrá ser invitado nuevamente en el futuro</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-5 w-5" />
                    <span>Confirmar Eliminación</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className="inline-flex items-center gap-2 border border-gray-200 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="h-5 w-5" />
                <span>Cancelar</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
