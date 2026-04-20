import { MarketingLayoutFrame } from '@/components/site/marketing-layout'

export default function EnMarketingLayout({ children }: { children: React.ReactNode }) {
  return <MarketingLayoutFrame locale="en">{children}</MarketingLayoutFrame>
}
