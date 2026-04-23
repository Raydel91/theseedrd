/**
 * Opcional: ejecutar `payload migrate` **antes** de `next build`.
 *
 * Por defecto NO corre en Vercel: el CLI de Payload a veces deja promesas sin capturar
 * en Node 24 y el build falla con ERR_UNHANDLED_REJECTION. Las migraciones siguen
 * aplicándose al arrancar Payload (`prodMigrations`) con la URL que uses en runtime.
 *
 * Forzar en CI/build: PAYLOAD_PREBUILD_MIGRATE=true y una URI directa en env.
 */
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const skip = process.env.PAYLOAD_PREBUILD_MIGRATE === 'false'
/** Solo si es explícitamente `true` (no basta con estar en Vercel). */
const force = process.env.PAYLOAD_PREBUILD_MIGRATE === 'true'

if (skip || !force) {
  if (!skip) {
    // eslint-disable-next-line no-console
    console.info(
      '[prebuild] Omitiendo `payload migrate` (por defecto). Migraciones: al conectar Payload. Forzar en build: PAYLOAD_PREBUILD_MIGRATE=true + URI directa.',
    )
  }
  process.exit(0)
}

const url = process.env.DATABASE_URL || ''
if (!url.startsWith('postgres')) {
  process.exit(0)
}

const direct =
  process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL_UNPOOLED || process.env.DIRECT_URL || ''

if (!direct.startsWith('postgres')) {
  // eslint-disable-next-line no-console
  console.error(
    '[prebuild] PAYLOAD_PREBUILD_MIGRATE=true requiere DATABASE_DIRECT_URL (o DATABASE_URL_UNPOOLED / DIRECT_URL).',
  )
  process.exit(1)
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const payloadBin = path.join(root, 'node_modules', 'payload', 'bin.js')
const env = { ...process.env, DATABASE_URL: direct }

// eslint-disable-next-line no-console
console.info('[prebuild] Ejecutando `payload migrate` con Node + bin local…')
const r = spawnSync(process.execPath, [payloadBin, 'migrate'], {
  stdio: 'inherit',
  env,
  cwd: root,
})

process.exit(r.status === null ? 1 : r.status)
