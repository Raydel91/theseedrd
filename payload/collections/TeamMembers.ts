import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

import type { User } from '@/payload-types'
import { canAccessPayloadAdmin } from '@/payload/access/user-helpers'

function linkedUserId(raw: unknown): string | number | null {
  if (raw == null) return null
  if (typeof raw === 'object' && 'id' in raw && (raw as { id: unknown }).id != null) {
    return (raw as { id: string | number }).id
  }
  if (typeof raw === 'string' || typeof raw === 'number') return raw
  return null
}

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'order'],
    description: 'Equipo visible en /sobre-nosotros. Solo cuentas internas con staff; no clientes.',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => canAccessPayloadAdmin(user as User),
    update: ({ req: { user } }) => canAccessPayloadAdmin(user as User),
    delete: ({ req: { user } }) => (user as User | undefined)?.isAdmin === true,
  },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        const uid = linkedUserId((data as { linkedUser?: unknown }).linkedUser)
        if (uid == null) return data
        const u = (await req.payload.findByID({
          collection: 'users',
          id: uid,
          depth: 0,
          overrideAccess: true,
        })) as User
        if (u.accountKind === 'client') {
          throw new APIError(
            'Un cliente no puede vincularse al equipo público. Use una cuenta interna con «Equipo».',
            400,
          )
        }
        if (u.isStaff !== true) {
          throw new APIError('El usuario vinculado debe tener «Equipo (staff)» activo.', 400)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Cargo',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Foto',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Biografía',
    },
    {
      name: 'linkedin',
      type: 'text',
      label: 'LinkedIn URL',
    },
    {
      name: 'instagram',
      type: 'text',
      label: 'Instagram URL',
    },
    {
      name: 'whatsapp',
      type: 'text',
      label: 'WhatsApp (número con código de país, ej. 18095551234, o URL wa.me/...)',
    },
    {
      name: 'facebook',
      type: 'text',
      label: 'Facebook URL',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Orden',
    },
    {
      name: 'linkedUser',
      type: 'relationship',
      relationTo: 'users',
      label: 'Usuario interno vinculado (opcional)',
      admin: {
        description:
          'Si se rellena, debe ser un usuario interno con «Equipo». Se limpia solo si el usuario pasa a cliente o pierde staff.',
      },
      filterOptions: () => ({
        and: [{ accountKind: { equals: 'internal' } }, { isStaff: { equals: true } }],
      }),
    },
  ],
}
