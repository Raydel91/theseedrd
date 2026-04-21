import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const isProd = process.env.NODE_ENV === 'production'

/**
 * CSP equilibrada para Next.js + Payload (requiere unsafe-inline en scripts/estilos en varias rutas).
 * Endurecer más con nonces implica integración adicional en layouts.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://vitals.vercel-insights.com https://*.vercel-insights.com",
  /** Mapas embebidos (footer, ficha de propiedad) */
  "frame-src 'self' https://maps.google.com https://www.google.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isProd ? ["upgrade-insecure-requests"] : []),
].join('; ')

/**
 * En dev, Next.js bloquea peticiones a `/_next/*` desde orígenes distintos al host del servidor
 * (p. ej. abrir por IP de LAN o `127.0.0.1` vs `localhost`) → "Failed to fetch" / página en blanco.
 * Añade tu IP u host en `NEXT_DEV_ALLOWED_ORIGINS` (separados por coma).
 */
const allowedDevOrigins = [
  '127.0.0.1',
  ...(process.env.NEXT_DEV_ALLOWED_ORIGINS?.split(/[,]+/).map((s) => s.trim()).filter(Boolean) ?? []),
]

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  ...(isProd
    ? [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
      ]
    : []),
]

const nextConfig: NextConfig = {
  ...(!isProd ? { allowedDevOrigins } : {}),
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
    ],
  },
  async headers() {
    /** En desarrollo, CSP estricta a veces interfiere con Turbopack / RSC; en prod se mantiene. */
    if (!isProd) {
      return [
        {
          source: '/:path*',
          headers: [
            { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
          ],
        },
      ]
    }
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

export default withPayload(nextConfig)
