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
