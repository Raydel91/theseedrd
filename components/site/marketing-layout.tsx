import { headers } from 'next/headers'
import { Suspense, type ReactNode } from 'react'

import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { MobileNavOverlay } from '@/components/site/mobile-nav-overlay'
import { WhatsappFloat } from '@/components/site/whatsapp-float'
import type { Locale } from '@/lib/i18n/copy'
import { defaultWhatsapp, getSiteConfig } from '@/lib/site-data'

/**
 * El shell (header + main) se pinta sin esperar a Payload; footer y WhatsApp cargan en Suspense
 * para no bloquear las páginas ni la navegación RSC (misma “historia” de cuelgue / Failed to fetch).
 */
export async function MarketingLayoutFrame({
  locale,
  children,
}: {
  locale: Locale
  children: ReactNode
}) {
  const pathname = (await headers()).get('x-pathname') ?? ''

  return (
    <>
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader locale={locale} />
        <main className="flex-1">{children}</main>
        <Suspense fallback={<FooterAreaFallback />}>
          <MarketingFooterAndWhatsapp locale={locale} />
        </Suspense>
      </div>
      <MobileNavOverlay locale={locale} currentPath={pathname} />
    </>
  )
}

function FooterAreaFallback() {
  return (
    <div
      className="min-h-40 animate-pulse border-t border-seed-forest/10 bg-seed-forest/5"
      aria-hidden
    />
  )
}

async function MarketingFooterAndWhatsapp({ locale }: { locale: Locale }) {
  const cfg = await getSiteConfig(locale)
  const phone = cfg?.whatsappPhone || defaultWhatsapp()
  return (
    <>
      <SiteFooter locale={locale} site={cfg} />
      <WhatsappFloat phone={phone} />
    </>
  )
}
