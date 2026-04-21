import type { Payload } from 'payload'

type Localized = { es: string; en: string }

type SeedPackage = {
  slug: string
  order: number
  highlighted: boolean
  price: number
  title: Localized
  shortDescription: Localized
  billingNote: Localized
  ctaLabel: Localized
  features: { es: string; en: string }[]
}

const SEED_PACKAGES: SeedPackage[] = [
  {
    slug: 'seed-starter',
    order: 1,
    highlighted: false,
    price: 2490,
    title: { es: 'Seed Starter', en: 'Seed Starter' },
    shortDescription: {
      es: 'Comienza tu nueva vida con los pies en la tierra. Ideal para personas que solo quieren residencia.',
      en: 'Start your new life with both feet on the ground. Ideal for people who only want residency.',
    },
    billingNote: { es: 'desde', en: 'from' },
    ctaLabel: { es: 'Solicitar', en: 'Request' },
    features: [
      {
        es: 'Asesoría y preparación completa del expediente de residencia',
        en: 'Full advisory and preparation of your residency application',
      },
      {
        es: 'Acompañamiento en Dirección General de Migración',
        en: 'Assistance at the General Directorate of Migration',
      },
      { es: 'Traducciones y apostillados', en: 'Translations and apostilles' },
      { es: 'Apertura de cuenta bancaria', en: 'Bank account opening' },
      {
        es: 'Asistencia con seguro médico y cédula',
        en: 'Assistance with medical insurance and national ID card',
      },
    ],
  },
  {
    slug: 'seed-relocation',
    order: 2,
    highlighted: false,
    price: 4290,
    title: { es: 'Seed Relocation', en: 'Seed Relocation' },
    shortDescription: {
      es: 'Llegar es fácil. Establecerse es nuestro trabajo. Ideal para expats que quieren mudarse por completo.',
      en: 'Arriving is easy. Settling is our job. Ideal for expats who want a full relocation.',
    },
    billingNote: { es: 'desde', en: 'from' },
    ctaLabel: { es: 'Solicitar', en: 'Request' },
    features: [
      { es: 'Todo lo incluido en Seed Starter, más:', en: 'Everything in Seed Starter, plus:' },
      {
        es: 'Búsqueda y visitas de propiedades (alquiler o compra)',
        en: 'Property search and visits (rent or purchase)',
      },
      {
        es: 'Acompañamiento en firma de contratos',
        en: 'Support at contract signing',
      },
      {
        es: 'Trámites de mudanza y aduanas',
        en: 'Relocation paperwork and customs',
      },
      {
        es: 'Configuración de servicios (internet, electricidad, teléfono)',
        en: 'Utility setup (internet, electricity, phone)',
      },
      {
        es: 'Orientación cultural y práctica (30 días)',
        en: 'Cultural and practical orientation (30 days)',
      },
    ],
  },
  {
    slug: 'seed-home-residency',
    order: 3,
    highlighted: true,
    price: 5990,
    title: { es: 'Seed Home & Residency', en: 'Seed Home & Residency' },
    shortDescription: {
      es: 'Tu residencia y tu hogar, todo en un solo paquete. Ideal para quienes quieren comprar propiedad + residencia.',
      en: 'Your residency and your home, all in one package. Ideal if you want property + residency.',
    },
    billingNote: { es: 'desde', en: 'from' },
    ctaLabel: { es: 'Solicitar', en: 'Request' },
    features: [
      { es: 'Todo lo incluido en Seed Relocation, más:', en: 'Everything in Seed Relocation, plus:' },
      {
        es: 'Búsqueda personalizada y due diligence de propiedades',
        en: 'Personalized search and property due diligence',
      },
      {
        es: 'Coordinación con abogado para compra',
        en: 'Coordination with legal counsel for the purchase',
      },
      {
        es: 'Residencia por inversión (si aplica)',
        en: 'Investment residency (if applicable)',
      },
      {
        es: 'Soporte los primeros 90 días',
        en: 'Support during your first 90 days',
      },
    ],
  },
  {
    slug: 'seed-vip-experience',
    order: 4,
    highlighted: false,
    price: 8900,
    title: { es: 'Seed VIP Experience', en: 'Seed VIP Experience' },
    shortDescription: {
      es: 'La experiencia completa de lujo en Punta Cana. Ideal para inversionistas y familias que buscan experiencia premium.',
      en: 'The full luxury experience in Punta Cana. Ideal for investors and families seeking a premium experience.',
    },
    billingNote: { es: 'desde', en: 'from' },
    ctaLabel: { es: 'Solicitar', en: 'Request' },
    features: [
      { es: 'Todo lo incluido en Seed Home & Residency, más:', en: 'Everything in Seed Home & Residency, plus:' },
      {
        es: 'Soporte prioritario 6 meses',
        en: 'Priority support for 6 months',
      },
      {
        es: 'Servicio de concierge personal',
        en: 'Personal concierge service',
      },
      {
        es: 'Asistencia con matrícula de vehículos',
        en: 'Vehicle registration assistance',
      },
      {
        es: 'Visitas a colegios (si hay niños)',
        en: 'School visits (if you have children)',
      },
      {
        es: 'Evento de bienvenida y networking con otros expats',
        en: 'Welcome event and networking with other expats',
      },
    ],
  },
]

async function upsertPackage(payload: Payload, p: SeedPackage): Promise<void> {
  const found = await payload.find({
    collection: 'packages',
    where: { slug: { equals: p.slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const base = {
    slug: p.slug,
    price: p.price,
    order: p.order,
    highlighted: p.highlighted,
  }
  const featuresEs = p.features.map((f) => ({ item: f.es }))
  const featuresEn = p.features.map((f) => ({ item: f.en }))

  if (found.docs[0]) {
    const id = found.docs[0].id
    await payload.update({
      collection: 'packages',
      id,
      locale: 'es',
      overrideAccess: true,
      data: {
        ...base,
        title: p.title.es,
        shortDescription: p.shortDescription.es,
        billingNote: p.billingNote.es,
        ctaLabel: p.ctaLabel.es,
        features: featuresEs,
      },
    })
    await payload.update({
      collection: 'packages',
      id,
      locale: 'en',
      overrideAccess: true,
      data: {
        title: p.title.en,
        shortDescription: p.shortDescription.en,
        billingNote: p.billingNote.en,
        ctaLabel: p.ctaLabel.en,
        features: featuresEn,
      },
    })
    return
  }

  const created = await payload.create({
    collection: 'packages',
    locale: 'es',
    overrideAccess: true,
    data: {
      ...base,
      title: p.title.es,
      shortDescription: p.shortDescription.es,
      billingNote: p.billingNote.es,
      ctaLabel: p.ctaLabel.es,
      features: featuresEs,
    },
  })
  await payload.update({
    collection: 'packages',
    id: created.id,
    locale: 'en',
    overrideAccess: true,
    data: {
      title: p.title.en,
      shortDescription: p.shortDescription.en,
      billingNote: p.billingNote.en,
      ctaLabel: p.ctaLabel.en,
      features: featuresEn,
    },
  })
}

/**
 * Cuatro paquetes de servicios (Punta Cana) — idempotente por slug.
 */
export async function seedServicePackages(payload: Payload): Promise<void> {
  for (const p of SEED_PACKAGES) {
    await upsertPackage(payload, p)
  }
}
