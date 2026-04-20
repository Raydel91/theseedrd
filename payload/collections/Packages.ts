import type { CollectionConfig } from 'payload'

export const Packages: CollectionConfig = {
  slug: 'packages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'order', 'highlighted'],
    description: 'Paquetes de servicios en /servicios',
  },
  access: {
    read: () => true,
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
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
      label: 'Descripción corta',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Precio (USD)',
    },
    {
      name: 'billingNote',
      type: 'text',
      localized: true,
      label: 'Nota de facturación',
      defaultValue: 'por caso',
    },
    {
      name: 'features',
      type: 'array',
      label: 'Características',
      fields: [
        {
          name: 'item',
          type: 'text',
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: 'ctaLabel',
      type: 'text',
      localized: true,
      defaultValue: 'Solicitar',
      label: 'Texto del botón',
    },
    {
      name: 'highlighted',
      type: 'checkbox',
      defaultValue: false,
      label: 'Destacado',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Orden',
    },
  ],
}
