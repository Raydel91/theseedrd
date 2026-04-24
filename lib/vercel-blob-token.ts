/** Token esperado por `@payloadcms/storage-vercel-blob` (si no coincide, el plugin lanza al iniciar). */
export function isValidVercelBlobReadWriteToken(
  token: string | undefined,
): token is string {
  if (typeof token !== 'string') return false
  const value = token.trim()
  if (!value) return false
  // Vercel puede variar el sufijo del token con nuevos formatos.
  // Mantener validación por prefijo evita falsos negativos que desactivan el plugin de storage.
  return value.toLowerCase().startsWith('vercel_blob_rw_')
}
