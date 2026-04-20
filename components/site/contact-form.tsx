'use client'

import { useActionState, useEffect, useRef } from 'react'

import { submitContact, type ContactState } from '@/app/actions/contact'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Locale } from '@/lib/i18n/copy'
import { toast } from 'sonner'

const initial: ContactState = { ok: false }

export function ContactForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState(submitContact, initial)
  const prevSig = useRef<string>('')

  useEffect(() => {
    const sig = JSON.stringify(state)
    if (sig === prevSig.current) return
    prevSig.current = sig
    if (!state.ok && !state.error) return

    if (state.ok) {
      toast.success(
        locale === 'es'
          ? 'Mensaje recibido. Te contactaremos pronto.'
          : 'Message received. We will get back to you shortly.',
      )
      const el = document.getElementById('contact-public-form') as HTMLFormElement | null
      el?.reset()
    } else if (state.error === 'rate_limited') {
      toast.error(
        locale === 'es'
          ? 'Demasiados envíos. Espera un momento e inténtalo de nuevo.'
          : 'Too many submissions. Please wait and try again.',
      )
    } else if (state.error === 'validation') {
      toast.error(
        locale === 'es'
          ? 'Revisa los campos del formulario.'
          : 'Please check the form fields.',
      )
    } else if (state.error === 'persist') {
      toast.error(locale === 'es' ? 'No se pudo guardar el mensaje. Inténtalo más tarde.' : 'Could not save your message. Try again later.')
    } else if (state.error) {
      toast.error(locale === 'es' ? 'No se pudo enviar. Inténtalo más tarde.' : 'Could not send. Try again later.')
    }
  }, [state, locale])

  return (
    <div className="rounded-2xl border border-seed-forest/10 bg-white/80 p-6 shadow-sm backdrop-blur">
      <form id="contact-public-form" action={formAction} className="space-y-4">
        <Field>
          <FieldLabel htmlFor="contact-name">{locale === 'es' ? 'Nombre' : 'Name'}</FieldLabel>
          <Input id="contact-name" name="name" type="text" required minLength={2} maxLength={120} autoComplete="name" />
          <FieldError errors={[]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="contact-email">Email</FieldLabel>
          <Input id="contact-email" name="email" type="email" required maxLength={254} autoComplete="email" />
        </Field>
        <Field>
          <FieldLabel htmlFor="contact-phone">
            {locale === 'es' ? 'Teléfono / WhatsApp' : 'Phone / WhatsApp'}
          </FieldLabel>
          <Input
            id="contact-phone"
            name="phone"
            type="tel"
            required
            minLength={8}
            maxLength={32}
            autoComplete="tel"
            placeholder={locale === 'es' ? '+1 809 …' : '+1 809 …'}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="contact-subject">{locale === 'es' ? 'Asunto' : 'Subject'}</FieldLabel>
          <Input id="contact-subject" name="subject" required minLength={2} maxLength={200} />
        </Field>
        <Field>
          <FieldLabel htmlFor="contact-message">{locale === 'es' ? 'Mensaje' : 'Message'}</FieldLabel>
          <Textarea id="contact-message" name="message" rows={5} required minLength={10} maxLength={8000} />
        </Field>
        <Button type="submit" className="w-full rounded-full bg-seed-emerald" disabled={pending}>
          {pending
            ? locale === 'es'
              ? 'Enviando…'
              : 'Sending…'
            : locale === 'es'
              ? 'Enviar'
              : 'Send'}
        </Button>
      </form>
    </div>
  )
}
