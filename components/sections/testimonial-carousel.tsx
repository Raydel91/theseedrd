'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import { Star } from 'lucide-react'
import { useRef } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

export type TestimonialItem = {
  id: string
  clientName: string
  quote: string
  nationality?: string | null
  rating?: number | null
  photo?: { url?: string } | string | null
}

export function TestimonialCarousel({
  items,
  title,
}: {
  items: TestimonialItem[]
  title: string
}) {
  const plugin = useRef(Autoplay({ delay: 5200, stopOnInteraction: false }))

  if (!items.length) return null

  return (
    <section className="border-y border-seed-forest/10 bg-seed-sand-dark/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-center text-3xl font-semibold text-seed-forest md:text-4xl"
        >
          {title}
        </motion.h2>
        <Carousel
          plugins={[plugin.current]}
          className="mt-12"
          opts={{ align: 'start', loop: true }}
        >
          <CarouselContent>
            {items.map((t, idx) => (
              <CarouselItem key={t.id} className="md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-24px' }}
                  transition={{ duration: 0.4, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Card className="h-full border-seed-forest/10 bg-white/80 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg touch-manipulation">
                    <CardContent className="flex flex-col gap-4 p-6">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 overflow-hidden rounded-full bg-seed-sand-dark">
                          {typeof t.photo === 'object' && t.photo?.url ? (
                            <Image src={t.photo.url} alt="" fill className="object-cover" />
                          ) : null}
                        </div>
                        <div>
                          <p className="font-medium text-seed-forest">{t.clientName}</p>
                          {t.nationality ? (
                            <p className="text-xs text-muted-foreground">{t.nationality}</p>
                          ) : null}
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                      <div className="flex gap-0.5 text-seed-turquoise">
                        {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                          <Star key={i} className="size-4 fill-current" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  )
}
