import type { MetadataRoute } from 'next'

import { listPostsForSitemap } from '@/lib/blog'
import { routeMap } from '@/lib/i18n/routes'

const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  const staticEs = [
    routeMap.es.home,
    routeMap.es.about,
    routeMap.es.services,
    routeMap.es.homes,
    routeMap.es.blog,
    routeMap.es.referrals,
    routeMap.es.contact,
  ]
  const staticEn = [
    routeMap.en.home,
    routeMap.en.about,
    routeMap.en.services,
    routeMap.en.homes,
    routeMap.en.blog,
    routeMap.en.referrals,
    routeMap.en.contact,
  ]

  for (const p of staticEs) {
    entries.push({ url: new URL(p, base).toString(), lastModified: now, changeFrequency: 'weekly', priority: p === '/' ? 1 : 0.85 })
  }
  for (const p of staticEn) {
    entries.push({ url: new URL(p, base).toString(), lastModified: now, changeFrequency: 'weekly', priority: p === '/en' ? 0.95 : 0.8 })
  }

  for (const locale of ['es', 'en'] as const) {
    const posts = await listPostsForSitemap(locale)
    for (const post of posts) {
      const path = locale === 'es' ? `/blog/${post.slug}` : `/en/blog/${post.slug}`
      entries.push({
        url: new URL(path, base).toString(),
        lastModified: new Date(post.date),
        changeFrequency: 'monthly',
        priority: 0.65,
      })
    }
  }

  // En build de Vercel no forzar más consultas a Postgres desde el sitemap.
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    const seen = new Map<string, MetadataRoute.Sitemap[0]>()
    for (const e of entries) {
      if (!seen.has(e.url)) seen.set(e.url, e)
    }
    return [...seen.values()]
  }

  const seen = new Map<string, MetadataRoute.Sitemap[0]>()
  for (const e of entries) {
    if (!seen.has(e.url)) seen.set(e.url, e)
  }
  return [...seen.values()]
}
