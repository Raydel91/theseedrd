import type { Metadata } from 'next'

import { ContactPage } from '@/components/pages/contact-page'
import { publicPageMetadataWithOg } from '@/lib/seo/public-metadata'

export async function generateMetadata(): Promise<Metadata> {
  return publicPageMetadataWithOg('es', 'contact', {
    title: 'Contacto | The Seed RD',
    description:
      'Agenda una consulta boutique por WhatsApp o email. Horario extendido para zonas US/EU.',
    path: '/contacto',
  })
}

export default function ContactoPage() {
  return <ContactPage locale="es" />
}
