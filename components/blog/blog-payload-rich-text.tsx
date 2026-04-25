import { convertLexicalToHTMLAsync } from '@payloadcms/richtext-lexical/html-async'
import sanitizeHtml from 'sanitize-html'

import type { BlogPost } from '@/payload-types'

export async function BlogPayloadRichText({ content }: { content: BlogPost['content'] }) {
  if (!content) return null
  const htmlRaw = await convertLexicalToHTMLAsync({ data: content })
  const html = sanitizeHtml(htmlRaw, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    },
  })

  return (
    <div
      className="max-w-none space-y-4 leading-relaxed [&_a]:text-seed-emerald [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-seed-turquoise [&_blockquote]:pl-4 [&_h1]:font-heading [&_h1]:text-2xl [&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-xl [&_p]:mb-4 [&_ul]:my-4 [&_ol]:my-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
