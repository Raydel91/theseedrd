import { redirect } from 'next/navigation'

import { ClientMessagesPanel, type ClientMessageRow } from '@/components/dashboard/client-messages-panel'
import { DashboardView } from '@/components/dashboard/dashboard-view'
import { auth } from '@/auth'
import { getPayloadInstance } from '@/lib/payload-server'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const payload = await getPayloadInstance()
  const uid = session.user.id

  const clientCase = await payload.find({
    collection: 'clients',
    where: { portalUser: { equals: uid } },
    limit: 1,
    depth: 0,
    locale: 'es',
  })

  const caseDoc = clientCase.docs[0]
  const timeline =
    (caseDoc?.timeline as {
      label?: string | { es?: string }
      description?: string | { es?: string }
      completed?: boolean
      sortOrder?: number
    }[]) || []

  const mappedTimeline = timeline.map((t, i) => ({
    label: typeof t.label === 'string' ? t.label : t.label?.es ?? `Paso ${i + 1}`,
    description: typeof t.description === 'string' ? t.description : t.description?.es,
    completed: t.completed,
    sortOrder: t.sortOrder,
  }))

  const refList = await payload.find({
    collection: 'referrals',
    where: { referrer: { equals: uid } },
    limit: 50,
    locale: 'es',
  })

  const referrals = refList.docs.map((r) => ({
    id: String(r.id),
    name: r.inviteeName as string,
    status: r.status as string,
    commission: (r.commissionAmount as number) || 0,
  }))

  const userRecord = await payload.findByID({
    collection: 'users',
    id: uid,
  })

  const earnings = (userRecord?.totalReferralEarnings as number) || 0
  const referralCode =
    session.user.referralCode || (userRecord?.referralCode as string) || 'PENDIENTE'

  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const shareUrl = `${base}/contacto?ref=${encodeURIComponent(referralCode)}`

  const inbox = await payload.find({
    collection: 'consultation-messages',
    where: {
      and: [
        { fromUser: { equals: Number(uid) } },
        { readAt: { equals: null } },
      ],
    },
    sort: '-createdAt',
    limit: 50,
    depth: 0,
    overrideAccess: true,
  })

  const clientMessages: ClientMessageRow[] = inbox.docs.map((d) => ({
    id: String(d.id),
    subject: String(d.subject ?? ''),
    body: String(d.body ?? ''),
    createdAt: typeof d.createdAt === 'string' ? d.createdAt : String(d.createdAt ?? ''),
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-seed-sand to-background">
      <DashboardView
        referralCode={referralCode}
        shareUrl={shareUrl}
        caseTitle={(caseDoc?.fullName as string) || 'Tu expediente'}
        timeline={mappedTimeline}
        referrals={referrals}
        earnings={earnings}
        messagesSlot={<ClientMessagesPanel messages={clientMessages} />}
      />
    </div>
  )
}
