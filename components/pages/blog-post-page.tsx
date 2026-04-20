import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import type { Locale } from '@/lib/i18n/copy'
import { getPost } from '@/lib/blog'
import { routeMap } from '@/lib/i18n/routes'
import { alternatesForBlogPost } from '@/lib/seo/alternates'
import { primaryKeywordsEn, primaryKeywordsEs } from '@/lib/seo/constants'
import { BlogPostingJsonLd } from '@/lib/seo/json-ld'

const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const back = {
  es: '← Blog',
  en: '← Blog',
} as const

export async function generateBlogPostMetadata(
  locale: Locale,
  slug: string,
): Promise<Metadata> {
  const post = await getPost(locale, slug)
  if (!post) return {}
  const path = locale === 'es' ? `/blog/${slug}` : `/en/blog/${slug}`
  const keywords = [...(locale === 'es' ? primaryKeywordsEs : primaryKeywordsEn)]
  return {
    title: post.meta.title,
    description: post.meta.excerpt,
    keywords,
    alternates: alternatesForBlogPost(locale, slug),
    openGraph: {
      type: 'article',
      title: post.meta.title,
      description: post.meta.excerpt,
      url: new URL(path, base).toString(),
      publishedTime: post.meta.date,
      locale: locale === 'es' ? 'es_DO' : 'en_US',
      siteName: 'The Seed RD',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta.title,
      description: post.meta.excerpt,
    },
  }
}

export async function BlogPostPage({ locale, slug }: { locale: Locale; slug: string }) {
  const post = await getPost(locale, slug)
  if (!post) notFound()
  const r = routeMap[locale]

  return (
    <>
      <BlogPostingJsonLd
        headline={post.meta.title}
        datePublished={post.meta.date}
        description={post.meta.excerpt}
        urlPath={locale === 'es' ? `/blog/${slug}` : `/en/blog/${slug}`}
      />
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href={r.blog} className="text-sm text-seed-emerald hover:underline">
        {back[locale]}
      </Link>
      <header className="mt-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{post.meta.date}</p>
        <h1 className="font-heading mt-2 text-4xl font-semibold text-seed-forest">{post.meta.title}</h1>
        <p className="mt-3 text-muted-foreground">{post.meta.excerpt}</p>
      </header>
      <div className="mt-10 max-w-none space-y-4 text-base leading-relaxed text-foreground [&_h1]:font-heading [&_h1]:text-2xl [&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-xl [&_a]:text-seed-emerald [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-seed-turquoise [&_blockquote]:pl-4">
        {post.content}
      </div>
    </article>
    </>
  )
}
