import { RichText } from '@payloadcms/richtext-lexical/react'

import type { BlogPost } from '@/payload-types'

export function BlogPayloadRichText({ content }: { content: BlogPost['content'] }) {
  if (!content) return null
  return (
    <RichText
      data={content}
      className="max-w-none space-y-4 leading-relaxed [&_a]:text-seed-emerald [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-seed-turquoise [&_blockquote]:pl-4 [&_h1]:font-heading [&_h1]:text-2xl [&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-xl [&_p]:mb-4 [&_ul]:my-4 [&_ol]:my-4"
    />
  )
}
