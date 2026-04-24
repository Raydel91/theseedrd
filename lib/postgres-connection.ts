/**
 * Supabase + Drizzle/node-pg (Vercel serverless).
 * - Solo el pooler en modo **transacción** (puerto **6543**) lleva `pgbouncer=true`.
 *   No añadirlo en `pooler.supabase.com:5432` (modo sesión): puede romper consultas
 *   internas de Payload/Drizzle (`SELECT to_regclass`, migraciones, etc.).
 * - Hosts Supabase: `sslmode=require` + `uselibpqcompat=true` si faltan en la URL.
 *   Esto evita fallos TLS en runtimes con `pg` reciente (`SELF_SIGNED_CERT_IN_CHAIN`)
 *   por el cambio de semántica de sslmode.
 */
/**
 * Pooler de Supabase en **modo sesión** (`*.pooler.supabase.*` puerto **5432**):
 * PgBouncer limita clientes concurrentes (`MaxClientsInSessionMode`). En serverless
 * conviene `pool.max = 1` para esa URI.
 *
 * Modo **transacción** usa puerto **6543** (misma familia de hosts).
 */
export function isSupabaseSessionPoolerUrl(raw: string): boolean {
  const lower = raw.trim().toLowerCase()
  if (!lower.includes('pooler.supabase.')) return false
  if (/[:@]6543(\/|\?|#|$)/.test(lower)) return false
  return true
}

const isPostgresUrl = (s: string) => s.startsWith('postgres://') || s.startsWith('postgresql://')

export type PayloadPostgresPoolResolutionKind =
  /** `DATABASE_URL` (p. ej. :6543) evita agotar el pool global en modo sesión. */
  | 'transaction_url_overrides_session_direct'
  /** Orden clásico: primera URL “directa” definida. */
  | 'direct_chain_first'
  /** Solo `DATABASE_URL` (no hay cadena directa Postgres). */
  | 'database_url_only'

export type PayloadPostgresPoolResolution = {
  url: string
  kind: PayloadPostgresPoolResolutionKind
}

/**
 * URL que debe usar el adaptador Postgres de Payload para el **pool** en runtime.
 *
 * Si `DATABASE_DIRECT_URL` (o equivalentes) apunta al pooler Supabase en **modo sesión**
 * (:5432), cada instancia serverless + el límite global de PgBouncer provocan
 * `MaxClientsInSessionMode` aunque `pool.max` sea 1. En ese caso, si `DATABASE_URL` es
 * Postgres y **no** es modo sesión (típico puerto **6543**), usamos `DATABASE_URL` para el pool.
 *
 * Desactivar: `PAYLOAD_DISABLE_TRANSACTION_POOL_FALLBACK=true`.
 */
export function resolvePayloadPostgresPoolFromEnv(): PayloadPostgresPoolResolution | null {
  const pooledRaw = (process.env.DATABASE_URL || '').trim()
  const directRaw = (
    process.env.DATABASE_DIRECT_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.DIRECT_URL ||
    ''
  ).trim()

  const pooledPg = isPostgresUrl(pooledRaw)
  const directPg = isPostgresUrl(directRaw)
  const disableFallback = process.env.PAYLOAD_DISABLE_TRANSACTION_POOL_FALLBACK === 'true'

  if (
    !disableFallback &&
    directPg &&
    isSupabaseSessionPoolerUrl(directRaw) &&
    pooledPg &&
    !isSupabaseSessionPoolerUrl(pooledRaw)
  ) {
    return { url: pooledRaw, kind: 'transaction_url_overrides_session_direct' }
  }

  if (directPg) {
    return { url: directRaw, kind: 'direct_chain_first' }
  }

  if (pooledPg) {
    return { url: pooledRaw, kind: 'database_url_only' }
  }

  return null
}

export function normalizePostgresConnectionString(raw: string): string {
  let url = raw.trim()
  if (!url) return url

  const lower = url.toLowerCase()
  const isSupabase = lower.includes('supabase.co') || lower.includes('supabase.com')
  const isTransactionPoolPort = /[:@]6543(\/|\?|#|$)/.test(lower)

  const append = (key: string, value: string) => {
    if (url.toLowerCase().includes(`${key}=`)) return
    url += url.includes('?') ? `&${key}=${value}` : `?${key}=${value}`
  }

  if (isSupabase && isTransactionPoolPort) {
    append('pgbouncer', 'true')
  }

  if (isSupabase) {
    append('uselibpqcompat', 'true')
    append('sslmode', 'require')
  }

  return url
}
