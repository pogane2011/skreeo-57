'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// CONFIGURACIÓN: Cambia esto a false cuando quieras abrir la web al público
const MAINTENANCE_MODE = true;
const SECRET_KEY = 'skreeo2025'; // URL: skreeo.com?access=skreeo2025

export default function HomePage() {
  const [hasAccess, setHasAccess] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Verificar si tiene acceso por URL o localStorage
    const urlAccess = searchParams.get('access');
    const storedAccess = localStorage.getItem('skreeo_access');
    
    if (urlAccess === SECRET_KEY || storedAccess === SECRET_KEY) {
      localStorage.setItem('skreeo_access', SECRET_KEY);
      setHasAccess(true);
    }
    setLoading(false);
  }, [searchParams]);

  // Si no está en modo mantenimiento o tiene acceso, mostrar la web real
  if (!MAINTENANCE_MODE || hasAccess) {
    return <MainWebsite />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Página de Coming Soon
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#3B82F6] to-[#0EA5E9] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="/LogoSkreeo.png" 
            alt="Skreeo" 
            className="h-16 mx-auto mb-6 brightness-0 invert"
          />
        </div>

        {/* Mensaje */}
        <h1 className="text-4xl font-bold text-white mb-4">
          Estamos despegando 🚁
        </h1>
        <p className="text-xl text-blue-100 mb-8">
          Algo grande está llegando para los pilotos de drones profesionales.
        </p>

        {/* Features preview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur rounded-lg p-3">
            <div className="text-2xl mb-1">📊</div>
            <p className="text-xs text-blue-100">TCO Automático</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-3">
            <div className="text-2xl mb-1">🎤</div>
            <p className="text-xs text-blue-100">Registro por Voz</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-3">
            <div className="text-2xl mb-1">📱</div>
            <p className="text-xs text-blue-100">Bot Telegram</p>
          </div>
        </div>

        {/* Formulario de email */}
        {!submitted ? (
          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <p className="text-white text-sm mb-4">
              Sé el primero en enterarte del lanzamiento
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                onClick={() => {
                  if (email) {
                    // Aquí podrías guardar el email en Supabase
                    setSubmitted(true);
                  }
                }}
                className="px-6 py-3 bg-white text-[#3B82F6] font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                Avisar
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <p className="text-white">
              ✅ ¡Perfecto! Te avisaremos cuando lancemos.
            </p>
          </div>
        )}

        {/* Footer */}
        <p className="text-blue-200 text-sm mt-8">
          © 2025 Skreeo · Gestión inteligente de flotas de drones
        </p>
      </div>
    </div>
  );
}

// ============================================
// LA WEB REAL (se muestra cuando tienes acceso)
// ============================================
import Link from 'next/link';
import { Mic, BarChart3, Zap, Shield, Clock, TrendingUp } from 'lucide-react';

function MainWebsite() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <img src="/LogoSkreeo.png" alt="Skreeo" className="h-8" />
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-[#6B7280] hover:text-[#1F2937] font-medium transition-colors">
                Iniciar Sesión
              </Link>
              <Link href="/register" className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Empezar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1F2937] leading-tight mb-6">
            Su Logbook NO es rentable.
            <br />
            <span className="text-[#3B82F6]">Skreeo calcula el margen neto real.</span>
          </h1>
          <p className="text-xl text-[#6B7280] mb-8 max-w-2xl mx-auto">
            Deje de volar a ciegas en costes. Mande un audio por Telegram y conozca, 
            al instante, su rentabilidad. La Fricción Cero para una auditoría sin fallos.
          </p>
          <Link 
            href="/register"
            className="inline-flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors"
          >
            <Mic className="h-5 w-5" />
            Calcular mi Margen Neto (Empezar Gratis)
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E7EB]">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
              <Mic className="h-6 w-6 text-[#3B82F6]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Manda un audio. Y punto.</h3>
            <p className="text-[#6B7280]">Registra vuelos desde el campo en 10 segundos.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E7EB]">
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-[#1F2937] mb-2">TCO Real-time</h3>
            <p className="text-[#6B7280]">Calcula automáticamente costes por hora, proyecto y drone.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E7EB]">
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Analytics Avanzado</h3>
            <p className="text-[#6B7280]">Dashboards estilo Google Analytics con predicciones IA.</p>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-24 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#1F2937] mb-12">Planes que crecen contigo</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E7EB]">
              <h3 className="text-lg font-semibold text-[#1F2937]">DESPEGUE</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold text-[#1F2937]">14,95€</span>
                <span className="text-[#6B7280]">/mes</span>
              </div>
              <ul className="text-left text-sm text-[#6B7280] space-y-2">
                <li>✓ Vuelos ilimitados</li>
                <li>✓ 1 piloto</li>
                <li>✓ 3 proyectos</li>
                <li>✓ 1 dron con TCO</li>
              </ul>
            </div>
            <div className="bg-[#3B82F6] p-6 rounded-xl shadow-lg transform scale-105">
              <span className="bg-white text-[#3B82F6] text-xs font-bold px-2 py-1 rounded-full">POPULAR</span>
              <h3 className="text-lg font-semibold text-white mt-2">OPERADOR</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold text-white">39,95€</span>
                <span className="text-blue-200">/mes</span>
              </div>
              <ul className="text-left text-sm text-blue-100 space-y-2">
                <li>✓ Vuelos ilimitados</li>
                <li>✓ 3 pilotos</li>
                <li>✓ 15 proyectos</li>
                <li>✓ 3 drones con TCO</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E7EB]">
              <h3 className="text-lg font-semibold text-[#1F2937]">CONTROLADOR</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold text-[#1F2937]">99,95€</span>
                <span className="text-[#6B7280]">/mes</span>
              </div>
              <ul className="text-left text-sm text-[#6B7280] space-y-2">
                <li>✓ Todo ilimitado</li>
                <li>✓ Múltiples operadores</li>
                <li>✓ API + Integraciones</li>
                <li>✓ Soporte prioritario</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-[#E5E7EB]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#6B7280]">
          <p>© 2025 Skreeo. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-[#1F2937]">Términos</Link>
            <Link href="/privacy" className="hover:text-[#1F2937]">Privacidad</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
