import type { GlobalConfig } from 'payload'

import type { User } from '@/payload-types'
import { canAccessPayloadAdmin } from '@/payload/access/user-helpers'

export const ReferralSettings: GlobalConfig = {
  slug: 'referral-settings',
  label: 'Programa de referidos',
  admin: {
    group: 'Sitio',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => canAccessPayloadAdmin(user as User),
  },
  fields: [
    {
      name: 'commissionPercent',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 10,
      label: 'Porcentaje de comisión (%)',
    },
    {
      name: 'headline',
      type: 'text',
      localized: true,
      label: 'Titular',
    },
    {
      name: 'body',
      type: 'textarea',
      localized: true,
      label: 'Texto principal',
    },
    {
      name: 'rules',
      type: 'array',
      label: 'Reglas',
      fields: [
        {
          name: 'rule',
          type: 'text',
          localized: true,
          required: true,
        },
      ],
    },
  ],
}
