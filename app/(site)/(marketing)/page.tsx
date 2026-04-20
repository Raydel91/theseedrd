import type { Metadata } from 'next'
import { HomeContent } from '@/components/pages/home-content'
import { OrganizationJsonLd, WebSiteJsonLd } from '@/lib/seo/json-ld'
import { publicPageMetadataWithOg } from '@/lib/seo/public-metadata'

export async function generateMetadata(): Promise<Metadata> {
  return publicPageMetadataWithOg('es', 'home', {
    title: 'Relocalización boutique en República Dominicana',
    description:
      'Concierge legal, vivienda y lifestyle para familias internacionales. Residencia, migración y hogar premium con transparencia.',
    path: '/',
  })
}

export default async function HomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <HomeContent locale="es" />
    </>
  )
}
