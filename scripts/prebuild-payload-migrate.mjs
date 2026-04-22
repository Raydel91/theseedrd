/**
 * Antes de `next build`: en Vercel/CI (o si PAYLOAD_PREBUILD_MIGRATE=true), aplica migraciones
 * pendientes contra Postgres. En local se omite para no exigir Postgres al compilar.
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
    '[prebuild] Saltando `payload migrate` (local). En Vercel/CI se ejecuta solo; forzar: PAYLOAD_PREBUILD_MIGRATE=true',
  )
  process.exit(0)
}

// eslint-disable-next-line no-console
console.info('[prebuild] Ejecutando `payload migrate` (Postgres)…')
const r = spawnSync('npx', ['payload', 'migrate'], {
  stdio: 'inherit',
  env: process.env,
  shell: true,
})

process.exit(r.status === null ? 1 : r.status)
