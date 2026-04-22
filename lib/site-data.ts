import { cache } from 'react'

import { getPayloadInstance } from '@/lib/payload-server'
import type { SiteConfig } from '@/payload-types'

const isProd = process.env.NODE_ENV === 'production'
const SITE_CONFIG_TIMEOUT_MS = isProd ? 25000 : 12000
/** Último site-config válido por locale para evitar volver a textos fijos si hay timeout puntual. */
const lastSiteConfigByLocale: Partial<Record<'es' | 'en', SiteConfig>> = {}
/** Lecturas Payload (testimonios, etc.). */
export const PAYLOAD_READ_TIMEOUT_MS = isProd ? 25000 : 12000

/**
 * Si Payload/SQLite se bloquea (p. ej. otro proceso con la BD abierta en Windows),
 * sin tope la RSC puede quedar colgada y la página “no carga”. Tras `ms`, devuelve null.
 */
export async function runWithTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T | null> {
  return new Promise((resolve) => {
    let settled = false
    const t = setTimeout(() => {
      if (settled) return
      settled = true
      if (process.env.NODE_ENV === 'development') {
        console.warn(`${label} — timeout ${ms}ms, usando fallback`)
      }
      resolve(null)
    }, ms)
    promise.then(
      (v) => {
        if (settled) return
        settled = true
        clearTimeout(t)
        resolve(v)
      },
      () => {
        if (settled) return
        settled = true
        clearTimeout(t)
        resolve(null)
      },
    )
  })
}

export const getSiteConfig = cache(async (locale: 'es' | 'en'): Promise<SiteConfig | null> => {
  try {
    const doc = await runWithTimeout(
      (async () => {
        const payload = await getPayloadInstance()
        return await payload.findGlobal({
          slug: 'site-config',
          locale,
          fallbackLocale: 'es',
          depth: 1,
        })
      })(),
      SITE_CONFIG_TIMEOUT_MS,
      `[getSiteConfig:${locale}]`,
    )
    if (doc) {
      lastSiteConfigByLocale[locale] = doc
      return doc
    }
    return lastSiteConfigByLocale[locale] ?? null
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[getSiteConfig] error, usando null:', e)
    }
    return lastSiteConfigByLocale[locale] ?? null
  }
})

export function defaultWhatsapp(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP || '18095551234'
}

/** Extrae texto para el locale activo; admite `string` o forma localizada `{ es?, en? }` (Payload). */
function extractLocalizedString(value: unknown, locale: 'es' | 'en'): string {
  if (value == null) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const o = value as Record<string, unknown>
    const es = typeof o.es === 'string' ? o.es.trim() : ''
    const en = typeof o.en === 'string' ? o.en.trim() : ''
    if (locale === 'es') return es || en
    return en || es
  }
  return ''
}

/**
 * Payload guarda campos `localized` por idioma. Si solo rellenaste ES y visitas /en,
 * el valor en EN viene vacío: usa el otro idioma antes que el texto fijo del código.
 * Si la API devuelve el bloque `{ es, en }` en lugar de un string plano, también se resuelve.
 */
export function pickLocalizedString(
  valueCurrent: unknown,
  valueAlternate: unknown,
  locale: 'es' | 'en',
  fallback: string,
): string {
  const cur = extractLocalizedString(valueCurrent, locale)
  if (cur) return cur
  const alt = extractLocalizedString(valueAlternate, locale)
  if (alt) return alt
  return fallback
}
