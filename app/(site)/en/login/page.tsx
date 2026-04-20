import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { LoginForm } from '@/components/auth/login-form'
import { StaffSessionCard } from '@/components/auth/staff-session-card'
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Client login',
  robots: { index: false, follow: false },
}

export default async function LoginEnPage() {
  const session = await auth()
  if (session?.user?.role === 'client') {
    redirect('/en/dashboard')
  }

  const isStaff = session?.user?.role === 'admin' || session?.user?.role === 'staff'

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-seed-sand via-background to-seed-sand-dark/50 px-4">
      {isStaff ? <StaffSessionCard locale="en" /> : <LoginForm locale="en" />}
    </div>
  )
}
