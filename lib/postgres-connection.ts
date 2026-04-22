/**
 * Supabase + Drizzle/node-pg (Vercel serverless).
 * - Solo el pooler en modo **transacción** (puerto **6543**) lleva `pgbouncer=true`.
 *   No añadirlo en `pooler.supabase.com:5432` (modo sesión): puede romper consultas
 *   internas de Payload/Drizzle (`SELECT to_regclass`, migraciones, etc.).
 * - Hosts Supabase: `sslmode=require` si falta en la URL.
 */
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
    append('sslmode', 'require')
  }

  return url
}
