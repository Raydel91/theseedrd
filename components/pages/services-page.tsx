import Link from 'next/link'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { Locale } from '@/lib/i18n/copy'
import {
  formatPropertyPrice,
  getDopRateFromSiteConfig,
  normalizePropertyCurrency,
  toDisplayPrice,
} from '@/lib/property-currency'
import { pickLocaleWithFallback } from '@/lib/pick-locale'
import { getPayloadInstance } from '@/lib/payload-server'
import { routeMap } from '@/lib/i18n/routes'
import { ServiceListJsonLd } from '@/lib/seo/json-ld'
import { getSiteConfig } from '@/lib/site-data'
import type { Package } from '@/payload-types'

const copy = {
  es: {
    title: 'Servicios',
    intro: 'Paquetes modulares con precios transparentes. Ajustamos cada roadmap a tu familia y objetivos.',
    defaultCta: 'Solicitar',
    defaultBilling: 'por caso',
    currency: 'Moneda',
  },
  en: {
    title: 'Services',
    intro: 'Modular packages with transparent pricing. We tailor every roadmap to your family and goals.',
    defaultCta: 'Request',
    defaultBilling: 'per case',
    currency: 'Currency',
  },
} as const

export async function ServicesPage({ locale, currencyParam }: { locale: Locale; currencyParam?: string }) {
  const t = copy[locale]
  const r = routeMap[locale]
  const selectedCurrency = normalizePropertyCurrency(currencyParam)
  const site = await getSiteConfig(locale)
  const dopRate = getDopRateFromSiteConfig(site)
  let packs: { docs: Package[] } = { docs: [] }
  try {
    const payload = await getPayloadInstance()
    packs = await payload.find({
      collection: 'packages',
      sort: 'order',
      locale,
      fallbackLocale: 'es',
      limit: 24,
    })
  } catch {
    /* BD no disponible o error puntual: no tumbar toda la página */
  }
  const servicesForLd = packs.docs.map((p) => ({
    name: pickLocaleWithFallback(p.title as string | { es?: string; en?: string }, locale),
    description: pickLocaleWithFallback(p.shortDescription as string | { es?: string; en?: string }, locale),
  }))

  return (
    <>
      <ServiceListJsonLd locale={locale} services={servicesForLd} />
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-semibold text-seed-forest md:text-5xl">{t.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t.intro}</p>
      <div className="mt-4 flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">{t.currency}:</span>
        <Link
          href={selectedCurrency === 'USD' ? r.services : `${r.services}?moneda=USD`}
          className={
            selectedCurrency === 'USD'
              ? 'rounded-full bg-seed-forest px-3 py-1 font-medium text-white'
              : 'rounded-full border border-seed-forest/20 px-3 py-1 text-seed-forest'
          }
        >
          USD
        </Link>
        <Link
          href={`${r.services}?moneda=DOP`}
          className={
            selectedCurrency === 'DOP'
              ? 'rounded-full bg-seed-forest px-3 py-1 font-medium text-white'
              : 'rounded-full border border-seed-forest/20 px-3 py-1 text-seed-forest'
          }
        >
          RD$
        </Link>
      </div>
      <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {packs.docs.map((p) => {
          const title = pickLocaleWithFallback(p.title as string | { es?: string; en?: string }, locale)
          const desc = pickLocaleWithFallback(p.shortDescription as string | { es?: string; en?: string }, locale)
          const features = (p.features as { item?: string | { es?: string; en?: string } }[]) || []
          const highlighted = p.highlighted as boolean
          const billing = pickLocaleWithFallback(
            p.billingNote as string | { es?: string; en?: string } | undefined,
            locale,
          )
          const cta = pickLocaleWithFallback(p.ctaLabel as string | { es?: string; en?: string } | undefined, locale)
          return (
            <div key={String(p.id)}>
              <Card
                className={`h-full border-seed-forest/10 transition hover:-translate-y-1 hover:shadow-xl ${
                  highlighted ? 'ring-2 ring-seed-turquoise/60' : ''
                }`}
              >
                <CardHeader>
                  <CardTitle className="font-heading text-2xl text-seed-forest">{title}</CardTitle>
                  <p className="text-3xl font-semibold text-seed-emerald">
                    {formatPropertyPrice(
                      toDisplayPrice(p.price as number, selectedCurrency, dopRate),
                      selectedCurrency,
                      locale,
                    )}
                    <span className="text-base font-normal text-muted-foreground">
                      {' '}
                      / {billing || t.defaultBilling}
                    </span>
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {features.map((f, i) => {
                      const item = pickLocaleWithFallback(f.item as string | { es?: string; en?: string }, locale)
                      return (
                        <li key={i} className="flex gap-2">
                          <span className="text-seed-turquoise">✓</span>
                          <span>{item}</span>
                        </li>
                      )
                    })}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link
                    href={r.contact}
                    className="inline-flex h-10 w-full items-center justify-center rounded-full bg-seed-emerald px-4 text-sm font-medium text-primary-foreground transition hover:bg-seed-emerald/90"
                  >
                    {cta || t.defaultCta}
                  </Link>
                </CardFooter>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
    </>
  )
}
