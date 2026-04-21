'use client'

import Image from 'next/image'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  if (images.length === 0) return null

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((src, i) => (
          <CarouselItem key={src + i}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-seed-forest/10 bg-seed-sand-dark">
              <Image
                src={src}
                alt={`${title} — ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
                priority={i === 0}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 ? (
        <>
          <CarouselPrevious className="left-2 border-seed-forest/20 bg-background/90" />
          <CarouselNext className="right-2 border-seed-forest/20 bg-background/90" />
        </>
      ) : null}
    </Carousel>
  )
}
