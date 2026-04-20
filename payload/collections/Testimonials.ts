import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'nationality', 'rating'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'clientName',
      type: 'text',
      required: true,
      label: 'Cliente',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto',
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      label: 'Testimonio',
    },
    {
      name: 'nationality',
      type: 'text',
      label: 'Nacionalidad',
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      defaultValue: 5,
      label: 'Valoración',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: true,
      label: 'Mostrar en home',
    },
  ],
}
