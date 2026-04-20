import { cache } from 'react'

import { getPayloadInstance } from '@/lib/payload-server'

export const getSiteConfig = cache(async (locale: 'es' | 'en') => {
  try {
    const payload = await getPayloadInstance()
    const doc = await payload.findGlobal({
      slug: 'site-config',
      locale,
      depth: 1,
    })
    return doc
  } catch {
    return null
  }
})

export function defaultWhatsapp(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP || '18095551234'
}
