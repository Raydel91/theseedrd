import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Locale } from '@/lib/i18n/copy'
import { listPosts } from '@/lib/blog'
import { routeMap } from '@/lib/i18n/routes'

const copy = {
  es: {
    title: 'Blog',
    intro: 'Ideas, guías y actualidad para tu relocalización en República Dominicana.',
  },
  en: {
    title: 'Blog',
    intro: 'Ideas, guides, and updates for your relocation to the Dominican Republic.',
  },
} as const

export function BlogListPage({ locale }: { locale: Locale }) {
  const posts = listPosts(locale)
  const r = routeMap[locale]
  const t = copy[locale]

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-semibold text-seed-forest">{t.title}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t.intro}</p>
      <div className="mt-10 grid gap-6">
        {posts.map((p) => (
          <Link key={p.slug} href={`${r.blog}/${p.slug}`}>
            <Card className="border-seed-forest/10 transition hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader>
                <CardTitle className="font-heading text-xl">{p.title}</CardTitle>
                <p className="text-xs text-muted-foreground">{p.date}</p>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{p.excerpt}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
