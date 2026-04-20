import type { Metadata } from 'next'

import { routeMap } from '@/lib/i18n/routes'

const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export type PublicRouteKey = keyof typeof routeMap.es

/** hreflang; canonical según idioma de la página (x-default → ES). */
export function alternatesForPage(
  key: PublicRouteKey,
  locale: 'es' | 'en',
): NonNullable<Metadata['alternates']> {
  const esUrl = new URL(routeMap.es[key], base).toString()
  const enUrl = new URL(routeMap.en[key], base).toString()
  return {
    canonical: locale === 'es' ? esUrl : enUrl,
    languages: {
      es: esUrl,
      en: enUrl,
      'x-default': esUrl,
    },
  }
}

/** Artículos de blog: misma entrada en ES/EN (MDX o slug CMS). */
export function alternatesForBlogPost(locale: 'es' | 'en', slug: string): NonNullable<Metadata['alternates']> {
  const esUrl = new URL(`/blog/${slug}`, base).toString()
  const enUrl = new URL(`/en/blog/${slug}`, base).toString()
  return {
    canonical: locale === 'es' ? esUrl : enUrl,
    languages: {
      es: esUrl,
      en: enUrl,
      'x-default': esUrl,
    },
  }
}
