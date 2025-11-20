import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plane, BarChart3, Mic, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Skreeo</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/login">
              <Button>Empezar Gratis</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Su Logbook NO es rentable.
            <br />
            <span className="text-blue-600">Skreeo calcula el margen neto real.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Deje de volar a ciegas en costes. Mande un audio por Telegram y conozca, 
            al instante, su rentabilidad. La Fricción Cero para una auditoría sin fallos.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="h-14 px-8 text-lg">
                <Mic className="mr-2 h-5 w-5" />
                Calcular mi Margen Neto (Empezar Gratis)
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
              <Mic className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Manda un audio. Y punto.</h3>
            <p className="text-gray-600">
              Registra vuelos desde el campo en 10 segundos. Sin formularios, sin apps.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">TCO Real-time</h3>
            <p className="text-gray-600">
              Calcula automáticamente costes por hora, proyecto y drone.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics Avanzado</h3>
            <p className="text-gray-600">
              Dashboards estilo Google Analytics con predicciones IA.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <p>© 2025 Skreeo. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-gray-900">Inicio</Link>
            <Link href="#" className="hover:text-gray-900">Precios</Link>
            <Link href="/login" className="hover:text-gray-900">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
