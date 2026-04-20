'use client'

import { motion } from 'framer-motion'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

export function PropertyFilters() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 rounded-2xl border border-seed-forest/10 bg-white/70 p-6 shadow-sm backdrop-blur"
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Zona</Label>
          <Select defaultValue="all">
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="este">Zona Este</SelectItem>
              <SelectItem value="sd">Santo Domingo</SelectItem>
              <SelectItem value="lm">La Romana</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Presupuesto (USD)</Label>
          <Slider defaultValue={[750000]} max={5000000} min={300000} step={50000} className="mt-6" />
          <p className="mt-2 text-xs text-muted-foreground">Desliza para acotar (demo visual)</p>
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Estilo</Label>
          <Select defaultValue="any">
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Cualquiera</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="penthouse">Penthouse</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  )
}
