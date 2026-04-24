import { NextResponse } from 'next/server'

import { summarizePostgresEnvForHealth } from '@/lib/postgres-health-hint'
import { getPayloadInstance } from '@/lib/payload-server'

export const dynamic = 'force-dynamic'

/** Códigos PostgreSQL útiles sin filtrar el mensaje completo. */
const PG_HINTS: Record<string, string> = {
  '42P01': 'missing_schema',
  '3D000': 'missing_schema',
  '28000': 'connection',
  '28P01': 'connection',
  '08000': 'connection',
  '08006': 'connection',
  '08001': 'connection',
  '08004': 'connection',
  '08003': 'connection',
  '57P01': 'connection',
}

function pgCode(e: unknown): string | undefined {
  if (typeof e === 'object' && e !== null && 'code' in e) {
    const c = (e as { code?: unknown }).code
    return typeof c === 'string' ? c : undefined
  }
  return undefined
}

function pgCodeDeep(e: unknown): string | undefined {
  let cur: unknown = e
  for (let i = 0; i < 6 && cur; i++) {
    const c = pgCode(cur)
    if (c) return c
    if (cur instanceof Error && cur.cause) cur = cur.cause
    else if (typeof cur === 'object' && cur !== null && 'cause' in cur) {
      cur = (cur as { cause?: unknown }).cause
    } else break
  }
  return undefined
}

/** Drizzle envuelve el fallo real en `cause`; sin esto solo ves "Failed query: … to_regclass". */
function collectDeepMessages(e: unknown, maxDepth = 8): string[] {
  const out: string[] = []
  let cur: unknown = e
  for (let i = 0; i < maxDepth && cur; i++) {
    if (cur instanceof Error && cur.message) out.push(cur.message)
    else if (typeof cur === 'object' && cur !== null && 'message' in cur) {
      const m = (cur as { message?: unknown }).message
      if (typeof m === 'string' && m) out.push(m)
    }
    if (cur instanceof Error && cur.cause !== undefined && cur.cause !== null) cur = cur.cause
    else if (typeof cur === 'object' && cur !== null && 'cause' in cur) {
      const next = (cur as { cause?: unknown }).cause
      if (next === undefined || next === null) break
      cur = next
    } else break
  }
  return out
}

function classifyDbError(msg: string, code?: string): string {
  if (code && PG_HINTS[code]) return PG_HINTS[code]
  const m = msg.toLowerCase()
  /** Antes que "Failed query…to_regclass": suele ser timeout de `pg-pool` al conectar. */
  if (
    /timeout exceeded when trying to connect|econnrefused|enotfound|password|authentication|tenant or user|ssl|certificate|connect timeout|connection terminated/i.test(
      m,
    )
  ) {
    return 'connection'
  }
  if (/does not exist|relation|table|no existe|undefinedtable/.test(m)) {
    return 'missing_schema'
  }
  if (/prepared statement|unnamed stmt|bind message|protocol|pgbouncer/.test(m)) {
    return 'pooler_prepared_statement'
  }
  if (/query timeout|statement timeout|etimedout|timeout/i.test(m)) {
    return 'connection'
  }
  /** Superficie Drizzle si la causa no se propagó. */
  if (/failed query|to_regclass|payload_migrations/i.test(m)) {
    return 'database_query_failed'
  }
  return 'unknown'
}

function redactConnectionStrings(s: string): string {
  return s.replace(/postgres(ql)?:\/\/[^\s"'`]+/gi, 'postgres://***')
}

function errorMeta(e: unknown): { errorType: string; messagePreview: string | null } {
  /** No usar `constructor.name` ni `name` minificados (producción → "f"). */
  const errorType = e instanceof Error ? 'Error' : e === null ? 'null' : typeof e
  const show =
    process.env.PAYLOAD_PUBLIC_HEALTH_DETAILS === 'true' &&
    e instanceof Error &&
    e.message
  const chain = collectDeepMessages(e).join(' | ')
  const messagePreview = show ? redactConnectionStrings(chain).slice(0, 400) : null
  return { errorType, messagePreview }
}

function classifyFromError(e: unknown): string {
  const combined = collectDeepMessages(e).join('\n')
  return classifyDbError(combined, pgCodeDeep(e))
}

function messageShortFromError(e: unknown): string {
  const combined = collectDeepMessages(e).join(' | ')
  return redactConnectionStrings(combined).slice(0, 280)
}

/**
 * Comprueba que Payload arranca y puede consultar Postgres.
 * El mensaje completo solo va a logs de Vercel.
 */
export async function GET() {
  try {
    const payload = await getPayloadInstance()
    try {
      await payload.find({ collection: 'blog-posts', limit: 1, depth: 0 })
      return NextResponse.json({ ok: true })
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      const code = pgCodeDeep(e)
      const deep = collectDeepMessages(e).join(' | ')
      console.error('[health-payload] query', code, msg, deep !== msg ? `| ${deep}` : '')
      if (e instanceof Error && e.stack) console.error(e.stack)
      return NextResponse.json(
        {
          ok: false,
          phase: 'query',
          hint: classifyFromError(e),
          pgCode: code ?? null,
          messageShort: messageShortFromError(e),
          pgEnv: summarizePostgresEnvForHealth(),
          ...errorMeta(e),
        },
        { status: 503 },
      )
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    const code = pgCodeDeep(e)
    const deep = collectDeepMessages(e).join(' | ')
    console.error('[health-payload] init', code, msg, deep !== msg ? `| ${deep}` : '')
    if (e instanceof Error && e.stack) console.error(e.stack)
    const pgEnv = summarizePostgresEnvForHealth()
    const hint = classifyFromError(e)
    const connectionHint =
      hint === 'connection'
        ? 'timeout al conectar: revisa host/puerto/contraseña (Supabase → Database), que el proyecto no esté pausado (reactivar), y que la región del pooler coincida con el panel.'
        : undefined
    const authHint =
      code === '28P01' || /password authentication failed/i.test(msg)
        ? '28P01: usuario o contraseña en la URI no coinciden con Supabase. Copia de nuevo ambas URIs completas desde el panel (tras reset de password si hace falta). Si la contraseña tiene @ : / # etc., debe ir URL-encoded en la URI.'
        : undefined
    const poolerUserHint = pgEnv.payloadConnection?.suggestPoolerUserFormat
      ? 'Usuario detectado: postgres en pooler.supabase.com. Suele ser incorrecto: usa la URI tal cual Supabase (usuario postgres.<project_ref>).'
      : undefined
    return NextResponse.json(
      {
        ok: false,
        phase: 'init',
        hint,
        pgCode: code ?? null,
        messageShort: messageShortFromError(e),
        pgEnv,
        ...(connectionHint ? { connectionHint } : {}),
        ...(authHint ? { authHint } : {}),
        ...(poolerUserHint ? { poolerUserHint } : {}),
        ...(pgEnv.transactionPoolerOnlyWarning
          ? {
              fixHint:
                'Define DATABASE_DIRECT_URL (o DATABASE_URL_UNPOOLED) con la URI del Session pooler :5432 de Supabase; no uses solo :6543 para Payload.',
            }
          : {}),
        ...errorMeta(e),
      },
      { status: 503 },
    )
  }
}
