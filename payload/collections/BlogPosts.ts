import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import type { User } from '@/payload-types'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishedAt'],
    description: 'Artículos del blog (URLs /blog/[slug] cuando publiques desde aquí)',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { published: { equals: true } }
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
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
      label: 'Slug (URL)',
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Fecha de publicación',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      label: 'Resumen',
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      label: 'Contenido',
      editor: lexicalEditor(),
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      label: 'Publicado',
    },
  ],
}
