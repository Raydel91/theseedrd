/**
 * Secreto compartido por Auth.js (JWT/cookies) y middleware.
 * En producción define AUTH_SECRET en el entorno (nunca uses el valor de desarrollo).
 */
export function getAuthSecret(): string {
  const fromEnv = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET
  if (fromEnv) return fromEnv
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'AUTH_SECRET (o NEXTAUTH_SECRET) es obligatorio en producción. No arranques el servidor sin definirlo.',
    )
  }
  return 'dev-only-the-seed-rd-auth-secret-no-usar-en-produccion'
}
