import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Rutas públicas
  const publicPaths = ['/', '/login', '/register', '/pricing']
  if (publicPaths.includes(path)) {
    return response
  }

  // Sin auth → login
  if (!user && !path.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Con auth en login → operadores
  if (user && path === '/login') {
    return NextResponse.redirect(new URL('/operadores', request.url))
  }

  // Rutas viejas → operadores
  const oldPaths = ['/dashboard', '/operator', '/drones', '/pilots', '/projects', '/flights']
  if (oldPaths.some(p => path.startsWith(p))) {
    return NextResponse.redirect(new URL('/operadores', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
