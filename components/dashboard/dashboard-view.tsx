'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Copy, Share2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'

type TimelineRow = { label: string; description?: string; completed?: boolean; sortOrder?: number }

export function DashboardView({
  referralCode,
  shareUrl,
  caseTitle,
  timeline,
  referrals,
  earnings,
  messagesSlot,
}: {
  referralCode: string
  shareUrl: string
  caseTitle: string
  timeline: TimelineRow[]
  referrals: { id: string; name: string; status: string; commission: number }[]
  earnings: number
  messagesSlot?: ReactNode
}) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Enlace copiado')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('No se pudo copiar. Selecciona el enlace abajo y cópialo manualmente.')
    }
  }

  const sorted = [...timeline].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-seed-forest">Tu dashboard</h1>
        <p className="text-muted-foreground">Expediente y programa de referidos — The Seed RD</p>
      </div>

      {messagesSlot}

      <Card className="border-seed-forest/10">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="font-heading text-xl">Tu código de referido</CardTitle>
            <p className="text-sm text-muted-foreground">Comparte y gana comisiones cuando activen un caso.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <code className="rounded-lg bg-seed-sand-dark px-3 py-2 text-sm font-semibold text-seed-forest">
              {referralCode}
            </code>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              type="button"
              onClick={() => void copyLink()}
            >
              <Copy className="mr-2 size-4" />
              {copied ? 'Copiado' : 'Copiar enlace'}
            </Button>
            <a
              href={shareUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center justify-center gap-2 rounded-full bg-seed-emerald px-3 text-sm font-medium text-primary-foreground"
            >
              <Share2 className="size-4" />
              Abrir
            </a>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground break-all">{shareUrl}</p>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-seed-forest/10">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Progreso — {caseTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sorted.map((step, i) => (
              <motion.div
                key={`${step.label}-${i}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-3"
              >
                {step.completed ? (
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-seed-turquoise" />
                ) : (
                  <Circle className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium text-seed-forest">{step.label}</p>
                  {step.description ? (
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-seed-forest/10">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Comisiones</CardTitle>
            <p className="text-3xl font-semibold text-seed-emerald">${earnings.toLocaleString()} USD</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referido</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Comisión</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.name}</TableCell>
                    <TableCell className="capitalize">{r.status}</TableCell>
                    <TableCell className="text-right">${r.commission.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
