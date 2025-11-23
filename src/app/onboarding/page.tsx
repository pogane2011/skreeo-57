'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Check, Send, Building2, Search, Plane } from 'lucide-react';

// Pasos del onboarding
const STEPS = {
  TELEGRAM: 1,
  OPERADORA: 2,
  DRONE: 3,
  COMPLETADO: 4,
};

function OnboardingContent() {
  const [currentStep, setCurrentStep] = useState(STEPS.TELEGRAM);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  // Estado Telegram
  const [telegramCode, setTelegramCode] = useState('');
  const [telegramLinked, setTelegramLinked] = useState(false);
  const [checkingTelegram, setCheckingTelegram] = useState(false);

  // Estado Operadora
  const [operadoraMode, setOperadoraMode] = useState<'create' | 'join' | null>(null);
  const [operadoraForm, setOperadoraForm] = useState({
    nombre: '',
    numero_aesa: '',
    telefono: '',
    direccion: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [operadorasDisponibles, setOperadorasDisponibles] = useState<any[]>([]);
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);

  // Estado Drone (opcional)
  const [skipDrone, setSkipDrone] = useState(false);
  const [droneForm, setDroneForm] = useState({
    marca_modelo: '',
    matricula: '',
    numero_serie: '',
  });

  // Verificar usuario y generar código Telegram al cargar
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);

      // Generar código en servidor
      try {
        const response = await fetch('/api/telegram/generate-code', {
          method: 'POST',
        });
        const data = await response.json();
        
        if (data.code) {
          setTelegramCode(data.code);
        }
      } catch (error) {
        console.error('Error generating code:', error);
      }

      // Verificar si ya tiene Telegram vinculado
      checkTelegramLink();
    };

    init();
  }, []);

  // Verificar si Telegram ya está vinculado
  const checkTelegramLink = async () => {
    if (!user) return;

    setCheckingTelegram(true);

    try {
      const response = await fetch('/api/telegram/check-link');
      const data = await response.json();

      if (data.linked) {
        setTelegramLinked(true);
        setCurrentStep(STEPS.OPERADORA);
      }
    } catch (error) {
      console.error('Error checking telegram:', error);
    } finally {
      setCheckingTelegram(false);
    }
  };

  // Paso 1: Vincular Telegram
  const handleTelegramStep = () => {
    if (telegramLinked) {
      setCurrentStep(STEPS.OPERADORA);
    } else {
      // Verificar cada 3 segundos si ya vinculó
      const interval = setInterval(checkTelegramLink, 3000);
      return () => clearInterval(interval);
    }
  };

  // Paso 2: Crear operadora
  const handleCreateOperadora = async () => {
    setLoading(true);

    try {
      // Crear operadora
      const { data: operadora, error: opError } = await supabase
        .from('operadoras')
        .insert({
          nombre: operadoraForm.nombre,
          numero_aesa: operadoraForm.numero_aesa,
          telefono: operadoraForm.telefono,
          direccion: operadoraForm.direccion,
          email: user.email,
          activa: true,
        })
        .select()
        .single();

      if (opError) throw opError;

      // Crear piloto si no existe
      const { data: pilotoExistente } = await supabase
        .from('pilotos')
        .select('id_piloto')
        .eq('id_piloto', user.id)
        .single();

      if (!pilotoExistente) {
        await supabase.from('pilotos').insert({
          id_piloto: user.id,
          nombre: user.user_metadata?.nombre || user.email?.split('@')[0] || 'Usuario',
          email: user.email,
          plan_activo: true,
          vuelos_restantes: 99999,
        });
      }

      // Vincular piloto con operadora (como admin)
      await supabase.from('operador_pilotos').insert({
        id_operadora: operadora.id_operadora,
        id_piloto: user.id,
        id_rol: 1, // Admin
        operador_activo: true,
        estado_membresia: 'activo',
      });

      setCurrentStep(STEPS.DRONE);
    } catch (error) {
      console.error('Error creando operadora:', error);
      alert('Error al crear operadora. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Buscar operadoras
  const handleSearchOperadoras = async () => {
    if (!searchQuery) return;

    const { data } = await supabase
      .from('operadoras')
      .select('id_operadora, nombre, numero_aesa')
      .ilike('nombre', `%${searchQuery}%`)
      .eq('activa', true)
      .limit(10);

    setOperadorasDisponibles(data || []);
  };

  // Paso 2: Solicitar unirse a operadora
  const handleJoinOperadora = async (idOperadora: string) => {
    setLoading(true);

    try {
      // Crear piloto si no existe
      const { data: pilotoExistente } = await supabase
        .from('pilotos')
        .select('id_piloto')
        .eq('id_piloto', user.id)
        .single();

      if (!pilotoExistente) {
        await supabase.from('pilotos').insert({
          id_piloto: user.id,
          nombre: user.user_metadata?.nombre || user.email?.split('@')[0] || 'Usuario',
          email: user.email,
          plan_activo: true,
          vuelos_restantes: 99999,
        });
      }

      // Solicitar acceso (estado: pendiente)
      await supabase.from('operador_pilotos').insert({
        id_operadora: idOperadora,
        id_piloto: user.id,
        id_rol: 2, // Piloto
        operador_activo: false,
        estado_membresia: 'pendiente',
      });

      setSolicitudEnviada(true);
    } catch (error) {
      console.error('Error solicitando acceso:', error);
      alert('Error al solicitar acceso. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Paso 3: Añadir drone
  const handleAddDrone = async () => {
    if (skipDrone) {
      setCurrentStep(STEPS.COMPLETADO);
      return;
    }

    setLoading(true);

    try {
      // Obtener operadora del usuario
      const { data: operadorPiloto } = await supabase
        .from('operador_pilotos')
        .select('id_operadora')
        .eq('id_piloto', user.id)
        .eq('estado_membresia', 'activo')
        .single();

      if (!operadorPiloto) {
        throw new Error('No se encontró operadora activa');
      }

      // Crear drone
      await supabase.from('drones').insert({
        id_operadora: operadorPiloto.id_operadora,
        marca_modelo: droneForm.marca_modelo,
        matricula: droneForm.matricula,
        numero_serie: droneForm.numero_serie,
        activo: true,
        horas_uso: 0,
      });

      setCurrentStep(STEPS.COMPLETADO);
    } catch (error) {
      console.error('Error añadiendo drone:', error);
      alert('Error al añadir drone. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Completado: redirigir a dashboard
  useEffect(() => {
    if (currentStep === STEPS.COMPLETADO) {
      setTimeout(() => {
        router.push('/operator');
      }, 2000);
    }
  }, [currentStep]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="h-12 w-12 animate-spin text-[#3B82F6]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                  step <= currentStep
                    ? 'bg-[#3B82F6] text-white'
                    : 'bg-white border-2 border-[#E5E7EB] text-[#6B7280]'
                }`}
              >
                {step < currentStep ? <Check className="h-5 w-5" /> : step}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-[#6B7280]">
            <span>Telegram</span>
            <span>Operadora</span>
            <span>Drone</span>
          </div>
        </div>

        {/* Contenido por paso */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-8">
          {/* PASO 1: TELEGRAM */}
          {currentStep === STEPS.TELEGRAM && (
            <div className="text-center">
              <div className="text-6xl mb-6">📱</div>
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                Vincula tu Telegram
              </h2>
              <p className="text-[#6B7280] mb-8">
                Registra tus vuelos enviando audios al bot de Telegram
              </p>

              <div className="bg-[#F1F5F9] rounded-xl p-6 mb-6">
                <p className="text-sm text-[#6B7280] mb-3">
                  1. Abre Telegram y busca:
                </p>
                <p className="text-2xl font-bold text-[#3B82F6] mb-6">
                  @Skreeo_Bot
                </p>

                <p className="text-sm text-[#6B7280] mb-3">
                  2. Envía este comando:
                </p>
                <div className="bg-white rounded-lg px-4 py-3 font-mono text-[#3B82F6] text-xl mb-3">
                  /vincular {telegramCode}
                </div>

                <p className="text-xs text-[#9CA3AF]">
                  El código expira en 10 minutos
                </p>
              </div>

              {checkingTelegram ? (
                <div className="flex items-center justify-center gap-2 text-[#6B7280]">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Esperando vinculación...
                </div>
              ) : telegramLinked ? (
                <button
                  onClick={() => setCurrentStep(STEPS.OPERADORA)}
                  className="skreeo-btn-primary w-full"
                >
                  Continuar
                </button>
              ) : (
                <button
                  onClick={handleTelegramStep}
                  className="skreeo-btn-secondary w-full"
                >
                  Verificar vinculación
                </button>
              )}

              <p className="text-xs text-[#9CA3AF] mt-4">
                Puedes hacerlo más tarde desde Ajustes
              </p>
            </div>
          )}

          {/* PASO 2: OPERADORA */}
          {currentStep === STEPS.OPERADORA && !operadoraMode && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                ¿Qué quieres hacer?
              </h2>
              <p className="text-[#6B7280] mb-8">
                Elige cómo quieres usar Skreeo
              </p>

              <div className="grid gap-4">
                <button
                  onClick={() => setOperadoraMode('create')}
                  className="p-6 border-2 border-[#E5E7EB] rounded-xl hover:border-[#3B82F6] transition-all text-left"
                >
                  <Building2 className="h-8 w-8 text-[#3B82F6] mb-3" />
                  <h3 className="font-semibold text-[#1F2937] mb-1">
                    Crear mi operadora
                  </h3>
                  <p className="text-sm text-[#6B7280]">
                    Administra tu propia flota de drones
                  </p>
                </button>

                <button
                  onClick={() => setOperadoraMode('join')}
                  className="p-6 border-2 border-[#E5E7EB] rounded-xl hover:border-[#3B82F6] transition-all text-left"
                >
                  <Search className="h-8 w-8 text-[#3B82F6] mb-3" />
                  <h3 className="font-semibold text-[#1F2937] mb-1">
                    Unirme a una operadora
                  </h3>
                  <p className="text-sm text-[#6B7280]">
                    Trabaja como piloto en una operadora existente
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* PASO 2A: CREAR OPERADORA */}
          {currentStep === STEPS.OPERADORA && operadoraMode === 'create' && (
            <div>
              <h2 className="text-2xl font-bold text-[#1F2937] mb-6">
                Crea tu operadora
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="skreeo-label">Nombre de la operadora *</label>
                  <input
                    type="text"
                    value={operadoraForm.nombre}
                    onChange={(e) => setOperadoraForm({ ...operadoraForm, nombre: e.target.value })}
                    placeholder="Mi Empresa de Drones S.L."
                    className="skreeo-input"
                  />
                </div>

                <div>
                  <label className="skreeo-label">Número AESA</label>
                  <input
                    type="text"
                    value={operadoraForm.numero_aesa}
                    onChange={(e) => setOperadoraForm({ ...operadoraForm, numero_aesa: e.target.value })}
                    placeholder="AESA-OP-XXXX"
                    className="skreeo-input"
                  />
                </div>

                <div>
                  <label className="skreeo-label">Teléfono</label>
                  <input
                    type="tel"
                    value={operadoraForm.telefono}
                    onChange={(e) => setOperadoraForm({ ...operadoraForm, telefono: e.target.value })}
                    placeholder="+34 600 000 000"
                    className="skreeo-input"
                  />
                </div>

                <div>
                  <label className="skreeo-label">Dirección</label>
                  <input
                    type="text"
                    value={operadoraForm.direccion}
                    onChange={(e) => setOperadoraForm({ ...operadoraForm, direccion: e.target.value })}
                    placeholder="Calle, Ciudad, CP"
                    className="skreeo-input"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setOperadoraMode(null)}
                  className="skreeo-btn-secondary flex-1"
                  disabled={loading}
                >
                  Atrás
                </button>
                <button
                  onClick={handleCreateOperadora}
                  disabled={!operadoraForm.nombre || loading}
                  className="skreeo-btn-primary flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    'Crear operadora'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* PASO 2B: UNIRSE A OPERADORA */}
          {currentStep === STEPS.OPERADORA && operadoraMode === 'join' && !solicitudEnviada && (
            <div>
              <h2 className="text-2xl font-bold text-[#1F2937] mb-6">
                Buscar operadora
              </h2>

              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nombre de la operadora..."
                  className="skreeo-input flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchOperadoras()}
                />
                <button
                  onClick={handleSearchOperadoras}
                  className="skreeo-btn-primary"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>

              {operadorasDisponibles.length > 0 && (
                <div className="space-y-2 mb-6">
                  {operadorasDisponibles.map((op) => (
                    <div
                      key={op.id_operadora}
                      className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-lg hover:border-[#3B82F6] transition-all"
                    >
                      <div>
                        <p className="font-medium text-[#1F2937]">{op.nombre}</p>
                        <p className="text-sm text-[#6B7280]">{op.numero_aesa || 'Sin número AESA'}</p>
                      </div>
                      <button
                        onClick={() => handleJoinOperadora(op.id_operadora)}
                        disabled={loading}
                        className="skreeo-btn-primary"
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Solicitar acceso'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setOperadoraMode(null)}
                className="skreeo-btn-secondary w-full"
              >
                Atrás
              </button>
            </div>
          )}

          {/* SOLICITUD ENVIADA */}
          {solicitudEnviada && (
            <div className="text-center py-8">
              <div className="text-6xl mb-6">✉️</div>
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                ¡Solicitud enviada!
              </h2>
              <p className="text-[#6B7280] mb-8">
                El administrador de la operadora revisará tu solicitud.<br />
                Te notificaremos cuando sea aprobada.
              </p>
              <button
                onClick={() => router.push('/operator')}
                className="skreeo-btn-primary"
              >
                Ir al dashboard
              </button>
            </div>
          )}

          {/* PASO 3: DRONE */}
          {currentStep === STEPS.DRONE && (
            <div>
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                Añade tu primer drone
              </h2>
              <p className="text-[#6B7280] mb-6">
                Opcional - puedes hacerlo más tarde desde el dashboard
              </p>

              {!skipDrone ? (
                <div className="space-y-4">
                  <div>
                    <label className="skreeo-label">Marca y modelo *</label>
                    <input
                      type="text"
                      value={droneForm.marca_modelo}
                      onChange={(e) => setDroneForm({ ...droneForm, marca_modelo: e.target.value })}
                      placeholder="DJI Mavic 3"
                      className="skreeo-input"
                    />
                  </div>

                  <div>
                    <label className="skreeo-label">Matrícula *</label>
                    <input
                      type="text"
                      value={droneForm.matricula}
                      onChange={(e) => setDroneForm({ ...droneForm, matricula: e.target.value })}
                      placeholder="ES-XXX-XXX"
                      className="skreeo-input"
                    />
                  </div>

                  <div>
                    <label className="skreeo-label">Número de serie</label>
                    <input
                      type="text"
                      value={droneForm.numero_serie}
                      onChange={(e) => setDroneForm({ ...droneForm, numero_serie: e.target.value })}
                      placeholder="SN123456789"
                      className="skreeo-input"
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setSkipDrone(true)}
                      className="skreeo-btn-secondary flex-1"
                    >
                      Omitir
                    </button>
                    <button
                      onClick={handleAddDrone}
                      disabled={!droneForm.marca_modelo || !droneForm.matricula || loading}
                      className="skreeo-btn-primary flex-1"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        'Añadir drone'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleAddDrone}
                  className="skreeo-btn-primary w-full"
                >
                  Continuar
                </button>
              )}
            </div>
          )}

          {/* PASO 4: COMPLETADO */}
          {currentStep === STEPS.COMPLETADO && (
            <div className="text-center py-8">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
                ¡Todo listo!
              </h2>
              <p className="text-[#6B7280] mb-8">
                Tu cuenta está configurada.<br />
                Redirigiendo al dashboard...
              </p>
              <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6] mx-auto" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="h-12 w-12 animate-spin text-[#3B82F6]" />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
