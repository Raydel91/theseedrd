import type { CollectionConfig } from 'payload'

import type { User } from '@/payload-types'
import { canAccessPayloadAdmin } from '@/payload/access/user-helpers'

export const PropertyAmenities: CollectionConfig = {
  slug: 'property-amenities',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'slug', 'amenityCategory', 'sortOrder'],
    description: 'Amenidades (piscina, spa, etc.). Organizadas por categoría.',
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
      label: 'Nombre',
    },
    {
      name: 'amenityCategory',
      type: 'select',
      required: true,
      label: 'Categoría',
      options: [
        { label: 'Exterior / parcela', value: 'exterior' },
        { label: 'Comunidad / resort', value: 'community' },
        { label: 'Interior', value: 'interior' },
        { label: 'Lujo premium', value: 'luxury' },
      ],
      defaultValue: 'exterior',
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Orden',
    },
  ],
}
