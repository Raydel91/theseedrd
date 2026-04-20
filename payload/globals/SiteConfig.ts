import type { GlobalConfig } from 'payload'

import type { User } from '@/payload-types'
import { canAccessPayloadAdmin } from '@/payload/access/user-helpers'

export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  label: 'Configuración del sitio',
  admin: {
    group: 'Sitio',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => canAccessPayloadAdmin(user as User),
  },
  fields: [
    {
      name: 'contactEmail',
      type: 'email',
      required: true,
      label: 'Correo de contacto',
      admin: {
        description: 'Obligatorio. Se muestra en el footer y en la página de contacto.',
      },
    },
    {
      name: 'whatsappPhone',
      type: 'text',
      required: true,
      label: 'Teléfono / WhatsApp (E.164, sin +)',
      defaultValue: '18095551234',
      admin: {
        description: 'Obligatorio. Mismo número para WhatsApp (flotante) y enlace wa.me.',
      },
    },
    {
      name: 'addressLine',
      type: 'text',
      localized: true,
      label: 'Dirección',
      admin: {
        description: 'Opcional. Texto visible en footer y contacto.',
      },
    },
    {
      name: 'rnc',
      type: 'text',
      label: 'RNC',
      admin: {
        description: 'Opcional. Registro Nacional del Contribuyente (República Dominicana).',
      },
    },
    {
      name: 'instagramUrl',
      type: 'text',
      label: 'Instagram (URL)',
      admin: {
        description: 'Opcional. Enlace completo al perfil, ej. https://instagram.com/tu_cuenta',
      },
    },
    {
      name: 'facebookUrl',
      type: 'text',
      label: 'Facebook (URL)',
      admin: {
        description: 'Opcional. Enlace completo a la página, ej. https://facebook.com/tu_pagina',
      },
    },
    {
      name: 'mapEmbedUrl',
      type: 'text',
      label: 'URL embed Google Maps',
      admin: {
        description: 'Opcional. Pega la URL src del iframe; si está vacío, el footer usa un mapa genérico de RD.',
      },
    },
    {
      name: 'heroTitle',
      type: 'text',
      localized: true,
      label: 'Título hero',
      admin: {
        description: 'Opcional. Si está vacío, la portada usa un texto por defecto.',
      },
    },
    {
      name: 'heroSubtitle',
      type: 'textarea',
      localized: true,
      label: 'Subtítulo hero',
    },
    {
      name: 'welcomeText',
      type: 'textarea',
      localized: true,
      label: 'Texto de bienvenida',
    },
  ],
}
