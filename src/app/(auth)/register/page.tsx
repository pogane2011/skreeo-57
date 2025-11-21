'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Plane, Check, Mic, BarChart3, Users, FolderKanban, Shield } from 'lucide-react';

// Características para el lado derecho
const features = [
  {
    icon: Mic,
    title: "Registro por voz",
    description: "Envía un audio por Telegram y listo"
  },
  {
    icon: BarChart3,
    title: "TCO automático",
    description: "Calcula costes por hora de cada UAS"
  },
  {
    icon: Users,
    title: "Gestión de pilotos",
    description: "Controla tu equipo y sus certificaciones"
  },
  {
    icon: FolderKanban,
    title: "Proyectos rentables",
    description: "Conoce el margen real de cada trabajo"
  },
  {
    icon: Shield,
    title: "Cumplimiento AESA",
    description: "Documentación siempre actualizada"
  }
];

// Planes resumidos
const plans = [
  { name: "DESPEGUE", price: "9,95", highlight: false },
  { name: "OPERADOR", price: "29,95", highlight: true },
  { name: "CONTROLADOR", price: "79,95", highlight: false },
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFeature, setCurrentFeature] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  // Animación de características
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.correo,
        password: formData.password,
        options: {
          data: {
            nombre: formData.nombre,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (authData.user) {
        router.push('/onboarding');
      }
    } catch (err) {
      setError('Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
        },
      });

      if (error) {
        setError(error.message);
        setGoogleLoading(false);
      }
    } catch (err) {
      setError('Error al conectar con Google');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado Izquierdo - Formulario */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl bg-[#3B82F6] flex items-center justify-center">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#0F172A]">Skreeo</span>
          </Link>

          {/* Título */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2">
              Crea tu cuenta
            </h1>
            <p className="text-[#64748B]">
              14 días de prueba gratis. Sin tarjeta.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="skreeo-alert skreeo-alert-error mb-6">
              {error}
            </div>
          )}

          {/* Botón Google */}
          <button
            onClick={handleGoogleRegister}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-[#E2E8F0] rounded-lg text-[#0F172A] font-medium hover:bg-[#F8FAFC] transition-colors disabled:opacity-50 mb-6"
          >
            {googleLoading ? (
              <div className="skreeo-spinner border-[#64748B]" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? 'Conectando...' : 'Registrarse con Google'}
          </button>

          {/* Separador */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#94A3B8]">o con email</span>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleEmailRegister} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="skreeo-label">
                Nombre completo
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Juan Pérez"
                required
                className="skreeo-input"
              />
            </div>

            <div>
              <label htmlFor="correo" className="skreeo-label">
                Email
              </label>
              <input
                id="correo"
                name="correo"
                type="email"
                value={formData.correo}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                className="skreeo-input"
              />
            </div>

            <div>
              <label htmlFor="password" className="skreeo-label">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
                className="skreeo-input"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="skreeo-label">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repite la contraseña"
                required
                className="skreeo-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="skreeo-btn-primary w-full py-3"
            >
              {loading ? (
                <>
                  <div className="skreeo-spinner border-white" />
                  Creando cuenta...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          {/* Términos */}
          <p className="text-xs text-[#94A3B8] text-center mt-4">
            Al registrarte, aceptas nuestros{' '}
            <Link href="/terms" className="text-[#3B82F6] hover:underline">Términos de Servicio</Link>
            {' '}y{' '}
            <Link href="/privacy" className="text-[#3B82F6] hover:underline">Política de Privacidad</Link>
          </p>

          {/* Footer */}
          <p className="text-center text-[#64748B] text-sm mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-[#3B82F6] hover:text-[#2563EB] font-medium">
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>

      {/* Lado Derecho - Branding (solo desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1E3A8A] via-[#3B82F6] to-[#0EA5E9] p-12 xl:p-16 flex-col justify-between relative overflow-hidden">
        {/* Patrón decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Header */}
        <div className="relative z-10">
          <h2 className="text-3xl xl:text-4xl font-bold text-white mb-4">
            Todo lo que necesitas para gestionar tu flota
          </h2>
          <p className="text-blue-100 text-lg">
            Únete a cientos de operadores profesionales
          </p>
        </div>

        {/* Features animadas */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="space-y-4 w-full">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = index === currentFeature;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                    isActive 
                      ? 'bg-white/20 backdrop-blur scale-105' 
                      : 'bg-white/5 opacity-60'
                  }`}
                >
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${
                    isActive ? 'bg-white text-[#3B82F6]' : 'bg-white/10 text-white'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{feature.title}</p>
                    <p className="text-sm text-blue-100">{feature.description}</p>
                  </div>
                  {isActive && (
                    <div className="ml-auto">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Planes */}
        <div className="relative z-10">
          <p className="text-sm text-blue-200 mb-3">Planes desde</p>
          <div className="flex gap-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`flex-1 p-3 rounded-xl text-center ${
                  plan.highlight 
                    ? 'bg-white text-[#0F172A]' 
                    : 'bg-white/10 backdrop-blur text-white'
                }`}
              >
                <p className="text-xs font-medium opacity-80">{plan.name}</p>
                <p className="text-lg font-bold">{plan.price}€<span className="text-xs font-normal">/mes</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
