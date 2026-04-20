import { Building2, Mail, MapPin, Phone } from 'lucide-react'

import { ContactForm } from '@/components/site/contact-form'
import type { Locale } from '@/lib/i18n/copy'
import { routeMap } from '@/lib/i18n/routes'
import { BreadcrumbJsonLd, FaqJsonLd } from '@/lib/seo/json-ld'
import { defaultWhatsapp, getSiteConfig } from '@/lib/site-data'

const copy = {
  es: {
    title: 'Contacto',
    intro:
      'Agenda una llamada o escríbenos por WhatsApp. Respondemos en horario extendido para zonas US/EU.',
  },
  en: {
    title: 'Contact',
    intro: 'Book a call or message us on WhatsApp. We cover extended hours for US/EU time zones.',
  },
} as const

export async function ContactPage({ locale }: { locale: Locale }) {
  const cfg = await getSiteConfig(locale)
  const phone = cfg?.whatsappPhone || defaultWhatsapp()
  const email = cfg?.contactEmail || 'hello@theseerd.com'
  const address = pickAddress(cfg?.addressLine, locale)
  const rnc = cfg?.rnc?.trim()
  const t = copy[locale]
  const r = routeMap[locale]
  const faqs =
    locale === 'es'
      ? [
          {
            question: '¿Trabajan con familias que aún no están en República Dominicana?',
            answer: 'Sí. Diseñamos el roadmap legal y de vivienda antes del viaje y coordinamos la llegada.',
          },
          {
            question: '¿Cuánto tarda una primera respuesta?',
            answer: 'Normalmente en 24–48 h hábiles por WhatsApp o email, con ventanas amplias para US/EU.',
          },
        ]
      : [
          {
            question: 'Do you work with families not yet in the Dominican Republic?',
            answer: 'Yes. We design legal and housing roadmaps before travel and coordinate arrival.',
          },
          {
            question: 'How fast is the first reply?',
            answer: 'Typically within 24–48 business hours via WhatsApp or email, with broad US/EU coverage.',
          },
        ]

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: locale === 'es' ? 'Inicio' : 'Home', url: r.home },
          { name: t.title, url: r.contact },
        ]}
      />
      <FaqJsonLd faqs={faqs} />
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h1 className="font-heading text-4xl font-semibold text-seed-forest">{t.title}</h1>
          <p className="mt-4 text-muted-foreground">{t.intro}</p>
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex gap-3">
              <Phone className="size-5 text-seed-turquoise" />
              <a href={`https://wa.me/${String(phone).replace(/\D/g, '')}`} className="hover:underline">
                WhatsApp {phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="size-5 text-seed-turquoise" />
              <a href={`mailto:${email}`} className="hover:underline">
                {email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="size-5 text-seed-turquoise" />
              <span>{address}</span>
            </li>
            {rnc ? (
              <li className="flex gap-3">
                <Building2 className="size-5 text-seed-turquoise" />
                <span>RNC: {rnc}</span>
              </li>
            ) : null}
          </ul>
        </div>
        <ContactForm locale={locale} />
      </div>
    </div>
    </>
  )
}

function pickAddress(
  val: string | { es?: string; en?: string } | null | undefined,
  locale: Locale,
): string {
  if (val == null) return locale === 'es' ? 'República Dominicana' : 'Dominican Republic'
  if (typeof val === 'string') return val
  return val[locale] ?? val.es ?? val.en ?? ''
}
