'use client';

import Link from 'next/link';
import { Mic, BarChart3, Zap, Shield, Clock, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img 
                src="/LogoSkreeo.png" 
                alt="Skreeo" 
                className="h-8"
              />
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="text-[#6B7280] hover:text-[#1F2937] font-medium transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link 
                href="/register" 
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
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
          <div className="flex items-center justify-center gap-4">
            <Link 
              href="/register"
              className="inline-flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors"
            >
              <Mic className="h-5 w-5" />
              Calcular mi Margen Neto (Empezar Gratis)
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E7EB]">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
              <Mic className="h-6 w-6 text-[#3B82F6]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Manda un audio. Y punto.</h3>
            <p className="text-[#6B7280]">
              Registra vuelos desde el campo en 10 segundos. Sin formularios, sin apps.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E7EB]">
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-[#1F2937] mb-2">TCO Real-time</h3>
            <p className="text-[#6B7280]">
              Calcula automáticamente costes por hora, proyecto y drone.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E7EB]">
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Analytics Avanzado</h3>
            <p className="text-[#6B7280]">
              Dashboards estilo Google Analytics con predicciones IA.
            </p>
          </div>
        </div>

        {/* Second row of features */}
        <div className="grid md:grid-cols-3 gap-8 mt-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E7EB]">
            <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Cumple AESA</h3>
            <p className="text-[#6B7280]">
              Libro de vuelos digital con todos los campos requeridos por normativa.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E7EB]">
            <div className="h-12 w-12 rounded-lg bg-cyan-100 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-cyan-600" />
            </div>
            <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Depreciación Automática</h3>
            <p className="text-[#6B7280]">
              Rastrea el desgaste de baterías y accesorios en tiempo real.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E7EB]">
            <div className="h-12 w-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Rentabilidad por Proyecto</h3>
            <p className="text-[#6B7280]">
              Sabe exactamente cuánto ganas (o pierdes) en cada trabajo.
            </p>
          </div>
        </div>

        {/* Pricing Preview */}
        <div className="mt-24 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#1F2937] mb-4">
            Planes que crecen contigo
          </h2>
          <p className="text-[#6B7280] mb-12">
            Desde pilotos freelance hasta flotas empresariales
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Plan Despegue */}
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

            {/* Plan Operador */}
            <div className="bg-[#3B82F6] p-6 rounded-xl shadow-lg border-2 border-[#2563EB] transform scale-105">
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

            {/* Plan Controlador */}
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

          <Link 
            href="/pricing"
            className="inline-block mt-8 text-[#3B82F6] hover:text-[#2563EB] font-medium"
          >
            Ver comparativa completa →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-[#E5E7EB]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#6B7280]">
          <p>© 2025 Skreeo. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-[#1F2937]">Términos</Link>
            <Link href="/privacy" className="hover:text-[#1F2937]">Privacidad</Link>
            <Link href="/contact" className="hover:text-[#1F2937]">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
