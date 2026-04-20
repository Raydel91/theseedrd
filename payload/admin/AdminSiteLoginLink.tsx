'use client'

import Link from 'next/link'

/** Enlace al login del portal (NextAuth), visible en el panel Payload. */
export function AdminSiteLoginLink() {
  return (
    <Link
      href="/logout"
      className="nav__link"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 'var(--style-radius-s, 4px)',
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--theme-elevation-800)',
        textDecoration: 'none',
        border: '1px solid var(--theme-elevation-150)',
        background: 'var(--theme-elevation-0)',
      }}
    >
      Cerrar sesión e ir a login
    </Link>
  )
}
