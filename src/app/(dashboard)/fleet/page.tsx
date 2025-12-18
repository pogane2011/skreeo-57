'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { 
  generarPDFDatosTecnicos,
  generarPDFHistorialVuelos,
  generarCSVVuelos,
  generarPDFMantenimiento
} from '@/lib/pdfGenerator';
import { 
  ArrowLeft,
  Info,
  Settings,
  Wrench,
  Download,
  Edit,
  Trash2,
  Plus,
  FileText,
  FileSpreadsheet,
  AlertTriangle,
  Check,
  X,
  Plane,
  PlaneTakeoff,
  Clock,
  TrendingUp,
  Calendar,
} from 'lucide-react';

type Tab = 'info' | 'operacional' | 'mantenimiento' | 'descargas' | 'editar' | 'eliminar';

export default function DroneDetailPage() {
  const params = useParams();
  const router = useRouter();
  const droneId = params.id as string;

  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [drone, setDrone] = useState<any>(null);
  const [operadora, setOperadora] = useState<any>(null);
  const [vuelos, setVuelos] = useState<any[]>([]);
  const [mantenimientos, setMantenimientos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    categoria: '',
    marca_modelo: '',
    num_matricula: '',
    num_serie: '',
    alias: '',
    poliza: '',
    fecha_compra: '',
    precio: '',
    vida_util: '',
    estado: 'activo',
  });

  // Nuevo mantenimiento
  const [nuevoMant, setNuevoMant] = useState({
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
    horas_vuelo: '',
    precio: '',
  });
  const [showNuevoMant, setShowNuevoMant] = useState(false);
  
  // Editar mantenimiento
  const [editandoMant, setEditandoMant] = useState<any>(null);
  const [showEditarMant, setShowEditarMant] = useState(false);

  useEffect(() => {
    loadData();
  }, [droneId]);

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
        router.push('/fleet');
        return;
      }

      // Obtener datos operadora
      const { data: opData } = await supabase
        .from('operadoras')
        .select('*')
        .eq('id_operadora', operadorData.id_operadora)
        .single();

      setOperadora(opData);

      // Obtener drone
      const { data: droneData, error: droneError } = await supabase
        .from('drones')
        .select('*')
        .eq('id', droneId)
        .eq('id_operadora', operadorData.id_operadora)
        .single();

      if (droneError || !droneData) {
        router.push('/fleet');
        return;
      }

      setDrone(droneData);
      setFormData({
        categoria: droneData.categoria || '',
        marca_modelo: droneData.marca_modelo || '',
        num_matricula: droneData.num_matricula || '',
        num_serie: droneData.num_serie || '',
        alias: droneData.alias || '',
        poliza: droneData.poliza || '',
        fecha_compra: droneData.fecha_compra || '',
        precio: droneData.precio?.toString() || '',
        vida_util: droneData.vida_util?.toString() || '',
        estado: droneData.estado || 'activo',
      });

      // Obtener vuelos
      const { data: vuelosData } = await supabase
        .from('vuelos')
        .select('*')
        .eq('id_drone', droneId)
        .order('fecha', { ascending: false })
        .limit(50);

      setVuelos(vuelosData || []);

      // Obtener mantenimientos
      const { data: mantData } = await supabase
        .from('mantenimiento_drones')
        .select('*')
        .eq('id_drone', droneId)
        .order('fecha', { ascending: false });

      setMantenimientos(mantData || []);

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
        .from('drones')
        .update({
          categoria: formData.categoria,
          marca_modelo: formData.marca_modelo,
          num_matricula: formData.num_matricula,
          num_serie: formData.num_serie,
          alias: formData.alias,
          poliza: formData.poliza || null,
          fecha_compra: formData.fecha_compra || null,
          precio: parseFloat(formData.precio) || null,
          vida_util: parseFloat(formData.vida_util) || null,
          estado: formData.estado,
          updated_at: new Date().toISOString(),
        })
        .eq('id', droneId);

      if (error) throw error;

      alert('UAS actualizado correctamente');
      loadData();
      setActiveTab('info');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar UAS');
    } finally {
      setSaving(false);
    }
  };

  // Helper: Formatear horas al formato TIME de PostgreSQL
  const formatearHorasVuelo = (horas: string): string | null => {
    if (!horas) return null;
    
    // Si ya tiene formato completo (10:30:00), dejarlo
    if (/^\d{1,2}:\d{2}:\d{2}$/.test(horas)) {
      return horas;
    }
    
    // Si tiene formato parcial (10:30), añadir :00
    if (/^\d{1,2}:\d{2}$/.test(horas)) {
      return `${horas}:00`;
    }
    
    // Si solo tiene horas (10), convertir a 10:00:00
    if (/^\d{1,2}$/.test(horas)) {
      return `${horas}:00:00`;
    }
    
    return null;
  };

  const handleAddMantenimiento = async () => {
    if (!nuevoMant.descripcion) {
      alert('La descripción es obligatoria');
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('mantenimiento_drones')
        .insert({
          id_drone: droneId,
          fecha: nuevoMant.fecha,
          descripcion: nuevoMant.descripcion,
          horas_vuelo: formatearHorasVuelo(nuevoMant.horas_vuelo),
          precio: parseFloat(nuevoMant.precio) || null,
        });

      if (error) throw error;

      alert('Mantenimiento registrado');
      setNuevoMant({
        fecha: new Date().toISOString().split('T')[0],
        descripcion: '',
        horas_vuelo: '',
        precio: '',
      });
      setShowNuevoMant(false);
      loadData();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al registrar mantenimiento');
    } finally {
      setSaving(false);
    }
  };

  const handleEditarMantenimiento = (mant: any) => {
    setEditandoMant({
      id: mant.id,
      fecha: mant.fecha.split('T')[0],
      descripcion: mant.descripcion,
      horas_vuelo: mant.horas_vuelo || '',
      precio: mant.precio?.toString() || '',
    });
    setShowEditarMant(true);
  };

  const handleUpdateMantenimiento = async () => {
    if (!editandoMant.descripcion) {
      alert('La descripción es obligatoria');
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('mantenimiento_drones')
        .update({
          fecha: editandoMant.fecha,
          descripcion: editandoMant.descripcion,
          horas_vuelo: formatearHorasVuelo(editandoMant.horas_vuelo),
          precio: parseFloat(editandoMant.precio) || null,
        })
        .eq('id', editandoMant.id);

      if (error) throw error;

      alert('Mantenimiento actualizado');
      setShowEditarMant(false);
      setEditandoMant(null);
      loadData();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar mantenimiento');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMantenimiento = async (mantId: string) => {
    if (!confirm('¿Estás seguro de eliminar este registro de mantenimiento?')) {
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('mantenimiento_drones')
        .delete()
        .eq('id', mantId);

      if (error) throw error;

      alert('Mantenimiento eliminado');
      loadData();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar mantenimiento');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar este UAS? Esta acción es irreversible.')) {
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('drones')
        .update({
          eliminado: true,
          deleted_at: new Date().toISOString(),
        })
        .eq('id', droneId);

      if (error) throw error;

      alert('UAS eliminado correctamente');
      router.push('/fleet');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar UAS');
    } finally {
      setSaving(false);
    }
  };

  // Funciones de descarga
  const handleDescargarDatosTecnicos = () => {
    setGeneratingPDF(true);
    try {
      generarPDFDatosTecnicos(drone, operadora);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleDescargarHistorialVuelosPDF = () => {
    setGeneratingPDF(true);
    try {
      generarPDFHistorialVuelos(drone, operadora, vuelos);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleDescargarHistorialVuelosCSV = () => {
    try {
      generarCSVVuelos(drone, vuelos);
    } catch (error) {
      console.error('Error generando CSV:', error);
      alert('Error al generar CSV');
    }
  };

  const handleDescargarMantenimiento = () => {
    setGeneratingPDF(true);
    try {
      generarPDFMantenimiento(drone, operadora, mantenimientos);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const formatDuration = (duracion: any) => {
    if (!duracion) return '0:00';
    if (typeof duracion === 'string') {
      const match = duracion.match(/(\d+):(\d+):(\d+)/);
      if (match) {
        const hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
      }
    }
    return duracion;
  };

  const tabs = [
    { id: 'info', label: 'Información', icon: Info },
    { id: 'operacional', label: 'Operacional', icon: Settings },
    { id: 'mantenimiento', label: 'Mantenimiento', icon: Wrench },
    { id: 'descargas', label: 'Descargas', icon: Download },
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

  if (!drone) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">UAS no encontrado</p>
      </div>
    );
  }

  const saludPercent = drone.vida_util > 0 
    ? Math.round((drone.horas_voladas / drone.vida_util) * 100)
    : 0;
  const saludRestante = 100 - saludPercent;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/fleet" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{drone.marca_modelo}</h1>
          <p className="text-gray-500">{drone.num_matricula} · {drone.alias || 'Sin alias'}</p>
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
          className="w-full px-4 py-3 border border-gray-200 rounded-lg"
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
                <p className="text-sm text-gray-500">Categoría</p>
                <p className="text-base font-semibold text-gray-900">{drone.categoria || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Marca / Modelo</p>
                <p className="text-base font-semibold text-gray-900">{drone.marca_modelo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Alias</p>
                <p className="text-base font-semibold text-gray-900">{drone.alias || '-'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Nº Serie</p>
                <p className="text-base font-semibold text-gray-900 font-mono">{drone.num_serie || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nº Matrícula</p>
                <p className="text-base font-semibold text-gray-900 font-mono">{drone.num_matricula}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Póliza Seguro</p>
                <p className="text-base font-semibold text-gray-900">{drone.poliza || '-'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Precio Adquisición</p>
                <p className="text-base font-semibold text-gray-900">{drone.precio ? `${drone.precio.toFixed(2)} €` : '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha Compra</p>
                <p className="text-base font-semibold text-gray-900">{drone.fecha_compra || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                  drone.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {drone.estado === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* OPERACIONAL - (incluye tarjetas + vuelos - código igual que antes) */}
        {activeTab === 'operacional' && (
          <div className="space-y-8">
            {/* Tarjetas de métricas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas Operacionales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">TCO/Hora</p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{(drone.tco_por_hora || 0).toFixed(2)} €</p>
                  <p className="text-xs text-gray-500 mt-1">Coste operacional</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Horas Voladas</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{(drone.horas_voladas || 0).toFixed(1)} h</p>
                  <p className="text-xs text-gray-500 mt-1">Tiempo total de vuelo</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Vida Útil</p>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">{(drone.vida_util || 0).toFixed(0)} h</p>
                  <p className="text-xs text-gray-500 mt-1">Horas estimadas totales</p>
                </div>

                <div className={`border-2 rounded-xl p-5 ${
                  saludRestante >= 80 ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' :
                  saludRestante >= 50 ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300' :
                  'bg-gradient-to-br from-red-50 to-rose-50 border-red-300'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      saludRestante >= 80 ? 'bg-green-100' :
                      saludRestante >= 50 ? 'bg-yellow-100' :
                      'bg-red-100'
                    }`}>
                      <Plane className={`h-5 w-5 ${
                        saludRestante >= 80 ? 'text-green-600' :
                        saludRestante >= 50 ? 'text-yellow-600' :
                        'text-red-600'
                      }`} />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Salud</p>
                  </div>
                  <p className={`text-3xl font-bold ${
                    saludRestante >= 80 ? 'text-green-600' :
                    saludRestante >= 50 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>{saludRestante}%</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {drone.vida_util > 0 
                      ? `${(drone.vida_util - drone.horas_voladas).toFixed(1)}h restantes`
                      : 'Sin configurar'
                    }
                  </p>
                </div>
              </div>

              {saludRestante < 20 && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mt-4">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">Alerta de Riesgo</p>
                    <p className="text-sm text-red-700">El UAS ha superado el {drone.alerta_riesgo}% de su vida útil. Programa mantenimiento.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Historial de Vuelos */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Vuelos</h3>
              
              {vuelos.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <PlaneTakeoff className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay vuelos registrados</p>
                </div>
              ) : (
                <>
                  <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Fecha</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Hora Despegue</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Duración</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Actividad</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">TCO</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {vuelos.map((vuelo) => (
                          <tr key={vuelo.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {new Date(vuelo.fecha).toLocaleDateString('es-ES')}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{vuelo.hora_despegue || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{formatDuration(vuelo.duracion)}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{vuelo.actividad || '-'}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-green-600">
                              {(vuelo.coste_tco_dron || 0).toFixed(2)} €
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="md:hidden space-y-3">
                    {vuelos.map((vuelo) => (
                      <div key={vuelo.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(vuelo.fecha).toLocaleDateString('es-ES')}
                          </span>
                          <span className="text-sm font-semibold text-green-600">
                            {(vuelo.coste_tco_dron || 0).toFixed(2)} €
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1"><strong>Hora:</strong> {vuelo.hora_despegue || '-'}</p>
                        <p className="text-sm text-gray-600 mb-1"><strong>Duración:</strong> {formatDuration(vuelo.duracion)}</p>
                        <p className="text-sm text-gray-600"><strong>Actividad:</strong> {vuelo.actividad || '-'}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* MANTENIMIENTO - (código igual que antes) */}
        {activeTab === 'mantenimiento' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Libro de Mantenimiento</h3>
              <button
                onClick={() => setShowNuevoMant(!showNuevoMant)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Añadir</span>
              </button>
            </div>

            {showNuevoMant && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
                <h4 className="font-medium text-blue-900">Nuevo Mantenimiento</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                    <input
                      type="date"
                      value={nuevoMant.fecha}
                      onChange={(e) => setNuevoMant({...nuevoMant, fecha: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={nuevoMant.precio}
                      onChange={(e) => setNuevoMant({...nuevoMant, precio: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horas de Vuelo
                    <span className="text-xs text-gray-500 ml-2">(Ej: 10 o 10:30 o 10:30:00)</span>
                  </label>
                  <input
                    type="text"
                    value={nuevoMant.horas_vuelo}
                    onChange={(e) => setNuevoMant({...nuevoMant, horas_vuelo: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10 o 10:30 o 10:30:00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                  <textarea
                    value={nuevoMant.descripcion}
                    onChange={(e) => setNuevoMant({...nuevoMant, descripcion: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddMantenimiento}
                    disabled={saving}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    <Check className="h-4 w-4" />
                    <span>{saving ? 'Guardando...' : 'Guardar'}</span>
                  </button>
                  <button
                    onClick={() => setShowNuevoMant(false)}
                    className="inline-flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancelar</span>
                  </button>
                </div>
              </div>
            )}

            {mantenimientos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No hay registros de mantenimiento</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mantenimientos.map((mant) => (
                  <div key={mant.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-sm text-gray-500">
                            {new Date(mant.fecha).toLocaleDateString('es-ES')}
                          </div>
                          {mant.precio && (
                            <div className="text-sm font-semibold text-green-600">
                              {parseFloat(mant.precio).toFixed(2)} €
                            </div>
                          )}
                          {mant.horas_vuelo && (
                            <div className="text-sm text-gray-600">
                              {mant.horas_vuelo}
                            </div>
                          )}
                        </div>
                        <p className="text-gray-900">{mant.descripcion}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleEditarMantenimiento(mant)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMantenimiento(mant.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal Editar Mantenimiento */}
            {showEditarMant && editandoMant && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <h4 className="font-medium text-gray-900 text-lg mb-4">Editar Mantenimiento</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                        <input
                          type="date"
                          value={editandoMant.fecha}
                          onChange={(e) => setEditandoMant({...editandoMant, fecha: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Precio (€)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editandoMant.precio}
                          onChange={(e) => setEditandoMant({...editandoMant, precio: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Horas de Vuelo
                        <span className="text-xs text-gray-500 ml-2">(Ej: 10 o 10:30 o 10:30:00)</span>
                      </label>
                      <input
                        type="text"
                        value={editandoMant.horas_vuelo}
                        onChange={(e) => setEditandoMant({...editandoMant, horas_vuelo: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="10 o 10:30 o 10:30:00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                      <textarea
                        value={editandoMant.descripcion}
                        onChange={(e) => setEditandoMant({...editandoMant, descripcion: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Cambio hélice delantera izquierda"
                      />
                    </div>
                    <div className="flex items-center gap-3 pt-4">
                      <button
                        onClick={handleUpdateMantenimiento}
                        disabled={saving}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Guardando...</span>
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            <span>Guardar Cambios</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setShowEditarMant(false);
                          setEditandoMant(null);
                        }}
                        className="inline-flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancelar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DESCARGAS - FUNCIONALES */}
        {activeTab === 'descargas' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Exportar Datos</h3>
            
            <button 
              onClick={handleDescargarDatosTecnicos}
              disabled={generatingPDF}
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-red-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Datos Técnicos (PDF)</p>
                  <p className="text-sm text-gray-500">Información y especificaciones</p>
                </div>
              </div>
              <Download className="h-5 w-5 text-gray-400" />
            </button>

            <button 
              onClick={handleDescargarHistorialVuelosPDF}
              disabled={generatingPDF || vuelos.length === 0}
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-red-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Historial Vuelos (PDF)</p>
                  <p className="text-sm text-gray-500">
                    {vuelos.length > 0 ? `${vuelos.length} vuelos registrados` : 'No hay vuelos'}
                  </p>
                </div>
              </div>
              <Download className="h-5 w-5 text-gray-400" />
            </button>

            <button 
              onClick={handleDescargarHistorialVuelosCSV}
              disabled={vuelos.length === 0}
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Historial Vuelos (CSV)</p>
                  <p className="text-sm text-gray-500">Compatible con Excel</p>
                </div>
              </div>
              <Download className="h-5 w-5 text-gray-400" />
            </button>

            <button 
              onClick={handleDescargarMantenimiento}
              disabled={generatingPDF || mantenimientos.length === 0}
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-red-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Mantenimiento (PDF)</p>
                  <p className="text-sm text-gray-500">
                    {mantenimientos.length > 0 ? `${mantenimientos.length} registros` : 'No hay registros'}
                  </p>
                </div>
              </div>
              <Download className="h-5 w-5 text-gray-400" />
            </button>

            {generatingPDF && (
              <div className="flex items-center justify-center gap-2 text-blue-600 mt-4">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Generando PDF...</span>
              </div>
            )}
          </div>
        )}

        {/* EDITAR */}
        {activeTab === 'editar' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Editar UAS</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="C0">C0</option>
                  <option value="C1">C1</option>
                  <option value="C2">C2</option>
                  <option value="C3">C3</option>
                  <option value="C4">C4</option>
                  <option value="C5">C5</option>
                  <option value="C6">C6</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca y Modelo *</label>
                <input
                  type="text"
                  value={formData.marca_modelo}
                  onChange={(e) => setFormData({...formData, marca_modelo: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="DJI Mavic 3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula *</label>
                <input
                  type="text"
                  value={formData.num_matricula}
                  onChange={(e) => setFormData({...formData, num_matricula: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ES-XXX-XXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Serie</label>
                <input
                  type="text"
                  value={formData.num_serie}
                  onChange={(e) => setFormData({...formData, num_serie: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SN123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alias</label>
                <input
                  type="text"
                  value={formData.alias}
                  onChange={(e) => setFormData({...formData, alias: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Drone principal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Póliza Seguro</label>
                <input
                  type="text"
                  value={formData.poliza}
                  onChange={(e) => setFormData({...formData, poliza: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="POL-12345"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Compra</label>
                <input
                  type="date"
                  value={formData.fecha_compra}
                  onChange={(e) => setFormData({...formData, fecha_compra: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({...formData, precio: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1500.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vida Útil (horas)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.vida_util}
                  onChange={(e) => setFormData({...formData, vida_util: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="activo">Activo</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="reparacion">Reparación</option>
                  <option value="retirado">Retirado</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
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
                className="inline-flex items-center gap-2 border border-gray-200 px-6 py-3 rounded-lg hover:bg-gray-50"
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
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Eliminar UAS</h3>
                  <p className="text-red-700 mb-4">
                    Esta acción es <strong>irreversible</strong>. Se eliminará permanentemente:
                  </p>
                  <ul className="list-disc list-inside text-red-700 space-y-1 mb-6">
                    <li>Todos los datos del UAS</li>
                    <li>Historial de vuelos asociados</li>
                    <li>Registros de mantenimiento</li>
                    <li>Alertas y notificaciones</li>
                  </ul>
                  <div className="bg-white border border-red-300 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>UAS a eliminar:</strong>
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {drone?.marca_modelo} ({drone?.num_matricula})
                    </p>
                  </div>
                  <button
                    onClick={handleDelete}
                    disabled={saving}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
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
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
