import { Suspense, type ReactNode } from 'react'

import { MarketingLayoutFrame } from '@/components/site/marketing-layout'

export default function EnMarketingLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" aria-hidden />}>
      <MarketingLayoutFrame locale="en">{children}</MarketingLayoutFrame>
    </Suspense>
  )
}
