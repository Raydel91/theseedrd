'use client'

import { submitClientConsultationMessage, type ClientConsultationState } from '@/app/actions/client-consultation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useRef } from 'react'
import { toast } from 'sonner'

const initial: ClientConsultationState = { ok: false }

export type ClientMessageRow = {
  id: string
  subject: string
  body: string
  createdAt: string
}

export function ClientMessagesPanel({ messages }: { messages: ClientMessageRow[] }) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(submitClientConsultationMessage, initial)
  const prevSig = useRef<string>('')

  useEffect(() => {
    const sig = JSON.stringify(state)
    if (sig === prevSig.current) return
    prevSig.current = sig
    if (!state.ok && !state.error) return

    if (state.ok) {
      toast.success('Mensaje enviado. El equipo lo verá en el panel.')
      const el = document.getElementById('client-msg-form') as HTMLFormElement | null
      el?.reset()
      router.refresh()
    } else if (state.error === 'rate_limited') {
      toast.error('Demasiados envíos. Espera un momento.')
    } else if (state.error === 'validation') {
      toast.error('Revisa asunto, teléfono y mensaje.')
    } else if (state.error === 'auth' || state.error === 'forbidden') {
      toast.error('Sesión no válida. Vuelve a entrar.')
    }
  }, [state, router])

  return (
    <Card className="border-seed-forest/10">
      <CardHeader>
        <CardTitle className="font-heading text-xl">Mensajes con el equipo</CardTitle>
        <CardDescription>
          Envía consultas; cuando un administrador las lea, el texto se archiva y solo queda un registro con tus datos de
          contacto.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {messages.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm font-medium text-seed-forest">Pendientes de lectura</p>
            <ul className="space-y-3">
              {messages.map((m) => (
                <li key={m.id} className="rounded-xl border border-seed-forest/10 bg-seed-sand-dark/30 p-4 text-sm">
                  <p className="font-medium text-seed-forest">{m.subject}</p>
                  <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{m.body}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(m.createdAt).toLocaleString('es-DO', { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No tienes mensajes pendientes.</p>
        )}

        <form id="client-msg-form" action={formAction} className="space-y-4 border-t border-seed-forest/10 pt-6">
          <p className="text-sm font-medium text-seed-forest">Nuevo mensaje</p>
          <Field>
            <FieldLabel htmlFor="cm-phone">Teléfono / WhatsApp</FieldLabel>
            <Input
              id="cm-phone"
              name="phone"
              type="tel"
              required
              minLength={8}
              maxLength={32}
              autoComplete="tel"
              placeholder="+1 809 …"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="cm-subject">Asunto</FieldLabel>
            <Input id="cm-subject" name="subject" required minLength={2} maxLength={200} />
          </Field>
          <Field>
            <FieldLabel htmlFor="cm-body">Mensaje</FieldLabel>
            <Textarea id="cm-body" name="body" rows={5} required minLength={10} maxLength={8000} />
          </Field>
          <Button type="submit" className="rounded-full bg-seed-emerald" disabled={pending}>
            {pending ? 'Enviando…' : 'Enviar mensaje'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
