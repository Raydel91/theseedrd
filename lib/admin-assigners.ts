import type { Payload } from 'payload'

import type { User } from '@/payload-types'

export function resolveUserId(rel: unknown): string | number | null {
  if (rel == null) return null
  if (typeof rel === 'object' && 'id' in rel && (rel as { id: unknown }).id != null) {
    return (rel as { id: string | number }).id
  }
  if (typeof rel === 'string' || typeof rel === 'number') return rel
  return null
}

/** IDs que pueden promover/revocar `isAdmin` en cuentas ajenas (principal + delegados). */
export async function getAdminAssignerIds(payload: Payload): Promise<Set<string>> {
  const ids = new Set<string>()
  try {
    const reg = await payload.findGlobal({
      slug: 'admin-registry',
      depth: 1,
      overrideAccess: true,
    })
    const primary = resolveUserId(reg?.primaryAdmin as unknown)
    if (primary != null) ids.add(String(primary))

    const raw = (reg as { delegates?: unknown })?.delegates
    const list = Array.isArray(raw) ? raw : raw != null ? [raw] : []
    for (const d of list) {
      const id = resolveUserId(d)
      if (id != null) ids.add(String(id))
    }
  } catch {
    // sin registry, nadie excepto bootstrap
  }
  return ids
}

export async function actorCanAssignAdminRole(
  payload: Payload,
  actor: User | { id: string | number; isAdmin?: boolean | null } | null | undefined,
): Promise<boolean> {
  if (!actor?.id) return false
  const assigners = await getAdminAssignerIds(payload)
  if (assigners.has(String(actor.id))) return true
  // Fallback seguro: si registry está vacío/huérfano, permite a un admin existente desbloquear gestión.
  const actorDoc =
    (await payload
      .findByID({
        collection: 'users',
        id: actor.id,
        depth: 0,
        overrideAccess: true,
      })
      .catch(() => null)) as User | null

  const actorIsAdmin = actorDoc?.isAdmin === true || (actor as { isAdmin?: boolean | null }).isAdmin === true
  if (!actorIsAdmin) return false

  if (assigners.size === 0) return true

  const activeAssigners = await payload.find({
    collection: 'users',
    where: {
      and: [{ id: { in: [...assigners] } }, { accountKind: { equals: 'internal' } }, { isAdmin: { equals: true } }],
    },
    limit: 10,
    depth: 0,
    overrideAccess: true,
  })
  if (activeAssigners.docs.length === 0) return true
  return false
}
