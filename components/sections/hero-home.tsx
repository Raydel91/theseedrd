'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'

import { Award, Compass, ShieldCheck } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button-variants'
import type { Locale } from '@/lib/i18n/copy'
import { copy } from '@/lib/i18n/copy'
import { routeMap } from '@/lib/i18n/routes'

const heroImg =
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2400&auto=format&fit=crop'

export function HeroHome({
  locale,
  title,
  subtitle,
  welcomeText,
}: {
  locale: Locale
  title: string
  subtitle: string
  welcomeText: string
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const t = copy[locale]
  const r = routeMap[locale]

  return (
    <section ref={ref} className="relative min-h-screen md:min-h-[92vh]">
      {/*
        Solo el fondo usa motion (parallax). Título y textos son HTML normal para que
        no dependan de hidratación/Framer (opacity:0 inicial en motion.* dejaba la pantalla
        “vacía” en algunos móviles hasta cargar el JS).
      */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
          <Image
            src={heroImg}
            alt="República Dominicana"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-seed-forest/85 via-seed-forest/55 to-seed-sand/95" />
        </motion.div>
      </div>

      <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-col justify-start px-4 pb-20 pt-8 sm:px-6 md:min-h-[92vh] md:justify-center md:pb-24 md:pt-28 lg:px-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-seed-turquoise">
          {welcomeText}
        </p>
        <h1 className="font-heading max-w-4xl text-4xl font-semibold leading-tight text-white drop-shadow-sm sm:text-5xl md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/90 md:text-xl">{subtitle}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href={r.contact}
            className={buttonVariants({
              size: 'lg',
              className:
                'rounded-full bg-seed-turquoise px-8 text-seed-forest shadow-lg shadow-seed-turquoise/30 hover:bg-seed-turquoise/90',
            })}
          >
            {t.hero.ctaPrimary}
          </Link>
          <Link
            href={r.services}
            className={buttonVariants({
              size: 'lg',
              variant: 'outline',
              className:
                'rounded-full border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20',
            })}
          >
            {t.hero.ctaSecondary}
          </Link>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, text: t.hero.trust1 },
            { icon: Compass, text: t.hero.trust2 },
            { icon: Award, text: t.hero.trust3 },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/95 backdrop-blur-md"
            >
              <Icon className="size-5 shrink-0 text-seed-turquoise" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
