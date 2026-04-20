export const copy = {
  es: {
    brand: 'The Seed RD',
    tagline: 'Relocalización premium en República Dominicana',
    nav: {
      home: 'Inicio',
      about: 'Sobre nosotros',
      services: 'Servicios',
      homes: 'Hogar',
      blog: 'Blog',
      referrals: 'Referidos',
      contact: 'Contacto',
      dashboard: 'Mi cuenta',
      login: 'Acceder',
    },
    hero: {
      ctaPrimary: 'Agendar consulta',
      ctaSecondary: 'Ver servicios',
      trust1: 'Asesoría legal certificada',
      trust2: 'Acompañamiento end-to-end',
      trust3: 'Cobertura en República Dominicana',
    },
    footer: {
      rights: 'Todos los derechos reservados.',
      privacy: 'Privacidad',
      follow: 'Síguenos',
      contact: 'Contacto',
      social: 'Redes',
      rncLabel: 'RNC',
    },
  },
  en: {
    brand: 'The Seed RD',
    tagline: 'Premium relocation in the Dominican Republic',
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      homes: 'Homes',
      blog: 'Blog',
      referrals: 'Referrals',
      contact: 'Contact',
      dashboard: 'My account',
      login: 'Sign in',
    },
    hero: {
      ctaPrimary: 'Book a consultation',
      ctaSecondary: 'Explore services',
      trust1: 'Certified legal counsel',
      trust2: 'End-to-end concierge',
      trust3: 'Coverage across the Dominican Republic',
    },
    footer: {
      rights: 'All rights reserved.',
      privacy: 'Privacy',
      follow: 'Follow',
      contact: 'Contact',
      social: 'Social',
      rncLabel: 'RNC',
    },
  },
} as const

export type Locale = keyof typeof copy
