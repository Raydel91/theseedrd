/** URL absoluta para imágenes de Payload /media */
export function absoluteMediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined
  if (path.startsWith('http')) return path
  const base = process.env.NEXT_PUBLIC_SERVER_URL || ''
  return `${base}${path}`
}
