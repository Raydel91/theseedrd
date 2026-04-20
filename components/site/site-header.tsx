'use client'

import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { routeMap, translatePath } from '@/lib/i18n/routes'
import type { Locale } from '@/lib/i18n/copy'
import { copy } from '@/lib/i18n/copy'
import { cn } from '@/lib/utils'
import { Globe, Menu } from 'lucide-react'

const navKeys = ['about', 'services', 'homes', 'blog', 'referrals', 'contact'] as const

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  const t = copy[locale]
  const routes = routeMap[locale]

  useMotionValueEvent(scrollY, 'change', (y) => {
    setSolid(y > 48)
  })

  const toggleLocalePath = translatePath(pathname, locale === 'es' ? 'en' : 'es')

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        solid
          ? 'border-b border-seed-forest/10 bg-background/92 shadow-sm backdrop-blur-md dark:bg-background/95'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={routes.home} className="flex items-center gap-3">
          <Image src="/logo.svg" alt={t.brand} width={140} height={40} className="h-9 w-auto" priority />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navKeys.map((key) => (
            <Link
              key={key}
              href={routes[key]}
              className={cn(
                'rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-seed-emerald/10 hover:text-seed-forest',
                pathname === routes[key] && 'bg-seed-emerald/15 text-seed-forest',
              )}
            >
              {t.nav[key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={toggleLocalePath}
            className={buttonVariants({
              variant: 'ghost',
              size: 'sm',
              className: 'gap-2 rounded-full',
            })}
            title={locale === 'es' ? 'Switch to English' : 'Cambiar a español'}
          >
            <Globe className="size-4" />
            <span className="hidden sm:inline">{locale.toUpperCase()}</span>
          </Link>

          <Link
            href={routes.login}
            className={buttonVariants({
              variant: 'outline',
              size: 'sm',
              className: 'hidden rounded-full md:inline-flex',
            })}
          >
            {t.nav.login}
          </Link>

          <Sheet>
            <SheetTrigger
              className={buttonVariants({
                variant: 'outline',
                size: 'icon',
                className: 'rounded-full lg:hidden',
              })}
              aria-label="Menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,20rem)]">
              <div className="mt-8 flex flex-col gap-2">
                {navKeys.map((key) => (
                  <Link
                    key={key}
                    href={routes[key]}
                    className="rounded-lg px-3 py-2 text-base font-medium hover:bg-muted"
                  >
                    {t.nav[key]}
                  </Link>
                ))}
                <Link href={routes.login} className="rounded-lg px-3 py-2 text-base font-medium hover:bg-muted">
                  {t.nav.login}
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
