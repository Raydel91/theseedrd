import { Mail, MapPin, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { routeMap } from '@/lib/i18n/routes'
import type { Locale } from '@/lib/i18n/copy'
import { copy } from '@/lib/i18n/copy'
import { defaultWhatsapp } from '@/lib/site-data'
import type { SiteConfig } from '@/payload-types'

const DEFAULT_MAP_EMBED =
  'https://maps.google.com/maps?q=Rep%C3%BAblica%20Dominicana&hl=es&z=7&ie=UTF8&iwloc=&output=embed'

function pickAddress(
  val: string | { es?: string; en?: string } | null | undefined,
  locale: Locale,
): string | null {
  if (val == null) return null
  if (typeof val === 'string') {
    const s = val.trim()
    return s.length > 0 ? s : null
  }
  const s = (val[locale] ?? val.es ?? val.en ?? '').trim()
  return s.length > 0 ? s : null
}

function ensureHttp(url: string): string {
  const u = url.trim()
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u
  return `https://${u}`
}

export function SiteFooter({ locale, site }: { locale: Locale; site: SiteConfig | null }) {
  const t = copy[locale]
  const r = routeMap[locale]

  const email = site?.contactEmail?.trim() || 'hello@theseerd.com'
  const phone = site?.whatsappPhone?.trim() || defaultWhatsapp()
  const waDigits = String(phone).replace(/\D/g, '')
  const address = pickAddress(site?.addressLine as string | { es?: string; en?: string } | null | undefined, locale)
  const rnc = site?.rnc?.trim() || null
  const instagram = site?.instagramUrl?.trim() ? ensureHttp(site.instagramUrl) : ''
  const facebook = site?.facebookUrl?.trim() ? ensureHttp(site.facebookUrl) : ''
  const mapSrc = site?.mapEmbedUrl?.trim() || DEFAULT_MAP_EMBED

  return (
    <footer className="border-t border-seed-forest/10 bg-seed-forest text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image src="/logo.svg" alt={t.brand} width={160} height={48} className="mb-4 h-10 w-auto brightness-0 invert" />
            <p className="max-w-xs text-sm text-primary-foreground/80">{t.tagline}</p>
          </div>

          <div>
            <p className="font-heading text-lg font-medium">{t.footer.follow}</p>
            <ul className="mt-3 space-y-2 text-sm text-primary-foreground/85">
              <li>
                <Link href={r.about} className="hover:underline">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href={r.services} className="hover:underline">
                  {t.nav.services}
                </Link>
              </li>
              <li>
                <Link href={r.contact} className="hover:underline">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-heading text-lg font-medium">{t.footer.contact}</p>
            <ul className="mt-3 space-y-3 text-sm text-primary-foreground/90">
              <li className="flex gap-2">
                <Mail className="mt-0.5 size-4 shrink-0 text-seed-turquoise" aria-hidden />
                <a href={`mailto:${email}`} className="break-all hover:underline">
                  {email}
                </a>
              </li>
              <li className="flex gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-seed-turquoise" aria-hidden />
                <a href={`https://wa.me/${waDigits}`} className="hover:underline" target="_blank" rel="noreferrer">
                  {phone}
                </a>
              </li>
              {address ? (
                <li className="flex gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-seed-turquoise" aria-hidden />
                  <span className="text-primary-foreground/85">{address}</span>
                </li>
              ) : null}
            </ul>

            {(instagram || facebook) && (
              <div className="mt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-primary-foreground/60">{t.footer.social}</p>
                <div className="mt-2 flex flex-wrap gap-3">
                  {instagram ? (
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-white/15 px-3 py-1.5 text-sm transition hover:bg-white/10"
                    >
                      Instagram
                    </a>
                  ) : null}
                  {facebook ? (
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-white/15 px-3 py-1.5 text-sm transition hover:bg-white/10"
                    >
                      Facebook
                    </a>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border border-white/10 bg-black/15">
            <iframe
              title={locale === 'es' ? 'Mapa' : 'Map'}
              src={mapSrc}
              width="100%"
              height="180"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="opacity-90"
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-primary-foreground/70 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6 sm:gap-y-2">
          <span>
            © {new Date().getFullYear()} {t.brand}. {t.footer.rights}
          </span>
          {rnc ? (
            <span>
              {t.footer.rncLabel}: {rnc}
            </span>
          ) : null}
          <span>{t.footer.privacy}</span>
        </div>
      </div>
    </footer>
  )
}
