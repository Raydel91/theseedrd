import type { Payload } from 'payload'

import type { User } from '@/payload-types'

function displayName(u: Pick<User, 'firstName' | 'lastName' | 'email'>): string {
  const n = [u.firstName, u.lastName].filter(Boolean).join(' ').trim()
  return n || (u.email as string) || 'Cliente'
}

/** Sincroniza expedientes `clients` y desvincula `team-members` según tipo de cuenta. */
export async function syncUserDirectoryRecords(
  payload: Payload,
  user: User,
  previous: User | undefined,
): Promise<void> {
  const kind = user.accountKind
  const wasClient = previous?.accountKind === 'client'
  const staffOk = kind === 'internal' && user.isStaff === true

  if (!staffOk) {
    const team = await payload.find({
      collection: 'team-members',
      where: { linkedUser: { equals: user.id } },
      limit: 50,
      depth: 0,
      overrideAccess: true,
    })
    for (const row of team.docs) {
      await payload.update({
        collection: 'team-members',
        id: row.id,
        data: { linkedUser: null },
        overrideAccess: true,
      })
    }
  }

  if (kind === 'client') {
    const fullName = displayName(user)
    const existing = await payload.find({
      collection: 'clients',
      where: { portalUser: { equals: user.id } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'clients',
        id: existing.docs[0].id,
        data: { fullName, email: user.email },
        overrideAccess: true,
      })
    } else {
      await payload.create({
        collection: 'clients',
        data: {
          fullName,
          email: user.email,
          portalUser: user.id,
          caseStage: 'intake',
        },
        overrideAccess: true,
      })
    }
    return
  }

  if (wasClient || previous?.accountKind === 'client') {
    const rows = await payload.find({
      collection: 'clients',
      where: { portalUser: { equals: user.id } },
      limit: 50,
      depth: 0,
      overrideAccess: true,
    })
    for (const row of rows.docs) {
      await payload.delete({
        collection: 'clients',
        id: row.id,
        overrideAccess: true,
      })
    }
  }
}

export async function deleteClientRecordsForUser(payload: Payload, userId: string | number): Promise<void> {
  const rows = await payload.find({
    collection: 'clients',
    where: { portalUser: { equals: userId } },
    limit: 50,
    depth: 0,
    overrideAccess: true,
  })
  for (const row of rows.docs) {
    await payload.delete({ collection: 'clients', id: row.id, overrideAccess: true })
  }
}

export async function clearTeamMemberLinksForUser(payload: Payload, userId: string | number): Promise<void> {
  const team = await payload.find({
    collection: 'team-members',
    where: { linkedUser: { equals: userId } },
    limit: 50,
    depth: 0,
    overrideAccess: true,
  })
  for (const row of team.docs) {
    await payload.update({
      collection: 'team-members',
      id: row.id,
      data: { linkedUser: null },
      overrideAccess: true,
    })
  }
}
