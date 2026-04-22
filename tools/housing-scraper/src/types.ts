import { z } from 'zod'

export const RegionIdSchema = z.enum(['punta-cana', 'santo-domingo'])
export type RegionId = z.infer<typeof RegionIdSchema>

export const ListingKindSchema = z.enum(['sale', 'rent'])
export type ListingKind = z.infer<typeof ListingKindSchema>

export const SourceIdSchema = z.enum(['supercasas', 'mercadolibre', 'demo'])
export type SourceId = z.infer<typeof SourceIdSchema>

export type HousingListing = {
  source: SourceId
  title: string
  url: string
  priceText?: string
  region: RegionId
  kind: ListingKind
  rawSnippet?: string
  /** ID numérico del anuncio en la URL (SuperCasas). */
  listingId?: string
  /** Rutas relativas a `--out-dir`: `1416587/01.jpg`. */
  photosLocal?: string[]
  photoRemoteUrls?: string[]
}
