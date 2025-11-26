import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E5E7EB] py-12 rounded-t-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo y descripción */}
          <div>
            <img src="/LogoSkreeo.png" alt="Skreeo" className="h-8 mb-4" />
            <p className="text-[#6B7280] text-sm">
              Gestión inteligente de flotas de drones
            </p>
          </div>

          {/* Producto */}
          <div>
            <h3 className="font-bold text-[#1F2937] mb-4">Producto</h3>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li>
                <Link href="/pricing" className="hover:text-[#3B82F6] transition-colors">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="hover:text-[#3B82F6] transition-colors">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link href="/#como-funciona" className="hover:text-[#3B82F6] transition-colors">
                  Cómo funciona
                </Link>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="font-bold text-[#1F2937] mb-4">Recursos</h3>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li>
                <Link href="/blog" className="hover:text-[#3B82F6] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/ayuda" className="hover:text-[#3B82F6] transition-colors">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-[#3B82F6] transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-[#1F2937] mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li>
                <Link href="/aviso-legal" className="hover:text-[#3B82F6] transition-colors">
                  Aviso Legal
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-[#3B82F6] transition-colors">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-[#3B82F6] transition-colors">
                  Cookies
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-[#3B82F6] transition-colors">
                  Términos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#E5E7EB] pt-8 text-center text-sm text-[#6B7280]">
          <p>© 2025 Skreeo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
