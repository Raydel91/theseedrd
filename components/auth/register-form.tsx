'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { registerPortalClient } from '@/app/actions/register-portal'
import { routeMap } from '@/lib/i18n/routes'
import type { Locale } from '@/lib/i18n/copy'

const schema = z
  .object({
    firstName: z.string().min(1).max(80),
    lastName: z.string().min(1).max(80),
    email: z.string().email(),
    password: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'match',
    path: ['confirmPassword'],
  })

export function RegisterForm({ locale }: { locale: Locale }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const r = routeMap[locale]

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: z.infer<typeof schema>) {
    setError(null)
    const fd = new FormData()
    fd.set('firstName', data.firstName)
    fd.set('lastName', data.lastName)
    fd.set('email', data.email)
    fd.set('password', data.password)

    const res = await registerPortalClient({ ok: false }, fd)

    if (!res.ok) {
      if (res.error === 'duplicate_email') {
        setError(locale === 'es' ? 'Ese email ya está registrado.' : 'That email is already registered.')
      } else if (res.error === 'rate_limited') {
        setError(locale === 'es' ? 'Demasiados intentos. Espera un momento.' : 'Too many attempts. Please wait.')
      } else if (res.error === 'validation') {
        setError(locale === 'es' ? 'Revisa los campos.' : 'Please check the fields.')
      } else {
        setError(locale === 'es' ? 'No se pudo crear la cuenta.' : 'Could not create your account.')
      }
      return
    }

    const sign = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    if (sign?.error) {
      router.push(`${r.login}?registered=1`)
      return
    }
    try {
      router.push(r.dashboard)
      router.refresh()
    } catch {
      window.location.assign(r.dashboard)
    }
  }

  return (
    <Card className="w-full max-w-md border-seed-forest/10 shadow-xl">
      <CardHeader className="text-center">
        <Image src="/logo.svg" alt="The Seed RD" width={160} height={48} className="mx-auto h-10 w-auto" />
        <CardTitle className="font-heading text-2xl text-seed-forest">
          {locale === 'es' ? 'Crear cuenta' : 'Create account'}
        </CardTitle>
        <CardDescription>
          {locale === 'es'
            ? 'Regístrate para acceder a expediente y referidos.'
            : 'Sign up to access your case and referrals.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="firstName">{locale === 'es' ? 'Nombre' : 'First name'}</FieldLabel>
              <Input id="firstName" autoComplete="given-name" {...form.register('firstName')} />
              <FieldError errors={[form.formState.errors.firstName]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="lastName">{locale === 'es' ? 'Apellido' : 'Last name'}</FieldLabel>
              <Input id="lastName" autoComplete="family-name" {...form.register('lastName')} />
              <FieldError errors={[form.formState.errors.lastName]} />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" autoComplete="email" {...form.register('email')} />
            <FieldError errors={[form.formState.errors.email]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">{locale === 'es' ? 'Contraseña' : 'Password'}</FieldLabel>
            <Input id="password" type="password" autoComplete="new-password" {...form.register('password')} />
            <FieldError errors={[form.formState.errors.password]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="confirmPassword">{locale === 'es' ? 'Confirmar contraseña' : 'Confirm password'}</FieldLabel>
            <Input id="confirmPassword" type="password" autoComplete="new-password" {...form.register('confirmPassword')} />
            <FieldError errors={[form.formState.errors.confirmPassword]} />
            {form.formState.errors.confirmPassword?.message === 'match' ? (
              <p className="text-sm text-destructive">
                {locale === 'es' ? 'Las contraseñas no coinciden.' : 'Passwords do not match.'}
              </p>
            ) : null}
          </Field>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" className="w-full rounded-full bg-seed-emerald">
            {locale === 'es' ? 'Registrarme' : 'Sign up'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {locale === 'es' ? '¿Ya tienes cuenta? ' : 'Already have an account? '}
          <Link href={r.login} className="underline">
            {locale === 'es' ? 'Entrar' : 'Sign in'}
          </Link>
          {' · '}
          <Link href={r.home} className="underline">
            {locale === 'es' ? 'Volver al sitio' : 'Back to website'}
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
