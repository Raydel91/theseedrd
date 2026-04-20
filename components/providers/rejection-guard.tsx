'use client'

import { useEffect } from 'react'

/**
 * En dev, algunas APIs (p. ej. clipboard, navegación) o el runtime de Next pueden
 * dejar un rechazo no capturado cuyo valor es un Event; el overlay muestra "[object Event]".
 * Solo silenciamos ese caso concreto.
 */
export function RejectionGuard() {
  useEffect(() => {
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const r = event.reason
      if (r instanceof Event) {
        event.preventDefault()
        if (process.env.NODE_ENV === 'development') {
          console.warn('[RejectionGuard] Promesa rechazada con Event (ignorado):', r.type)
        }
      }
    }
    window.addEventListener('unhandledrejection', onUnhandledRejection)
    return () => window.removeEventListener('unhandledrejection', onUnhandledRejection)
  }, [])
  return null
}
