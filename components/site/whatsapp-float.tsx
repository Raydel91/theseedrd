'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

export function WhatsappFloat({ phone }: { phone: string }) {
  const href = `https://wa.me/${phone.replace(/\D/g, '')}`
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-seed-forest/25"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      aria-label="WhatsApp"
    >
      <MessageCircle className="size-7" />
    </motion.a>
  )
}
