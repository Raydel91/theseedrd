import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import { fetchText } from './http.js'
import type { HousingListing } from './types.js'

function pixelsFromSize(size: string): number {
  const m = size.match(/(\d+)x(\d+)/i)
  if (!m) return 0
  return Number(m[1]) * Number(m[2])
}

/**
 * Por cada ID de foto, elige la URL de mayor resolución presente en el HTML.
 */
export function extractBestSupercasasPhotoUrls(html: string): string[] {
  const byId = new Map<string, { url: string; px: number }>()
  const re =
    /https:\/\/img\.supercasas\.com\/AdsPhotos\/(\d+x\d+)\/(\d+)\/(\d+)\.(jpg|jpeg|webp)/gi
  for (const m of html.matchAll(re)) {
    const size = m[1]
    const id = m[3]
    const ext = m[4].toLowerCase()
    const url = `https://img.supercasas.com/AdsPhotos/${size}/${m[2]}/${id}.${ext}`
    const px = pixelsFromSize(size)
    const prev = byId.get(id)
    if (!prev || px > prev.px) {
      byId.set(id, { url, px })
    }
  }
  return [...byId.values()]
    .sort((a, b) => b.px - a.px)
    .map((x) => x.url)
}

export function listingIdFromSupercasasUrl(url: string): string | null {
  try {
    const path = new URL(url).pathname.replace(/\/+$/, '')
    const seg = path.split('/').filter(Boolean).pop()
    if (seg && /^\d+$/.test(seg)) return seg
  } catch {
    /* ignore */
  }
  return null
}

async function fetchBinary(url: string, delayMs: number): Promise<Uint8Array> {
  await new Promise((r) => setTimeout(r, delayMs))
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; DR-Housing-Scraper/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'image/avif,image/webp,image/*,*/*;q=0.8',
      Referer: 'https://www.supercasas.com/',
    },
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} al descargar imagen — ${url}`)
  }
  return new Uint8Array(await res.arrayBuffer())
}

function extFromUrl(url: string): string {
  const m = url.match(/\.(jpg|jpeg|webp)$/i)
  return (m?.[1] || 'jpg').toLowerCase()
}

/**
 * Descarga fotos de anuncios SuperCasas en `baseDir/<id>/01.jpg`…
 */
export async function downloadSupercasasPhotosForListings(
  listings: HousingListing[],
  options: {
    baseDir: string
    pageDelayMs: number
    imageDelayMs: number
    maxPerListing: number
    onProgress?: (msg: string) => void
  },
): Promise<HousingListing[]> {
  const { baseDir, pageDelayMs, imageDelayMs, maxPerListing, onProgress } = options
  const next: HousingListing[] = []

  for (const row of listings) {
    if (row.source !== 'supercasas') {
      next.push({ ...row })
      continue
    }
    const id = listingIdFromSupercasasUrl(row.url)
    if (!id) {
      next.push({ ...row })
      continue
    }

    let html: string
    try {
      html = await fetchText(row.url, { delayMs: pageDelayMs })
    } catch (e) {
      onProgress?.(`[skip] ${row.url} — ${e instanceof Error ? e.message : e}`)
      next.push({ ...row })
      continue
    }

    const urls = extractBestSupercasasPhotoUrls(html).slice(0, maxPerListing)
    if (urls.length === 0) {
      onProgress?.(`[sin fotos] ${id}`)
      next.push({ ...row, listingId: id })
      continue
    }

    const dir = join(baseDir, id)
    await mkdir(dir, { recursive: true })
    const photosLocal: string[] = []

    let i = 0
    for (const u of urls) {
      i += 1
      const ext = extFromUrl(u)
      const fileName = `${String(i).padStart(2, '0')}.${ext}`
      const filePath = join(dir, fileName)
      try {
        const buf = await fetchBinary(u, imageDelayMs)
        await writeFile(filePath, buf)
        photosLocal.push(join(id, fileName).replace(/\\/g, '/'))
        onProgress?.(`OK ${id}/${fileName}`)
      } catch (e) {
        onProgress?.(`[img error] ${u} — ${e instanceof Error ? e.message : e}`)
      }
    }

    next.push({
      ...row,
      listingId: id,
      photosLocal,
      photoRemoteUrls: urls.slice(0, photosLocal.length),
    })
  }

  return next
}

export async function writeGalleryHtml(
  listings: HousingListing[],
  meta: { region: string; kind: string; generatedAt: string },
  outFile: string,
): Promise<void> {
  const sections = listings
    .filter((l) => l.listingId && (l.photosLocal?.length || 0) > 0)
    .map((l) => {
      const imgs = (l.photosLocal || [])
        .map(
          (p) =>
            `    <figure><img src="${encodeURI(p)}" alt="" loading="lazy" width="320"/><figcaption>${escapeHtml(p)}</figcaption></figure>`,
        )
        .join('\n')
      return `  <section>
    <h2>${escapeHtml(l.title.slice(0, 120))}</h2>
    <p><a href="${escapeHtml(l.url)}">${escapeHtml(l.url)}</a> · ${escapeHtml(l.priceText || '')}</p>
    <div class="grid">
${imgs}
    </div>
  </section>`
    })
    .join('\n')

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Export vivienda RD</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 1rem; max-width: 1200px; }
    h1 { font-size: 1.25rem; }
    .grid { display: flex; flex-wrap: wrap; gap: 8px; }
    figure { margin: 0; }
    img { max-height: 220px; width: auto; border-radius: 8px; object-fit: cover; }
    figcaption { font-size: 11px; color: #555; max-width: 320px; word-break: break-all; }
    section { margin-bottom: 2rem; border-bottom: 1px solid #eee; padding-bottom: 1rem; }
  </style>
</head>
<body>
  <h1>Vivienda RD — ${escapeHtml(meta.region)} · ${escapeHtml(meta.kind)} · ${escapeHtml(meta.generatedAt)}</h1>
  <p>Abre este archivo en el navegador. Las carpetas llevan el ID del anuncio en SuperCasas.</p>
${sections}
</body>
</html>`
  await writeFile(outFile, html, 'utf8')
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
