/**
 * Supabase + Drizzle/node-pg (Vercel serverless).
 * - Pooler en modo transacción (6543) o host `*.pooler.supabase.com`: `pgbouncer=true`
 *   para evitar prepared statements incompatibles con PgBouncer.
 * - Hosts Supabase: `sslmode=require` si falta en la URL.
 */
export function normalizePostgresConnectionString(raw: string): string {
  let url = raw.trim()
  if (!url) return url

  const lower = url.toLowerCase()
  const isSupabase = lower.includes('supabase.co') || lower.includes('supabase.com')
  const isTransactionPoolPort = /[:@]6543(\/|\?|#|$)/.test(lower)
  const isPoolerHost = lower.includes('pooler.supabase.com')

  const append = (key: string, value: string) => {
    if (url.toLowerCase().includes(`${key}=`)) return
    url += url.includes('?') ? `&${key}=${value}` : `?${key}=${value}`
  }

  if (isSupabase && (isTransactionPoolPort || isPoolerHost)) {
    append('pgbouncer', 'true')
  }

  if (isSupabase) {
    append('sslmode', 'require')
  }

  return url
}
