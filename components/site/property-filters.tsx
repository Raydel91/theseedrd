'use client'

import { motion } from 'framer-motion'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Locale } from '@/lib/i18n/copy'
import { RD_PROVINCE_OPTIONS, getMunicipalitiesForProvince } from '@/lib/rd-admin-divisions'

const Q_PROV = 'provincia'
const Q_MUN = 'municipio'

export function PropertyFilters({ locale }: { locale: Locale }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const provinceSlug = searchParams.get(Q_PROV) ?? ''
  const municipalitySlug = searchParams.get(Q_MUN) ?? ''

  const municipalities = useMemo(
    () => (provinceSlug ? getMunicipalitiesForProvince(provinceSlug) : []),
    [provinceSlug],
  )

  const setQuery = useCallback(
    (next: { provincia?: string; municipio?: string }) => {
      const params = new URLSearchParams(searchParams.toString())
      if (next.provincia !== undefined) {
        if (next.provincia) params.set(Q_PROV, next.provincia)
        else params.delete(Q_PROV)
      }
      if (next.municipio !== undefined) {
        if (next.municipio) params.set(Q_MUN, next.municipio)
        else params.delete(Q_MUN)
      }
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  const t =
    locale === 'es'
      ? {
          province: 'Provincia o Distrito Nacional',
          municipality: 'Municipio',
          all: 'Todas',
          allMuni: 'Todos',
          clear: 'Limpiar filtros',
        }
      : {
          province: 'Province or National District',
          municipality: 'Municipality',
          all: 'All',
          allMuni: 'All',
          clear: 'Clear filters',
        }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mt-8 rounded-2xl border border-seed-forest/10 bg-white/70 p-6 shadow-sm backdrop-blur"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end">
        <div className="min-w-0 flex-1">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t.province}</Label>
          <Select
            value={provinceSlug || 'all'}
            onValueChange={(v) => {
              const val = v ?? ''
              if (val === 'all') {
                setQuery({ provincia: '', municipio: '' })
                return
              }
              setQuery({ provincia: val, municipio: '' })
            }}
          >
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder={t.all} />
            </SelectTrigger>
            <SelectContent className="max-h-[min(24rem,70vh)]">
              <SelectItem value="all">{t.all}</SelectItem>
              {RD_PROVINCE_OPTIONS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {locale === 'es' ? p.labelEs : p.labelEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-0 flex-1">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t.municipality}</Label>
          <Select
            value={municipalitySlug || 'all'}
            onValueChange={(v) => {
              const val = v ?? ''
              if (val === 'all') {
                setQuery({ municipio: '' })
                return
              }
              setQuery({ municipio: val })
            }}
            disabled={!provinceSlug}
          >
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder={t.allMuni} />
            </SelectTrigger>
            <SelectContent className="max-h-[min(24rem,70vh)]">
              <SelectItem value="all">{t.allMuni}</SelectItem>
              {municipalities.map((m) => (
                <SelectItem key={m.value} value={m.municipalitySlug}>
                  {locale === 'es' ? m.labelEs.split(' — ').pop() : m.labelEn.split(' — ').pop()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          variant="outline"
          className="shrink-0 rounded-full border-seed-forest/25"
          onClick={() => setQuery({ provincia: '', municipio: '' })}
        >
          {t.clear}
        </Button>
      </div>
    </motion.div>
  )
}
