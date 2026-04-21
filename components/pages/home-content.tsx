import { HeroHome } from '@/components/sections/hero-home'
import { TestimonialCarousel, type TestimonialItem } from '@/components/sections/testimonial-carousel'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Locale } from '@/lib/i18n/copy'
import type { Testimonial } from '@/payload-types'
import { absoluteMediaUrl } from '@/lib/media-url'
import { getPayloadInstance } from '@/lib/payload-server'
import { getSiteConfig, pickLocalizedString, PAYLOAD_READ_TIMEOUT_MS, runWithTimeout } from '@/lib/site-data'
import { routeMap } from '@/lib/i18n/routes'
import Link from 'next/link'

const blurbs = {
  es: [
    { t: 'Legal & residencia', d: 'Residencias, visados y cumplimiento — sin sorpresas.' },
    { t: 'Hogar & inversión', d: 'Curación de propiedades premium alineada a tu estilo de vida.' },
    { t: 'Lifestyle', d: 'Escuelas, salud y comunidad expat en República Dominicana.' },
  ],
  en: [
    { t: 'Legal & residency', d: 'Residency, visas, and compliance — no surprises.' },
    { t: 'Home & investment', d: 'Premium property curation aligned with your lifestyle.' },
    { t: 'Lifestyle', d: 'Schools, healthcare, and expat community across the Dominican Republic.' },
  ],
} as const

export async function HomeContent({ locale }: { locale: Locale }) {
  const [siteEs, siteEn, testimonialsResult] = await Promise.all([
    getSiteConfig('es'),
    getSiteConfig('en'),
    (async () => {
      try {
        const found = await runWithTimeout(
          (async () => {
            const payload = await getPayloadInstance()
            return await payload.find({
              collection: 'testimonials',
              limit: 12,
              depth: 1,
              locale,
              where: { featured: { equals: true } },
            })
          })(),
          PAYLOAD_READ_TIMEOUT_MS,
          '[HomeContent] testimonials',
        )
        if (found == null) return { docs: [] as Testimonial[] }
        return found
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[HomeContent] testimonios omitidos:', e)
        }
        return { docs: [] as Testimonial[] }
      }
    })(),
  ])

  const site = locale === 'es' ? siteEs : siteEn
  const siteAlt = locale === 'es' ? siteEn : siteEs

  const testimonials = testimonialsResult

  const items: TestimonialItem[] = testimonials.docs.map((doc: Testimonial) => {
    const photo = doc.photo
    let url: string | undefined
    if (typeof photo === 'object' && photo && 'url' in photo && photo.url) {
      url = absoluteMediaUrl(photo.url as string) ?? undefined
    }
    return {
      id: String(doc.id),
      clientName: doc.clientName as string,
      quote: doc.quote as string,
      nationality: doc.nationality as string,
      rating: doc.rating as number,
      photo: url ? { url } : null,
    }
  })

  const title = pickLocalizedString(
    site?.heroTitle,
    siteAlt?.heroTitle,
    locale === 'es'
      ? 'Tu nuevo comienzo en el Caribe, con confianza absoluta'
      : 'Your new beginning in the Caribbean, with absolute confidence',
  )
  const subtitle = pickLocalizedString(
    site?.heroSubtitle,
    siteAlt?.heroSubtitle,
    locale === 'es'
      ? 'Legal, vivienda y lifestyle — un equipo boutique para familias y profesionales en República Dominicana.'
      : 'Legal, home, and lifestyle — a boutique team for families and professionals in the Dominican Republic.',
  )

  const r = routeMap[locale]

  return (
    <>
      <HeroHome locale={locale} title={title} subtitle={subtitle} />
      <TestimonialCarousel
        items={items}
        title={
          locale === 'es'
            ? 'Historias de quienes ya hicieron el cambio'
            : 'Stories from those who already made the move'
        }
      />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {blurbs[locale].map((c) => (
            <Card
              key={c.t}
              className="border-seed-forest/10 bg-white/90 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
            >
              <CardHeader>
                <CardTitle className="font-heading text-xl text-seed-forest">{c.t}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">{c.d}</CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link
            href={r.contact}
            className={buttonVariants({
              size: 'lg',
              className:
                'rounded-full bg-seed-emerald px-10 text-primary-foreground hover:bg-seed-emerald/90',
            })}
          >
            {locale === 'es' ? 'Hablemos de tu caso' : "Let's talk about your case"}
          </Link>
        </div>
      </section>
    </>
  )
}
