'use client'

/** `<a>` en lugar de `next/link`: el admin de Payload no debe depender del router de Next. */
export function AdminSiteLoginLink() {
  return (
    <a
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
    </a>
  )
}
