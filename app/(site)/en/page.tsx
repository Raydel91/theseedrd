import type { Metadata } from 'next'
import { HomeContent } from '@/components/pages/home-content'
import { OrganizationJsonLd, WebSiteJsonLd } from '@/lib/seo/json-ld'
import { publicPageMetadataWithOg } from '@/lib/seo/public-metadata'

export async function generateMetadata(): Promise<Metadata> {
  return publicPageMetadataWithOg('en', 'home', {
    title: 'Boutique relocation in the Dominican Republic',
    description:
      'Legal, home, and lifestyle concierge for international families. Residency, migration, and premium homes with clarity.',
    path: '/en',
  })
}

export default async function EnHomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <HomeContent locale="en" />
    </>
  )
}
