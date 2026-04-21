import type { Payload } from 'payload'

const HOUSE_TYPES: { slug: string; sortOrder: number; es: string; en: string }[] = [
  { slug: 'villa-de-lujo', sortOrder: 1, es: 'Villa de Lujo', en: 'Luxury Villa' },
  { slug: 'casa-independiente', sortOrder: 2, es: 'Casa Independiente', en: 'Single-Family Home' },
  { slug: 'apartamento-condominio', sortOrder: 3, es: 'Apartamento / Condominio', en: 'Apartment / Condominium' },
  { slug: 'penthouse', sortOrder: 4, es: 'Penthouse', en: 'Penthouse' },
  { slug: 'townhouse', sortOrder: 5, es: 'Townhouse', en: 'Townhouse' },
  { slug: 'casa-de-playa', sortOrder: 6, es: 'Casa de Playa (Beach House)', en: 'Beach House' },
  { slug: 'finca-casa-campestre', sortOrder: 7, es: 'Finca / Casa Campestre', en: 'Country Estate / Farmhouse' },
  { slug: 'residencia-de-golf', sortOrder: 8, es: 'Residencia de Golf', en: 'Golf Residence' },
  { slug: 'villa-ecologica-wellness', sortOrder: 9, es: 'Villa Ecológica / Wellness', en: 'Eco / Wellness Villa' },
  { slug: 'loft', sortOrder: 10, es: 'Loft', en: 'Loft' },
  { slug: 'casa-comunidad-cerrada', sortOrder: 11, es: 'Casa en Comunidad Cerrada (Gated Community)', en: 'Gated Community Home' },
  { slug: 'bungalow', sortOrder: 12, es: 'Bungalow', en: 'Bungalow' },
  { slug: 'mansion', sortOrder: 13, es: 'Mansión', en: 'Mansion' },
  { slug: 'casa-adosada-duplex-triplex', sortOrder: 14, es: 'Casa Adosada (Duplex / Triplex)', en: 'Duplex / Triplex' },
  { slug: 'apartamento-playa-beachfront', sortOrder: 15, es: 'Apartamento en Playa (Beachfront Apartment)', en: 'Beachfront Apartment' },
]

const PROPERTY_TAGS: {
  slug: string
  tagCategory: 'general' | 'style' | 'location'
  sortOrder: number
  es: string
  en: string
}[] = [
  { slug: 'venta', tagCategory: 'general', sortOrder: 1, es: 'Venta', en: 'For Sale' },
  { slug: 'alquiler', tagCategory: 'general', sortOrder: 2, es: 'Alquiler', en: 'For Rent' },
  { slug: 'amueblado', tagCategory: 'general', sortOrder: 3, es: 'Amueblado', en: 'Furnished' },
  { slug: 'semi-amueblado', tagCategory: 'general', sortOrder: 4, es: 'Semi-Amueblado', en: 'Semi-Furnished' },
  { slug: 'sin-amueblar', tagCategory: 'general', sortOrder: 5, es: 'Sin Amueblar', en: 'Unfurnished' },
  { slug: 'listo-para-mudarse', tagCategory: 'general', sortOrder: 6, es: 'Listo para Mudarse', en: 'Move-In Ready' },
  { slug: 'nueva-construccion', tagCategory: 'general', sortOrder: 7, es: 'Nueva Construcción', en: 'New Construction' },
  { slug: 'remodelada', tagCategory: 'general', sortOrder: 8, es: 'Remodelada', en: 'Renovated' },
  { slug: 'oportunidad', tagCategory: 'general', sortOrder: 9, es: 'Oportunidad', en: 'Opportunity' },
  { slug: 'pre-venta', tagCategory: 'general', sortOrder: 10, es: 'Pre-Venta', en: 'Pre-Sale' },
  { slug: 'frente-al-mar', tagCategory: 'general', sortOrder: 11, es: 'Frente al Mar', en: 'Oceanfront' },
  { slug: 'vista-al-mar', tagCategory: 'general', sortOrder: 12, es: 'Vista al Mar', en: 'Ocean View' },
  { slug: 'vista-al-golf', tagCategory: 'general', sortOrder: 13, es: 'Vista al Golf', en: 'Golf View' },
  { slug: 'vista-a-la-laguna', tagCategory: 'general', sortOrder: 14, es: 'Vista a la Laguna', en: 'Lagoon View' },
  { slug: 'frente-al-lago', tagCategory: 'general', sortOrder: 15, es: 'Frente al Lago', en: 'Lakefront' },
  { slug: 'estilo-moderno', tagCategory: 'style', sortOrder: 20, es: 'Estilo Moderno', en: 'Modern Style' },
  { slug: 'estilo-mediterraneo', tagCategory: 'style', sortOrder: 21, es: 'Estilo Mediterráneo', en: 'Mediterranean Style' },
  { slug: 'estilo-caribeno', tagCategory: 'style', sortOrder: 22, es: 'Estilo Caribeño', en: 'Caribbean Style' },
  { slug: 'minimalista', tagCategory: 'style', sortOrder: 23, es: 'Minimalista', en: 'Minimalist' },
  { slug: 'rustico-elegante', tagCategory: 'style', sortOrder: 24, es: 'Rústico Elegante', en: 'Elegant Rustic' },
  { slug: 'contemporaneo', tagCategory: 'style', sortOrder: 25, es: 'Contemporáneo', en: 'Contemporary' },
  { slug: 'tropical-luxury', tagCategory: 'style', sortOrder: 26, es: 'Tropical Luxury', en: 'Tropical Luxury' },
  { slug: 'punta-cana', tagCategory: 'location', sortOrder: 40, es: 'Punta Cana', en: 'Punta Cana' },
  { slug: 'bavaro', tagCategory: 'location', sortOrder: 41, es: 'Bávaro', en: 'Bávaro' },
  { slug: 'cap-cana', tagCategory: 'location', sortOrder: 42, es: 'Cap Cana', en: 'Cap Cana' },
  { slug: 'el-cortecito', tagCategory: 'location', sortOrder: 43, es: 'El Cortecito', en: 'El Cortecito' },
  { slug: 'los-corales', tagCategory: 'location', sortOrder: 44, es: 'Los Corales', en: 'Los Corales' },
  { slug: 'uvero-alto', tagCategory: 'location', sortOrder: 45, es: 'Uvero Alto', en: 'Uvero Alto' },
  { slug: 'macao', tagCategory: 'location', sortOrder: 46, es: 'Macao', en: 'Macao' },
  { slug: 'cabeza-de-toro', tagCategory: 'location', sortOrder: 47, es: 'Cabeza de Toro', en: 'Cabeza de Toro' },
  { slug: 'arena-gorda', tagCategory: 'location', sortOrder: 48, es: 'Arena Gorda', en: 'Arena Gorda' },
  { slug: 'comunidad-cerrada-tag', tagCategory: 'location', sortOrder: 49, es: 'Comunidad Cerrada', en: 'Gated Community' },
]

const AMENITIES: {
  slug: string
  amenityCategory: 'exterior' | 'community' | 'interior' | 'luxury'
  sortOrder: number
  es: string
  en: string
}[] = [
  { slug: 'piscina-privada', amenityCategory: 'exterior', sortOrder: 1, es: 'Piscina privada', en: 'Private pool' },
  { slug: 'piscina-comunitaria', amenityCategory: 'exterior', sortOrder: 2, es: 'Piscina comunitaria', en: 'Community pool' },
  { slug: 'jacuzzi-hot-tub', amenityCategory: 'exterior', sortOrder: 3, es: 'Jacuzzi / Hot Tub', en: 'Jacuzzi / Hot tub' },
  { slug: 'terraza-balcon', amenityCategory: 'exterior', sortOrder: 4, es: 'Terraza / Balcón', en: 'Terrace / Balcony' },
  { slug: 'jardin-privado', amenityCategory: 'exterior', sortOrder: 5, es: 'Jardín privado', en: 'Private garden' },
  { slug: 'barbacoa-asador', amenityCategory: 'exterior', sortOrder: 6, es: 'Barbacoa / Asador', en: 'BBQ / Grill area' },
  { slug: 'area-fogata', amenityCategory: 'exterior', sortOrder: 7, es: 'Área de fogata', en: 'Fire pit area' },
  { slug: 'garaje-privado', amenityCategory: 'exterior', sortOrder: 8, es: 'Garaje privado', en: 'Private garage' },
  { slug: 'parqueo-techado', amenityCategory: 'exterior', sortOrder: 9, es: 'Parqueo techado', en: 'Covered parking' },
  { slug: 'acceso-directo-playa', amenityCategory: 'exterior', sortOrder: 10, es: 'Acceso directo a la playa', en: 'Direct beach access' },
  { slug: 'muelle-privado', amenityCategory: 'exterior', sortOrder: 11, es: 'Muelle privado', en: 'Private dock' },
  { slug: 'gimnasio-privado-ext', amenityCategory: 'exterior', sortOrder: 12, es: 'Gimnasio privado', en: 'Private gym' },
  { slug: 'gimnasio-equipado', amenityCategory: 'community', sortOrder: 20, es: 'Gimnasio equipado', en: 'Equipped gym' },
  { slug: 'spa', amenityCategory: 'community', sortOrder: 21, es: 'Spa', en: 'Spa' },
  { slug: 'clubhouse', amenityCategory: 'community', sortOrder: 22, es: 'Clubhouse', en: 'Clubhouse' },
  { slug: 'cancha-tenis', amenityCategory: 'community', sortOrder: 23, es: 'Cancha de tenis', en: 'Tennis court' },
  { slug: 'cancha-padel', amenityCategory: 'community', sortOrder: 24, es: 'Cancha de pádel', en: 'Padel court' },
  { slug: 'campo-golf', amenityCategory: 'community', sortOrder: 25, es: 'Campo de golf', en: 'Golf course' },
  { slug: 'restaurante-bar', amenityCategory: 'community', sortOrder: 26, es: 'Restaurante / Bar', en: 'Restaurant / Bar' },
  { slug: 'seguridad-24-7', amenityCategory: 'community', sortOrder: 27, es: 'Seguridad 24/7', en: '24/7 security' },
  { slug: 'camaras-vigilancia', amenityCategory: 'community', sortOrder: 28, es: 'Cámaras de vigilancia', en: 'CCTV' },
  { slug: 'acceso-controlado-gated', amenityCategory: 'community', sortOrder: 29, es: 'Acceso controlado (Gated)', en: 'Gated access' },
  { slug: 'playa-privada', amenityCategory: 'community', sortOrder: 30, es: 'Playa privada', en: 'Private beach' },
  { slug: 'kids-club', amenityCategory: 'community', sortOrder: 31, es: 'Kids Club', en: 'Kids club' },
  { slug: 'centro-negocios', amenityCategory: 'community', sortOrder: 32, es: 'Centro de negocios', en: 'Business center' },
  { slug: 'tienda-conveniencia', amenityCategory: 'community', sortOrder: 33, es: 'Tienda de conveniencia', en: 'Convenience store' },
  { slug: 'cocina-gourmet', amenityCategory: 'interior', sortOrder: 40, es: 'Cocina gourmet', en: 'Gourmet kitchen' },
  { slug: 'cocina-americana', amenityCategory: 'interior', sortOrder: 41, es: 'Cocina americana', en: 'Open kitchen' },
  { slug: 'walk-in-closet', amenityCategory: 'interior', sortOrder: 42, es: 'Walk-in closet', en: 'Walk-in closet' },
  { slug: 'bano-principal-suite', amenityCategory: 'interior', sortOrder: 43, es: 'Baño principal en suite', en: 'Primary ensuite bath' },
  { slug: 'sala-cine', amenityCategory: 'interior', sortOrder: 44, es: 'Sala de cine (Home Theater)', en: 'Home theater' },
  { slug: 'sala-juegos', amenityCategory: 'interior', sortOrder: 45, es: 'Sala de juegos', en: 'Game room' },
  { slug: 'oficina-estudio', amenityCategory: 'interior', sortOrder: 46, es: 'Oficina / Estudio', en: 'Office / Study' },
  { slug: 'aire-acondicionado-central', amenityCategory: 'interior', sortOrder: 47, es: 'Sistema de aire acondicionado central', en: 'Central A/C' },
  { slug: 'paneles-solares', amenityCategory: 'interior', sortOrder: 48, es: 'Paneles solares', en: 'Solar panels' },
  { slug: 'domotica-smart-home', amenityCategory: 'interior', sortOrder: 49, es: 'Sistema de domótica (Smart Home)', en: 'Smart home' },
  { slug: 'pisos-marmol-porcelanato', amenityCategory: 'interior', sortOrder: 50, es: 'Pisos de mármol / porcelanato', en: 'Marble / porcelain floors' },
  { slug: 'techos-altos', amenityCategory: 'interior', sortOrder: 51, es: 'Techos altos', en: 'High ceilings' },
  { slug: 'ventanas-floor-to-ceiling', amenityCategory: 'interior', sortOrder: 52, es: 'Ventanas floor-to-ceiling', en: 'Floor-to-ceiling windows' },
  { slug: 'infinity-pool', amenityCategory: 'luxury', sortOrder: 60, es: 'Infinity Pool', en: 'Infinity pool' },
  { slug: 'rooftop-terrace', amenityCategory: 'luxury', sortOrder: 61, es: 'Rooftop Terrace', en: 'Rooftop terrace' },
  { slug: 'wine-cellar', amenityCategory: 'luxury', sortOrder: 62, es: 'Wine Cellar', en: 'Wine cellar' },
  { slug: 'gimnasio-privado-sauna', amenityCategory: 'luxury', sortOrder: 63, es: 'Gimnasio privado con sauna', en: 'Private gym with sauna' },
  { slug: 'helipuerto-cercano', amenityCategory: 'luxury', sortOrder: 64, es: 'Helipuerto cercano', en: 'Helipad nearby' },
  { slug: 'generador-electrico', amenityCategory: 'luxury', sortOrder: 65, es: 'Generador eléctrico propio', en: 'Backup generator' },
  { slug: 'cisterna-grande', amenityCategory: 'luxury', sortOrder: 66, es: 'Cisterna grande', en: 'Large cistern' },
  { slug: 'mobiliario-disenador', amenityCategory: 'luxury', sortOrder: 67, es: 'Mobiliario de diseñador', en: 'Designer furnishings' },
  { slug: 'purificacion-agua', amenityCategory: 'luxury', sortOrder: 68, es: 'Sistema de purificación de agua', en: 'Water purification system' },
]

async function ensureHouseTypes(payload: Payload) {
  const allSlugs = HOUSE_TYPES.map((h) => h.slug)
  const existing = await payload.find({
    collection: 'house-types',
    where: { slug: { in: allSlugs } },
    limit: Math.max(200, allSlugs.length),
  })
  const have = new Set(existing.docs.map((d) => (d as { slug?: string }).slug).filter(Boolean))
  for (const row of HOUSE_TYPES) {
    if (have.has(row.slug)) continue
    const created = await payload.create({
      collection: 'house-types',
      locale: 'es',
      data: {
        slug: row.slug,
        sortOrder: row.sortOrder,
        label: row.es,
      },
    })
    await payload.update({
      collection: 'house-types',
      id: created.id,
      locale: 'en',
      data: { label: row.en },
    })
  }
}

async function ensurePropertyTags(payload: Payload) {
  const allSlugs = PROPERTY_TAGS.map((h) => h.slug)
  const existing = await payload.find({
    collection: 'property-tags',
    where: { slug: { in: allSlugs } },
    limit: Math.max(200, allSlugs.length),
  })
  const have = new Set(existing.docs.map((d) => (d as { slug?: string }).slug).filter(Boolean))
  for (const row of PROPERTY_TAGS) {
    if (have.has(row.slug)) continue
    const created = await payload.create({
      collection: 'property-tags',
      locale: 'es',
      data: {
        slug: row.slug,
        sortOrder: row.sortOrder,
        tagCategory: row.tagCategory,
        label: row.es,
      },
    })
    await payload.update({
      collection: 'property-tags',
      id: created.id,
      locale: 'en',
      data: { label: row.en },
    })
  }
}

async function ensureAmenities(payload: Payload) {
  const allSlugs = AMENITIES.map((h) => h.slug)
  const existing = await payload.find({
    collection: 'property-amenities',
    where: { slug: { in: allSlugs } },
    limit: Math.max(200, allSlugs.length),
  })
  const have = new Set(existing.docs.map((d) => (d as { slug?: string }).slug).filter(Boolean))
  for (const row of AMENITIES) {
    if (have.has(row.slug)) continue
    const created = await payload.create({
      collection: 'property-amenities',
      locale: 'es',
      data: {
        slug: row.slug,
        sortOrder: row.sortOrder,
        amenityCategory: row.amenityCategory,
        label: row.es,
      },
    })
    await payload.update({
      collection: 'property-amenities',
      id: created.id,
      locale: 'en',
      data: { label: row.en },
    })
  }
}

/**
 * Antes: ~115 consultas `find` secuenciales en cada arranque → bloqueaba Payload y la 1.ª petición.
 * Ahora: si ya hay datos sembrados, 3 `count` y salida; si falta algo, como mucho 3 `find in` + creates.
 */
export async function seedPropertyTaxonomies(payload: Payload): Promise<void> {
  const [cHt, cTag, cAm] = await Promise.all([
    payload.count({ collection: 'house-types' }),
    payload.count({ collection: 'property-tags' }),
    payload.count({ collection: 'property-amenities' }),
  ])

  if (
    cHt.totalDocs >= HOUSE_TYPES.length &&
    cTag.totalDocs >= PROPERTY_TAGS.length &&
    cAm.totalDocs >= AMENITIES.length
  ) {
    return
  }

  /** Secuencial: SQLite en Windows evita bloqueos si varias colecciones escriben a la vez. */
  if (cHt.totalDocs < HOUSE_TYPES.length) await ensureHouseTypes(payload)
  if (cTag.totalDocs < PROPERTY_TAGS.length) await ensurePropertyTags(payload)
  if (cAm.totalDocs < AMENITIES.length) await ensureAmenities(payload)
}
