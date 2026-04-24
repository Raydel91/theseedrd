import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { randomBytes } from 'crypto'

import type { User } from '@/payload-types'

function generateReferralCode(): string {
  return `TSR-${randomBytes(3).toString('hex').toUpperCase()}`
}

function resolveUserId(rel: unknown): string | number | null {
  if (rel == null) return null
  if (typeof rel === 'object' && 'id' in rel && (rel as { id: unknown }).id != null) {
    return (rel as { id: string | number }).id
  }
  if (typeof rel === 'string' || typeof rel === 'number') return rel
  return null
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
          'Cliente: solo portal público. Interno: puede ser equipo, administrador o ambos (máx. 3 administradores en todo el sistema).',
      },
    },
    {
      name: 'isStaff',
      type: 'checkbox',
      defaultValue: false,
      label: 'Equipo (staff)',
      admin: {
        description: 'Acceso de equipo al panel Payload (contenido, casos, etc.). Compatible con administrador.',
      },
    },
    {
      name: 'isAdmin',
      type: 'checkbox',
      defaultValue: false,
      label: 'Administrador',
      admin: {
        description:
          'Máximo 3 administradores en total. El primer admin queda como “principal” y solo él puede nombrar a los otros dos admins (cuentas internas).',
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
        /** Solo el asistente inicial de `/admin` (sin sesión). */
        const isFirstUserBootstrap = operation === 'create' && !req.user

        // Flujo nativo de Payload: creación del primer usuario sin sesión activa.
        // Debe poder completarse aunque la UI no envíe todos los campos custom.
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

        if (merged.accountKind === 'internal' && merged.isAdmin === true) {
          const payload = req.payload
          const docId = originalDoc?.id
          const wasAdmin = Boolean((originalDoc as User | undefined)?.isAdmin)

          const { totalDocs: otherAdminCount } = await payload.count({
            collection: 'users',
            where: {
              and: [
                { isAdmin: { equals: true } },
                ...(docId != null ? [{ id: { not_equals: docId } }] : []),
              ],
            },
          })

          if (!wasAdmin && otherAdminCount >= 3) {
            throw new APIError('Ya hay 3 administradores. Para añadir otro, primero revoca el rol a uno existente.', 400)
          }

          const reg = await payload.findGlobal({
            slug: 'admin-registry',
            depth: 0,
            overrideAccess: true,
          })
          const primaryId = resolveUserId(reg?.primaryAdmin as unknown)

          const assigningNewAdmin = !wasAdmin

          const promotingAnotherUser =
            assigningNewAdmin &&
            req.user &&
            (operation === 'create' ||
              (docId != null && String(docId) !== String(req.user.id)))

          if (promotingAnotherUser) {
            const actor = req.user
            if (!actor) {
              throw new APIError('Sesión requerida para asignar administradores.', 401)
            }
            if (primaryId == null) {
              throw new APIError(
                'El primer administrador debe crearse con el registro inicial de Payload (sin sesión). Luego solo el administrador principal puede nombrar a los demás.',
                403,
              )
            }
            if (String(actor.id) !== String(primaryId)) {
              throw new APIError(
                'Solo el administrador principal puede asignar el rol de administrador a otras cuentas.',
                403,
              )
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
      async ({ doc, req }) => {
        const u = doc as User
        if (!u.isAdmin || u.accountKind !== 'internal') return

        const payload = req.payload
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
      },
    ],
  },
}
