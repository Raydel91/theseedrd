import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'

import { BlogPosts } from './payload/collections/BlogPosts'
import { Media } from './payload/collections/Media'
import { Users } from './payload/collections/Users'
import { TeamMembers } from './payload/collections/TeamMembers'
import { Testimonials } from './payload/collections/Testimonials'
import { Packages } from './payload/collections/Packages'
import { Clients } from './payload/collections/Clients'
import { Referrals } from './payload/collections/Referrals'
import { ConsultationMessages } from './payload/collections/ConsultationMessages'
import { ConsultationReadLogs } from './payload/collections/ConsultationReadLogs'
import { Properties } from './payload/collections/Properties'
import { AdminRegistry } from './payload/globals/AdminRegistry'
import { SiteConfig } from './payload/globals/SiteConfig'
import { ReferralSettings } from './payload/globals/ReferralSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  graphQL: {
    /** En producción desactiva GraphQL salvo que habilites explícitamente (reduce superficie de ataque). */
    disable: process.env.NODE_ENV === 'production' && process.env.PAYLOAD_ENABLE_GRAPHQL !== 'true',
    disableIntrospectionInProduction: true,
    disablePlaygroundInProduction: true,
  },
  hooks: {
    afterError: [
      ({ error }) => {
        if (process.env.NODE_ENV === 'production') {
          console.error('[payload:error]', error.message)
          return {
            response: {
              message: 'Ha ocurrido un error. Inténtalo de nuevo más tarde.',
            },
          }
        }
      },
    ],
  },
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— The Seed RD',
      icons: [
        {
          url: '/logo.svg',
          rel: 'icon',
          type: 'image/svg+xml',
        },
      ],
    },
    components: {
      /** Esquina superior derecha: acceso al login del sitio (portal clientes / NextAuth). */
      actions: ['./payload/admin/AdminSiteLoginLink.tsx#AdminSiteLoginLink'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    TeamMembers,
    Testimonials,
    Packages,
    Properties,
    BlogPosts,
    Clients,
    Referrals,
    ConsultationMessages,
    ConsultationReadLogs,
  ],
  globals: [SiteConfig, ReferralSettings, AdminRegistry],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  localization: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    /** Evita que el locale se "bloquee" por herencia automática en el admin. */
    fallback: false,
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./payload.db',
    },
    /** Espera si la BD está bloqueada (dev / Windows). */
    busyTimeout: 8000,
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['packages', 'properties', 'blog-posts'],
      globals: ['site-config', 'referral-settings'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc, globalSlug }) => {
        if (globalSlug === 'site-config' && doc && typeof doc === 'object' && 'heroTitle' in doc) {
          const t = (doc as { heroTitle?: unknown }).heroTitle
          if (typeof t === 'string' && t.trim()) return t
        }
        if (globalSlug === 'referral-settings' && doc && typeof doc === 'object' && 'headline' in doc) {
          const h = (doc as { headline?: unknown }).headline
          if (typeof h === 'string' && h.trim()) return h
        }
        if (doc && typeof doc === 'object' && 'title' in doc) {
          const t = (doc as { title?: unknown }).title
          if (typeof t === 'string' && t.trim()) return t
        }
        return 'The Seed RD'
      },
      generateDescription: ({ doc }) => {
        if (doc && typeof doc === 'object' && 'meta' in doc && doc.meta && typeof doc.meta === 'object') {
          const m = doc.meta as { description?: string }
          if (m.description) return m.description
        }
        if (doc && typeof doc === 'object' && 'shortDescription' in doc) {
          const sd = (doc as { shortDescription?: unknown }).shortDescription
          if (typeof sd === 'string' && sd.trim()) return sd
        }
        if (doc && typeof doc === 'object' && 'excerpt' in doc) {
          const ex = (doc as { excerpt?: unknown }).excerpt
          if (typeof ex === 'string' && ex.trim()) return ex
        }
        if (doc && typeof doc === 'object' && 'body' in doc) {
          const b = (doc as { body?: unknown }).body
          if (typeof b === 'string' && b.trim()) return b.slice(0, 160)
        }
        return ''
      },
      generateURL: ({ doc, collectionSlug, globalSlug }) => {
        const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        if (globalSlug === 'site-config') return `${base}/`
        if (globalSlug === 'referral-settings') return `${base}/referidos`
        if (collectionSlug === 'blog-posts' && doc && typeof doc === 'object' && 'slug' in doc) {
          return `${base}/blog/${String((doc as { slug: string }).slug)}`
        }
        if (collectionSlug === 'packages' && doc && typeof doc === 'object' && 'slug' in doc) {
          return `${base}/servicios#${String((doc as { slug: string }).slug)}`
        }
        if (collectionSlug === 'properties' && doc && typeof doc === 'object' && 'slug' in doc) {
          return `${base}/hogar#${String((doc as { slug: string }).slug)}`
        }
        return base
      },
    }),
  ],
})
