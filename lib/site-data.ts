import { cache } from 'react'

import { getPayloadInstance } from '@/lib/payload-server'

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

export const getSiteConfig = cache(async (locale: 'es' | 'en') => {
  try {
    const doc = await runWithTimeout(
      (async () => {
        const payload = await getPayloadInstance()
        return await payload.findGlobal({
          slug: 'site-config',
          locale,
          depth: 1,
        })
      })(),
      30000,
      `[getSiteConfig:${locale}]`,
    )
    return doc
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[getSiteConfig] usando fallback (null):', e)
    }
    return null
  }
})

export function defaultWhatsapp(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP || '18095551234'
}

/**
 * Payload guarda campos `localized` por idioma. Si solo rellenaste ES y visitas /en,
 * el valor en EN viene vacío: usa el otro idioma antes que el texto fijo del código.
 */
export function pickLocalizedString(
  valueCurrent: unknown,
  valueAlternate: unknown,
  fallback: string,
): string {
  const cur = typeof valueCurrent === 'string' ? valueCurrent.trim() : ''
  if (cur) return cur
  const alt = typeof valueAlternate === 'string' ? valueAlternate.trim() : ''
  if (alt) return alt
  return fallback
}
