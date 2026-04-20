import { MarketingLayout } from '@/components/site/marketing-layout'
import { defaultWhatsapp, getSiteConfig } from '@/lib/site-data'

export const dynamic = 'force-dynamic'

export default async function EnMarketingLayout({ children }: { children: React.ReactNode }) {
  const cfg = await getSiteConfig('en')
  const phone = cfg?.whatsappPhone || defaultWhatsapp()

  return (
    <MarketingLayout locale="en" whatsapp={phone} site={cfg}>
      {children}
    </MarketingLayout>
  )
}
