import type { Metadata } from 'next'

import { BlogListPage } from '@/components/pages/blog-list-page'
import { publicPageMetadataWithOg } from '@/lib/seo/public-metadata'

export async function generateMetadata(): Promise<Metadata> {
  return publicPageMetadataWithOg('en', 'blog', {
    title: 'Blog | Relocation & lifestyle DR',
    description:
      'Guides on residency, migration, buying a home, and life in the Dominican Republic.',
    path: '/en/blog',
  })
}

export default function BlogIndexEn() {
  return <BlogListPage locale="en" />
}
