import type { Locale } from '@/lib/i18n/copy'

/** Extrae texto de campos localizados de Payload o string plana */
export function pickLocale(
  val: string | { es?: string; en?: string } | null | undefined,
  locale: Locale,
): string {
  if (val == null) return ''
  if (typeof val === 'string') return val
  return val[locale] ?? val.es ?? val.en ?? ''
}

/**
 * Con `localization.fallback: false`, un locale puede venir vacío aunque el otro sí esté en BD.
 * Usar junto a `fallbackLocale` en `find` cuando sea posible.
 */
export function pickLocaleWithFallback(
  val: string | { es?: string; en?: string } | null | undefined,
  locale: Locale,
): string {
  const primary = pickLocale(val, locale).trim()
  if (primary) return primary
  const alt = pickLocale(val, locale === 'es' ? 'en' : 'es').trim()
  return alt
}
