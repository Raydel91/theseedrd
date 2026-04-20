import { MarketingLayoutFrame } from '@/components/site/marketing-layout'

/** El layout ya no hace await a Payload: el shell renderiza al instante. */
export default function EsMarketingLayout({ children }: { children: React.ReactNode }) {
  return <MarketingLayoutFrame locale="es">{children}</MarketingLayoutFrame>
}
