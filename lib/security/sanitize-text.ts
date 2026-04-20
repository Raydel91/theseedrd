import sanitizeHtml from 'sanitize-html'

/** Texto plano seguro (sin HTML) para mensajes de contacto, etc. */
export function sanitizePlainText(input: string, maxLength: number): string {
  const stripped = sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  })
  return stripped.trim().slice(0, maxLength)
}
