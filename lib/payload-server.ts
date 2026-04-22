import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@payload-config'

/**
 * Una sola inicialización de Payload por petición (deduplica layout + metadata + páginas).
 * No envolver `getPayload()` en un timeout que rechace: en SQLite/Windows el primer arranque
 * puede tardar mucho (>15–30s) y lanzaría error en runtime; las consultas concretas sí llevan
 * tope en `site-data`, `home-content`, etc.
 */
const getPayloadCached = cache(async () => getPayload({ config }))

/** Instancia Payload para Server Components y route handlers */
export async function getPayloadInstance() {
  return getPayloadCached()
}
