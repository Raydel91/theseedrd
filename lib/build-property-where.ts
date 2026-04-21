import type { Payload } from 'payload'
import type { Where } from 'payload'

import { getProvincesForRegion } from '@/lib/rd-regions'

export type PropertyListFilters = {
  filterProvince?: string
  filterMunicipality?: string
  filterRegion?: string
  filterHouseTypeSlug?: string
  minBeds?: number
  minBaths?: number
  tagSlugs?: string[]
}

export async function buildPropertyWhere(
  payload: Payload,
  f: PropertyListFilters,
): Promise<Where> {
  const and: Where[] = [{ published: { equals: true } }]

  if (f.filterHouseTypeSlug) {
    const ht = await payload.find({
      collection: 'house-types',
      where: { slug: { equals: f.filterHouseTypeSlug } },
      limit: 1,
    })
    const id = ht.docs[0]?.id
    if (id != null) and.push({ houseType: { equals: id } })
  }

  if (f.filterProvince && f.filterMunicipality) {
    and.push({ rdDivision: { equals: `${f.filterProvince}__${f.filterMunicipality}` } })
  } else if (f.filterProvince) {
    and.push({ rdDivision: { contains: `${f.filterProvince}__` } })
  } else if (f.filterRegion) {
    const provs = getProvincesForRegion(f.filterRegion)
    if (provs.length) {
      and.push({
        or: provs.map((p) => ({ rdDivision: { contains: `${p}__` } })),
      })
    }
  }

  if (f.minBeds != null && f.minBeds > 0) {
    and.push({ beds: { greater_than_equal: f.minBeds } })
  }
  if (f.minBaths != null && f.minBaths > 0) {
    and.push({ baths: { greater_than_equal: f.minBaths } })
  }

  if (f.tagSlugs?.length) {
    const tags = await payload.find({
      collection: 'property-tags',
      where: { slug: { in: f.tagSlugs } },
      limit: 200,
    })
    for (const doc of tags.docs) {
      and.push({ propertyTags: { contains: doc.id } })
    }
  }

  return { and }
}
