import type { Metadata } from 'next'

import { ReferralsPage } from '@/components/pages/referrals-page'
import { publicPageMetadataWithOg } from '@/lib/seo/public-metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return publicPageMetadataWithOg('es', 'referrals', {
    title: 'Programa de referidos | The Seed RD',
    description: 'Recomienda The Seed RD y gana comisiones por clientes cualificados.',
    path: '/referidos',
  })
}

export default function ReferidosEsPage() {
  return <ReferralsPage locale="es" />
}
