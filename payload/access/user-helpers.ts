import type { User } from '@/payload-types'

/** Rol en JWT / Auth.js: cliente del portal vs equipo Payload */
export type SessionPortalRole = 'client' | 'admin' | 'staff'

/** Mapea cuenta Payload → rol de sesión (login portal / middleware). */
export function sessionRoleFromUser(
  u: Pick<User, 'accountKind' | 'isAdmin' | 'isStaff'> | null | undefined,
): SessionPortalRole {
  if (!u || u.accountKind === 'client') return 'client'
  if (u.isAdmin === true) return 'admin'
  return 'staff'
}

/** Acceso al panel Payload / gestión interna */
export function canAccessPayloadAdmin(user: User | null | undefined): boolean {
  if (!user) return false
  return Boolean(user.isAdmin === true || user.isStaff === true)
}

export function isPortalClient(user: User | null | undefined): boolean {
  return user?.accountKind === 'client'
}
