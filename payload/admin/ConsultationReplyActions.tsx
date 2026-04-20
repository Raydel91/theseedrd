'use client'

import { useFormFields } from '@payloadcms/ui'
import type { CSSProperties } from 'react'
import type { DefaultCellComponentProps, UIFieldClient } from 'payload'

function ReplyActions({ phone, email }: { phone?: string | null; email?: string | null }) {
  const digits = phone ? String(phone).replace(/\D/g, '') : ''
  const wa = digits.length >= 8 ? `https://wa.me/${digits}` : null
  const mailto = email
    ? `mailto:${encodeURIComponent(String(email).trim())}?subject=${encodeURIComponent('The Seed RD')}`
    : null

  if (!wa && !mailto) {
    return (
      <div className="payload-ui-field">
        <p style={{ margin: 0, fontSize: 13, opacity: 0.75 }}>Añade teléfono y email para habilitar enlaces.</p>
      </div>
    )
  }

  const btn: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 12px',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    textDecoration: 'none',
    border: '1px solid var(--theme-elevation-150)',
  }

  return (
    <div className="payload-ui-field" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {wa ? (
        <a href={wa} target="_blank" rel="noreferrer noopener" style={{ ...btn, background: '#25D366', color: '#fff', borderColor: '#128C7E' }}>
          WhatsApp
        </a>
      ) : null}
      {mailto ? (
        <a href={mailto} style={{ ...btn, background: 'var(--theme-elevation-50)', color: 'var(--theme-text)' }}>
          Email
        </a>
      ) : null}
    </div>
  )
}

/** Formulario de edición en Payload (documento individual) */
export function ConsultationReplyActionsField() {
  const phone = useFormFields(([state]) => state?.phone?.value as string | undefined)
  const email = useFormFields(([state]) => state?.email?.value as string | undefined)
  return <ReplyActions phone={phone} email={email} />
}

/** Columna en la vista lista */
export function ConsultationReplyActionsCell(props: DefaultCellComponentProps<UIFieldClient>) {
  const phone = props.rowData?.phone as string | undefined
  const email = props.rowData?.email as string | undefined
  return <ReplyActions phone={phone} email={email} />
}
