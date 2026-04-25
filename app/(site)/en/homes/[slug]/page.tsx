import type { Metadata } from 'next'

import { PropertyDetailPage } from '@/components/pages/property-detail-page'
import { pickLocale } from '@/lib/pick-locale'
import { absoluteMediaUrl } from '@/lib/media-url'
import { propertyPublishedWhere } from '@/lib/property-published-where'
import { getPayloadInstance } from '@/lib/payload-server'

export const dynamic = 'force-dynamic'

const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadInstance()
  const res = await payload.find({
    collection: 'properties',
    where: { and: [{ slug: { equals: slug } }, propertyPublishedWhere] },
    depth: 1,
    locale: 'en',
    limit: 1,
  })
  const prop = res.docs[0]
  if (!prop) {
    return { title: 'Property | The Seed RD' }
  }
  const title = pickLocale(prop.title as string | { es?: string; en?: string }, 'en')
  const cover =
    typeof prop.coverImage === 'object' && prop.coverImage && 'url' in prop.coverImage
      ? absoluteMediaUrl(prop.coverImage.url as string)
      : undefined
  const description = pickLocale(prop.location as string | { es?: string; en?: string }, 'en')
  const urlEs = new URL(`/hogar/${slug}`, base).toString()
  const urlEn = new URL(`/en/homes/${slug}`, base).toString()
  return {
    title: `${title} | The Seed RD`,
    description,
    alternates: {
      canonical: urlEn,
      languages: { es: urlEs, en: urlEn, 'x-default': urlEs },
    },
    openGraph: {
      title: `${title} | The Seed RD`,
      description,
      url: urlEn,
      locale: 'en_US',
      siteName: 'The Seed RD',
      type: 'website',
      ...(cover ? { images: [{ url: cover, width: 1200, height: 630, alt: title }] } : {}),
    },
  }
}

export default async function HomesPropertyEnPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ moneda?: string }>
}) {
  const { slug } = await params
  const sp = await searchParams
  return <PropertyDetailPage locale="en" slug={slug} currencyParam={sp.moneda} />
}
