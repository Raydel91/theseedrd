import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

/**
 * Rate limiting distribuido (Upstash Redis) en producción.
 * Si faltan UPSTASH_* se usa fallback en memoria (solo válido en instancia única / desarrollo).
 */

type MemoryBucket = { count: number; resetAt: number }
const memoryBuckets = new Map<string, MemoryBucket>()
const MEMORY_MAX_KEYS = 5000

function memoryLimit(key: string, limit: number, windowMs: number): { success: boolean; reset: number } {
  const now = Date.now()
  let b = memoryBuckets.get(key)
  if (!b || now > b.resetAt) {
    if (memoryBuckets.size > MEMORY_MAX_KEYS) {
      for (const [k, v] of memoryBuckets) {
        if (now > v.resetAt) memoryBuckets.delete(k)
      }
    }
    b = { count: 1, resetAt: now + windowMs }
    memoryBuckets.set(key, b)
    return { success: true, reset: b.resetAt }
  }
  if (b.count >= limit) {
    return { success: false, reset: b.resetAt }
  }
  b.count++
  return { success: true, reset: b.resetAt }
}

let authRatelimit: Ratelimit | null = null
let contactRatelimit: Ratelimit | null = null

function tryRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

const redis = tryRedis()
if (redis) {
  authRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '15 m'),
    prefix: 'ratelimit:auth',
    analytics: false,
  })
  contactRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(8, '1 h'),
    prefix: 'ratelimit:contact',
    analytics: false,
  })
}

const AUTH_WINDOW_MS = 15 * 60 * 1000
const AUTH_LIMIT = 30
const CONTACT_WINDOW_MS = 60 * 60 * 1000
const CONTACT_LIMIT = 8

export async function rateLimitAuth(ip: string): Promise<{ ok: boolean }> {
  if (authRatelimit) {
    const { success } = await authRatelimit.limit(ip)
    return { ok: success }
  }
  const { success } = memoryLimit(`auth:${ip}`, AUTH_LIMIT, AUTH_WINDOW_MS)
  return { ok: success }
}

export async function rateLimitContact(ip: string): Promise<{ ok: boolean }> {
  if (contactRatelimit) {
    const { success } = await contactRatelimit.limit(ip)
    return { ok: success }
  }
  const { success } = memoryLimit(`contact:${ip}`, CONTACT_LIMIT, CONTACT_WINDOW_MS)
  return { ok: success }
}
