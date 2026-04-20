import Image from 'next/image'

import { Card, CardContent } from '@/components/ui/card'
import { absoluteMediaUrl } from '@/lib/media-url'
import { getPayloadInstance } from '@/lib/payload-server'

export async function TeamSection({
  locale,
  title,
  description,
}: {
  locale: 'es' | 'en'
  title: string
  description: string
}) {
  const payload = await getPayloadInstance()
  const team = await payload.find({
    collection: 'team-members',
    sort: 'order',
    depth: 1,
    locale,
    limit: 24,
  })

  return (
    <div className="bg-gradient-to-b from-background to-seed-sand-dark/30">
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl font-semibold text-seed-forest md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{description}</p>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.docs.map((m) => {
            const photo =
              typeof m.photo === 'object' && m.photo && 'url' in m.photo
                ? absoluteMediaUrl(m.photo.url as string)
                : null
            const name = m.name as string
            const role = m.title as string
            const bio = m.bio as string | undefined
            return (
              <Card
                key={String(m.id)}
                className="overflow-hidden border-seed-forest/10 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative mx-auto mt-8 size-32 overflow-hidden rounded-full border-4 border-seed-turquoise/40 bg-seed-sand-dark">
                  {photo ? (
                    <Image src={photo} alt={name} fill className="object-cover" />
                  ) : null}
                </div>
                <CardContent className="pb-8 pt-6">
                  <h2 className="font-heading text-xl text-seed-forest">{name}</h2>
                  <p className="text-sm font-medium text-seed-emerald">{role}</p>
                  {bio ? <p className="mt-3 text-sm text-muted-foreground">{bio}</p> : null}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
