'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  // Ocultar navbar en páginas de auth
  const hideNavbar = ['/login', '/register', '/forgot-password'].includes(pathname);
  
  if (hideNavbar) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center">
            <img 
              src="/LogoSkreeo.png" 
              alt="Skreeo" 
              className="h-8"
            />
          </Link>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink href="/dashboard" current={pathname}>
              Dashboard
            </NavLink>
            <NavLink href="/vuelos" current={pathname}>
              Vuelos
            </NavLink>
            <NavLink href="/drones" current={pathname}>
              Drones
            </NavLink>
            <NavLink href="/proyectos" current={pathname}>
              Proyectos
            </NavLink>
            <NavLink href="/pilotos" current={pathname}>
              Pilotos
            </NavLink>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <Link 
              href="/settings" 
              className="text-[#6B7280] hover:text-[#3B82F6] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
            
            {/* Mobile menu button */}
            <button className="md:hidden text-[#6B7280] hover:text-[#3B82F6]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, current, children }: { href: string; current: string; children: React.ReactNode }) {
  const isActive = current === href || current.startsWith(href + '/');
  
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${
        isActive 
          ? 'text-[#3B82F6]' 
          : 'text-[#6B7280] hover:text-[#1F2937]'
      }`}
    >
      {children}
    </Link>
  );
}
