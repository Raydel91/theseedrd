import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { randomBytes } from 'crypto'

import type { User } from '@/payload-types'
import { actorCanAssignAdminRole, resolveUserId } from '@/lib/admin-assigners'
import {
  clearTeamMemberLinksForUser,
  deleteClientRecordsForUser,
  syncUserDirectoryRecords,
} from '@/lib/user-directory-sync'

function generateReferralCode(): string {
  return `TSR-${randomBytes(3).toString('hex').toUpperCase()}`
}

function adminFlagChanged(next: boolean | undefined | null, prev: boolean): boolean {
  return Boolean(next) !== prev
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 45 * 60,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'accountKind', 'isStaff', 'isAdmin', 'createdAt'],
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      label: 'Nombre',
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Apellido',
    },
    {
      name: 'accountKind',
      type: 'select',
      required: true,
      defaultValue: 'client',
      label: 'Tipo de cuenta',
      options: [
        { label: 'Cliente (portal de referidos)', value: 'client' },
        { label: 'Interno (equipo / administración)', value: 'internal' },
      ],
      admin: {
        description:
          'Cliente: portal y expediente en Clientes. Interno: staff y/o admin (máx. 3 administradores). Los clientes no pueden figurar en Equipo.',
      },
    },
    {
      name: 'isStaff',
      type: 'checkbox',
      defaultValue: false,
      label: 'Equipo (staff)',
      admin: {
        description: 'Acceso de equipo al panel Payload. No aplica a cuentas solo-cliente.',
      },
    },
    {
      name: 'isAdmin',
      type: 'checkbox',
      defaultValue: false,
      label: 'Administrador',
      access: {
        create: () => true,
        update: async ({ req, id }) => {
          const actor = req.user as User | undefined
          if (!actor?.id) return false
          if (id != null && String(actor.id) === String(id)) return true
          return actorCanAssignAdminRole(req.payload, actor)
        },
      },
      admin: {
        description:
          'Máximo 3 administradores. Solo el administrador principal o un delegado (definidos en Administración sistema) pueden cambiar este campo en cuentas ajenas; puedes quitarte el rol a ti mismo.',
      },
    },
    {
      name: 'referralCode',
      type: 'text',
      unique: true,
      index: true,
      label: 'Código de referido',
      admin: {
        description: 'Se genera automáticamente para clientes del portal.',
        readOnly: true,
      },
    },
    {
      name: 'totalReferralEarnings',
      type: 'number',
      defaultValue: 0,
      label: 'Comisiones acumuladas (USD)',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        const merged: Partial<User> & Record<string, unknown> = {
          ...(originalDoc as object as User),
          ...data,
        }
        const isFirstUserBootstrap = operation === 'create' && !req.user

        if (isFirstUserBootstrap) {
          merged.accountKind = 'internal'
          merged.isStaff = true
          merged.isAdmin = true
        }

        if (merged.accountKind === 'client') {
          merged.isStaff = false
          merged.isAdmin = false
        }

        if (merged.accountKind === 'internal') {
          const internalStaff = merged.isStaff === true
          const internalAdmin = merged.isAdmin === true
          if (!internalStaff && !internalAdmin) {
            throw new APIError(
              'Cuenta interna: marca al menos «Equipo» o «Administrador».',
              400,
            )
          }
        }

        const wasAdmin = Boolean((originalDoc as User | undefined)?.isAdmin)
        const nextAdmin = merged.isAdmin === true
        const adminToggled = adminFlagChanged(merged.isAdmin, wasAdmin)

        if (merged.accountKind === 'internal' && adminToggled && !isFirstUserBootstrap) {
          const payload = req.payload
          const actor = req.user as User | undefined
          const docId = originalDoc?.id
          const isSelf =
            Boolean(actor?.id) &&
            operation === 'update' &&
            docId != null &&
            String(actor.id) === String(docId)

          if (isSelf) {
            if (nextAdmin && !wasAdmin) {
              throw new APIError('No puedes asignarte el rol de administrador tú mismo.', 403)
            }
          } else {
            const targetsOther =
              operation === 'create' ||
              (operation === 'update' && docId != null && String(docId) !== String(actor?.id))

            if (targetsOther) {
              const canAssign = await actorCanAssignAdminRole(payload, actor)
              if (!canAssign) {
                throw new APIError(
                  'Solo el administrador principal o un delegado autorizado puede cambiar el rol de administrador de otras cuentas.',
                  403,
                )
              }
            }

            if (nextAdmin && !wasAdmin) {
              const { totalDocs: otherAdminCount } = await payload.count({
                collection: 'users',
                where: {
                  and: [
                    { isAdmin: { equals: true } },
                    ...(docId != null ? [{ id: { not_equals: docId } }] : []),
                  ],
                },
              })
              if (otherAdminCount >= 3) {
                throw new APIError(
                  'Ya hay 3 administradores. Para añadir otro, primero revoca el rol a uno existente.',
                  400,
                )
              }
            }
          }
        }

        if (operation === 'create' && merged.accountKind === 'client' && !merged.referralCode) {
          return {
            ...merged,
            referralCode: generateReferralCode(),
          }
        }

        return merged
      },
    ],
    afterChange: [
      async ({ doc, req, previousDoc }) => {
        const u = doc as User
        if (u.isAdmin && u.accountKind === 'internal') {
          const payload = req.payload
          try {
            const reg = await payload.findGlobal({
              slug: 'admin-registry',
              depth: 0,
              overrideAccess: true,
            })
            const hasPrimary = Boolean(resolveUserId(reg?.primaryAdmin as unknown))
            if (!hasPrimary) {
              await payload.updateGlobal({
                slug: 'admin-registry',
                data: {
                  primaryAdmin: u.id,
                },
                overrideAccess: true,
              })
            }
          } catch (err) {
            req.payload.logger.error({ err, msg: '[users.afterChange] admin-registry sync skipped' })
          }
        }

        try {
          await syncUserDirectoryRecords(req.payload, u, previousDoc as User | undefined)
        } catch (err) {
          req.payload.logger.error({ err, msg: '[users.afterChange] directory sync failed' })
        }
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        const id = (doc as User).id
        try {
          await deleteClientRecordsForUser(req.payload, id)
          await clearTeamMemberLinksForUser(req.payload, id)
        } catch (err) {
          req.payload.logger.error({ err, msg: '[users.afterDelete] cleanup failed' })
        }
      },
    ],
  },
}
