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
  actor: User | { id: string | number } | null | undefined,
): Promise<boolean> {
  if (!actor?.id) return false
  const assigners = await getAdminAssignerIds(payload)
  return assigners.has(String(actor.id))
}
