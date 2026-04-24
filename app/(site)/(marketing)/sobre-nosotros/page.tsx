import type { Metadata } from 'next'

import { TeamSection } from '@/components/sections/team-section'
import { BreadcrumbJsonLd, LocalBusinessJsonLd } from '@/lib/seo/json-ld'
import { publicPageMetadataWithOg } from '@/lib/seo/public-metadata'
import { getSiteConfig } from '@/lib/site-data'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return publicPageMetadataWithOg('es', 'about', {
    title: 'Sobre nosotros | The Seed RD',
    description:
      'Equipo boutique de legal, real estate y lifestyle para familias internacionales en República Dominicana.',
    path: '/sobre-nosotros',
  })
}

export default async function AboutEsPage() {
  const cfg = await getSiteConfig('es')
  const addr = cfg?.addressLine
  const addressLine =
    typeof addr === 'string' ? addr : addr && typeof addr === 'object' ? (addr as { es?: string }).es : undefined

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', url: '/' },
          { name: 'Sobre nosotros', url: '/sobre-nosotros' },
        ]}
      />
      <LocalBusinessJsonLd locale="es" addressLine={addressLine} />
      <TeamSection
        locale="es"
        title="Sobre nosotros"
        description="Un equipo boutique de legal, real estate y lifestyle para familias internacionales que eligen República Dominicana."
      />
    </>
  )
}
