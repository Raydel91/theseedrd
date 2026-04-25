import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PropertyGallery } from '@/components/site/property-gallery'
import { Badge } from '@/components/ui/badge'
import { googleMapsEmbedFromAddress } from '@/lib/maps-embed'
import { pickLocaleWithFallback } from '@/lib/pick-locale'
import { getRDDivisionLabels } from '@/lib/rd-admin-divisions'
import { absoluteMediaUrl } from '@/lib/media-url'
import type { Locale } from '@/lib/i18n/copy'
import { routeMap } from '@/lib/i18n/routes'
import { propertyPublishedWhere } from '@/lib/property-published-where'
import {
  formatPropertyPrice,
  getDopRateFromSiteConfig,
  normalizePropertyCurrency,
  toDisplayPrice,
} from '@/lib/property-currency'
import { getPayloadInstance } from '@/lib/payload-server'
import { getSiteConfig } from '@/lib/site-data'
import type { Property } from '@/payload-types'

const copy = {
  es: {
    back: '← Volver a Hogar',
    beds: 'Habitaciones',
    baths: 'Baños',
    sqm: 'm²',
    address: 'Dirección',
    map: 'Ubicación',
    type: 'Tipo',
    tags: 'Etiquetas',
    amenities: 'Amenidades',
    gallery: 'Galería',
    currency: 'Moneda',
  },
  en: {
    back: '← Back to Homes',
    beds: 'Bedrooms',
    baths: 'Bathrooms',
    sqm: 'm²',
    address: 'Address',
    map: 'Location',
    type: 'Type',
    tags: 'Tags',
    amenities: 'Amenities',
    gallery: 'Gallery',
    currency: 'Currency',
  },
} as const

function labelFromRelation(doc: unknown, locale: Locale): string | null {
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

export async function PropertyDetailPage({
  locale,
  slug,
  currencyParam,
}: {
  locale: Locale
  slug: string
  currencyParam?: string
}) {
  let prop: Property | undefined
  try {
    const payload = await getPayloadInstance()
    const res = await payload.find({
      collection: 'properties',
      where: { and: [{ slug: { equals: slug } }, propertyPublishedWhere] },
      depth: 2,
      locale,
      fallbackLocale: 'es',
      limit: 1,
    })
    prop = res.docs[0]
  } catch {
    notFound()
  }
  if (!prop) notFound()

  const t = copy[locale]
  const r = routeMap[locale]
  const site = await getSiteConfig(locale)
  const dopRate = getDopRateFromSiteConfig(site)
  const selectedCurrency = normalizePropertyCurrency(currencyParam)

  const title = pickLocaleWithFallback(prop.title as string | { es?: string; en?: string }, locale)
  const zone = pickLocaleWithFallback(prop.location as string | { es?: string; en?: string }, locale)
  const street = pickLocaleWithFallback(
    prop.streetAddress as string | { es?: string; en?: string } | null | undefined,
    locale,
  )

  const rd = prop.rdDivision as string | null | undefined
  const geo = getRDDivisionLabels(rd ?? null, locale === 'es' ? 'es' : 'en')
  const geoLine = geo ? `${geo.province} — ${geo.municipalityLine}` : null

  const houseType =
    typeof prop.houseType === 'object' && prop.houseType && 'label' in prop.houseType
      ? labelFromRelation(prop.houseType as { label?: unknown }, locale)
      : null

  const tagDocs = Array.isArray(prop.propertyTags) ? prop.propertyTags : []
  const amenityDocs = Array.isArray(prop.amenities) ? prop.amenities : []

  const cover =
    typeof prop.coverImage === 'object' && prop.coverImage && 'url' in prop.coverImage
      ? absoluteMediaUrl(prop.coverImage.url as string)
      : null

  const galleryRows = Array.isArray(prop.gallery) ? prop.gallery : []
  const secondaryUrls: string[] = []
  for (const row of galleryRows) {
    if (row && typeof row === 'object' && 'image' in row) {
      const img = (row as { image?: unknown }).image
      if (typeof img === 'object' && img && 'url' in img) {
        const u = (img as { url?: string }).url
        if (typeof u === 'string' && u) {
          const abs = absoluteMediaUrl(u)
          if (abs) secondaryUrls.push(abs)
        }
      }
    }
  }

  const allImages = [cover, ...secondaryUrls].filter((u): u is string => Boolean(u))
  const mapSrc = street?.trim() ? googleMapsEmbedFromAddress(street) : null

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href={r.homes}
        className="text-sm font-medium text-seed-emerald underline-offset-4 hover:underline"
      >
        {t.back}
      </Link>

      <header className="mt-6">
        {geoLine ? (
          <p className="text-xs uppercase tracking-wide text-seed-emerald">{geoLine}</p>
        ) : null}
        <h1 className="font-heading text-3xl font-semibold text-seed-forest md:text-4xl">{title}</h1>
        <p className="mt-2 text-muted-foreground">{zone}</p>
        <p className="mt-4 text-3xl font-bold text-seed-forest">
          {formatPropertyPrice(
            toDisplayPrice(prop.price as number, selectedCurrency, dopRate),
            selectedCurrency,
            locale,
          )}
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">{t.currency}:</span>
          <Link
            href={`${r.homes}/${slug}?moneda=USD`}
            className={
              selectedCurrency === 'USD'
                ? 'rounded-full bg-seed-forest px-3 py-1 font-medium text-white'
                : 'rounded-full border border-seed-forest/20 px-3 py-1 text-seed-forest'
            }
          >
            USD
          </Link>
          <Link
            href={`${r.homes}/${slug}?moneda=DOP`}
            className={
              selectedCurrency === 'DOP'
                ? 'rounded-full bg-seed-forest px-3 py-1 font-medium text-white'
                : 'rounded-full border border-seed-forest/20 px-3 py-1 text-seed-forest'
            }
          >
            RD$
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>
            {t.beds}: <strong className="text-foreground">{prop.beds as number}</strong>
          </span>
          <span>
            {t.baths}: <strong className="text-foreground">{prop.baths as number}</strong>
          </span>
          {prop.sqm != null ? (
            <span>
              {t.sqm}: <strong className="text-foreground">{prop.sqm as number}</strong>
            </span>
          ) : null}
          {houseType ? (
            <span>
              {t.type}: <strong className="text-foreground">{houseType}</strong>
            </span>
          ) : null}
        </div>
      </header>

      {allImages.length > 0 ? (
        <section className="mt-10" aria-labelledby="gallery-heading">
          <h2 id="gallery-heading" className="font-heading text-xl text-seed-forest">
            {t.gallery}
          </h2>
          <div className="mt-4">
            <PropertyGallery images={allImages} title={title} />
          </div>
        </section>
      ) : null}

      {street?.trim() ? (
        <section className="mt-10" aria-labelledby="addr-heading">
          <h2 id="addr-heading" className="font-heading text-xl text-seed-forest">
            {t.address}
          </h2>
          <p className="mt-2 text-muted-foreground whitespace-pre-wrap">{street}</p>
        </section>
      ) : null}

      {mapSrc ? (
        <section className="mt-10" aria-labelledby="map-heading">
          <h2 id="map-heading" className="font-heading text-xl text-seed-forest">
            {t.map}
          </h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-seed-forest/10">
            <iframe
              title={t.map}
              src={mapSrc}
              width="100%"
              height={320}
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="bg-muted"
            />
          </div>
        </section>
      ) : null}

      {tagDocs.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-heading text-xl text-seed-forest">{t.tags}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {tagDocs.map((tag) => {
              const lab =
                typeof tag === 'object' && tag && 'label' in tag
                  ? labelFromRelation(tag as { label?: unknown }, locale)
                  : null
              const id = typeof tag === 'object' && tag && 'id' in tag ? String((tag as { id: unknown }).id) : ''
              if (!lab) return null
              return (
                <Badge key={id} variant="secondary">
                  {lab}
                </Badge>
              )
            })}
          </div>
        </section>
      ) : null}

      {amenityDocs.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-heading text-xl text-seed-forest">{t.amenities}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {amenityDocs.map((a) => {
              const lab =
                typeof a === 'object' && a && 'label' in a
                  ? labelFromRelation(a as { label?: unknown }, locale)
                  : null
              const id = typeof a === 'object' && a && 'id' in a ? String((a as { id: unknown }).id) : ''
              if (!lab) return null
              return (
                <Badge key={id} variant="outline" className="border-seed-forest/20">
                  {lab}
                </Badge>
              )
            })}
          </div>
        </section>
      ) : null}
    </div>
  )
}
