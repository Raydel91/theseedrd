import type { HousingListing, ListingKind, RegionId } from '../types.js'

export function demoListings(region: RegionId, kind: ListingKind): HousingListing[] {
  const sale = kind === 'sale'
  return [
    {
      source: 'demo',
      title: sale ? 'Casa demo — Vista Cana (ejemplo)' : 'Apartamento demo alquiler — Bávaro (ejemplo)',
      url: 'https://www.supercasas.com/',
      priceText: sale ? 'US$ 350,000' : 'US$ 1,200/Mes',
      region,
      kind,
    },
    {
      source: 'demo',
      title: sale ? 'Villa demo — Cap Cana (ejemplo)' : 'Estudio demo — Piantini (ejemplo)',
      url: 'https://www.supercasas.com/',
      priceText: sale ? 'US$ 890,000' : 'US$ 950/Mes',
      region,
      kind,
    },
  ]
}
