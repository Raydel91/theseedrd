import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { getPayload } from 'payload'

import config from '@payload-config'
import type { User } from '@/payload-types'
import { sessionRoleFromUser } from '@/payload/access/user-helpers'
import { getAuthSecret } from '@/lib/auth-secret'

const isProd = process.env.NODE_ENV === 'production'

/** Evita ClientFetchError en dev si falta AUTH_URL (sesión vía /api/auth). */
if (!isProd && !process.env.AUTH_URL && process.env.NEXT_PUBLIC_SITE_URL) {
  process.env.AUTH_URL = process.env.NEXT_PUBLIC_SITE_URL
}
if (!isProd && !process.env.AUTH_URL) {
  process.env.AUTH_URL = 'http://localhost:3000'
}

const cookieBase = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  secure: isProd,
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: getAuthSecret(),
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const payload = await getPayload({ config })
        try {
          const result = await payload.login({
            collection: 'users',
            data: {
              email: credentials.email as string,
              password: credentials.password as string,
            },
          })
          const u = result.user as User
          return {
            id: String(u.id),
            email: u.email,
            role: sessionRoleFromUser(u),
            name: [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email,
            referralCode: u.referralCode,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    /** Sesión portal cliente: máx. 1 h; actividad renueva el token (updateAge). */
    maxAge: 60 * 60,
    updateAge: 5 * 60,
  },
  /**
   * JWT firmado en cookie httpOnly (Auth.js). No hay tokens en localStorage.
   * @see https://authjs.dev/concepts/session-strategies#jwt-session
   */
  cookies: {
    sessionToken: {
      options: cookieBase,
    },
    callbackUrl: {
      options: cookieBase,
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role
        token.sub = user.id
        token.referralCode = (user as { referralCode?: string }).referralCode
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? ''
        ;(session.user as { role?: string }).role = token.role as string
        ;(session.user as { referralCode?: string }).referralCode = token.referralCode as
          | string
          | undefined
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  trustHost: true,
})
