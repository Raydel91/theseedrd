/**
 * Genera lib/rd-admin-divisions.ts desde datos oficiales (provincia → municipios).
 * Ejecutar: node scripts/build-rd-divisions.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function slugify(input) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** [slugProvincia, etiquetaEs, etiquetaEn, municipios[]] */
const raw = [
  ['distrito-nacional', 'Distrito Nacional', 'National District', ['Distrito Nacional (Santo Domingo)']],
  [
    'azua',
    'Azua',
    'Azua',
    [
      'Azua de Compostela',
      'Estebanía',
      'Guayabal',
      'Las Charcas',
      'Las Yayas de Viajama',
      'Padre Las Casas',
      'Peralta',
      'Pueblo Viejo',
      'Sabana Yegua',
      'Tábara Arriba',
    ],
  ],
  [
    'bahoruco',
    'Bahoruco (Baoruco)',
    'Bahoruco',
    ['Neiba', 'Galván', 'Los Ríos', 'Tamayo', 'Villa Jaragua'],
  ],
  [
    'barahona',
    'Barahona',
    'Barahona',
    [
      'Barahona (Santa Cruz de Barahona)',
      'Cabral',
      'El Peñón',
      'Enriquillo',
      'Fundación',
      'Jaquimeyes',
      'La Ciénaga',
      'Las Salinas',
      'Paraíso',
      'Polo',
      'Vicente Noble',
    ],
  ],
  ['dajabon', 'Dajabón', 'Dajabón', ['Dajabón', 'El Pino', 'Loma de Cabrera', 'Partido', 'Restauración']],
  [
    'duarte',
    'Duarte',
    'Duarte',
    [
      'San Francisco de Macorís',
      'Arenoso',
      'Castillo',
      'Eugenio María de Hostos',
      'Las Guáranas',
      'Pimentel',
      'Villa Riva', // suele faltar en listas resumidas; clave duarte__villa-riva
    ],
  ],
  ['el-seibo', 'El Seibo', 'El Seibo', ['El Seibo (Santa Cruz de El Seibo)', 'Miches']],
  [
    'elias-pina',
    'Elías Piña',
    'Elías Piña',
    ['Comendador', 'Bánica', 'El Llano', 'Hondo Valle', 'Juan Santiago', 'Pedro Santana'],
  ],
  [
    'espaillat',
    'Espaillat',
    'Espaillat',
    ['Moca', 'Cayetano Germosén', 'Gaspar Hernández', 'Jamao al Norte'],
  ],
  ['hato-mayor', 'Hato Mayor', 'Hato Mayor', ['Hato Mayor del Rey', 'El Valle', 'Sabana de la Mar']],
  ['hermanas-mirabal', 'Hermanas Mirabal', 'Hermanas Mirabal', ['Salcedo', 'Tenares', 'Villa Tapia']],
  [
    'independencia',
    'Independencia',
    'Independencia',
    ['Jimaní', 'Cristóbal', 'Duvergé', 'La Descubierta', 'Mella', 'Postrer Río'],
  ],
  ['la-altagracia', 'La Altagracia', 'La Altagracia', ['Higüey (Salvaleón de Higüey)', 'San Rafael del Yuma']],
  ['la-romana', 'La Romana', 'La Romana', ['La Romana', 'Guaymate', 'Villa Hermosa']],
  [
    'la-vega',
    'La Vega',
    'La Vega',
    ['La Vega (Concepción de La Vega)', 'Constanza', 'Jarabacoa', 'Jima Abajo'],
  ],
  [
    'maria-trinidad-sanchez',
    'María Trinidad Sánchez',
    'María Trinidad Sánchez',
    ['Nagua', 'Cabrera', 'El Factor', 'Río San Juan'],
  ],
  ['monsenor-nouel', 'Monseñor Nouel', 'Monseñor Nouel', ['Bonao', 'Maimón', 'Piedra Blanca']],
  [
    'monte-cristi',
    'Monte Cristi',
    'Monte Cristi',
    [
      'Monte Cristi (San Fernando de Monte Cristi)',
      'Castañuelas',
      'Guayubín',
      'Las Matas de Santa Cruz',
      'Pepillo Salcedo',
      'Villa Vásquez',
    ],
  ],
  [
    'monte-plata',
    'Monte Plata',
    'Monte Plata',
    ['Monte Plata', 'Bayaguana', 'Peralvillo', 'Sabana Grande de Boyá', 'Yamasá'],
  ],
  ['pedernales', 'Pedernales', 'Pedernales', ['Pedernales', 'Oviedo']],
  ['peravia', 'Peravia', 'Peravia', ['Baní', 'Nizao']],
  [
    'puerto-plata',
    'Puerto Plata',
    'Puerto Plata',
    [
      'Puerto Plata',
      'Altamira',
      'Guananico',
      'Imbert',
      'Los Hidalgos',
      'Luperón',
      'Sosúa',
      'Villa Isabela',
      'Villa Montellano',
    ],
  ],
  [
    'samana',
    'Samaná',
    'Samaná',
    ['Samaná (Santa Bárbara de Samaná)', 'Las Terrenas', 'Sánchez'],
  ],
  [
    'san-cristobal',
    'San Cristóbal',
    'San Cristóbal',
    [
      'San Cristóbal',
      'Bajos de Haina',
      'Cambita Garabitos',
      'Los Cacaos',
      'Sabana Grande de Palenque',
      'San Gregorio de Nigua',
      'Villa Altagracia', // suele faltar en listas resumidas; clave san-cristobal__villa-altagracia
      'Yaguate',
    ],
  ],
  [
    'san-jose-de-ocoa',
    'San José de Ocoa',
    'San José de Ocoa',
    ['San José de Ocoa', 'Rancho Arriba', 'Sabana Larga'],
  ],
  [
    'san-juan',
    'San Juan',
    'San Juan',
    [
      'San Juan de la Maguana',
      'Bohechío',
      'El Cercado',
      'Juan de Herrera',
      'Las Matas de Farfán',
      'Vallejuelo',
    ],
  ],
  [
    'san-pedro-de-macoris',
    'San Pedro de Macorís',
    'San Pedro de Macorís',
    [
      'San Pedro de Macorís',
      'Consuelo',
      'Guayacanes',
      'Quisqueya',
      'Ramón Santana',
      'San José de Los Llanos',
    ],
  ],
  ['sanchez-ramirez', 'Sánchez Ramírez', 'Sánchez Ramírez', ['Cotuí', 'Cevicos', 'Fantino', 'La Mata']],
  [
    'santiago',
    'Santiago',
    'Santiago',
    [
      'Santiago de los Caballeros',
      'Bisonó (Navarrete)',
      'Jánico',
      'Licey al Medio',
      'Puñal',
      'Sabana Iglesia',
      'San José de las Matas',
      'Tamboril',
      'Villa González',
    ],
  ],
  [
    'santiago-rodriguez',
    'Santiago Rodríguez',
    'Santiago Rodríguez',
    ['San Ignacio de Sabaneta', 'Los Almácigos', 'Monción'],
  ],
  [
    'santo-domingo',
    'Santo Domingo',
    'Santo Domingo',
    [
      'Santo Domingo Este',
      'Boca Chica',
      'Los Alcarrizos',
      'Pedro Brand', // suele faltar en listas resumidas; clave santo-domingo__pedro-brand
      'San Antonio de Guerra',
      'Santo Domingo Norte',
      'Santo Domingo Oeste',
    ],
  ],
  ['valverde', 'Valverde', 'Valverde', ['Mao (Santa Cruz de Mao)', 'Esperanza', 'Laguna Salada']],
]

const divisions = []
const seen = new Set()
for (const [pSlug, labelEs, labelEn, munis] of raw) {
  for (const m of munis) {
    const mSlug = slugify(m)
    const value = `${pSlug}__${mSlug}`
    if (seen.has(value)) throw new Error(`Duplicate division key: ${value}`)
    seen.add(value)
    divisions.push({
      value,
      provinceSlug: pSlug,
      municipalitySlug: mSlug,
      labelEs: `${labelEs} — ${m}`,
      labelEn: `${labelEn} — ${m}`,
    })
  }
}

/** Claves compuestas que no deben eliminarse al editar el catálogo (complemento frecuente a listas cortas). */
const REQUIRED_DIVISION_KEYS = [
  'duarte__villa-riva',
  'san-cristobal__villa-altagracia',
  'santo-domingo__pedro-brand',
]
for (const key of REQUIRED_DIVISION_KEYS) {
  if (!seen.has(key)) {
    throw new Error(`Falta municipio requerido en datos RD: ${key}`)
  }
}

const out = `/* eslint-disable */
/**
 * División político-administrativa RD (31 provincias + Distrito Nacional). Filas municipales según \`raw\` (fuentes oficiales citan 158 municipios).
 * Generado por scripts/build-rd-divisions.mjs — no editar a mano.
 */
export type RDProvinceSlug = ${raw.map((r) => `'${r[0]}'`).join(' | ')}

export type RDDivisionValue = string

export const RD_PROVINCE_OPTIONS = ${JSON.stringify(
  raw.map((r) => ({ value: r[0], labelEs: r[1], labelEn: r[2] })),
  null,
  2,
)} as const

export const RD_DIVISIONS = ${JSON.stringify(divisions, null, 2)} as const

/** Opciones para Payload CMS (select) */
export const PAYLOAD_RD_DIVISION_OPTIONS = RD_DIVISIONS.map((d) => ({
  label: d.labelEs,
  value: d.value,
}))

const divisionByValue = new Map<string, (typeof RD_DIVISIONS)[number]>(
  RD_DIVISIONS.map((d) => [d.value, d]),
)

export function parseRDDivision(value: string | null | undefined): {
  provinceSlug: string
  municipalitySlug: string
} | null {
  if (!value || typeof value !== 'string') return null
  const d = divisionByValue.get(value)
  if (!d) return null
  return { provinceSlug: d.provinceSlug, municipalitySlug: d.municipalitySlug }
}

export function getRDDivisionLabels(
  value: string | null | undefined,
  locale: 'es' | 'en',
): { province: string; municipalityLine: string } | null {
  const d = value ? divisionByValue.get(value) : undefined
  if (!d) return null
  const p = RD_PROVINCE_OPTIONS.find((x) => x.value === d.provinceSlug)
  if (!p) return null
  const provLabel = locale === 'en' ? p.labelEn : p.labelEs
  const line = locale === 'en' ? d.labelEn : d.labelEs
  const muniLine = line.includes(' — ') ? line.split(' — ').slice(1).join(' — ') : line
  return { province: provLabel, municipalityLine: muniLine }
}

export function getMunicipalitiesForProvince(provinceSlug: string): typeof RD_DIVISIONS[number][] {
  return RD_DIVISIONS.filter((d) => d.provinceSlug === provinceSlug)
}

export function isValidRDDivision(value: string | null | undefined): boolean {
  return typeof value === 'string' && divisionByValue.has(value)
}
`

const target = path.join(__dirname, '..', 'lib', 'rd-admin-divisions.ts')
fs.writeFileSync(target, out, 'utf8')
console.log(`Wrote ${target} (${divisions.length} divisiones)`)
