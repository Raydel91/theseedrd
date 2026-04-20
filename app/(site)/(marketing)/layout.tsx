import { MarketingLayout } from '@/components/site/marketing-layout'
import { defaultWhatsapp, getSiteConfig } from '@/lib/site-data'

export const dynamic = 'force-dynamic'

export default async function EsMarketingLayout({ children }: { children: React.ReactNode }) {
  const cfg = await getSiteConfig('es')
  const phone = cfg?.whatsappPhone || defaultWhatsapp()

  return (
    <MarketingLayout locale="es" whatsapp={phone} site={cfg}>
      {children}
    </MarketingLayout>
  )
}
