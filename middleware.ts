import { type NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

import { getAuthSecret } from '@/lib/auth-secret'
import { getClientIpFromRequest } from '@/lib/security/client-ip'
import { rateLimitAuth } from '@/lib/security/rate-limit'

/** Pasa la ruta al layout raíz para evitar <html> anidado: /admin usa solo el documento de Payload */
function withPathnameHeader(request: NextRequest): Headers {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)
  return requestHeaders
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  /** Solo POST (login/callback): no limitar GET /api/auth/session para no bloquear hidratación. */
  if (path.startsWith('/api/auth') && request.method === 'POST') {
    const ip = getClientIpFromRequest(request)
    const { ok } = await rateLimitAuth(ip)
    if (!ok) {
      return NextResponse.json(
        { error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'Retry-After': '900',
            'Cache-Control': 'no-store',
          },
        },
      )
    }
  }

  if (path.startsWith('/dashboard') || path.startsWith('/en/dashboard')) {
    const secret = getAuthSecret()
    const token = await getToken({ req: request, secret })
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('callbackUrl', path)
      return NextResponse.redirect(url)
    }
    const role = (token as { role?: string }).role
    if (role && role !== 'client') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next({
    request: { headers: withPathnameHeader(request) },
  })
}

export const config = {
  matcher: [
    /**
     * Excluir todo `/_next/*` (flight, Turbopack, HMR). Si el matcher es demasiado estrecho,
     * peticiones internas pasan por el middleware y pueden romper la navegación (Failed to fetch).
     */
    '/((?!_next/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
