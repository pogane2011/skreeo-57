'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  ChevronDown, 
  Building2, 
  Check, 
  Search, 
  Plus,
  AlertCircle,
  X
} from 'lucide-react';

interface Operador {
  id_operadora: string;
  nombre: string;
  numero_aesa: string | null;
}

interface OperatorSelectorProps {
  currentOperator: Operador;
  pilotoId: number;
}

export default function OperatorSelector({ currentOperator, pilotoId }: OperatorSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [operadores, setOperadores] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [solicitudesPendientes, setSolicitudesPendientes] = useState(0);
  const supabase = createClient();

  // Cargar operadores del usuario
  useEffect(() => {
    loadOperadores();
    loadSolicitudesPendientes();
  }, [pilotoId]);

  const loadOperadores = async () => {
    const { data } = await supabase
      .from('operadora_pilotos')
      .select('*, operadoras(*)')
      .eq('id_piloto', pilotoId)
      .eq('estado_solicitud', 'activo');
    
    if (data) setOperadores(data);
  };

  const loadSolicitudesPendientes = async () => {
    const { count } = await supabase
      .from('operadora_pilotos')
      .select('*', { count: 'exact', head: true })
      .eq('id_piloto', pilotoId)
      .eq('estado_solicitud', 'pendiente');
    
    setSolicitudesPendientes(count || 0);
  };

  const cambiarOperadorActivo = async (operadoraId: string) => {
    setLoading(true);
    
    // Desactivar todos
    await supabase
      .from('operadora_pilotos')
      .update({ operador_activo: false })
      .eq('id_piloto', pilotoId);

    // Activar el seleccionado
    await supabase
      .from('operadora_pilotos')
      .update({ operador_activo: true })
      .eq('id_piloto', pilotoId)
      .eq('id_operadora', operadoraId);

    setLoading(false);
    window.location.reload();
  };

  const buscarOperadores = async () => {
    if (searchQuery.length < 2) return;
    
    setLoading(true);
    const { data } = await supabase
      .from('operadoras')
      .select('*')
      .or(`nombre.ilike.%${searchQuery}%,numero_aesa.ilike.%${searchQuery}%`)
      .limit(10);
    
    setSearchResults(data || []);
    setLoading(false);
  };

  const solicitarAcceso = async (operadoraId: string) => {
    setLoading(true);
    
    const { error } = await supabase
      .from('operadora_pilotos')
      .insert({
        id_operadora: operadoraId,
        id_piloto: pilotoId,
        id_rol: 2, // Rol piloto por defecto
        operador_activo: false,
        estado_solicitud: 'pendiente',
        estado_membresia: 'pendiente'
      });

    if (!error) {
      alert('Solicitud enviada correctamente');
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
      loadSolicitudesPendientes();
    }
    
    setLoading(false);
  };

  return (
    <>
      {/* Selector de operador */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="skreeo-card px-4 py-3 flex items-center gap-3 hover:border-[#3B82F6] transition-colors"
        >
          <div className="h-10 w-10 rounded-full bg-[#DBEAFE] flex items-center justify-center">
            <span className="text-sm font-bold text-[#3B82F6]">
              {currentOperator.nombre?.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-[#0F172A]">
              {currentOperator.nombre}
            </p>
            <p className="text-xs text-[#64748B]">
              {currentOperator.numero_aesa || 'Sin AESA'}
            </p>
          </div>
          <ChevronDown className={`h-4 w-4 text-[#64748B] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          {solicitudesPendientes > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#F59E0B] text-white text-xs font-bold rounded-full flex items-center justify-center">
              {solicitudesPendientes}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-[#E2E8F0] z-50">
            <div className="p-3 border-b border-[#E2E8F0]">
              <p className="text-xs font-semibold text-[#64748B] uppercase">Mis Operadores</p>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {operadores.map((op) => (
                <button
                  key={op.id_operadora}
                  onClick={() => cambiarOperadorActivo(op.id_operadora)}
                  disabled={loading}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-[#3B82F6]">
                      {op.operadoras.nombre?.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-[#0F172A]">
                      {op.operadoras.nombre}
                    </p>
                    <p className="text-xs text-[#64748B]">
                      {op.operadoras.numero_aesa || 'Sin AESA'}
                    </p>
                  </div>
                  {op.operador_activo && (
                    <Check className="h-5 w-5 text-[#10B981]" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-[#E2E8F0]">
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#3B82F6] hover:bg-[#EFF6FF] rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Buscar operador</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de búsqueda */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#0F172A]">Buscar Operador</h3>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Buscador */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && buscarOperadores()}
                  placeholder="Buscar por nombre o número AESA..."
                  className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                />
              </div>
              <button
                onClick={buscarOperadores}
                disabled={loading || searchQuery.length < 2}
                className="mt-3 w-full skreeo-btn-primary"
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>

            {/* Resultados */}
            <div className="p-6 overflow-y-auto max-h-96">
              {searchResults.length === 0 && searchQuery.length >= 2 && !loading && (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-[#94A3B8] mx-auto mb-3" />
                  <p className="text-sm text-[#64748B]">No se encontraron operadores</p>
                </div>
              )}

              <div className="space-y-3">
                {searchResults.map((op) => (
                  <div
                    key={op.id_operadora}
                    className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-lg hover:border-[#3B82F6] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-[#DBEAFE] flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-[#3B82F6]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0F172A]">
                          {op.nombre}
                        </p>
                        <p className="text-xs text-[#64748B]">
                          {op.numero_aesa || 'Sin número AESA'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => solicitarAcceso(op.id_operadora)}
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-[#3B82F6] hover:bg-[#EFF6FF] rounded-lg transition-colors"
                    >
                      Solicitar acceso
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
