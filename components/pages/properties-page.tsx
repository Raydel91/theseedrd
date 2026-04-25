import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

import { PropertyFilters } from '@/components/site/property-filters'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { buildPropertyWhere } from '@/lib/build-property-where'
import {
  formatPropertyPrice,
  getDopRateFromSiteConfig,
  normalizePropertyCurrency,
  toDisplayPrice,
  toUsdPrice,
} from '@/lib/property-currency'
import type { Locale } from '@/lib/i18n/copy'
import { routeMap } from '@/lib/i18n/routes'
import { pickLocaleWithFallback } from '@/lib/pick-locale'
import { getRDDivisionLabels } from '@/lib/rd-admin-divisions'
import { absoluteMediaUrl } from '@/lib/media-url'
import { getPayloadInstance } from '@/lib/payload-server'
import { getSiteConfig } from '@/lib/site-data'
import type { HouseType, Property, PropertyTag } from '@/payload-types'

const copy = {
  es: {
    title: 'Hogar',
    intro: 'Propiedades curadas en destinos premium de República Dominicana.',
    empty: 'No hay propiedades con estos filtros.',
    emptyAdmin:
      'Si acabas de crear una, abre su ficha en el admin y confirma que «Publicado» esté marcado y guardada.',
    emptyFilters:
      'Tienes filtros en la URL; una propiedad nueva puede quedar fuera. Prueba sin filtros:',
    emptyClear: 'Ver todas',
  },
  en: {
    title: 'Homes',
    intro: 'Curated properties in premium destinations across the Dominican Republic.',
    empty: 'No properties match these filters.',
    emptyAdmin:
      'If you just created one, open it in the admin and confirm «Publicado» is checked and saved.',
    emptyFilters: 'URL filters can hide a new listing. Try without filters:',
    emptyClear: 'View all',
  },
} as const

function hasActiveListingFilters(s: PropertiesListingSearch): boolean {
  return Boolean(
    s.provincia ||
      s.municipio ||
      s.region ||
      s.tipo ||
      s.cuartos ||
      s.banos ||
      s.precioMin ||
      s.precioMax ||
      s.etiquetas,
  )
}

function labelFromDoc(doc: unknown, locale: Locale): string | null {
  if (!doc || typeof doc !== 'object') return null
  const raw = (doc as { label?: string | { es?: string; en?: string } | null }).label
  if (typeof raw === 'string') {
    const s = raw.trim()
    return s || null
  }
  if (raw && typeof raw === 'object') {
    const s = pickLocaleWithFallback(raw as { es?: string; en?: string }, locale)
    return s || null
  }
  return null
}

export type PropertiesListingSearch = {
  provincia?: string
  municipio?: string
  region?: string
  tipo?: string
  cuartos?: string
  banos?: string
  etiquetas?: string
  precioMin?: string
  precioMax?: string
  moneda?: string
}

export async function PropertiesPage({
  locale,
  search,
}: {
  locale: Locale
  search: PropertiesListingSearch
}) {
  const tagSlugs = search.etiquetas?.split(',').map((s) => s.trim()).filter(Boolean)

  const minBeds =
    search.cuartos && !Number.isNaN(Number(search.cuartos)) ? Number(search.cuartos) : undefined
  const minBaths =
    search.banos && !Number.isNaN(Number(search.banos)) ? Number(search.banos) : undefined
  const selectedCurrency = normalizePropertyCurrency(search.moneda)
  const site = await getSiteConfig(locale)
  const dopRate = getDopRateFromSiteConfig(site)
  const minPriceInput =
    search.precioMin && !Number.isNaN(Number(search.precioMin)) ? Number(search.precioMin) : undefined
  const maxPriceInput =
    search.precioMax && !Number.isNaN(Number(search.precioMax)) ? Number(search.precioMax) : undefined
  const minPriceUsd = minPriceInput != null ? toUsdPrice(minPriceInput, selectedCurrency, dopRate) : undefined
  const maxPriceUsd = maxPriceInput != null ? toUsdPrice(maxPriceInput, selectedCurrency, dopRate) : undefined

  const filters = {
    filterProvince: search.provincia,
    filterMunicipality: search.municipio,
    filterRegion: search.region,
    filterHouseTypeSlug: search.tipo,
    minBeds,
    minBaths,
    minPriceUsd,
    maxPriceUsd,
    tagSlugs,
  }

  let res: { docs: Property[] } = { docs: [] }
  let houseTypes: { docs: HouseType[] } = { docs: [] }
  let propertyTags: { docs: PropertyTag[] } = { docs: [] }
  try {
    const payload = await getPayloadInstance()
    const where = await buildPropertyWhere(payload, filters)
    const results = await Promise.all([
      payload.find({
        collection: 'properties',
        where,
        depth: 2,
        locale,
        fallbackLocale: 'es',
        limit: 48,
        sort: '-createdAt',
      }),
      payload.find({
        collection: 'house-types',
        sort: 'sortOrder',
        locale,
        fallbackLocale: 'es',
        limit: 200,
      }),
      payload.find({
        collection: 'property-tags',
        sort: 'sortOrder',
        locale,
        fallbackLocale: 'es',
        limit: 500,
      }),
    ])
    res = results[0] as typeof res
    houseTypes = results[1] as typeof houseTypes
    propertyTags = results[2] as typeof propertyTags
  } catch {
    /* BD no disponible: listado vacío y filtros sin opciones */
  }

  const t = copy[locale]
  const r = routeMap[locale]
  const filtersActive = hasActiveListingFilters(search)

  const houseTypeOptions = houseTypes.docs.map((d) => ({
    slug: d.slug as string,
    label: labelFromDoc(d as { label?: unknown }, locale) ?? (d.slug as string),
  }))

  const tagOptions = propertyTags.docs
    .filter((d) => (d.tagCategory as string) !== 'location')
    .map((d) => ({
      slug: d.slug as string,
      label: labelFromDoc(d as { label?: unknown }, locale) ?? (d.slug as string),
      category: (d.tagCategory as string) || 'general',
    }))

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-semibold text-seed-forest">{t.title}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t.intro}</p>

      <Suspense fallback={<div className="mt-8 h-28 animate-pulse rounded-2xl bg-muted/30" aria-hidden />}>
        <PropertyFilters
          locale={locale}
          houseTypeOptions={houseTypeOptions}
          tagOptions={tagOptions}
        />
      </Suspense>

      {res.docs.length === 0 ? (
        <div className="mt-10 space-y-3">
          <p className="text-muted-foreground">{t.empty}</p>
          <p className="max-w-xl text-sm text-muted-foreground">{t.emptyAdmin}</p>
          {filtersActive ? (
            <p className="max-w-xl text-sm text-muted-foreground">
              {t.emptyFilters}{' '}
              <Link href={r.homes} className="font-medium text-seed-emerald underline underline-offset-4">
                {t.emptyClear}
              </Link>
            </p>
          ) : null}
        </div>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {res.docs.map((prop) => {
            const title = pickLocaleWithFallback(prop.title as string | { es?: string; en?: string }, locale)
            const zone = pickLocaleWithFallback(prop.location as string | { es?: string; en?: string }, locale)
            const slug = prop.slug as string
            const rd = prop.rdDivision as string | null | undefined
            const geo = getRDDivisionLabels(rd ?? null, locale === 'es' ? 'es' : 'en')
            const geoLine = geo ? `${geo.province} — ${geo.municipalityLine}` : null
            const cover =
              typeof prop.coverImage === 'object' && prop.coverImage && 'url' in prop.coverImage
                ? absoluteMediaUrl(prop.coverImage.url as string)
                : null
            const houseType =
              typeof prop.houseType === 'object' && prop.houseType && 'label' in prop.houseType
                ? labelFromDoc(prop.houseType as { label?: unknown }, locale)
                : null
            const tagDocs = Array.isArray(prop.propertyTags) ? prop.propertyTags : []
            return (
              <Link
                key={String(prop.id)}
                href={`${r.homes}/${slug}`}
                className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seed-emerald focus-visible:ring-offset-2"
              >
                <Card className="h-full overflow-hidden border-seed-forest/10 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative aspect-[4/3] overflow-hidden bg-seed-sand-dark">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width:768px) 100vw, 33vw"
                      />
                    ) : null}
                  </div>
                  <CardContent className="p-5 text-left">
                    {geoLine ? (
                      <p className="text-xs uppercase tracking-wide text-seed-emerald">{geoLine}</p>
                    ) : (
                      <p className="text-xs uppercase tracking-wide text-seed-emerald">{zone}</p>
                    )}
                    {houseType ? (
                      <p className="mt-1 text-xs font-medium text-muted-foreground">{houseType}</p>
                    ) : null}
                    <h2 className="font-heading text-lg text-seed-forest group-hover:text-seed-emerald">{title}</h2>
                    {geoLine ? <p className="mt-1 text-sm text-muted-foreground">{zone}</p> : null}
                    <p className="mt-2 text-xl font-semibold text-seed-forest">
                      {formatPropertyPrice(
                        toDisplayPrice(prop.price as number, selectedCurrency, dopRate),
                        selectedCurrency,
                        locale,
                      )}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="text-xs text-muted-foreground">
                        {prop.beds as number} bd · {prop.baths as number} ba
                        {prop.sqm != null ? ` · ${prop.sqm} m²` : ''}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tagDocs.slice(0, 4).map((tag) => {
                        const lab =
                          typeof tag === 'object' && tag && 'label' in tag
                            ? labelFromDoc(tag as { label?: unknown }, locale)
                            : null
                        const id =
                          typeof tag === 'object' && tag && 'id' in tag
                            ? String((tag as { id: unknown }).id)
                            : ''
                        if (!lab) return null
                        return (
                          <Badge key={id} variant="secondary" className="text-xs font-normal">
                            {lab}
                          </Badge>
                        )
                      })}
                      {tagDocs.length > 4 ? (
                        <Badge variant="outline" className="text-xs">
                          +{tagDocs.length - 4}
                        </Badge>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
