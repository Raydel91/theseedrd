import { Gift, Share2, Sparkles } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Locale } from '@/lib/i18n/copy'
import { pickLocale } from '@/lib/pick-locale'
import { getPayloadInstance } from '@/lib/payload-server'

const ui = {
  es: {
    steps: [
      { icon: Share2, t: 'Comparte tu enlace', d: 'Desde tu dashboard copias tu código único.' },
      { icon: Gift, t: 'Ellos contratan', d: 'Validamos el proyecto y activamos el caso.' },
      { icon: Sparkles, t: 'Recibes comisión', d: 'Pago transparente según reglas del programa.' },
    ],
    commission: (n: number) => `Comisión referida hasta ${n}% según el caso`,
  },
  en: {
    steps: [
      { icon: Share2, t: 'Share your link', d: 'From your dashboard, copy your unique code.' },
      { icon: Gift, t: 'They sign on', d: 'We validate the project and activate the case.' },
      { icon: Sparkles, t: 'You earn', d: 'Transparent payouts per program rules.' },
    ],
    commission: (n: number) => `Referral commission up to ${n}% depending on the case`,
  },
} as const

export async function ReferralsPage({ locale }: { locale: Locale }) {
  const payload = await getPayloadInstance()
  const settings = await payload.findGlobal({ slug: 'referral-settings', locale })
  const pct = settings?.commissionPercent as number | undefined
  const headline = pickLocale(settings?.headline as string | { es?: string; en?: string }, locale)
  const body = pickLocale(settings?.body as string | { es?: string; en?: string }, locale)
  const rules = (settings?.rules as { rule?: string | { es?: string; en?: string } }[]) || []
  const labels = ui[locale]

  return (
    <div className="bg-gradient-to-b from-seed-sand to-background">
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <Sparkles className="mx-auto size-10 text-seed-turquoise" />
          <h1 className="font-heading mt-4 text-4xl font-semibold text-seed-forest md:text-5xl">
            {headline || (locale === 'es' ? 'Programa de referidos' : 'Referral program')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {body ||
              (locale === 'es'
                ? 'Comparte The Seed RD con amigos y familiares. Cuando contraten nuestros servicios premium, tú ganas.'
                : 'Share The Seed RD with friends and family. When they engage our premium services, you earn.')}
          </p>
          {pct != null ? (
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-seed-emerald/10 px-5 py-2 text-sm font-semibold text-seed-emerald">
              <Gift className="size-4" />
              {labels.commission(pct)}
            </p>
          ) : null}
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {labels.steps.map(({ icon: Icon, t, d }) => (
            <Card key={t} className="border-seed-forest/10 bg-white/80 backdrop-blur">
              <CardHeader>
                <Icon className="size-8 text-seed-turquoise" />
                <CardTitle className="font-heading text-lg">{t}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{d}</CardContent>
            </Card>
          ))}
        </div>

        <ul className="mx-auto mt-14 max-w-2xl space-y-3 text-sm text-muted-foreground">
          {rules.map((r, i) => {
            const text = pickLocale(r.rule as string | { es?: string; en?: string }, locale)
            return (
              <li key={i} className="flex gap-2">
                <span className="text-seed-turquoise">•</span>
                <span>{text}</span>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
