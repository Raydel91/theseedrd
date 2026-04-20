import type { Metadata } from 'next'

import { ContactPage } from '@/components/pages/contact-page'
import { publicPageMetadataWithOg } from '@/lib/seo/public-metadata'

export async function generateMetadata(): Promise<Metadata> {
  return publicPageMetadataWithOg('en', 'contact', {
    title: 'Contact | The Seed RD',
    description: 'Book a boutique consultation via WhatsApp or email. Extended hours for US/EU time zones.',
    path: '/en/contact',
  })
}

export default function ContactEnPage() {
  return <ContactPage locale="en" />
}
