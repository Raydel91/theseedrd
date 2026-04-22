import type { HousingListing, ListingKind, RegionId } from '../types.js'

/**
 * MercadoLibre inmuebles suele exigir login o cookies anti-bot para listados completos.
 * Implementación reservada: usar Playwright con sesión manual o API oficial si obtienes credenciales.
 */
export async function scrapeMercadoLibre(_options: {
  region: RegionId
  kind: ListingKind
  maxResults: number
}): Promise<HousingListing[]> {
  return []
}
