import type { Metadata } from 'next'

import { ServicesPage } from '@/components/pages/services-page'
import { publicPageMetadataWithOg } from '@/lib/seo/public-metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return publicPageMetadataWithOg('es', 'services', {
    title: 'Servicios de relocalización y residencia | The Seed RD',
    description:
      'Paquetes modulares: legal, hogar y lifestyle en República Dominicana. Precios transparentes y roadmap a medida.',
    path: '/servicios',
  })
}

export default function ServicesEsPage() {
  return <ServicesPage locale="es" />
}
