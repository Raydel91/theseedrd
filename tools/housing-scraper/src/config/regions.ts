import type { ListingKind, RegionId } from '../types.js'

/** Normaliza texto para comparar con slugs (sin acentos opcional: simplificamos a minúsculas). */
export function normalizeForMatch(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/**
 * Si el slug o el título del anuncio contiene alguna palabra clave, se considera de esa región.
 * SuperCasas mete la zona en el path: ...-venta-bavaro/123/
 */
export const REGION_KEYWORDS: Record<RegionId, string[]> = {
  'punta-cana': [
    'bavaro',
    'bávaro',
    'veron',
    'verón',
    'cap cana',
    'cap-cana',
    'capcana',
    'punta cana',
    'punta-cana',
    'uvero',
    'arena gorda',
    'cocotal',
    'macao',
    'bávaro',
    'el cortecito',
    'cortecito',
    'fruisa',
    'los corales',
  ],
  'santo-domingo': [
    'santo domingo',
    'distrito nacional',
    'naco',
    'bella vista',
    'gazcue',
    'prado',
    'millon',
    'millón',
    'la esperilla',
    'esperilla',
    'zona colonial',
    'arroyo hondo',
    'malecon',
    'malecón',
    'evaristo morales',
    'la julia',
    'los cacicazgos',
    'cacicazgos',
    'renacimiento',
    'san carlos',
    'ensanche',
    'julienta morales',
    'jacobo majluta',
    'charles de gaulle',
    'guachupita',
    'cristo rey',
    'fe y alegria',
    'sarasota',
    'mirador norte',
    'mirador sur',
    'mejoramiento social',
    'los prados',
    'la castellana',
    'piantini',
    'evaristo',
    'la esperanza',
    'los rios',
    'colinas',
    'autopista san isidro',
    'san isidro',
    'la caleta',
    'don bosco',
    'mata hambre',
    'santo domingo este',
    'santo domingo oeste',
    'santo domingo norte',
  ],
}

export function matchesRegion(text: string, region: RegionId): boolean {
  const n = normalizeForMatch(text)
  return REGION_KEYWORDS[region].some((kw) => n.includes(normalizeForMatch(kw)))
}

export function listingKindFromPath(pathname: string): ListingKind | null {
  const p = pathname.toLowerCase()
  if (p.includes('-venta-') || p.includes('-venta/')) return 'sale'
  if (p.includes('-alquiler-') || p.includes('-alquiler/')) return 'rent'
  /** Algunos anuncios usan "precio" para tarifas diarias / vacacionales — lo tratamos como alquiler. */
  if (p.includes('-precio-')) return 'rent'
  return null
}

export function matchesListingKind(kind: ListingKind, pathname: string): boolean {
  const k = listingKindFromPath(pathname)
  if (!k) return true
  return k === kind
}
