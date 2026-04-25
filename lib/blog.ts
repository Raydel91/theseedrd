import fs from 'node:fs/promises'
import path from 'node:path'
import type { ReactNode } from 'react'
import { compileMDX } from 'next-mdx-remote/rsc'

import type { Locale } from '@/lib/i18n/copy'
import { getPayloadInstance } from '@/lib/payload-server'
import type { BlogPost } from '@/payload-types'

export type PostMeta = {
  title: string
  date: string
  excerpt: string
}

export type BlogSlug = 'bienvenida'

export type ResolvedBlogPost =
  | {
      source: 'payload'
      slug: string
      meta: PostMeta
      lexical: BlogPost['content']
    }
  | {
      source: 'mdx'
      slug: string
      meta: PostMeta
      mdxContent: ReactNode
    }

const staticPosts: Record<
  'es' | 'en',
  { slug: BlogSlug; file: string; title: string; date: string; excerpt: string }[]
> = {
  es: [
    {
      slug: 'bienvenida',
      file: 'bienvenida.es.mdx',
      title: 'Bienvenida a The Seed RD',
      date: '2026-04-01',
      excerpt: 'Tu guía boutique para vivir en República Dominicana con tranquilidad y estilo.',
    },
  ],
  en: [
    {
      slug: 'bienvenida',
      file: 'bienvenida.en.mdx',
      title: 'Welcome to The Seed RD',
      date: '2026-04-01',
      excerpt: 'Your boutique guide to living in the Dominican Republic with calm and style.',
    },
  ],
}

function formatPostDate(iso: string | null | undefined, fallback: string): string {
  if (!iso) return fallback
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return fallback
  return d.toISOString().slice(0, 10)
}

async function getMdxResolvedPost(locale: 'es' | 'en', slug: string): Promise<ResolvedBlogPost | null> {
  const entry = staticPosts[locale].find((p) => p.slug === slug)
  if (!entry) return null
  const full = path.join(process.cwd(), 'content', 'blog', entry.file)
  const source = await fs.readFile(full, 'utf8')
  const compiled = await compileMDX<PostMeta>({
    source,
    options: { parseFrontmatter: true },
  })
  return {
    source: 'mdx',
    slug: entry.slug,
    meta: compiled.frontmatter,
    mdxContent: compiled.content,
  }
}

async function getPayloadPost(locale: Locale, slug: string): Promise<ResolvedBlogPost | null> {
  try {
    const payload = await getPayloadInstance()
    const res = await payload.find({
      collection: 'blog-posts',
      locale,
      limit: 1,
      depth: 1,
      overrideAccess: false,
      where: {
        and: [{ slug: { equals: slug } }, { published: { equals: true } }],
      },
    })
    const doc = res.docs[0] as BlogPost | undefined
    if (!doc) return null
    const title = typeof doc.title === 'string' ? doc.title : slug
    const excerpt = typeof doc.excerpt === 'string' ? doc.excerpt : ''
    const date = formatPostDate(doc.publishedAt ?? doc.createdAt, doc.createdAt.slice(0, 10))
    return {
      source: 'payload',
      slug: doc.slug,
      meta: { title, excerpt, date },
      lexical: doc.content ?? null,
    }
  } catch {
    return null
  }
}

/** Artículo individual: prioriza Payload (publicado); si no, MDX estático. */
export async function getPost(locale: Locale, slug: string): Promise<ResolvedBlogPost | null> {
  const fromPayload = await getPayloadPost(locale, slug)
  if (fromPayload) return fromPayload
  return getMdxResolvedPost(locale, slug)
}

export type BlogListItem = { slug: string; title: string; date: string; excerpt: string }

/** Listado: entradas publicadas en Payload + artículos MDX sin duplicar slug (gana Payload). */
export async function listPosts(locale: Locale): Promise<BlogListItem[]> {
  const bySlug = new Map<string, BlogListItem>()

  try {
    const payload = await getPayloadInstance()
    const res = await payload.find({
      collection: 'blog-posts',
      locale,
      limit: 80,
      depth: 0,
      overrideAccess: false,
      sort: '-publishedAt',
      where: { published: { equals: true } },
    })
    for (const doc of res.docs as BlogPost[]) {
      const title = typeof doc.title === 'string' ? doc.title : doc.slug
      const excerpt = typeof doc.excerpt === 'string' ? doc.excerpt : ''
      const date = formatPostDate(doc.publishedAt ?? doc.createdAt, doc.createdAt.slice(0, 10))
      bySlug.set(doc.slug, { slug: doc.slug, title, date, excerpt })
    }
  } catch {
    // sin BD, solo MDX
  }

  for (const row of staticPosts[locale]) {
    if (bySlug.has(row.slug)) continue
    bySlug.set(row.slug, {
      slug: row.slug,
      title: row.title,
      date: row.date,
      excerpt: row.excerpt,
    })
  }

  return Array.from(bySlug.values()).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

/** En `next build` evita conectar a Payload desde el sitemap. */
export async function listPostsForSitemap(locale: Locale): Promise<BlogListItem[]> {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return staticPosts[locale].map((p) => ({
      slug: p.slug,
      title: p.title,
      date: p.date,
      excerpt: p.excerpt,
    }))
  }
  return listPosts(locale)
}
