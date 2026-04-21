import type { Metadata } from 'next'

import { PropertiesPage } from '@/components/pages/properties-page'
import { publicPageMetadataWithOg } from '@/lib/seo/public-metadata'

export async function generateMetadata(): Promise<Metadata> {
  return publicPageMetadataWithOg('en', 'homes', {
    title: 'Premium homes & real estate | The Seed RD',
    description:
      'Luxury property curation in the Dominican Republic: Bavaro, Punta Cana, and beyond. Buy with boutique guidance.',
    path: '/en/homes',
  })
}

export default async function HomesEnPage({
  searchParams,
}: {
  searchParams: Promise<{
    provincia?: string
    municipio?: string
    region?: string
    tipo?: string
    cuartos?: string
    banos?: string
    etiquetas?: string
  }>
}) {
  const sp = await searchParams
  return <PropertiesPage locale="en" search={sp} />
}
