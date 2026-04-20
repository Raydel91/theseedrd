'use client'

import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

import { RejectionGuard } from '@/components/providers/rejection-guard'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'

/** Sin next-themes: su ThemeProvider inyecta script inline y React 19 muestra error en consola. El sitio usa tema claro fijo. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={0}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      <RejectionGuard />
      <TooltipProvider>
        {children}
        <Toaster richColors position="bottom-center" theme="light" />
      </TooltipProvider>
    </SessionProvider>
  )
}
