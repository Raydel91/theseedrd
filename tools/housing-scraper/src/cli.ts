#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'

import { Command } from 'commander'

import { defaultSuperCasasSearchUrl, scrapeSuperCasas } from './sources/supercasas.js'
import { scrapeMercadoLibre } from './sources/mercadolibre.js'
import { demoListings } from './sources/demo.js'
import { downloadSupercasasPhotosForListings, writeGalleryHtml } from './supercasas-photos.js'
import { ListingKindSchema, RegionIdSchema, SourceIdSchema } from './types.js'
import type { HousingListing, ListingKind, RegionId, SourceId } from './types.js'

async function runSource(
  source: SourceId,
  region: RegionId,
  kind: ListingKind,
  max: number,
  startUrl: string | undefined,
  maxPages: number,
  delayMs: number,
): Promise<HousingListing[]> {
  if (source === 'demo') {
    return demoListings(region, kind).slice(0, max)
  }
  if (source === 'mercadolibre') {
    const rows = await scrapeMercadoLibre({ region, kind, maxResults: max })
    return rows.slice(0, max)
  }
  const url = startUrl?.trim() || defaultSuperCasasSearchUrl(kind)
  return scrapeSuperCasas({
    startUrl: url,
    region,
    kind,
    maxResults: max,
    maxPages,
    delayMs,
  })
}

const program = new Command()
program
  .name('dr-housing-scraper')
  .description('Listados de vivienda (RD): SuperCasas + fotos opcionales. Uso responsable.')
  .option('-r, --region <id>', 'punta-cana | santo-domingo', 'punta-cana')
  .option('-k, --kind <sale|rent>', 'sale (venta) o rent (alquiler)', 'sale')
  .option('-s, --source <id>', 'supercasas | mercadolibre | demo | all', 'supercasas')
  .option('-n, --limit <n>', 'máximo de anuncios', '30')
  .option('--pages <n>', 'máximo de páginas de listado a seguir', '3')
  .option('--delay <ms>', 'espera entre peticiones HTTP (listado + fichas)', '900')
  .option('--url <url>', 'URL de listado SuperCasas (opcional)')
  .option('-o, --out <file>', 'ruta del JSON (si no usas --photos)')
  .option('--photos', 'descargar fotos de cada anuncio (SuperCasas) y generar galería HTML')
  .option('--out-dir <dir>', 'carpeta de salida (fotos + listado.json + galeria.html)', 'housing-export')
  .option('--photo-max <n>', 'máx. fotos por anuncio', '24')
  .option('--image-delay <ms>', 'pausa entre descargas de imagen', '400')
  .option('--skip-gallery', 'no generar galeria.html')
  .action(async (opts) => {
    const region = RegionIdSchema.parse(opts.region)
    const kind = ListingKindSchema.parse(opts.kind)
    const limit = Math.min(500, Math.max(1, Number(opts.limit) || 30))
    const maxPages = Math.min(50, Math.max(1, Number(opts.pages) || 3))
    const delayMs = Math.min(10_000, Math.max(200, Number(opts.delay) || 900))
    const photoMax = Math.min(100, Math.max(1, Number(opts.photoMax) || 24))
    const imageDelayMs = Math.min(5000, Math.max(100, Number(opts.imageDelay) || 400))

    const rawSources = String(opts.source).split(',').map((s) => s.trim())
    const sources: SourceId[] =
      rawSources[0] === 'all'
        ? ['supercasas', 'mercadolibre']
        : rawSources.map((s) => SourceIdSchema.parse(s))

    const merged: HousingListing[] = []
    for (const source of sources) {
      const rows = await runSource(source, region, kind, limit, opts.url, maxPages, delayMs)
      merged.push(...rows)
    }

    const dedup = new Map<string, HousingListing>()
    for (const row of merged) {
      if (!dedup.has(row.url)) dedup.set(row.url, row)
    }
    let finalList = [...dedup.values()].slice(0, limit)

    const withPhotos = Boolean(opts.photos)
    const baseDir = resolve(process.cwd(), String(opts.outDir || 'housing-export'))

    if (withPhotos) {
      await mkdir(baseDir, { recursive: true })
      // eslint-disable-next-line no-console -- CLI
      console.error('Descargando fotos (SuperCasas)…')
      finalList = await downloadSupercasasPhotosForListings(finalList, {
        baseDir,
        pageDelayMs: delayMs,
        imageDelayMs,
        maxPerListing: photoMax,
        onProgress: (m) => console.error(m),
      })
      if (!opts.skipGallery) {
        await writeGalleryHtml(
          finalList,
          { region, kind, generatedAt: new Date().toISOString() },
          join(baseDir, 'galeria.html'),
        )
      }
    }

    const payload = {
      meta: {
        region,
        kind,
        sources,
        count: finalList.length,
        generatedAt: new Date().toISOString(),
        exportDir: withPhotos ? baseDir : undefined,
      },
      listings: finalList,
    }

    const json = JSON.stringify(payload, null, 2)

    if (withPhotos) {
      const jsonPath = join(baseDir, 'listado.json')
      await writeFile(jsonPath, json, 'utf8')
      // eslint-disable-next-line no-console -- CLI
      console.error('')
      // eslint-disable-next-line no-console -- CLI
      console.error(`Listo.
  Carpeta: ${baseDir}
  · listado.json  — datos
  · galeria.html  — álbum en el navegador (doble clic)
  · <id>/NN.jpg   — fotos por anuncio`)
      // eslint-disable-next-line no-console -- CLI
      console.log(JSON.stringify({ ok: true, dir: baseDir, listings: finalList.length }, null, 2))
    } else {
      // eslint-disable-next-line no-console -- CLI
      console.log(json)
      if (opts.out) {
        const path = resolve(process.cwd(), opts.out)
        await mkdir(dirname(path), { recursive: true })
        await writeFile(path, json, 'utf8')
        // eslint-disable-next-line no-console -- CLI
        console.error(`Escrito: ${path}`)
      }
    }
  })

program.parse()
