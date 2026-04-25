import Link from 'next/link'

import { MOBILE_NAV_TOGGLE_ID } from '@/components/site/mobile-nav-toggle-id'
import type { Locale } from '@/lib/i18n/copy'
import { copy } from '@/lib/i18n/copy'
import { routeMap } from '@/lib/i18n/routes'
import { cn } from '@/lib/utils'

const NAV_KEYS = ['home', 'homes', 'services', 'blog', 'about', 'contact'] as const

/**
 * Solo el panel a pantalla completa (fuera del header para no quedar recortado).
 * El checkbox y los botones ☰/✕ van en `site-header.tsx` en el flujo flex.
 */
export function MobileNavOverlay({ locale, currentPath }: { locale: Locale; currentPath: string }) {
  const r = routeMap[locale]
  const t = copy[locale]

  return (
    <div
      className={cn(
        'the-seed-mobile-overlay pointer-events-none fixed inset-0 z-[99998] hidden flex-row items-stretch bg-black/0 lg:hidden',
      )}
    >
      <label htmlFor={MOBILE_NAV_TOGGLE_ID} className="min-h-0 min-w-0 flex-1 cursor-pointer bg-transparent" aria-hidden />
      <aside
        className="flex min-h-0 w-[min(100vw,20rem)] shrink-0 flex-col border-l border-border bg-[#f5f0e8] shadow-xl"
        style={{
          minHeight: '100dvh',
          paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0px))',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
          <span className="font-heading text-sm font-semibold text-[#0a3d2f]">{t.brand}</span>
          <label
            htmlFor={MOBILE_NAV_TOGGLE_ID}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-[#0a3d2f] hover:bg-black/5"
            aria-label={locale === 'es' ? 'Cerrar menú' : 'Close menu'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </label>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain p-4" aria-label="Principal">
          {NAV_KEYS.map((key) => (
            <Link
              key={key}
              href={r[key]}
              className={cn(
                'rounded-lg px-3 py-3 text-base font-medium text-[#0a3d2f] hover:bg-black/5',
                currentPath === r[key] && 'bg-seed-emerald/15 text-seed-forest',
              )}
            >
              {t.nav[key]}
            </Link>
          ))}
          <Link href={r.login} className="rounded-lg px-3 py-3 text-base font-medium text-[#0a3d2f] hover:bg-black/5">
            {t.nav.login}
          </Link>
        </nav>
      </aside>
    </div>
  )
}
