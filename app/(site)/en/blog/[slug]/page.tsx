import type { Metadata } from 'next'

import { BlogPostPage, generateBlogPostMetadata } from '@/components/pages/blog-post-page'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return generateBlogPostMetadata('en', slug)
}

export default async function BlogPostEn({ params }: Props) {
  const { slug } = await params
  return <BlogPostPage locale="en" slug={slug} />
}
