import { headers } from 'next/headers'
import type { Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'

import { AppProviders } from '@/components/providers/app-providers'

import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading-serif',
  weight: ['500', '700'],
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#f5f0e8' }],
}

/** Documento del sitio público (ES/EN, login, dashboard cliente). `/admin` no pasa por aquí. */
export default async function SiteDocumentLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = (await headers()).get('x-pathname') ?? ''
  const lang = pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es'

  return (
    <html lang={lang} suppressHydrationWarning className="h-full">
      <body className={`${inter.variable} ${playfair.variable} min-h-full font-sans antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
