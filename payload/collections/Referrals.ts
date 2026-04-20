import type { CollectionConfig } from 'payload'

import type { User } from '@/payload-types'
import { canAccessPayloadAdmin, isPortalClient } from '@/payload/access/user-helpers'

export const Referrals: CollectionConfig = {
  slug: 'referrals',
  admin: {
    useAsTitle: 'inviteeName',
    defaultColumns: ['referrer', 'inviteeName', 'status', 'commissionAmount'],
    description: 'Seguimiento de referidos y comisiones',
  },
  access: {
    read: ({ req: { user } }) => {
      if (canAccessPayloadAdmin(user as User)) return true
      if (user?.collection === 'users' && isPortalClient(user as User)) {
        return {
          referrer: {
            equals: user.id,
          },
        }
      }
      return false
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => canAccessPayloadAdmin(user as User),
    delete: ({ req: { user } }) => (user as User | undefined)?.isAdmin === true,
  },
  fields: [
    {
      name: 'referrer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Referidor',
      filterOptions: {
        accountKind: {
          equals: 'client',
        },
      },
    },
    {
      name: 'inviteeName',
      type: 'text',
      required: true,
      label: 'Nombre del referido',
    },
    {
      name: 'inviteeEmail',
      type: 'email',
      label: 'Email del referido',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pendiente', value: 'pending' },
        { label: 'Calificado', value: 'qualified' },
        { label: 'Pagado', value: 'paid' },
        { label: 'Rechazado', value: 'rejected' },
      ],
      label: 'Estado',
    },
    {
      name: 'commissionAmount',
      type: 'number',
      defaultValue: 0,
      label: 'Comisión (USD)',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notas',
    },
  ],
}
