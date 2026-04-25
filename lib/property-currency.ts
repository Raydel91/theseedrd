import type { SiteConfig } from '@/payload-types'

export type PropertyCurrency = 'USD' | 'DOP'

const DEFAULT_DOP_RATE = 60

export function sanitizeDopRate(rateRaw: unknown): number {
  const n = Number(rateRaw)
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_DOP_RATE
  return n
}

export function getDopRateFromSiteConfig(site: SiteConfig | null | undefined): number {
  return sanitizeDopRate((site as { propertyUsdToDopRate?: unknown } | null | undefined)?.propertyUsdToDopRate)
}

export function normalizePropertyCurrency(raw: string | null | undefined): PropertyCurrency {
  return raw === 'DOP' ? 'DOP' : 'USD'
}

export function toDisplayPrice(usdPrice: number, currency: PropertyCurrency, dopRate: number): number {
  if (currency === 'DOP') return usdPrice * dopRate
  return usdPrice
}

export function toUsdPrice(inputPrice: number, currency: PropertyCurrency, dopRate: number): number {
  if (currency === 'DOP') return inputPrice / dopRate
  return inputPrice
}

export function formatPropertyPrice(value: number, currency: PropertyCurrency, locale: 'es' | 'en'): string {
  const lang = locale === 'en' ? 'en-US' : 'es-DO'
  return new Intl.NumberFormat(lang, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}
