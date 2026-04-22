'use client'

import { Globe } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { MOBILE_NAV_TOGGLE_ID } from '@/components/site/mobile-nav-toggle-id'
import { buttonVariants } from '@/components/ui/button-variants'
import type { Locale } from '@/lib/i18n/copy'
import { copy } from '@/lib/i18n/copy'
import { routeMap, translatePath } from '@/lib/i18n/routes'
import { cn } from '@/lib/utils'

const NAV_KEYS = ['home', 'homes', 'services', 'about', 'contact'] as const

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const r = routeMap[locale]
  const t = copy[locale]
  const toggleLocalePath = translatePath(pathname, locale === 'es' ? 'en' : 'es')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /** Cierra el menú móvil nativo (checkbox) al navegar; va aquí y no en un hijo suelto del layout RSC. */
  useEffect(() => {
    const el = document.getElementById(MOBILE_NAV_TOGGLE_ID) as HTMLInputElement | null
    if (el) el.checked = false
  }, [pathname])

  return (
    <header
      className={cn(
        'sticky top-0 z-[100] border-b bg-background/95 shadow-sm backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-300 supports-[backdrop-filter]:bg-background/80',
        'pt-[calc(0.75rem+env(safe-area-inset-top,0px))]',
        scrolled ? 'border-seed-forest/10' : 'border-seed-forest/5',
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 pb-3 sm:px-6">
        {/*
          El logo.svg tiene viewBox muy ancho; sin tope, el <Link> puede medir más de lo visible
          y tapar el área táctil del menú hamburguesa a la derecha (Chrome móvil).
        */}
        <Link
          href={r.home}
          className="relative z-10 flex min-w-0 max-w-[min(160px,calc(100%-7.5rem))] shrink items-center overflow-hidden outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-seed-emerald"
        >
          <Image
            src="/logo.svg"
            alt={t.brand}
            width={150}
            height={40}
            sizes="(max-width: 640px) 38vw, 150px"
            unoptimized
            className="h-9 w-auto max-h-10 max-w-full object-contain object-left md:h-10"
            priority
          />
        </Link>

        <nav
          aria-label="Principal"
          className="site-header-desktop-nav hidden flex-1 items-center justify-center gap-1 lg:flex"
        >
          {NAV_KEYS.map((key) => (
            <Link
              key={key}
              href={r[key]}
              className={cn(
                'rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-seed-emerald/10 hover:text-seed-forest',
                pathname === r[key] && 'bg-seed-emerald/15 text-seed-forest',
              )}
            >
              {t.nav[key]}
            </Link>
          ))}
        </nav>

        <div className="relative z-20 ml-auto flex shrink-0 items-center gap-2">
          <input
            id={MOBILE_NAV_TOGGLE_ID}
            type="checkbox"
            className="peer sr-only lg:pointer-events-none"
            aria-hidden
          />
          <Link
            href={toggleLocalePath}
            className={buttonVariants({
              variant: 'ghost',
              size: 'sm',
              className: 'gap-2 rounded-full touch-manipulation',
            })}
            title={locale === 'es' ? 'Switch to English' : 'Cambiar a español'}
          >
            <Globe className="size-4" />
            <span className="hidden sm:inline">{locale.toUpperCase()}</span>
          </Link>

          <Link
            href={r.login}
            className={buttonVariants({
              variant: 'outline',
              size: 'sm',
              className: 'hidden rounded-full md:inline-flex touch-manipulation',
            })}
          >
            {t.nav.login}
          </Link>

          <label
            htmlFor={MOBILE_NAV_TOGGLE_ID}
            className={cn(
              'relative z-30 inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full',
              'border-2 border-[#0a3d2f]/35 bg-[#f5f0e8] text-[#0a3d2f] shadow-sm',
              'touch-manipulation peer-checked:hidden lg:hidden',
            )}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label={locale === 'es' ? 'Abrir menú' : 'Open menu'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </label>
          <label
            htmlFor={MOBILE_NAV_TOGGLE_ID}
            className={cn(
              'relative z-30 hidden h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full',
              'border-2 border-[#0a3d2f]/35 bg-[#f5f0e8] text-[#0a3d2f] shadow-sm',
              'touch-manipulation peer-checked:inline-flex lg:hidden',
            )}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label={locale === 'es' ? 'Cerrar menú' : 'Close menu'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
      </div>
    </header>
  )
}
