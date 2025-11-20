# 🚁 Skreeo - Gestión Profesional de Drones

**"Manda un audio. Y punto."**

Sistema SaaS para gestión de flotas de drones con cálculo automático de TCO y analytics avanzado.

---

## 🚀 Quick Start

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

Puedes obtener estas credenciales desde:
- Dashboard de Supabase → Settings → API

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 📦 Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Animaciones**: Framer Motion
- **Gestión de estado**: Zustand
- **Gráficos**: Recharts

---

## 📁 Estructura del Proyecto

```
skreeo/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Rutas públicas (login, register)
│   │   ├── (dashboard)/         # Rutas protegidas
│   │   │   ├── operator/        # Dashboard operadora
│   │   │   ├── drones/          # Gestión de drones
│   │   │   ├── projects/        # Gestión de proyectos
│   │   │   └── ...
│   │   ├── layout.tsx           # Layout raíz
│   │   └── page.tsx             # Landing page
│   ├── components/
│   │   ├── ui/                  # Componentes UI base
│   │   ├── layout/              # Layout components (Sidebar, Header)
│   │   └── features/            # Feature-specific components
│   ├── lib/
│   │   ├── supabase/            # Supabase clients
│   │   ├── utils/               # Utilidades
│   │   └── hooks/               # Custom React hooks
│   ├── styles/
│   │   └── globals.css          # Estilos globales
│   └── types/
│       └── database.types.ts    # Tipos de TypeScript generados
├── public/                       # Assets estáticos
├── middleware.ts                 # Middleware de autenticación
└── package.json
```

---

## 🔐 Autenticación

El proyecto usa Supabase Auth con protección de rutas mediante middleware.

- **Rutas públicas**: `/`, `/login`, `/register`
- **Rutas protegidas**: `/operator`, `/drones`, `/projects`, etc.

Si un usuario no autenticado intenta acceder a una ruta protegida, será redirigido automáticamente a `/login`.

---

## 🎨 Sistema de Diseño

### Colores Principales

```css
--skreeo-primary: #2563eb      /* Azul corporativo */
--skreeo-success: #10b981      /* Verde para estados OK */
--skreeo-warning: #f59e0b      /* Naranja para alertas */
--skreeo-danger: #ef4444       /* Rojo para eliminar */
```

### Componentes UI

Todos los componentes base están en `src/components/ui/`:
- Button
- Card
- Input
- Label
- Select
- Dialog
- etc.

---

## 📊 Base de Datos

### Tablas Principales

- `operadoras`: Empresas operadoras de drones
- `pilotos`: Pilotos individuales
- `drones`: Flota de drones
- `proyectos`: Proyectos de clientes
- `vuelos`: Registro de vuelos
- `clientes`: Clientes de las operadoras

---

## 🚢 Despliegue en Vercel

### 1. Conectar GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/skreeo.git
git push -u origin main
```

### 2. Importar en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Importa tu repositorio de GitHub
4. Configura las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy

Tu app estará disponible en: `https://skreeo.vercel.app`

---

## 📝 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run type-check   # Verificar tipos TypeScript
```

---

## 🛠️ Próximos Pasos

### Fase 1 (Esta semana):
- [x] Setup proyecto base
- [x] Autenticación
- [ ] Dashboard operadora
- [ ] Lista de drones
- [ ] Gestión básica de drones

### Fase 2:
- [ ] Bot Telegram para registro de vuelos
- [ ] Analytics avanzado
- [ ] Cálculo TCO automático
- [ ] Reportes PDF

### Fase 3:
- [ ] Stripe payments
- [ ] Multi-tenant
- [ ] API REST
- [ ] White-label

---

## 📞 Soporte

¿Preguntas? Contacta al equipo de desarrollo.

---

**© 2025 Skreeo. Todos los derechos reservados.**
