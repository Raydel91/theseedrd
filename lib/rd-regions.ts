import type { RDProvinceSlug } from '@/lib/rd-admin-divisions'

/** Regiones macro para filtros (cada provincia aparece una sola vez). */
export const RD_MACRO_REGIONS: {
  value: string
  labelEs: string
  labelEn: string
  provinceSlugs: readonly RDProvinceSlug[]
}[] = [
  {
    value: 'este-caribe',
    labelEs: 'Este y Samaná',
    labelEn: 'East & Samaná',
    provinceSlugs: [
      'la-altagracia',
      'el-seibo',
      'la-romana',
      'hato-mayor',
      'maria-trinidad-sanchez',
      'samana',
    ],
  },
  {
    value: 'gran-santo-domingo',
    labelEs: 'Gran Santo Domingo',
    labelEn: 'Greater Santo Domingo',
    provinceSlugs: [
      'distrito-nacional',
      'santo-domingo',
      'san-cristobal',
      'monte-plata',
      'san-pedro-de-macoris',
    ],
  },
  {
    value: 'cibao',
    labelEs: 'Cibao y cordillera',
    labelEn: 'Cibao & central highlands',
    provinceSlugs: [
      'puerto-plata',
      'santiago',
      'espaillat',
      'la-vega',
      'duarte',
      'hermanas-mirabal',
      'sanchez-ramirez',
      'monsenor-nouel',
    ],
  },
  {
    value: 'noroeste',
    labelEs: 'Noroeste',
    labelEn: 'Northwest',
    provinceSlugs: ['monte-cristi', 'dajabon', 'santiago-rodriguez', 'valverde'],
  },
  {
    value: 'sur-valle',
    labelEs: 'Sur, valle y frontera',
    labelEn: 'South, valley & border',
    provinceSlugs: [
      'azua',
      'bahoruco',
      'barahona',
      'independencia',
      'pedernales',
      'peravia',
      'san-juan',
      'elias-pina',
      'san-jose-de-ocoa',
    ],
  },
]

const provinceToRegion = new Map<string, string>()
for (const r of RD_MACRO_REGIONS) {
  for (const p of r.provinceSlugs) {
    provinceToRegion.set(p, r.value)
  }
}

export function getRegionValueForProvince(provinceSlug: string | null | undefined): string | null {
  if (!provinceSlug) return null
  return provinceToRegion.get(provinceSlug) ?? null
}

export function getProvincesForRegion(regionValue: string): string[] {
  const r = RD_MACRO_REGIONS.find((x) => x.value === regionValue)
  return r ? [...r.provinceSlugs] : []
}
