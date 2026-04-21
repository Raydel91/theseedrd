import type { CollectionConfig } from 'payload'

import type { User } from '@/payload-types'
import { canAccessPayloadAdmin } from '@/payload/access/user-helpers'

export const HouseTypes: CollectionConfig = {
  slug: 'house-types',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'slug', 'sortOrder'],
    description: 'Tipos de vivienda (Villa, Penthouse, etc.). Añade filas para nuevos tipos.',
    group: 'Inmobiliario',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => canAccessPayloadAdmin(user as User),
    update: ({ req: { user } }) => canAccessPayloadAdmin(user as User),
    delete: ({ req: { user } }) => (user as User | undefined)?.isAdmin === true,
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: { description: 'Único, sin espacios (ej. villa-de-lujo).' },
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      localized: true,
      label: 'Nombre',
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Orden',
    },
  ],
}
