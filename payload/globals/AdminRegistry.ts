import type { GlobalConfig } from 'payload'
import { APIError } from 'payload'

import type { User } from '@/payload-types'
import { resolveUserId } from '@/lib/admin-assigners'

/**
 * Quién puede nombrar a los otros administradores (máx. 3 en total en `users`).
 * El primer admin queda como principal; solo él edita delegados y solo él+delegados asignan `isAdmin` a terceros.
 */
export const AdminRegistry: GlobalConfig = {
  slug: 'admin-registry',
  label: 'Administración (sistema)',
  admin: {
    group: 'Sistema',
    description:
      'El primer administrador queda como principal. Solo él puede editar esta pantalla. Puede designar hasta 2 delegados internos que también puedan promover o revocar administradores en otras cuentas (máximo 3 administradores en total en Usuarios).',
  },
  access: {
    read: ({ req: { user } }) => Boolean((user as User | undefined)?.isAdmin || (user as User | undefined)?.isStaff),
    update: async ({ req }) => {
      const u = req.user as User | undefined
      if (!u?.id) return false
      try {
        const reg = await req.payload.findGlobal({
          slug: 'admin-registry',
          depth: 0,
          overrideAccess: true,
        })
        const primaryId = resolveUserId(reg?.primaryAdmin as unknown)
        if (primaryId == null) return Boolean(u.isAdmin)
        return String(primaryId) === String(u.id)
      } catch {
        return Boolean(u.isAdmin)
      }
    },
  },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        const raw = (data as { delegates?: unknown }).delegates
        const list = Array.isArray(raw) ? raw : raw != null ? [raw] : []
        if (list.length > 2) {
          throw new APIError('Máximo 2 delegados.', 400)
        }
        for (const d of list) {
          const id = resolveUserId(d)
          if (id == null) continue
          const doc = await req.payload.findByID({
            collection: 'users',
            id,
            depth: 0,
            overrideAccess: true,
          })
          const user = doc as User
          if (user.accountKind !== 'internal') {
            throw new APIError('Los delegados deben ser cuentas internas.', 400)
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'primaryAdmin',
      type: 'relationship',
      relationTo: 'users',
      maxDepth: 0,
      label: 'Administrador principal',
      admin: {
        readOnly: true,
        description: 'Definido automáticamente al crear el primer admin en Payload.',
      },
    },
    {
      name: 'delegates',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      maxRows: 2,
      label: 'Delegados (asignar administradores)',
      admin: {
        description:
          'Hasta 2 usuarios internos que pueden promover o revocar el rol de administrador en otras cuentas. Solo el administrador principal puede modificar esta lista.',
      },
      filterOptions: {
        accountKind: {
          equals: 'internal',
        },
      },
    },
  ],
}
