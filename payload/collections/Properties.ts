import type { CollectionConfig } from 'payload'

import type { User } from '@/payload-types'
import { canAccessPayloadAdmin } from '@/payload/access/user-helpers'
import { PAYLOAD_RD_DIVISION_OPTIONS } from '@/lib/rd-admin-divisions'

export const Properties: CollectionConfig = {
  slug: 'properties',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'rdDivision', 'location', 'price', 'published'],
    description: 'Listados para /hogar',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => canAccessPayloadAdmin(user as User),
    update: ({ req: { user } }) => canAccessPayloadAdmin(user as User),
    delete: ({ req: { user } }) => (user as User | undefined)?.isAdmin === true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Título',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
    },
    {
      name: 'rdDivision',
      type: 'select',
      required: true,
      label: 'Provincia y municipio',
      options: PAYLOAD_RD_DIVISION_OPTIONS,
      admin: {
        description:
          'División territorial oficial (31 provincias + Distrito Nacional). Elige el municipio; la etiqueta incluye la provincia.',
      },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      localized: true,
      label: 'Zona o referencia',
      admin: {
        description: 'Texto breve visible en la ficha (barrio, urbanización, referencia).',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Precio (USD)',
    },
    {
      name: 'beds',
      type: 'number',
      defaultValue: 2,
      label: 'Habitaciones',
    },
    {
      name: 'baths',
      type: 'number',
      defaultValue: 2,
      label: 'Baños',
    },
    {
      name: 'sqm',
      type: 'number',
      label: 'm²',
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      label: 'Etiquetas',
      options: [
        { label: 'Vista mar', value: 'sea' },
        { label: 'Golf', value: 'golf' },
        { label: 'Nuevo', value: 'new' },
        { label: 'Inversión', value: 'investment' },
      ],
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Imagen principal',
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      label: 'Publicado',
    },
  ],
}
