import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { WhatsappFloat } from '@/components/site/whatsapp-float'
import type { Locale } from '@/lib/i18n/copy'
import type { SiteConfig } from '@/payload-types'

export function MarketingLayout({
  children,
  locale,
  whatsapp,
  site,
}: {
  children: ReactNode
  locale: Locale
  whatsapp: string
  site: SiteConfig | null
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader locale={locale} />
      <main className="flex-1 pt-16">{children}</main>
      <SiteFooter locale={locale} site={site} />
      <WhatsappFloat phone={whatsapp} />
    </div>
  )
}
