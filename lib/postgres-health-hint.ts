import {
  type PayloadPostgresPoolResolutionKind,
  resolvePayloadPostgresPoolFromEnv,
} from '@/lib/postgres-connection'

/**
 * Misma lógica que `payload.config.ts` para saber qué cadena usa el pool de Postgres.
 */
export function payloadEffectivePostgresUrlRaw(): { url: string; source: 'direct_chain' | 'DATABASE_URL' } | null {
  const r = resolvePayloadPostgresPoolFromEnv()
  if (!r) return null
  if (r.kind === 'direct_chain_first') {
    return { url: r.url, source: 'direct_chain' }
  }
  return { url: r.url, source: 'DATABASE_URL' }
}

function parsePgUrlIdentity(raw: string): {
  user: string
  host: string
  port: string
  parseError?: string
} {
  try {
    const u = new URL(raw)
    return {
      user: decodeURIComponent(u.username || ''),
      host: u.hostname,
      port: u.port || '5432',
    }
  } catch {
    return { user: '', host: '', port: '', parseError: 'invalid_postgres_url' }
  }
}

/**
 * Metadatos seguros para `/api/health-payload` (sin contraseñas ni querystring completa).
 */
export function summarizePostgresEnvForHealth(): {
  DATABASE_URL: { set: boolean; host?: string; port?: string }
  DATABASE_DIRECT_URL: { set: boolean; host?: string; port?: string }
  /** Primera URL “fuerte” que usa `payload.config` (mismo orden que allí). */
  effectiveDirect: { envKey: string; host?: string; port?: string } | null
  payloadPoolSource: 'direct_chain' | 'DATABASE_URL' | 'none'
  /** Cadena efectiva que Payload usa para conectar (misma regla que payload.config). */
  payloadConnection: {
    source: 'direct_chain' | 'DATABASE_URL'
    user: string
    host: string
    port: string
    parseError?: string
    /** Pooler Supabase suele exigir `postgres.<ref>`, no `postgres` solo. */
    suggestPoolerUserFormat?: boolean
  } | null
  /** Si Payload cae al pool transacción 6543 sin URL “fuerte”, suele fallar `to_regclass`. */
  transactionPoolerOnlyWarning: boolean
  /** Detalle de cómo se eligió la URL del pool (incluye fallback sesión→transacción). */
  payloadPoolKind: PayloadPostgresPoolResolutionKind | null
} {
  const meta = (name: string) => {
    const raw = process.env[name]?.trim()
    if (!raw) return { set: false as const }
    if (!raw.startsWith('postgres')) return { set: true as const, host: '(non-postgres)', port: undefined }
    try {
      const u = new URL(raw)
      return { set: true as const, host: u.hostname, port: u.port || '5432' }
    } catch {
      return { set: true as const, host: '(parse-error)', port: undefined }
    }
  }

  const directCandidates: [string, string | undefined][] = [
    ['DATABASE_DIRECT_URL', process.env.DATABASE_DIRECT_URL],
    ['DATABASE_URL_UNPOOLED', process.env.DATABASE_URL_UNPOOLED],
    ['DIRECT_URL', process.env.DIRECT_URL],
  ]
  let effectiveDirect: { envKey: string; host?: string; port?: string } | null = null
  for (const [key, raw] of directCandidates) {
    const t = raw?.trim()
    if (!t?.startsWith('postgres')) continue
    try {
      const u = new URL(t)
      effectiveDirect = { envKey: key, host: u.hostname, port: u.port || '5432' }
      break
    } catch {
      effectiveDirect = { envKey: key, host: '(parse-error)' }
      break
    }
  }

  const pooledRaw = process.env.DATABASE_URL || ''
  const hasDirectPg = Boolean(effectiveDirect)

  const poolResolution = resolvePayloadPostgresPoolFromEnv()
  const payloadPoolSource: 'direct_chain' | 'DATABASE_URL' | 'none' = poolResolution
    ? poolResolution.kind === 'direct_chain_first'
      ? 'direct_chain'
      : 'DATABASE_URL'
    : 'none'

  const transactionPoolerOnlyWarning =
    !hasDirectPg && /[:@]6543(\/|\?|#|$)/i.test(pooledRaw)

  const eff = payloadEffectivePostgresUrlRaw()
  let payloadConnection: {
    source: 'direct_chain' | 'DATABASE_URL'
    user: string
    host: string
    port: string
    parseError?: string
    suggestPoolerUserFormat?: boolean
  } | null = null
  if (eff) {
    const id = parsePgUrlIdentity(eff.url)
    const lowerHost = id.host.toLowerCase()
    const isPooler = lowerHost.includes('pooler.supabase.com')
    const suggestPoolerUserFormat =
      Boolean(id.user) && id.user === 'postgres' && isPooler
    payloadConnection = {
      source: eff.source,
      user: id.user || '(empty-user)',
      host: id.host || '(empty-host)',
      port: id.port,
      ...(id.parseError ? { parseError: id.parseError } : {}),
      ...(suggestPoolerUserFormat ? { suggestPoolerUserFormat: true } : {}),
    }
  }

  return {
    DATABASE_URL: meta('DATABASE_URL'),
    DATABASE_DIRECT_URL: meta('DATABASE_DIRECT_URL'),
    effectiveDirect,
    payloadPoolSource,
    payloadConnection,
    transactionPoolerOnlyWarning,
    payloadPoolKind: poolResolution?.kind ?? null,
  }
}
