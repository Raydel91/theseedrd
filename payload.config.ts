import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
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
import { HouseTypes } from './payload/collections/HouseTypes'
import { PropertyAmenities } from './payload/collections/PropertyAmenities'
import { PropertyTags } from './payload/collections/PropertyTags'
import { Properties } from './payload/collections/Properties'
import { seedPropertyTaxonomies } from './payload/seed/property-taxonomies'
import { seedServicePackages } from './payload/seed/seed-service-packages'
import { AdminRegistry } from './payload/globals/AdminRegistry'
import { SiteConfig } from './payload/globals/SiteConfig'
import { ReferralSettings } from './payload/globals/ReferralSettings'
import { normalizePostgresConnectionString } from './lib/postgres-connection'
import { isValidVercelBlobReadWriteToken } from './lib/vercel-blob-token'
import { migrations as postgresProdMigrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/** Pooler transacción (6543) u otra `DATABASE_URL`; SQLite por defecto en local. */
const pooledDatabaseUrl = process.env.DATABASE_URL || 'file:./payload.db'

/**
 * URI principal del pool de Payload (p. ej. Session pooler en Supabase si `db.*` es solo IPv6).
 * Solo variables `DATABASE_*` / `DIRECT_URL` — en Vercel borra las `POSTGRES_*` del integrador si las inyecta.
 */
const directDatabaseUrl =
  process.env.DATABASE_DIRECT_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DIRECT_URL ||
  ''

const usePostgres =
  pooledDatabaseUrl.startsWith('postgres://') ||
  pooledDatabaseUrl.startsWith('postgresql://') ||
  directDatabaseUrl.startsWith('postgres://') ||
  directDatabaseUrl.startsWith('postgresql://')

const postgresPoolUrl = directDatabaseUrl.startsWith('postgres') ? directDatabaseUrl : pooledDatabaseUrl

const databaseURL = usePostgres ? postgresPoolUrl : pooledDatabaseUrl
const postgresConnectionString = usePostgres
  ? normalizePostgresConnectionString(postgresPoolUrl)
  : pooledDatabaseUrl

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
        const err = error instanceof Error ? error : new Error(String(error))
        console.error('[payload:error]', err.message)
        if (err.stack) console.error(err.stack)
        if (process.env.NODE_ENV === 'production') {
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
    /** Hotfix visual: usar tema nativo claro hasta estabilizar estilos custom del admin. */
    theme: 'light',
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
    HouseTypes,
    PropertyTags,
    PropertyAmenities,
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
  db: usePostgres
    ? postgresAdapter({
        push: true,
        migrationDir: path.resolve(dirname, 'migrations'),
        prodMigrations: postgresProdMigrations,
        pool: {
          connectionString: postgresConnectionString,
          /**
           * `max: 1` en Vercel puede atascar peticiones concurrentes (admin + health + init)
           * y terminar en `timeout exceeded when trying to connect` del `pg-pool`.
           */
          max: Number(process.env.PAYLOAD_DB_POOL_MAX || (process.env.VERCEL ? 3 : 10)),
          /**
           * Supabase en frío / proyecto recién reactivado puede tardar >20s en aceptar TCP;
           * si no, `pg` devuelve "timeout exceeded when trying to connect" durante `migrate`.
           */
          connectionTimeoutMillis: process.env.VERCEL ? 60000 : 20000,
          idleTimeoutMillis: process.env.VERCEL ? 30000 : 20000,
          keepAlive: true,
          application_name: 'the-seed-rd-payload',
        },
      })
    : sqliteAdapter({
        client: {
          url: databaseURL,
        },
        /** Espera si la BD está bloqueada (dev / Windows). */
        busyTimeout: 8000,
        /**
         * Por defecto el adaptador usa SQLite sin WAL: un solo escritor y lecturas peor concurrentes.
         * Con varias peticiones RSC + admin, conviene WAL (mejor rendimiento y menos “colas”).
         */
        wal: true,
      }),
  sharp,
  onInit: async (payload) => {
    if (process.env.PAYLOAD_SKIP_AUTO_SEED === 'true') {
      return
    }
    /** Durante `next build` las tablas pueden no existir aún: no sembrar aquí. */
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return
    }
    /** No bloquear el primer request: el seed ya es idempotente y rápido si la BD está poblada. */
    queueMicrotask(() => {
      void seedPropertyTaxonomies(payload).catch((err: unknown) => {
        console.error('[payload] seedPropertyTaxonomies', err)
      })
      void seedServicePackages(payload).catch((err: unknown) => {
        console.error('[payload] seedServicePackages', err)
      })
    })
  },
  plugins: [
    ...(isValidVercelBlobReadWriteToken(process.env.BLOB_READ_WRITE_TOKEN)
      ? [
          vercelBlobStorage({
            token: process.env.BLOB_READ_WRITE_TOKEN,
            collections: {
              media: true,
            },
          }),
        ]
      : []),
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
          return `${base}/hogar/${String((doc as { slug: string }).slug)}`
        }
        return base
      },
    }),
  ],
})
