import type { Metadata } from 'next'

import { BlogListPage } from '@/components/pages/blog-list-page'
import { publicPageMetadataWithOg } from '@/lib/seo/public-metadata'

export async function generateMetadata(): Promise<Metadata> {
  return publicPageMetadataWithOg('es', 'blog', {
    title: 'Blog | Relocalización y lifestyle RD',
    description:
      'Guías sobre residencia, migración, compra de vivienda y vida en República Dominicana.',
    path: '/blog',
  })
}

export default function BlogIndexEs() {
  return <BlogListPage locale="es" />
}
