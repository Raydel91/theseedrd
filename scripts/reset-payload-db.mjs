/**
 * Borra el archivo SQLite de Payload (y WAL/SHM) para forzar recreación del esquema.
 * Úsalo en desarrollo si fallan migraciones / CREATE INDEX tras cambiar plugins o colecciones.
 *
 * Uso: node scripts/reset-payload-db.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const names = ['payload.db', 'payload.db-wal', 'payload.db-shm']

let removed = 0
for (const name of names) {
  const p = path.join(root, name)
  if (fs.existsSync(p)) {
    try {
      fs.unlinkSync(p)
      console.log('Eliminado:', p)
      removed++
    } catch (e) {
      if (e && e.code === 'EBUSY') {
        console.error(
          '\nNo se pudo borrar (archivo en uso). Cierra `npm run dev` y cualquier proceso que use payload.db, luego vuelve a ejecutar: npm run db:reset\n',
        )
        process.exit(1)
      }
      throw e
    }
  }
}
if (removed === 0) {
  console.log('No se encontró payload.db en la raíz del proyecto. Nada que borrar.')
} else {
  console.log('Listo. Reinicia `npm run dev` para regenerar la base.')
}
