/**
 * Seed manual de paquetes (sin competir con onInit de payload.config).
 * Uso: PAYLOAD_SKIP_AUTO_SEED=true está fijado antes de cargar la config.
 */
process.env.PAYLOAD_SKIP_AUTO_SEED = 'true'

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config.js')
const { seedServicePackages } = await import('../payload/seed/seed-service-packages.js')

const payload = await getPayload({ config })
await seedServicePackages(payload)
process.exit(0)

export {}
