'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Plane, Mic, BarChart3, Clock, Shield, Zap } from 'lucide-react';

// Frases animadas para el lado derecho
const phrases = [
  {
    icon: Mic,
    title: "Manda un audio. Y punto.",
    description: "Registra tus vuelos desde el campo en 10 segundos"
  },
  {
    icon: BarChart3,
    title: "TCO en tiempo real",
    description: "Conoce el coste real de cada hora de vuelo"
  },
  {
    icon: Clock,
    title: "Ahorra 5 horas/semana",
    description: "Automatiza la gestión de tu flota de UAS"
  },
  {
    icon: Shield,
    title: "Cumple con AESA",
    description: "Documentación y reportes siempre al día"
  },
  {
    icon: Zap,
    title: "Decisiones inteligentes",
    description: "Analytics avanzado para maximizar rentabilidad"
  }
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  // Animación de frases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        router.push('/operator');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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

  const CurrentIcon = phrases[currentPhrase].icon;

  return (
    <div className="min-h-screen flex">
      {/* Lado Izquierdo - Formulario */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 bg-white">
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
              Bienvenido de nuevo
            </h1>
            <p className="text-[#64748B]">
              Inicia sesión para gestionar tu flota
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
            onClick={handleGoogleLogin}
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
            {googleLoading ? 'Conectando...' : 'Continuar con Google'}
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
          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="skreeo-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="skreeo-input"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="skreeo-label mb-0">
                  Contraseña
                </label>
                <Link href="/forgot-password" className="text-sm text-[#3B82F6] hover:text-[#2563EB]">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
                  Entrando...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-[#64748B] text-sm mt-8">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-[#3B82F6] hover:text-[#2563EB] font-medium">
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>

      {/* Lado Derecho - Branding (solo desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1E3A8A] via-[#3B82F6] to-[#0EA5E9] p-12 xl:p-16 flex-col justify-between relative overflow-hidden">
        {/* Patrón decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Contenido */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Skreeo</span>
          </div>
          <p className="text-blue-100 text-lg">
            Gestión profesional de flotas UAS
          </p>
        </div>

        {/* Frase animada */}
        <div className="relative z-10 flex-1 flex items-center">
          <div 
            key={currentPhrase}
            className="animate-in"
          >
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-6">
              <CurrentIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl xl:text-4xl font-bold text-white mb-4">
              {phrases[currentPhrase].title}
            </h2>
            <p className="text-xl text-blue-100">
              {phrases[currentPhrase].description}
            </p>
          </div>
        </div>

        {/* Indicadores */}
        <div className="relative z-10 flex gap-2">
          {phrases.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPhrase(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentPhrase 
                  ? 'w-8 bg-white' 
                  : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
