import type { Metadata } from 'next'

import { BlogPostPage, generateBlogPostMetadata } from '@/components/pages/blog-post-page'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return generateBlogPostMetadata('es', slug)
}

export default async function BlogPostEs({ params }: Props) {
  const { slug } = await params
  return <BlogPostPage locale="es" slug={slug} />
}
