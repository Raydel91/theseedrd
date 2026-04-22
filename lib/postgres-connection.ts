/**
 * Supabase Transaction Pooler (PgBouncer) + Drizzle/node-pg: conviene `pgbouncer=true`
 * para evitar errores intermitentes con prepared statements.
 */
export function normalizePostgresConnectionString(raw: string): string {
  if (!raw.includes('pooler.supabase.com') || raw.includes('pgbouncer=true')) return raw
  return raw.includes('?') ? `${raw}&pgbouncer=true` : `${raw}?pgbouncer=true`
}
