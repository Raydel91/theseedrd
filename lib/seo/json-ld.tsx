import type { Locale } from '@/lib/i18n/copy'
import Script from 'next/script'

const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

function JsonLdScript({ id, data }: { id: string; data: Record<string, unknown> }) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function OrganizationJsonLd() {
  return (
    <JsonLdScript
      id="jsonld-organization"
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'The Seed RD',
        url: base,
        logo: `${base}/logo.svg`,
        sameAs: [],
      }}
    />
  )
}

export function WebSiteJsonLd() {
  return (
    <JsonLdScript
      id="jsonld-website"
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'The Seed RD',
        url: base,
        inLanguage: ['es-DO', 'en'],
        potentialAction: {
          '@type': 'SearchAction',
          target: `${base}/blog?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  )
}

export function LocalBusinessJsonLd({
  locale,
  addressLine,
}: {
  locale: Locale
  addressLine?: string | null
}) {
  return (
    <JsonLdScript
      id="jsonld-local-business"
      data={{
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'The Seed RD',
        url: base,
        description:
          locale === 'es'
            ? 'Concierge de relocalización y real estate de lujo en República Dominicana.'
            : 'Luxury relocation and real estate concierge in the Dominican Republic.',
        address: addressLine
          ? {
              '@type': 'PostalAddress',
              streetAddress: addressLine,
              addressCountry: 'DO',
            }
          : undefined,
      }}
    />
  )
}

export function ServiceListJsonLd({
  locale,
  services,
}: {
  locale: Locale
  services: { name: string; description: string }[]
}) {
  return (
    <JsonLdScript
      id="jsonld-service-list"
      data={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: services.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Service',
            name: s.name,
            description: s.description,
            provider: { '@type': 'Organization', name: 'The Seed RD', url: base },
            areaServed: { '@type': 'Country', name: locale === 'es' ? 'República Dominicana' : 'Dominican Republic' },
          },
        })),
      }}
    />
  )
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  return (
    <JsonLdScript
      id="jsonld-breadcrumb"
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((it, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: it.name,
          item: it.url.startsWith('http') ? it.url : new URL(it.url, base).toString(),
        })),
      }}
    />
  )
}

export function FaqJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <JsonLdScript
      id="jsonld-faq"
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }}
    />
  )
}

export function BlogPostingJsonLd({
  headline,
  datePublished,
  description,
  urlPath,
}: {
  headline: string
  datePublished: string
  description: string
  urlPath: string
}) {
  const url = new URL(urlPath, base).toString()
  return (
    <JsonLdScript
      id={`jsonld-blogposting-${encodeURIComponent(urlPath)}`}
      data={{
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline,
        datePublished,
        description,
        url,
        author: { '@type': 'Organization', name: 'The Seed RD' },
        publisher: { '@type': 'Organization', name: 'The Seed RD', logo: { '@type': 'ImageObject', url: `${base}/logo.svg` } },
      }}
    />
  )
}
