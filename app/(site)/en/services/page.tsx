import type { Metadata } from 'next'

import { ServicesPage } from '@/components/pages/services-page'
import { publicPageMetadataWithOg } from '@/lib/seo/public-metadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return publicPageMetadataWithOg('en', 'services', {
    title: 'Relocation & residency services | The Seed RD',
    description:
      'Modular packages: legal, home, and lifestyle in the Dominican Republic. Transparent pricing and tailored roadmaps.',
    path: '/en/services',
  })
}

export default function ServicesEnPage() {
  return <ServicesPage locale="en" />
}
