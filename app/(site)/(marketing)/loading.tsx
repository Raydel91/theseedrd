/** UI inmediata mientras resuelve el layout y Payload (evita sensación de pantalla vacía). */
export default function MarketingLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
      <div
        className="size-10 animate-spin rounded-full border-2 border-seed-emerald border-t-transparent"
        role="status"
        aria-label="Cargando"
      />
      <p className="text-sm text-muted-foreground">Cargando…</p>
    </div>
  )
}
