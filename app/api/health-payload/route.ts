import { NextResponse } from 'next/server'

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

function classifyDbError(msg: string, code?: string): string {
  if (code && PG_HINTS[code]) return PG_HINTS[code]
  const m = msg.toLowerCase()
  if (/does not exist|relation|table|no existe|undefinedtable/.test(m)) {
    return 'missing_schema'
  }
  if (/prepared statement|unnamed stmt|bind message|protocol|pgbouncer/.test(m)) {
    return 'pooler_prepared_statement'
  }
  if (
    /timeout|econnrefused|enotfound|password|authentication|tenant or user|ssl|certificate|network|connect/.test(
      m,
    )
  ) {
    return 'connection'
  }
  return 'unknown'
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
      console.error('[health-payload] query', code, msg)
      if (e instanceof Error && e.stack) console.error(e.stack)
      return NextResponse.json(
        { ok: false, phase: 'query', hint: classifyDbError(msg, code), pgCode: code ?? null },
        { status: 503 },
      )
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    const code = pgCodeDeep(e)
    console.error('[health-payload] init', code, msg)
    if (e instanceof Error && e.stack) console.error(e.stack)
    return NextResponse.json(
      { ok: false, phase: 'init', hint: classifyDbError(msg, code), pgCode: code ?? null },
      { status: 503 },
    )
  }
}
