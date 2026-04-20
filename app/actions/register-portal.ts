'use server'

import { z } from 'zod'

import { getPayloadInstance } from '@/lib/payload-server'
import { getClientIpFromHeaders } from '@/lib/security/client-ip'
import { rateLimitContact } from '@/lib/security/rate-limit'
import { sanitizePlainText } from '@/lib/security/sanitize-text'

const schema = z.object({
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
})

export type RegisterPortalState = { ok: boolean; error?: string }

export async function registerPortalClient(_prev: RegisterPortalState, formData: FormData): Promise<RegisterPortalState> {
  const ip = await getClientIpFromHeaders()
  const { ok } = await rateLimitContact(ip)
  if (!ok) {
    return { ok: false, error: 'rate_limited' }
  }

  const raw = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, error: 'validation' }
  }

  const firstName = sanitizePlainText(parsed.data.firstName, 80)
  const lastName = sanitizePlainText(parsed.data.lastName, 80)
  const email = sanitizePlainText(parsed.data.email, 254).toLowerCase()
  const password = parsed.data.password

  try {
    const payload = await getPayloadInstance()
    const dup = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })
    if (dup.docs.length > 0) {
      return { ok: false, error: 'duplicate_email' }
    }

    await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        accountKind: 'client',
        firstName,
        lastName,
      },
      overrideAccess: true,
    })
  } catch {
    return { ok: false, error: 'persist' }
  }

  return { ok: true }
}
