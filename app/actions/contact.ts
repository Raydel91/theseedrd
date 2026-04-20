'use server'

import { z } from 'zod'

import { getPayloadInstance } from '@/lib/payload-server'
import { getClientIpFromHeaders } from '@/lib/security/client-ip'
import { rateLimitContact } from '@/lib/security/rate-limit'
import { sanitizePlainText } from '@/lib/security/sanitize-text'

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(254),
  phone: z.string().min(8).max(32),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(8000),
})

export type ContactState = { ok: boolean; error?: string }

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const ip = await getClientIpFromHeaders()
  const { ok } = await rateLimitContact(ip)
  if (!ok) {
    return { ok: false, error: 'rate_limited' }
  }

  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  }

  const parsed = contactSchema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, error: 'validation' }
  }

  const name = sanitizePlainText(parsed.data.name, 120)
  const email = sanitizePlainText(parsed.data.email, 254).toLowerCase()
  const phone = sanitizePlainText(parsed.data.phone, 32)
  const subject = sanitizePlainText(parsed.data.subject, 200)
  const message = sanitizePlainText(parsed.data.message, 8000)
  const phoneDigits = phone.replace(/\D/g, '')

  if (name.length < 2 || message.length < 10 || phoneDigits.length < 8) {
    return { ok: false, error: 'validation' }
  }

  try {
    const payload = await getPayloadInstance()
    await payload.create({
      collection: 'consultation-messages',
      data: {
        source: 'public_form',
        name,
        phone,
        email,
        subject,
        body: message,
      },
      overrideAccess: true,
    })
  } catch {
    return { ok: false, error: 'persist' }
  }

  return { ok: true }
}
