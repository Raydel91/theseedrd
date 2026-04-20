'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { routeMap } from '@/lib/i18n/routes'
import type { Locale } from '@/lib/i18n/copy'
import { safeInternalPath } from '@/lib/security/safe-redirect'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export function LoginForm({ locale }: { locale: Locale }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = safeInternalPath(searchParams.get('callbackUrl'), routeMap[locale].dashboard)
  const [error, setError] = useState<string | null>(null)
  const r = routeMap[locale]

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: z.infer<typeof schema>) {
    setError(null)
    try {
      const res = await signIn('credentials', { ...data, redirect: false })
      if (res?.error) {
        setError(locale === 'es' ? 'Credenciales incorrectas' : 'Invalid credentials')
        return
      }
      try {
        router.push(callbackUrl)
        router.refresh()
      } catch {
        if (typeof window !== 'undefined') window.location.assign(callbackUrl)
      }
    } catch {
      setError(
        locale === 'es'
          ? 'No se pudo iniciar sesión. Revisa la conexión e inténtalo de nuevo.'
          : 'Could not sign in. Check your connection and try again.',
      )
    }
  }

  return (
    <Card className="w-full max-w-md border-seed-forest/10 shadow-xl">
      <CardHeader className="text-center">
        <Image src="/logo.svg" alt="The Seed RD" width={160} height={48} className="mx-auto h-10 w-auto" />
        <CardTitle className="font-heading text-2xl text-seed-forest">
          {locale === 'es' ? 'Portal de clientes' : 'Client portal'}
        </CardTitle>
        <CardDescription>
          {locale === 'es' ? 'Accede a tu expediente y referidos.' : 'Access your case and referrals.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" autoComplete="email" {...form.register('email')} />
            <FieldError errors={[form.formState.errors.email]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" type="password" autoComplete="current-password" {...form.register('password')} />
            <FieldError errors={[form.formState.errors.password]} />
          </Field>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full rounded-full bg-seed-emerald">
              {locale === 'es' ? 'Entrar' : 'Sign in'}
            </Button>
            <Link
              href={r.register}
              className={buttonVariants({
                variant: 'outline',
                className: 'w-full rounded-full border-seed-forest/25',
              })}
            >
              {locale === 'es' ? 'Crear cuenta' : 'Create account'}
            </Link>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href={r.home} className="underline">
            {locale === 'es' ? 'Volver al sitio' : 'Back to website'}
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
