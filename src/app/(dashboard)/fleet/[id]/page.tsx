'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { 
  ArrowLeft,
  MoreHorizontal,
  Info,
  Wrench,
  Download,
  Pencil,
  Trash2,
  FileText,
  FileSpreadsheet,
  Plane,
  Calendar,
  Clock,
  Euro,
  Shield,
  Hash,
  Tag,
  Plus,
  X
} from 'lucide-react';

export const dynamic = 'force-dynamic';

// Tipos
interface UAS {
  id_drone: number;
  marca_modelo: string;
  matricula: string;
  alias: string | null;
  categoria: string | null;
  numero_serie: string | null;
  poliza_seguro: string | null;
  precio: number | null;
  fecha_compra: string | null;
  horas_uso: number;
  vida_util_estimada: number | null;
  tco_por_hora: number | null;
  activo: boolean;
}

interface Mantenimiento {
  id: number;
  fecha: string;
  precio: number;
  horas_vuelo: number;
  descripcion: string;
}

export default function UASDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [uas, setUAS] = useState<UAS | null>(null);
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [showActions, setShowActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: uasData } = await supabase
        .from('drones')
        .select('*')
        .eq('id_drone', params.id)
        .single();
      
      if (uasData) {
        setUAS(uasData);
      }

      const { data: mantData } = await supabase
        .from('mantenimiento')
        .select('*')
        .eq('id_drone', params.id)
        .order('fecha', { ascending: false });
      
      if (mantData) {
        setMantenimientos(mantData);
      }

      setLoading(false);
    };

    fetchData();
  }, [params.id]);

  const handleDelete = async () => {
    await supabase.from('drones').delete().eq('id_drone', params.id);
    router.push('/fleet');
  };

  // Calcular salud
  const getSalud = () => {
    if (!uas?.vida_util_estimada || uas.vida_util_estimada === 0) return 100;
    const usado = Math.round((uas.horas_uso / uas.vida_util_estimada) * 100);
    return Math.max(0, 100 - usado);
  };

  const salud = getSalud();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="skreeo-spinner border-[#3B82F6]"></div>
      </div>
    );
  }

  if (!uas) {
    return (
      <div className="empty-state py-20">
        <Plane className="empty-state-icon" />
        <p className="empty-state-title">UAS no encontrado</p>
        <Link href="/fleet" className="skreeo-btn-primary mt-4">
          Volver a Mi Flota
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Info },
    { id: 'operacional', label: 'Operacional', icon: Clock },
    { id: 'mantenimiento', label: 'Mantenimiento', icon: Wrench },
    { id: 'descargas', label: 'Descargas', icon: Download },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="detail-header">
        <Link href="/fleet" className="detail-back">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        
        <div className="detail-title">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-[#DBEAFE] flex items-center justify-center">
              <Plane className="h-6 w-6 text-[#3B82F6]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0F172A]">{uas.marca_modelo}</h1>
              <p className="text-sm text-[#64748B]">
                {uas.alias ? `${uas.alias} · ` : ''}{uas.matricula}
              </p>
            </div>
            {uas.categoria && (
              <span className="skreeo-badge skreeo-badge-info ml-2">
                {uas.categoria}
              </span>
            )}
          </div>
        </div>

        {/* Botón Acciones */}
        <div className="detail-actions relative">
          <span className={`skreeo-badge ${uas.activo ? 'skreeo-badge-success' : 'skreeo-badge-neutral'} mr-2`}>
            {uas.activo ? 'Activo' : 'Inactivo'}
          </span>
          
          <button 
            onClick={() => setShowActions(!showActions)}
            className="skreeo-btn-secondary"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Acciones</span>
          </button>

          {/* Dropdown Acciones */}
          {showActions && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowActions(false)}
              />
              <div className="skreeo-dropdown animate-fade-in">
                <Link 
                  href={`/fleet/${uas.id_drone}/edit`}
                  className="skreeo-dropdown-item"
                  onClick={() => setShowActions(false)}
                >
                  <Pencil className="h-4 w-4" />
                  <span>Editar UAS</span>
                </Link>
                <button className="skreeo-dropdown-item w-full">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Descargar CSV</span>
                </button>
                <button className="skreeo-dropdown-item w-full">
                  <FileText className="h-4 w-4" />
                  <span>Descargar PDF</span>
                </button>
                <div className="skreeo-dropdown-divider" />
                <button 
                  onClick={() => {
                    setShowActions(false);
                    setShowDeleteModal(true);
                  }}
                  className="skreeo-dropdown-item-danger w-full"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Eliminar UAS</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="skreeo-tabs overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`skreeo-tab flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id ? 'skreeo-tab-active' : ''
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenido Tab General */}
      {activeTab === 'general' && (
        <div className="space-y-6 animate-in">
          <div className="detail-section">
            <div className="skreeo-card-header">
              <h3 className="detail-section-title">
                <Info className="h-5 w-5 text-[#3B82F6]" />
                Información General
              </h3>
            </div>
            <div className="skreeo-card-body">
              <div className="detail-grid">
                <div>
                  <p className="detail-label">Categoría</p>
                  <p className="detail-value">{uas.categoria || '-'}</p>
                </div>
                <div>
                  <p className="detail-label">Marca / Modelo</p>
                  <p className="detail-value">{uas.marca_modelo}</p>
                </div>
                <div>
                  <p className="detail-label">Alias</p>
                  <p className="detail-value">{uas.alias || '-'}</p>
                </div>
                <div>
                  <p className="detail-label">Nº Serie</p>
                  <p className="detail-value font-mono">{uas.numero_serie || '-'}</p>
                </div>
                <div>
                  <p className="detail-label">Nº Matrícula</p>
                  <p className="detail-value font-mono">{uas.matricula}</p>
                </div>
                <div>
                  <p className="detail-label">Póliza Seguro</p>
                  <p className="detail-value">
                    {uas.poliza_seguro ? (
                      <span className="skreeo-badge skreeo-badge-success">Activa</span>
                    ) : (
                      <span className="skreeo-badge skreeo-badge-warning">Sin póliza</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="detail-label">Precio Adquisición</p>
                  <p className="detail-value">{uas.precio ? `${uas.precio.toLocaleString()} €` : '-'}</p>
                </div>
                <div>
                  <p className="detail-label">Fecha Compra</p>
                  <p className="detail-value">
                    {uas.fecha_compra ? new Date(uas.fecha_compra).toLocaleDateString('es-ES') : '-'}
                  </p>
                </div>
                <div>
                  <p className="detail-label">Vida Útil Estimada</p>
                  <p className="detail-value">{uas.vida_util_estimada ? `${uas.vida_util_estimada}h` : '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido Tab Operacional */}
      {activeTab === 'operacional' && (
        <div className="space-y-6 animate-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="kpi-card">
              <div className="kpi-icon kpi-icon-info">
                <Euro className="h-6 w-6" />
              </div>
              <p className="kpi-value">{(uas.tco_por_hora || 0).toFixed(2)} €</p>
              <p className="kpi-label">TCO / Hora</p>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon kpi-icon-purple">
                <Clock className="h-6 w-6" />
              </div>
              <p className="kpi-value">{(uas.horas_uso || 0).toFixed(2)}h</p>
              <p className="kpi-label">Horas Voladas</p>
            </div>
            <div className="kpi-card">
              <div className={`kpi-icon ${salud >= 50 ? 'kpi-icon-success' : 'kpi-icon-warning'}`}>
                <Shield className="h-6 w-6" />
              </div>
              <p className="kpi-value">{salud}%</p>
              <p className="kpi-label">Salud</p>
              <div className="skreeo-progress mt-3">
                <div 
                  className={`skreeo-progress-bar ${
                    salud >= 50 ? 'skreeo-progress-success' : 
                    salud >= 20 ? 'skreeo-progress-warning' : 'skreeo-progress-error'
                  }`}
                  style={{ width: `${salud}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido Tab Mantenimiento */}
      {activeTab === 'mantenimiento' && (
        <div className="space-y-6 animate-in">
          <div className="skreeo-card">
            <div className="skreeo-card-header flex items-center justify-between">
              <h3 className="detail-section-title">
                <Wrench className="h-5 w-5 text-[#3B82F6]" />
                Libro de Mantenimiento
              </h3>
              <button className="skreeo-btn-primary skreeo-btn-sm">
                <Plus className="h-4 w-4" />
                <span>Añadir</span>
              </button>
            </div>
            <div className="skreeo-card-body p-0">
              {mantenimientos.length > 0 ? (
                <div className="divide-y divide-[#E2E8F0]">
                  {mantenimientos.map((mant) => (
                    <div key={mant.id} className="p-4 hover:bg-[#F8FAFC] transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-medium text-[#0F172A]">
                              {new Date(mant.fecha).toLocaleDateString('es-ES')}
                            </span>
                            <span className="text-sm text-[#64748B]">
                              {mant.horas_vuelo}h de vuelo
                            </span>
                          </div>
                          <p className="text-sm text-[#475569]">{mant.descripcion}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#0F172A]">
                            {mant.precio.toFixed(2)} €
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state py-12">
                  <Wrench className="empty-state-icon" />
                  <p className="empty-state-title">Sin registros de mantenimiento</p>
                  <p className="empty-state-description">
                    Añade el primer registro de mantenimiento
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contenido Tab Descargas */}
      {activeTab === 'descargas' && (
        <div className="space-y-6 animate-in">
          <div className="skreeo-card">
            <div className="skreeo-card-header">
              <h3 className="detail-section-title">
                <Download className="h-5 w-5 text-[#3B82F6]" />
                Descargas
              </h3>
            </div>
            <div className="skreeo-card-body space-y-4">
              <div>
                <label className="skreeo-label">Rango de fechas (para Historial de Vuelos)</label>
                <select className="skreeo-select">
                  <option>Todos los registros</option>
                  <option>Último mes</option>
                  <option>Últimos 3 meses</option>
                  <option>Último año</option>
                </select>
              </div>
              
              <div>
                <label className="skreeo-label">Información incluida</label>
                <div className="space-y-2 mt-2">
                  {['Datos técnicos del UAS', 'Historial de vuelos', 'Registros de mantenimiento', 'Alarmas configuradas'].map((item) => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 rounded border-[#E2E8F0] text-[#3B82F6] focus:ring-[#3B82F6]" />
                      <span className="text-sm text-[#475569]">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button className="skreeo-btn-primary">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Descargar CSV</span>
                </button>
                <button className="skreeo-btn-secondary">
                  <FileText className="h-4 w-4" />
                  <span>Descargar PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="skreeo-card max-w-md w-full animate-in">
            <div className="skreeo-card-header flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#EF4444] flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Eliminar UAS
              </h3>
              <button onClick={() => setShowDeleteModal(false)} className="skreeo-btn-icon">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="skreeo-card-body">
              <div className="skreeo-alert skreeo-alert-error mb-4">
                <strong>¡Acción irreversible!</strong>
                <p className="mt-1">Esta acción eliminará permanentemente el UAS <strong>{uas.marca_modelo}</strong> ({uas.alias}) y todos sus datos asociados:</p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Historial de vuelos</li>
                  <li>• Registros de mantenimiento</li>
                  <li>• Configuraciones de alarmas</li>
                  <li>• Datos técnicos y documentación</li>
                </ul>
              </div>
              
              <div className="bg-[#F8FAFC] rounded-lg p-4 mb-4">
                <p className="text-sm text-[#64748B]">Información del UAS a eliminar:</p>
                <p className="text-sm font-medium text-[#0F172A] mt-1">
                  Marca/Modelo: {uas.marca_modelo}
                </p>
                <p className="text-sm font-medium text-[#0F172A]">
                  Matrícula: {uas.matricula}
                </p>
                <p className="text-sm font-medium text-[#0F172A]">
                  Alias: {uas.alias || '-'}
                </p>
              </div>
            </div>
            <div className="skreeo-card-footer flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="skreeo-btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete}
                className="skreeo-btn-danger flex-1"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
