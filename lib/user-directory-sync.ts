import type { Payload } from 'payload'

import type { User } from '@/payload-types'

function displayName(u: Pick<User, 'firstName' | 'lastName' | 'email'>): string {
  const n = [u.firstName, u.lastName].filter(Boolean).join(' ').trim()
  return n || (u.email as string) || 'Cliente'
}

function isMissingLinkedUserColumnError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e)
  return /linked_user_id.*does not exist|column .*linked_user_id.*does not exist/i.test(msg)
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
    try {
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
    } catch (e) {
      if (!isMissingLinkedUserColumnError(e)) throw e
    }
  }

  if (staffOk) {
    const profilePhoto = (user as User & { profilePhoto?: number | null }).profilePhoto
    const fullName = displayName(user)
    let existingTeam = { docs: [] as { id: number | string }[] }
    try {
      existingTeam = await payload.find({
        collection: 'team-members',
        where: { linkedUser: { equals: user.id } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
    } catch (e) {
      if (!isMissingLinkedUserColumnError(e)) throw e
    }

    if (existingTeam.docs.length === 0) {
      const legacyByName = await payload.find({
        collection: 'team-members',
        where: { name: { equals: fullName } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      if (legacyByName.docs.length > 0) {
        existingTeam = legacyByName as typeof existingTeam
      }
    }
    if (existingTeam.docs.length === 0 && profilePhoto) {
      await payload.create({
        collection: 'team-members',
        data: {
          name: fullName,
          title: 'Staff',
          photo: profilePhoto,
          linkedUser: user.id,
        },
        overrideAccess: true,
      })
    } else if (existingTeam.docs.length > 0) {
      await payload.update({
        collection: 'team-members',
        id: existingTeam.docs[0].id,
        data: {
          name: fullName,
          ...(profilePhoto ? { photo: profilePhoto } : {}),
          linkedUser: user.id,
        },
        overrideAccess: true,
      })
    }
  }

  if (kind === 'client') {
    const fullName = displayName(user)
    let existing = await payload.find({
      collection: 'clients',
      where: { portalUser: { equals: user.id } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (existing.docs.length === 0 && user.email) {
      const legacyByEmail = await payload.find({
        collection: 'clients',
        where: { email: { equals: user.email } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      if (legacyByEmail.docs.length > 0) existing = legacyByEmail as typeof existing
    }
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
  let team = { docs: [] as { id: number | string }[] }
  try {
    team = await payload.find({
      collection: 'team-members',
      where: { linkedUser: { equals: userId } },
      limit: 50,
      depth: 0,
      overrideAccess: true,
    })
  } catch (e) {
    if (!isMissingLinkedUserColumnError(e)) throw e
  }
  for (const row of team.docs) {
    await payload.update({
      collection: 'team-members',
      id: row.id,
      data: { linkedUser: null },
      overrideAccess: true,
    })
  }
}

/** Backfill idempotente para poblar listas de Clients/TeamMembers desde users existentes. */
export async function reconcileAllUsersDirectoryRecords(payload: Payload): Promise<void> {
  let page = 1
  const limit = 100
  for (;;) {
    const res = await payload.find({
      collection: 'users',
      limit,
      page,
      depth: 0,
      overrideAccess: true,
    })
    for (const doc of res.docs as User[]) {
      await syncUserDirectoryRecords(payload, doc, undefined)
    }
    if (!res.hasNextPage) break
    page += 1
  }
}
