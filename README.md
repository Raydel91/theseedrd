# The Seed RD

Sitio premium de relocalización y real estate en **República Dominicana** con **Next.js 16**, **Tailwind CSS v4**, **shadcn/ui**, **Payload CMS 3** (SQLite en local), **Auth.js v5**, **Framer Motion** y blog en **MDX**.

## Requisitos

- Node.js 20+ (recomendado 22)
- npm 10+

## Instalación

```bash
cd the-seed-rd
cp .env.example .env
# Edita .env y define PAYLOAD_SECRET, AUTH_SECRET y opcionalmente NEXT_PUBLIC_SITE_URL
npm install
```

Tras **añadir o cambiar colecciones/campos** en Payload, regenera el mapa de imports del admin:

```bash
npm run generate:importmap
```

## Desarrollo local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). El panel de Payload está en **[http://localhost:3000/admin](http://localhost:3000/admin)**.

La primera vez verás el asistente para **crear el usuario administrador**. Ese usuario puede gestionar todo el contenido (globals, media, paquetes, equipo, testimonios, propiedades, clientes, referidos, usuarios).

### Base de datos

Por defecto se usa **SQLite** (`DATABASE_URL=file:./payload.db`). El archivo se crea al levantar el servidor y Payload aplica el esquema en desarrollo.

Si tras actualizar plugins (p. ej. SEO) o colecciones ves errores del tipo `CREATE INDEX ... failed` o esquema inconsistente, **para el servidor** (`npm run dev`) y regenera la base de desarrollo:

```bash
npm run db:reset
npm run dev
```

Eso borra `payload.db` (y archivos WAL/SHM). En local no suele importar; en datos que quieras conservar, exporta antes o usa Postgres en producción.

## Acceso a `/admin`

1. Ve a `/admin`.
2. Crea la cuenta del primer administrador (solo disponible cuando no hay usuarios).
3. Desde ahí edita:
   - **Globals**: `site-config` (hero, contacto, mapa + pestaña **SEO** del plugin), `referral-settings` (comisiones, reglas y SEO opcional).
   - **Colecciones**: equipo, testimonios, paquetes, propiedades, **blog-posts** (CMS; el blog público sigue pudiendo usar MDX en `content/blog/`), clientes, referidos, media, usuarios.

El **plugin SEO de Payload** añade título, descripción, imagen OG y vista previa en paquetes, propiedades, entradas CMS y globals anteriores.

### Estilo del admin

Estilos personalizados en `app/(payload)/custom.scss` (paleta bosque / turquesa alineada con la marca).

## Portal de clientes y Auth.js

- **Login**: `/login` (ES) o `/en/login` (EN).
- **Dashboard** (rol `client`): `/dashboard` — timeline del caso, tabla de referidos, comisiones y enlace/código para compartir.

Los usuarios **admin** y **staff** que inicien sesión vía `/login` se redirigen a `/admin`. Los **client** acceden al dashboard.

Variables necesarias: `AUTH_SECRET`, `AUTH_URL` (producción), `PAYLOAD_SECRET`.

## Blog (MDX)

Entradas en `content/blog/` (`*.es.mdx` / `*.en.mdx`). El índice de slugs está en `lib/blog.ts`.

## Producción

```bash
npm run build
npm start
```

Configura `NEXT_PUBLIC_SITE_URL`, `AUTH_URL` y secretos en el entorno del hosting. Para SQLite en servidor sin disco persistente, migra a Postgres/MySQL u host compatible con Payload.

## Logo

El logo del sitio es `public/logo.svg` (copiado desde el archivo de marca en la raíz del proyecto padre).

## SEO (sitemap, robots, metadatos)

- **`app/sitemap.ts`**: rutas públicas ES/EN, posts MDX y entradas `blog-posts` publicadas en Payload (deduplicado por URL).
- **`app/robots.ts`**: permite indexar el sitio público y bloquea `/admin`, `/dashboard`, `/api/`, login.
- **Metadatos**: `generateMetadata` por página con keywords, Open Graph, Twitter y **hreflang** (`alternates.languages` + canonical por idioma). La imagen OG por defecto puede definirse en **Globals → site-config → SEO → imagen**.
- **JSON-LD**: Organization/WebSite en inicio; LocalBusiness + Breadcrumb en Sobre nosotros; lista de servicios en Servicios; FAQ + Breadcrumb en Contacto; BlogPosting en posts del blog.

### Después del lanzamiento

1. **Google Search Console**: propiedad de dominio o prefijo de URL, enviar `sitemap.xml`, revisar cobertura e informes de Core Web Vitals.
2. **Comprobar indexación**: búsqueda `site:tudominio.com` y validación de URLs canónicas (ES/EN sin duplicados nocivos).
3. **Rich results**: prueba de [resultados enriquecidos de Google](https://search.google.com/test/rich-results) con URLs de inicio, servicios y un artículo de blog.
4. **Rendimiento**: mantener imágenes optimizadas (`next/image`), LCP estable en hero y revisar **PageSpeed Insights** tras cambios grandes.
