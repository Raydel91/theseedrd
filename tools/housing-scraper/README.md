# dr-housing-scraper

CLI para recopilar enlaces públicos de listados de vivienda en **República Dominicana** (Punta Cana y Santo Domingo), con fuente principal **SuperCasas.com**.

## Uso responsable

- Revisa [robots.txt](https://www.supercasas.com/robots.txt) y los **términos de uso** del sitio antes de automatizar.
- Usa `--delay` alto si haces muchas peticiones; no abuses del servidor.
- Los datos son solo para análisis interno; los anuncios pertenecen a sus autores.

## Instalación

```bash
cd tools/housing-scraper
npm install
```

Desde la raíz del monorepo también puedes usar:

```bash
npm run housing:scrape -- --region punta-cana --kind sale --limit 40
```

### Un clic (Windows)

Doble clic en **`Ejecutar-descarga-con-fotos.bat`** (en esta carpeta). Instala dependencias la primera vez, descarga listado + **fotos** de SuperCasas y abre la carpeta `housing-export` y **`galeria.html`** en el navegador.

### Fotos + álbum HTML

```bash
npm run housing:photos
```

o:

```bash
npx tsx src/cli.ts --photos --out-dir ./housing-export -n 12 -r punta-cana -k sale
```

Genera:

- `housing-export/listado.json` — metadatos y rutas locales
- `housing-export/galeria.html` — vista en miniatura (ábrelo con doble clic)
- `housing-export/<id>/01.jpg` … — fotos en la mejor resolución que aparezca en la ficha (p. ej. 1024×768)

Opciones útiles: `--photo-max 24`, `--image-delay 400`, `--skip-gallery` (solo JSON + archivos).

## Ejemplos

**Venta en Punta Cana (área Bávaro, Verón, Cap Cana, etc.):**

```bash
npx tsx src/cli.ts --region punta-cana --kind sale --limit 40 --pages 3
```

**Alquiler en Santo Domingo:**

```bash
npx tsx src/cli.ts --region santo-domingo --kind rent --limit 30
```

**Salida a archivo:**

```bash
npx tsx src/cli.ts -r punta-cana -k sale -n 50 -o listado.json
```

**URL de listado personalizada (misma lógica de filtrado por región en slug/texto):**

```bash
npx tsx src/cli.ts --url "https://www.supercasas.com/buscar/?tipo=comprar" -r santo-domingo -k sale
```

**Modo demo (sin red):**

```bash
npx tsx src/cli.ts --source demo -r punta-cana -k sale
```

## Fuentes

| Fuente        | Estado |
|---------------|--------|
| **supercasas** | Implementado: parsea enlaces de listados y filtra por zona (keywords) y venta/alquiler. |
| **mercadolibre** | Reservado: muchos listados exigen login o bloquean bots; usar API oficial o Playwright con sesión si lo necesitas. |

## Cómo funciona

1. Descarga HTML del listado (por defecto `/buscar/?tipo=comprar` o `?tipo=alquilar`).
2. Extrae enlaces a fichas (`/tipo-venta-zona/ID/`).
3. Filtra por **venta** vs **alquiler** según el path.
4. Filtra por **región** comprobando palabras clave en el slug y en el texto del enlace (ver `src/config/regions.ts`).

Puedes ampliar las listas de keywords si te faltan barrios.

## Opciones CLI

| Opción | Descripción |
|--------|-------------|
| `-r, --region` | `punta-cana` \| `santo-domingo` |
| `-k, --kind` | `sale` (venta) \| `rent` (alquiler) |
| `-s, --source` | `supercasas` \| `mercadolibre` \| `demo` \| `all` (supercasas + mercadolibre) |
| `-n, --limit` | Máximo de anuncios (default 30) |
| `--pages` | Máximo de páginas a seguir (enlaces “Siguiente” o `?page=`) |
| `--delay` | Milisegundos entre peticiones (default 900) |
| `--url` | URL inicial de listado SuperCasas |
| `-o, --out` | Archivo JSON (solo sin `--photos`) |
| `--photos` | Descargar fotos por anuncio y escribir `listado.json` + `galeria.html` |
| `--out-dir` | Carpeta de exportación (default `housing-export`) |
| `--photo-max` | Máx. fotos por anuncio |
| `--image-delay` | Pausa entre descargas de imagen (ms) |
| `--skip-gallery` | No generar `galeria.html` |
