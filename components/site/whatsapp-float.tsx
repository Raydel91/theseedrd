'use client'

import { MessageCircle } from 'lucide-react'

/** Sin Framer Motion: evita errores raros de SSR/hidratación con `motion.*` en algunos entornos. */
export function WhatsappFloat({ phone }: { phone: string }) {
  const href = `https://wa.me/${phone.replace(/\D/g, '')}`
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-seed-forest/25 touch-manipulation transition-transform hover:scale-105 active:scale-95"
      aria-label="WhatsApp"
    >
      <MessageCircle className="size-7" />
    </a>
  )
}
