import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'The Seed RD | Relocalización premium RD',
    template: '%s | The Seed RD',
  },
  description:
    'Concierge de relocalización y real estate de lujo en República Dominicana.',
  openGraph: {
    type: 'website',
    locale: 'es_DO',
    siteName: 'The Seed RD',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

/**
 * Sin <html>/<body> aquí: el sitio público los define `app/(site)/layout.tsx`.
 * Payload Admin usa `app/(payload)/layout.tsx` (RootLayout con su propio documento).
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
