import type { Metadata } from 'next'

import { PropertiesPage } from '@/components/pages/properties-page'
import { publicPageMetadataWithOg } from '@/lib/seo/public-metadata'

export async function generateMetadata(): Promise<Metadata> {
  return publicPageMetadataWithOg('es', 'homes', {
    title: 'Hogar e inversión inmobiliaria premium | The Seed RD',
    description:
      'Curación de propiedades de lujo en República Dominicana: Bávaro, Punta Cana y más. Compra con asesoría boutique.',
    path: '/hogar',
  })
}

export default function HogarPage() {
  return <PropertiesPage locale="es" />
}
