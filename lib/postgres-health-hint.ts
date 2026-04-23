/**
 * Metadatos seguros para `/api/health-payload` (sin contraseñas ni querystring completa).
 */
export function summarizePostgresEnvForHealth(): {
  DATABASE_URL: { set: boolean; host?: string; port?: string }
  DATABASE_DIRECT_URL: { set: boolean; host?: string; port?: string }
  /** Primera URL “fuerte” que usa `payload.config` (mismo orden que allí). */
  effectiveDirect: { envKey: string; host?: string; port?: string } | null
  payloadPoolSource: 'direct_chain' | 'DATABASE_URL' | 'none'
  /** Si Payload cae al pool transacción 6543 sin URL “fuerte”, suele fallar `to_regclass`. */
  transactionPoolerOnlyWarning: boolean
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
  const payloadPoolSource: 'direct_chain' | 'DATABASE_URL' | 'none' = hasDirectPg
    ? 'direct_chain'
    : pooledRaw.startsWith('postgres')
      ? 'DATABASE_URL'
      : 'none'

  const transactionPoolerOnlyWarning =
    !hasDirectPg && /[:@]6543(\/|\?|#|$)/i.test(pooledRaw)

  return {
    DATABASE_URL: meta('DATABASE_URL'),
    DATABASE_DIRECT_URL: meta('DATABASE_DIRECT_URL'),
    effectiveDirect,
    payloadPoolSource,
    transactionPoolerOnlyWarning,
  }
}
