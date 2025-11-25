'use client';

import Link from 'next/link';
import { Target, Users, Zap, Shield, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <img src="/LogoSkreeo.png" alt="Skreeo" className="h-8" />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/#como-funciona" className="text-[#6B7280] hover:text-[#1F2937] font-medium transition-colors">
                Cómo funciona
              </Link>
              <Link href="/pricing" className="text-[#6B7280] hover:text-[#1F2937] font-medium transition-colors">
                Precios
              </Link>
              <Link href="/sobre-nosotros" className="text-[#3B82F6] font-medium">
                Sobre nosotros
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-[#6B7280] hover:text-[#1F2937] font-medium transition-colors">
                Iniciar Sesión
              </Link>
              <Link href="/pricing" className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap">
                Empezar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#1F2937] mb-6">
              Nacimos para que los pilotos <span className="text-[#3B82F6]">ganen dinero de verdad</span>
            </h1>
            <p className="text-xl text-[#6B7280] leading-relaxed">
              Vimos cómo operadores profesionales perdían miles de euros en costes ocultos. 
              Decidimos cambiar eso para siempre.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-[#1F2937] mb-6">
              El problema que nos obsesionó
            </h2>
            <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
              En 2024, un piloto profesional nos contó algo que nos dejó helados: 
              <strong className="text-[#1F2937]"> "Cobro 800€ por vuelo, pero no sé si realmente gano dinero."</strong>
            </p>
            <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
              Tenía razón. Nadie calculaba el TCO real de sus drones. Nadie controlaba la depreciación de las baterías. 
              Nadie sumaba desplazamientos, seguros, mantenimientos. 
            </p>
            <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
              El resultado: <strong className="text-[#1F2937]">pilotos trabajando a pérdida sin saberlo.</strong>
            </p>
            <p className="text-lg text-[#6B7280] leading-relaxed">
              Ahí nació Skreeo: una herramienta que calcula el margen neto real de cada vuelo, 
              automáticamente, sin Excel, sin complicaciones. 
              <strong className="text-[#1F2937]"> Solo un audio de voz. Y punto.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E5E7EB]">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-[#3B82F6]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1F2937] mb-4">
                Nuestra Misión
              </h3>
              <p className="text-lg text-[#6B7280] leading-relaxed">
                Que cada piloto profesional conozca su rentabilidad real. Sin Excel, sin cálculos manuales, 
                sin perder horas cada mes. Automatizar el TCO para que los pilotos hagan lo que saben: volar.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E5E7EB]">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-[#1F2937] mb-4">
                Nuestra Visión
              </h3>
              <p className="text-lg text-[#6B7280] leading-relaxed">
                Convertirnos en el ERP de referencia para operadores de drones en España y Europa. 
                Que Skreeo sea sinónimo de gestión profesional de flotas aéreas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] mb-4">
              Nuestros Valores
            </h2>
            <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
              Los principios que guían cada decisión que tomamos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-[#3B82F6]" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2937] mb-3">
                Fricción Cero
              </h3>
              <p className="text-[#6B7280]">
                Si algo toma más de 10 segundos, lo rediseñamos. 
                Nuestros usuarios están en el campo, no tienen tiempo que perder.
              </p>
            </div>

            {/* Value 2 */}
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2937] mb-3">
                Transparencia Total
              </h3>
              <p className="text-[#6B7280]">
                Sin trucos, sin letra pequeña, sin costes ocultos. 
                Lo que ves es lo que pagas. Siempre.
              </p>
            </div>

            {/* Value 3 */}
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2937] mb-3">
                Obsesión Cliente
              </h3>
              <p className="text-[#6B7280]">
                Cada feature que creamos nace de problemas reales de pilotos reales. 
                No inventamos necesidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team (Opcional - Puedes personalizarlo) */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] mb-4">
              El Equipo
            </h2>
            <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
              Un equipo pequeño con un objetivo grande: cambiar cómo los pilotos gestionan su negocio
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-lg border border-[#E5E7EB] text-center">
            <div className="text-6xl mb-4">👨‍💻</div>
            <h3 className="text-2xl font-bold text-[#1F2937] mb-2">
              Abraham
            </h3>
            <p className="text-[#3B82F6] font-medium mb-4">
              Fundador & CEO
            </p>
            <p className="text-[#6B7280] leading-relaxed">
              Piloto profesional cansado de perder dinero sin saberlo. 
              Construyó Skreeo después de pasar 6 meses intentando calcular su TCO en Excel. 
              Ahora lo hace en 10 segundos con un audio.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-[#3B82F6] to-[#2563EB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            ¿Listo para unirte a la revolución?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Cientos de pilotos ya están controlando su rentabilidad con Skreeo. Tú puedes ser el siguiente.
          </p>
          <Link 
            href="/pricing"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[#3B82F6] px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-xl"
          >
            <span>Empezar gratis 14 días</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F2937] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/LogoSkreeo.png" alt="Skreeo" className="h-8 mb-4 brightness-0 invert" />
              <p className="text-gray-400 text-sm">
                Gestión inteligente de flotas de drones
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Producto</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/#como-funciona" className="hover:text-white">Cómo funciona</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Precios</Link></li>
                <li><Link href="/sobre-nosotros" className="hover:text-white">Sobre nosotros</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Recursos</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/ayuda" className="hover:text-white">Centro de ayuda</Link></li>
                <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/aviso-legal" className="hover:text-white">Aviso Legal</Link></li>
                <li><Link href="/privacidad" className="hover:text-white">Privacidad</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Cookies</Link></li>
                <li><Link href="/terminos" className="hover:text-white">Términos</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 Skreeo. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
