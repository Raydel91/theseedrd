import type { CollectionConfig } from 'payload'

import type { User } from '@/payload-types'
import { canAccessPayloadAdmin } from '@/payload/access/user-helpers'
import { PAYLOAD_RD_DIVISION_OPTIONS } from '@/lib/rd-admin-divisions'

export const Properties: CollectionConfig = {
  slug: 'properties',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'houseType', 'rdDivision', 'location', 'price', 'published'],
    description: 'Listados para /hogar — foto principal, galería y ficha completa.',
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
      name: 'houseType',
      type: 'relationship',
      relationTo: 'house-types',
      required: true,
      label: 'Tipo de propiedad',
    },
    {
      name: 'rdDivision',
      type: 'select',
      required: true,
      label: 'Provincia y municipio',
      options: PAYLOAD_RD_DIVISION_OPTIONS,
      admin: {
        description:
          'División territorial oficial. Elige el municipio; la etiqueta incluye la provincia.',
      },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      localized: true,
      label: 'Zona o referencia',
      admin: {
        description: 'Texto breve visible en listado (barrio, urbanización, referencia).',
      },
    },
    {
      name: 'streetAddress',
      type: 'textarea',
      localized: true,
      label: 'Dirección completa',
      admin: {
        description:
          'Opcional. Si está rellena, la ficha muestra un mapa con esta dirección. Usa formato legible para Google Maps.',
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
      name: 'propertyTags',
      type: 'relationship',
      relationTo: 'property-tags',
      hasMany: true,
      label: 'Etiquetas',
      admin: {
        description: 'Filtros, SEO y ubicación temática (Punta Cana, estilo, etc.).',
      },
    },
    {
      name: 'amenities',
      type: 'relationship',
      relationTo: 'property-amenities',
      hasMany: true,
      label: 'Amenidades',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Foto principal',
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Fotos secundarias',
      labels: { singular: 'Foto', plural: 'Fotos' },
      maxRows: 15,
      admin: {
        description: 'Hasta 15 imágenes adicionales (la principal es el campo anterior).',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Imagen',
        },
      ],
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      label: 'Publicado',
      admin: {
        description:
          'Si está desmarcado, la propiedad no aparece en /hogar ni en la ficha pública. Guarda el documento tras cambiarlo.',
      },
    },
  ],
}
