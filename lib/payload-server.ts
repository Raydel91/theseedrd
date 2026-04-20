import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@payload-config'

/**
 * Una sola inicialización de Payload por petición (deduplica layout + metadata + páginas).
 * Evita contención SQLite y trabajo repetido que puede dejar la página colgada.
 */
const getPayloadCached = cache(async () => getPayload({ config }))

/** Instancia Payload para Server Components y route handlers */
export async function getPayloadInstance() {
  return getPayloadCached()
}
