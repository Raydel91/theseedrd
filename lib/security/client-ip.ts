import type { NextRequest } from 'next/server'
import { headers } from 'next/headers'

/** IP del cliente (proxy / Vercel / local). */
export function getClientIpFromRequest(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return request.headers.get('x-real-ip') ?? '127.0.0.1'
}

export async function getClientIpFromHeaders(): Promise<string> {
  const h = await headers()
  const forwarded = h.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return h.get('x-real-ip') ?? '127.0.0.1'
}
