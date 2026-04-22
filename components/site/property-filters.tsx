'use client'

import { motion } from 'framer-motion'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Locale } from '@/lib/i18n/copy'
import { RD_MACRO_REGIONS, getProvincesForRegion } from '@/lib/rd-regions'
import { RD_PROVINCE_OPTIONS, getMunicipalitiesForProvince } from '@/lib/rd-admin-divisions'

const Q_REGION = 'region'
const Q_PROV = 'provincia'
const Q_MUN = 'municipio'
const Q_TIPO = 'tipo'
const Q_CUARTOS = 'cuartos'
const Q_BANOS = 'banos'
const Q_ETIQUETAS = 'etiquetas'

export function PropertyFilters({
  locale,
  houseTypeOptions,
  tagOptions,
}: {
  locale: Locale
  houseTypeOptions: { slug: string; label: string }[]
  tagOptions: { slug: string; label: string; category: string }[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const regionSlug = searchParams.get(Q_REGION) ?? ''
  const provinceSlug = searchParams.get(Q_PROV) ?? ''
  const municipalitySlug = searchParams.get(Q_MUN) ?? ''
  const tipoSlug = searchParams.get(Q_TIPO) ?? ''
  const cuartos = searchParams.get(Q_CUARTOS) ?? ''
  const banos = searchParams.get(Q_BANOS) ?? ''
  const etiquetasRaw = searchParams.get(Q_ETIQUETAS) ?? ''
  const selectedTags = useMemo(
    () => new Set(etiquetasRaw.split(',').map((s) => s.trim()).filter(Boolean)),
    [etiquetasRaw],
  )

  const provinceChoices = useMemo(() => {
    if (!regionSlug) return [...RD_PROVINCE_OPTIONS]
    const allowed = new Set(getProvincesForRegion(regionSlug))
    return RD_PROVINCE_OPTIONS.filter((p) => allowed.has(String(p.value)))
  }, [regionSlug])

  const municipalities = useMemo(
    () => (provinceSlug ? getMunicipalitiesForProvince(provinceSlug) : []),
    [provinceSlug],
  )

  const setParams = useCallback(
    (patch: Record<string, string | undefined | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [k, v] of Object.entries(patch)) {
        if (v === undefined || v === null || v === '') params.delete(k)
        else params.set(k, v)
      }
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  const toggleTag = useCallback(
    (slug: string) => {
      const next = new Set(selectedTags)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      const s = [...next].sort().join(',')
      setParams({ [Q_ETIQUETAS]: s || undefined })
    },
    [selectedTags, setParams],
  )

  const t =
    locale === 'es'
      ? {
          region: 'Región',
          province: 'Provincia o Distrito Nacional',
          municipality: 'Municipio',
          type: 'Tipo de propiedad',
          beds: 'Mín. habitaciones',
          baths: 'Mín. baños',
          tags: 'Etiquetas',
          all: 'Todas',
          allMuni: 'Todos',
          any: 'Cualquiera',
          clear: 'Limpiar filtros',
          tagGroups: { general: 'General', style: 'Estilo' },
        }
      : {
          region: 'Region',
          province: 'Province or National District',
          municipality: 'Municipality',
          type: 'Property type',
          beds: 'Min. bedrooms',
          baths: 'Min. bathrooms',
          tags: 'Tags',
          all: 'All',
          allMuni: 'All',
          any: 'Any',
          clear: 'Clear filters',
          tagGroups: { general: 'General', style: 'Style' },
        }

  const tagsByCat = useMemo(() => {
    const g: Record<'general' | 'style', typeof tagOptions> = {
      general: [],
      style: [],
    }
    for (const row of tagOptions) {
      const c: 'general' | 'style' = row.category === 'style' ? 'style' : 'general'
      g[c].push(row)
    }
    return g
  }, [tagOptions])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mt-8 rounded-2xl border border-seed-forest/10 bg-white/70 p-6 shadow-sm backdrop-blur"
    >
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t.region}</Label>
          <Select
            value={regionSlug || 'all'}
            onValueChange={(v) => {
              if (v === 'all') {
                setParams({ [Q_REGION]: undefined, [Q_PROV]: undefined, [Q_MUN]: undefined })
                return
              }
              setParams({ [Q_REGION]: v, [Q_PROV]: undefined, [Q_MUN]: undefined })
            }}
          >
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder={t.all} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.all}</SelectItem>
              {RD_MACRO_REGIONS.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {locale === 'es' ? r.labelEs : r.labelEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t.province}</Label>
          <Select
            value={provinceSlug || 'all'}
            onValueChange={(v) => {
              if (v === 'all') {
                setParams({ [Q_PROV]: undefined, [Q_MUN]: undefined })
                return
              }
              setParams({ [Q_PROV]: v, [Q_MUN]: undefined })
            }}
          >
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder={t.all} />
            </SelectTrigger>
            <SelectContent className="max-h-[min(24rem,70vh)]">
              <SelectItem value="all">{t.all}</SelectItem>
              {provinceChoices.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {locale === 'es' ? p.labelEs : p.labelEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t.municipality}</Label>
          <Select
            value={municipalitySlug || 'all'}
            onValueChange={(v) => {
              if (v === 'all') {
                setParams({ [Q_MUN]: undefined })
                return
              }
              setParams({ [Q_MUN]: v })
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

        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t.type}</Label>
          <Select
            value={tipoSlug || 'all'}
            onValueChange={(v) => {
              if (v === 'all') setParams({ [Q_TIPO]: undefined })
              else setParams({ [Q_TIPO]: v })
            }}
          >
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder={t.all} />
            </SelectTrigger>
            <SelectContent className="max-h-[min(24rem,70vh)]">
              <SelectItem value="all">{t.all}</SelectItem>
              {houseTypeOptions.map((h) => (
                <SelectItem key={h.slug} value={h.slug}>
                  {h.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t.beds}</Label>
          <Select
            value={cuartos || 'any'}
            onValueChange={(v) => {
              if (v === 'any') setParams({ [Q_CUARTOS]: undefined })
              else setParams({ [Q_CUARTOS]: v })
            }}
          >
            <SelectTrigger className="mt-2 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t.any}</SelectItem>
              {['1', '2', '3', '4', '5'].map((n) => (
                <SelectItem key={n} value={n}>
                  {n}+
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t.baths}</Label>
          <Select
            value={banos || 'any'}
            onValueChange={(v) => {
              if (v === 'any') setParams({ [Q_BANOS]: undefined })
              else setParams({ [Q_BANOS]: v })
            }}
          >
            <SelectTrigger className="mt-2 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t.any}</SelectItem>
              {['1', '2', '3', '4', '5'].map((n) => (
                <SelectItem key={n} value={n}>
                  {n}+
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-8">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t.tags}</Label>
        <div className="mt-3 max-h-56 space-y-4 overflow-y-auto rounded-xl border border-seed-forest/10 bg-background/50 p-4">
          {(['general', 'style'] as const).map((cat) => {
            const list = tagsByCat[cat]
            if (!list?.length) return null
            return (
              <div key={cat}>
                <p className="mb-2 text-xs font-semibold text-seed-forest">{t.tagGroups[cat]}</p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((tag) => (
                    <label
                      key={tag.slug}
                      className="flex cursor-pointer items-center gap-2 rounded-md border border-transparent px-1 py-1 text-sm hover:bg-seed-emerald/5"
                    >
                      <Checkbox
                        checked={selectedTags.has(tag.slug)}
                        onCheckedChange={() => toggleTag(tag.slug)}
                      />
                      <span>{tag.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="button"
          variant="outline"
          className="rounded-full border-seed-forest/25"
          onClick={() =>
            router.push(pathname, { scroll: false })
          }
        >
          {t.clear}
        </Button>
      </div>
    </motion.div>
  )
}
