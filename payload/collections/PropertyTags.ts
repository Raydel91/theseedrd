import type { CollectionConfig } from 'payload'

import type { User } from '@/payload-types'
import { canAccessPayloadAdmin } from '@/payload/access/user-helpers'

export const PropertyTags: CollectionConfig = {
  slug: 'property-tags',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'slug', 'tagCategory', 'sortOrder'],
    description: 'Etiquetas para filtros y SEO. Añade nuevas cuando las necesites.',
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
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      localized: true,
      label: 'Etiqueta',
    },
    {
      name: 'tagCategory',
      type: 'select',
      required: true,
      label: 'Grupo',
      options: [
        { label: 'General / transacción', value: 'general' },
        { label: 'Estilo', value: 'style' },
        { label: 'Ubicación', value: 'location' },
      ],
      defaultValue: 'general',
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Orden',
    },
  ],
}
