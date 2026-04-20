import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { LoginForm } from '@/components/auth/login-form'
import { StaffSessionCard } from '@/components/auth/staff-session-card'
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Acceso clientes',
  robots: { index: false, follow: false },
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string | string[] }>
}) {
  const session = await auth()
  if (session?.user?.role === 'client') {
    redirect('/dashboard')
  }

  const isStaff = session?.user?.role === 'admin' || session?.user?.role === 'staff'
  const sp = await searchParams
  const raw = sp.callbackUrl
  const callbackUrlParam = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : undefined

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-seed-sand via-background to-seed-sand-dark/50 px-4">
      {isStaff ? <StaffSessionCard locale="es" /> : <LoginForm locale="es" callbackUrl={callbackUrlParam} />}
    </div>
  )
}
