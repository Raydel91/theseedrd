/**
 * Evita open redirects: solo rutas relativas internas.
 */
export function safeInternalPath(candidate: string | null, fallback: string): string {
  if (!candidate || typeof candidate !== 'string') return fallback
  const t = candidate.trim()
  if (!t.startsWith('/') || t.startsWith('//') || t.includes('://')) return fallback
  if (t.includes('\0') || t.includes('\\')) return fallback
  return t
}
