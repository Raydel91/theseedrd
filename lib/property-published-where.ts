import type { Where } from 'payload'

/**
 * Propiedades visibles en el sitio: `published === true` o sin valor guardado (legacy).
 * Excluye explícitamente `published === false`.
 */
export const propertyPublishedWhere: Where = {
  or: [{ published: { equals: true } }, { published: { exists: false } }],
}
