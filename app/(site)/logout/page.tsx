'use client'

import { signOut } from 'next-auth/react'
import { useEffect } from 'react'

export default function LogoutPage() {
  useEffect(() => {
    let cancelled = false

    const run = async () => {
      // 1) Cierra sesión de Payload (panel admin / users auth cookie)
      try {
        await fetch('/api/users/logout', {
          method: 'POST',
          credentials: 'include',
        })
      } catch {
        // Si falla, continuamos para no bloquear salida del usuario.
      }

      // 2) Cierra sesión de NextAuth (portal)
      try {
        await signOut({ redirect: false })
      } catch {
        // noop
      }

      if (!cancelled) {
        window.location.replace('/login')
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-4 text-center">
      <p className="text-sm text-muted-foreground">Cerrando sesión…</p>
    </main>
  )
}
