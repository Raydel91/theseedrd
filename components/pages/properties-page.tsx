import Image from 'next/image'

import { PropertyFilters } from '@/components/site/property-filters'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Locale } from '@/lib/i18n/copy'
import { pickLocale } from '@/lib/pick-locale'
import { absoluteMediaUrl } from '@/lib/media-url'
import { getPayloadInstance } from '@/lib/payload-server'

const copy = {
  es: {
    title: 'Hogar',
    intro: 'Propiedades curadas en destinos premium de República Dominicana.',
  },
  en: {
    title: 'Homes',
    intro: 'Curated properties in premium destinations across the Dominican Republic.',
  },
} as const

export async function PropertiesPage({ locale }: { locale: Locale }) {
  const payload = await getPayloadInstance()
  const res = await payload.find({
    collection: 'properties',
    where: { published: { equals: true } },
    depth: 1,
    locale,
    limit: 24,
    sort: '-createdAt',
  })
  const t = copy[locale]

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-semibold text-seed-forest">{t.title}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t.intro}</p>

      <PropertyFilters />

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {res.docs.map((prop) => {
          const title = pickLocale(prop.title as string | { es?: string; en?: string }, locale)
          const loc = pickLocale(prop.location as string | { es?: string; en?: string }, locale)
          const cover =
            typeof prop.coverImage === 'object' && prop.coverImage && 'url' in prop.coverImage
              ? absoluteMediaUrl(prop.coverImage.url as string)
              : null
          const tags = (prop.tags as string[]) || []
          return (
            <Card
              key={String(prop.id)}
              className="group overflow-hidden border-seed-forest/10 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
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
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-seed-emerald">{loc}</p>
                <h2 className="font-heading text-lg text-seed-forest">{title}</h2>
                <p className="mt-2 text-xl font-semibold text-seed-forest">
                  ${(prop.price as number).toLocaleString()}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs capitalize">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
