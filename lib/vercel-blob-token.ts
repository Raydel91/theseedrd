/** Token esperado por `@payloadcms/storage-vercel-blob` (si no coincide, el plugin lanza al iniciar). */
export function isValidVercelBlobReadWriteToken(
  token: string | undefined,
): token is string {
  return (
    typeof token === 'string' &&
    /^vercel_blob_rw_[a-z\d]+_[a-z\d]+$/i.test(token.trim())
  )
}
