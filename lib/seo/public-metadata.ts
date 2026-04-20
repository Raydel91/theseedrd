import type { Metadata } from 'next'

import { absoluteMediaUrl } from '@/lib/media-url'
import { getSiteConfig } from '@/lib/site-data'

import { alternatesForPage, type PublicRouteKey } from './alternates'
import { primaryKeywordsEn, primaryKeywordsEs } from './constants'

const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export function publicPageMetadata(
  locale: 'es' | 'en',
  routeKey: PublicRouteKey,
  opts: { title: string; description: string; path: string },
): Metadata {
  const keywords = [...(locale === 'es' ? primaryKeywordsEs : primaryKeywordsEn)]
  const url = new URL(opts.path, base).toString()
  return {
    title: opts.title,
    description: opts.description,
    keywords,
    alternates: alternatesForPage(routeKey, locale),
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      locale: locale === 'es' ? 'es_DO' : 'en_US',
      siteName: 'The Seed RD',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
    },
  }
}

export async function publicPageMetadataWithOg(
  locale: 'es' | 'en',
  routeKey: PublicRouteKey,
  opts: { title: string; description: string; path: string },
): Promise<Metadata> {
  const baseMeta = publicPageMetadata(locale, routeKey, opts)
  try {
    const site = await getSiteConfig(locale)
    const meta = site?.meta
    const raw =
      meta && typeof meta === 'object' && meta !== null && 'image' in meta
        ? (meta as { image?: unknown }).image
        : undefined
    let url: string | undefined
    if (raw && typeof raw === 'object' && raw !== null && 'url' in raw && typeof (raw as { url?: string }).url === 'string') {
      url = absoluteMediaUrl((raw as { url: string }).url)
    }
    if (!url) return baseMeta
    return {
      ...baseMeta,
      openGraph: {
        ...baseMeta.openGraph,
        images: [{ url, width: 1200, height: 630, alt: opts.title }],
      },
      twitter: {
        ...baseMeta.twitter,
        images: [url],
      },
    }
  } catch {
    return baseMeta
  }
}
