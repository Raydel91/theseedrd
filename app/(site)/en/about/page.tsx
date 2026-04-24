import type { Metadata } from 'next'

import { TeamSection } from '@/components/sections/team-section'
import { BreadcrumbJsonLd, LocalBusinessJsonLd } from '@/lib/seo/json-ld'
import { publicPageMetadataWithOg } from '@/lib/seo/public-metadata'
import { getSiteConfig } from '@/lib/site-data'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return publicPageMetadataWithOg('en', 'about', {
    title: 'About us | The Seed RD',
    description:
      'Boutique team for legal, real estate, and lifestyle for international families in the Dominican Republic.',
    path: '/en/about',
  })
}

export default async function AboutEnPage() {
  const cfg = await getSiteConfig('en')
  const addr = cfg?.addressLine
  const addressLine =
    typeof addr === 'string' ? addr : addr && typeof addr === 'object' ? (addr as { en?: string }).en : undefined

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/en' },
          { name: 'About us', url: '/en/about' },
        ]}
      />
      <LocalBusinessJsonLd locale="en" addressLine={addressLine} />
      <TeamSection
        locale="en"
        title="About us"
        description="A boutique team for legal, real estate, and lifestyle — for international families choosing the Dominican Republic."
      />
    </>
  )
}
