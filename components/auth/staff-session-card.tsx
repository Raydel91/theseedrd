import Image from 'next/image'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button-variants'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Locale } from '@/lib/i18n/copy'

/** Si ya hay sesión de equipo, /login no redirige a Payload: se elige panel o cerrar sesión. */
export function StaffSessionCard({ locale }: { locale: Locale }) {
  const es = locale === 'es'

  return (
    <Card className="w-full max-w-md border-seed-forest/10 shadow-xl">
      <CardHeader className="text-center">
        <Image src="/logo.svg" alt="The Seed RD" width={160} height={48} className="mx-auto h-10 w-auto" />
        <CardTitle className="font-heading text-2xl text-seed-forest">
          {es ? 'Sesión de equipo activa' : 'Team session active'}
        </CardTitle>
        <CardDescription>
          {es
            ? 'Estás identificado como administrador o staff. El portal de clientes usa otra sesión: cierra sesión para entrar con una cuenta de cliente, o abre el panel.'
            : 'You are signed in as admin or staff. The client portal uses a different session — sign out to use a client account, or open the admin panel.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Link
          href="/admin"
          className={buttonVariants({
            className: 'w-full rounded-full bg-seed-emerald',
          })}
        >
          {es ? 'Ir al panel de administración' : 'Open admin panel'}
        </Link>
        <Link
          href="/logout"
          className={buttonVariants({
            variant: 'outline',
            className: 'w-full rounded-full border-seed-forest/25',
          })}
        >
          {es ? 'Cerrar sesión' : 'Sign out'}
        </Link>
        <p className="text-center text-sm text-muted-foreground">
          <Link href={locale === 'es' ? '/' : '/en'} className="underline">
            {es ? 'Volver al sitio' : 'Back to website'}
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
