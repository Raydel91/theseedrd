import * as cheerio from 'cheerio'

import { listingKindFromPath, matchesListingKind, matchesRegion } from '../config/regions.js'
import { fetchText } from '../http.js'
import type { HousingListing, ListingKind, RegionId, SourceId } from '../types.js'

const SOURCE: SourceId = 'supercasas'
const BASE = 'https://www.supercasas.com'

/** Slugs pueden incluir comas (ej. ...-juan-dolio). */
const LISTING_HREF =
  /^https?:\/\/(www\.)?supercasas\.com\/[a-z0-9][a-z0-9\-.,_%]*\/\d+\/?$/i

function normalizeUrl(href: string): string | null {
  try {
    const u = new URL(href, BASE)
    if (!u.hostname.includes('supercasas.com')) return null
    u.hash = ''
    u.search = ''
    const path = u.pathname.replace(/\/+$/, '/')
    if (!/\/\d+\/$/.test(path)) return null
    return `https://www.supercasas.com${path}`
  } catch {
    return null
  }
}

function extractPriceFromText(text: string): string | undefined {
  const m = text.match(/(?:US\$|RD\$)\s*[\d,.]+(?:\/Mes|\/D[ií]a)?/i)
  return m?.[0]?.trim()
}

/**
 * Extrae anuncios desde páginas de listado de SuperCasas (resultados de /buscar/ u otra URL de listado).
 */
export async function scrapeSuperCasas(options: {
  startUrl: string
  region: RegionId
  kind: ListingKind
  maxResults: number
  maxPages: number
  delayMs?: number
}): Promise<HousingListing[]> {
  const { region, kind, maxResults, maxPages, delayMs } = options
  let startUrl = options.startUrl
  if (!startUrl.startsWith('http')) {
    startUrl = `${BASE}${startUrl.startsWith('/') ? '' : '/'}${startUrl}`
  }

  const seen = new Set<string>()
  const out: HousingListing[] = []

  let pageUrl: string | null = startUrl
  let pages = 0

  while (pageUrl && pages < maxPages && out.length < maxResults) {
    const html = await fetchText(pageUrl, { delayMs })
    const $ = cheerio.load(html)

    $('a[href]').each((_, el) => {
      if (out.length >= maxResults) return
      const raw = $(el).attr('href')
      if (!raw) return
      const abs = normalizeUrl(new URL(raw, BASE).href)
      if (!abs || seen.has(abs)) return
      if (!LISTING_HREF.test(abs)) return

      const path = new URL(abs).pathname.toLowerCase()
      if (!matchesListingKind(kind, path)) return
      const lk = listingKindFromPath(path)
      if (lk !== kind) return

      const text = $(el)
        .text()
        .replace(/\s+/g, ' ')
        .replace(/^[\s«»]+/g, '')
        .trim()
      const slugAndText = `${path} ${text}`
      if (!matchesRegion(slugAndText, region)) return

      seen.add(abs)
      out.push({
        source: SOURCE,
        title: text || abs,
        url: abs,
        priceText: extractPriceFromText(text),
        region,
        kind,
        rawSnippet: text.slice(0, 280),
      })
    })

    pages += 1

    let next: string | null = null
    $('a[href]').each((_, el) => {
      if (next) return
      const t = $(el).text().trim().toLowerCase()
      if (t.includes('siguiente') || t === '»' || t.includes('next')) {
        const h = $(el).attr('href')
        if (h) {
          try {
            next = new URL(h, BASE).href
          } catch {
            /* ignore */
          }
        }
      }
    })

    if (!next || next === pageUrl) {
      /** Fallback: algunos listados usan ?page= */
      try {
        const parsed = new URL(pageUrl)
        const p = (Number(parsed.searchParams.get('page')) || pages) + 1
        parsed.searchParams.set('page', String(p))
        const candidate: string = parsed.href
        if (candidate !== pageUrl) next = candidate
      } catch {
        next = null
      }
    }

    pageUrl = next && next !== pageUrl ? next : null
  }

  return out
}

/** URLs de entrada razonables para “todo el sitio” filtrado luego por zona (PC / SD) y venta/alquiler. */
export function defaultSuperCasasSearchUrl(kind: ListingKind): string {
  /** Listado general muy visto; el filtrado por región es por keywords en slug + texto del enlace. */
  if (kind === 'sale') {
    return `${BASE}/buscar/?tipo=comprar`
  }
  return `${BASE}/buscar/?tipo=alquilar`
}
