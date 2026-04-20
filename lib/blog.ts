import fs from 'node:fs/promises'
import path from 'node:path'

import { compileMDX } from 'next-mdx-remote/rsc'

export type BlogSlug = 'bienvenida'

export type PostMeta = {
  title: string
  date: string
  excerpt: string
}

const posts: Record<
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

export function listPosts(locale: 'es' | 'en') {
  return posts[locale]
}

export async function getPost(locale: 'es' | 'en', slug: string) {
  const entry = posts[locale].find((p) => p.slug === slug)
  if (!entry) return null
  const full = path.join(process.cwd(), 'content', 'blog', entry.file)
  const source = await fs.readFile(full, 'utf8')
  const compiled = await compileMDX<PostMeta>({
    source,
    options: { parseFrontmatter: true },
  })
  return {
    content: compiled.content,
    meta: compiled.frontmatter,
    slug: entry.slug,
  }
}
