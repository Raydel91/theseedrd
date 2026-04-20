'use server'

import { z } from 'zod'

import { auth } from '@/auth'
import { getPayloadInstance } from '@/lib/payload-server'
import { getClientIpFromHeaders } from '@/lib/security/client-ip'
import { rateLimitContact } from '@/lib/security/rate-limit'
import { sanitizePlainText } from '@/lib/security/sanitize-text'

const schema = z.object({
  phone: z.string().min(8).max(32),
  subject: z.string().min(2).max(200),
  body: z.string().min(10).max(8000),
})

export type ClientConsultationState = { ok: boolean; error?: string }

export async function submitClientConsultationMessage(
  _prev: ClientConsultationState,
  formData: FormData,
): Promise<ClientConsultationState> {
  const session = await auth()
  if (!session?.user?.id) {
    return { ok: false, error: 'auth' }
  }

  const ip = await getClientIpFromHeaders()
  const { ok } = await rateLimitContact(ip)
  if (!ok) {
    return { ok: false, error: 'rate_limited' }
  }

  const payload = await getPayloadInstance()
  const uid = Number(session.user.id)
  const user = await payload.findByID({
    collection: 'users',
    id: uid,
    depth: 0,
  })

  if (!user || user.accountKind !== 'client') {
    return { ok: false, error: 'forbidden' }
  }

  const raw = {
    phone: formData.get('phone'),
    subject: formData.get('subject'),
    body: formData.get('body'),
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, error: 'validation' }
  }

  const phone = sanitizePlainText(parsed.data.phone, 32)
  const subject = sanitizePlainText(parsed.data.subject, 200)
  const body = sanitizePlainText(parsed.data.body, 8000)
  const phoneDigits = phone.replace(/\D/g, '')

  if (phoneDigits.length < 8) {
    return { ok: false, error: 'validation' }
  }

  const first = user.firstName ? String(user.firstName).trim() : ''
  const last = user.lastName ? String(user.lastName).trim() : ''
  const name = [first, last].filter(Boolean).join(' ') || (session.user.email ?? 'Cliente')
  const email = (session.user.email ?? user.email).toLowerCase()

  await payload.create({
    collection: 'consultation-messages',
    data: {
      source: 'client_portal',
      fromUser: uid,
      name,
      phone,
      email,
      subject,
      body,
    },
    overrideAccess: true,
  })

  return { ok: true }
}
