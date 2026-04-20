import type { Metadata } from 'next'

import { ReferralsPage } from '@/components/pages/referrals-page'
import { publicPageMetadataWithOg } from '@/lib/seo/public-metadata'

export async function generateMetadata(): Promise<Metadata> {
  return publicPageMetadataWithOg('en', 'referrals', {
    title: 'Referral program | The Seed RD',
    description: 'Refer The Seed RD and earn commissions on qualified clients.',
    path: '/en/referrals',
  })
}

export default function ReferralsEnPage() {
  return <ReferralsPage locale="en" />
}
