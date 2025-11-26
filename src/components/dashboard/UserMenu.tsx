'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Settings,
  CreditCard,
  Star,
  HelpCircle,
  MessageSquare,
  LogOut,
  ChevronDown,
} from 'lucide-react';

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    initials: string;
    plan: string;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    // TODO: Implementar logout con Supabase
    router.push('/login');
  };

  const menuItems = [
    {
      section: 'Cuenta',
      items: [
        { icon: User, label: 'Mi Perfil', href: '/profile' },
        { icon: Settings, label: 'Configuración', href: '/settings' },
        { icon: CreditCard, label: 'Facturación', href: '/billing' },
        { icon: Star, label: 'Mejorar Plan', href: '/pricing', highlight: true },
      ],
    },
    {
      section: 'Soporte',
      items: [
        { icon: HelpCircle, label: 'Centro de Ayuda', href: '/help' },
        { icon: MessageSquare, label: 'Vincular Telegram', href: '/settings?tab=integrations' },
      ],
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors w-full"
      >
        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
          {user.initials}
        </div>
        <div className="flex-1 min-w-0 text-left hidden lg:block">
          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
        <ChevronDown
          className={`hidden lg:block h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* Header del menú */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
                {user.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Plan {user.plan}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Secciones del menú */}
          {menuItems.map((section, sectionIdx) => (
            <div key={sectionIdx} className="py-2">
              <div className="px-4 py-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section.section}
                </p>
              </div>
              <div className="space-y-1 px-2">
                {section.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={itemIdx}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        item.highlight
                          ? 'text-blue-700 bg-blue-50 hover:bg-blue-100'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${item.highlight ? 'text-blue-700' : 'text-gray-400'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Logout */}
          <div className="pt-2 border-t border-gray-200 px-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
