/**
 * Opcional antes de `next build`: migraciones contra Postgres **directo** (Supabase 5432).
 * En Vercel, si falta DATABASE_DIRECT_URL, no hace nada aquí; Payload aplicará `prodMigrations`
 * en el primer arranque (puede ser más lento la primera vez).
 */
import { spawnSync } from 'node:child_process'

const skip = process.env.PAYLOAD_PREBUILD_MIGRATE === 'false'
const force = process.env.PAYLOAD_PREBUILD_MIGRATE === 'true'
const onVercel = process.env.VERCEL === '1'
const onCi = process.env.CI === 'true'

if (skip) {
  process.exit(0)
}

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''
if (!url.startsWith('postgres')) {
  process.exit(0)
}

if (!force && !onVercel && !onCi) {
  // eslint-disable-next-line no-console
  console.info(
    '[prebuild] Saltando migrate (local). Forzar: PAYLOAD_PREBUILD_MIGRATE=true y Postgres accesible.',
  )
  process.exit(0)
}

const direct =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_DIRECT_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DIRECT_URL ||
  ''

if (!direct.startsWith('postgres')) {
  // eslint-disable-next-line no-console
  console.info(
    '[prebuild] Sin DATABASE_DIRECT_URL (o POSTGRES_URL_NON_POOLING): migrate en build omitido; Payload aplicará migraciones al conectar.',
  )
  process.exit(0)
}

const env = { ...process.env, DATABASE_URL: direct }

// eslint-disable-next-line no-console
console.info('[prebuild] `payload migrate` usando conexión directa (no pooler 6543)…')
const r = spawnSync('npx', ['payload', 'migrate'], {
  stdio: 'inherit',
  env,
  shell: true,
})

process.exit(r.status === null ? 1 : r.status)
