import Image from 'next/image'
import { Facebook, Instagram, Linkedin } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { absoluteMediaUrl } from '@/lib/media-url'
import { getPayloadInstance } from '@/lib/payload-server'

function normalizeExternalUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null
  const t = url.trim()
  if (/^https?:\/\//i.test(t)) return t
  return `https://${t.replace(/^\/+/, '')}`
}

function normalizeWhatsApp(value: string | null | undefined): string | null {
  if (!value?.trim()) return null
  const t = value.trim()
  if (/^https?:\/\//i.test(t)) return t
  const digits = t.replace(/\D/g, '')
  if (digits.length < 8) return null
  return `https://wa.me/${digits}`
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.883 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

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
            const wa = normalizeWhatsApp(m.whatsapp as string | null | undefined)
            const li = normalizeExternalUrl(m.linkedin as string | null | undefined)
            const ig = normalizeExternalUrl(m.instagram as string | null | undefined)
            const fb = normalizeExternalUrl(m.facebook as string | null | undefined)
            const hasSocial = Boolean(wa || li || ig || fb)
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
                  {hasSocial ? (
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                      {wa ? (
                        <a
                          href={wa}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex size-9 items-center justify-center rounded-full border border-seed-forest/15 bg-background text-seed-emerald transition hover:bg-seed-turquoise/20"
                          aria-label={
                            locale === 'en' ? `${name} on WhatsApp` : `${name} en WhatsApp`
                          }
                        >
                          <WhatsAppIcon className="size-5" />
                        </a>
                      ) : null}
                      {li ? (
                        <a
                          href={li}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex size-9 items-center justify-center rounded-full border border-seed-forest/15 bg-background text-seed-forest transition hover:bg-seed-turquoise/20"
                          aria-label={
                            locale === 'en' ? `${name} on LinkedIn` : `${name} en LinkedIn`
                          }
                        >
                          <Linkedin className="size-5" aria-hidden />
                        </a>
                      ) : null}
                      {ig ? (
                        <a
                          href={ig}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex size-9 items-center justify-center rounded-full border border-seed-forest/15 bg-background text-seed-forest transition hover:bg-seed-turquoise/20"
                          aria-label={
                            locale === 'en' ? `${name} on Instagram` : `${name} en Instagram`
                          }
                        >
                          <Instagram className="size-5" aria-hidden />
                        </a>
                      ) : null}
                      {fb ? (
                        <a
                          href={fb}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex size-9 items-center justify-center rounded-full border border-seed-forest/15 bg-background text-seed-forest transition hover:bg-seed-turquoise/20"
                          aria-label={
                            locale === 'en' ? `${name} on Facebook` : `${name} en Facebook`
                          }
                        >
                          <Facebook className="size-5" aria-hidden />
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
