import { Suspense, type ReactNode } from 'react'

import { MarketingLayoutFrame } from '@/components/site/marketing-layout'

/** Suspense: `MarketingLayoutFrame` es async (headers); evita errores de RSC/hidratación en dev. */
export default function EsMarketingLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" aria-hidden />}>
      <MarketingLayoutFrame locale="es">{children}</MarketingLayoutFrame>
    </Suspense>
  )
}
