/** Rutas ES ↔ EN para el selector de idioma */
export const routeMap = {
  es: {
    home: '/',
    about: '/sobre-nosotros',
    services: '/servicios',
    homes: '/hogar',
    blog: '/blog',
    referrals: '/referidos',
    contact: '/contacto',
    login: '/login',
    register: '/registro',
    dashboard: '/dashboard',
  },
  en: {
    home: '/en',
    about: '/en/about',
    services: '/en/services',
    homes: '/en/homes',
    blog: '/en/blog',
    referrals: '/en/referrals',
    contact: '/en/contact',
    login: '/en/login',
    register: '/en/register',
    dashboard: '/en/dashboard',
  },
} as const

export type RouteKey = keyof typeof routeMap.es

export function getAlternatePath(locale: 'es' | 'en', key: RouteKey, currentPath: string): string {
  const esPath = routeMap.es[key]
  const enPath = routeMap.en[key]
  if (currentPath.startsWith('/en')) return esPath
  return enPath
}

/** Convierte la ruta actual a la misma página en el otro idioma */
export function translatePath(pathname: string, to: 'es' | 'en'): string {
  const pairs = Object.keys(routeMap.es) as RouteKey[]
  for (const key of pairs) {
    if (routeMap.es[key] === pathname || routeMap.en[key] === pathname) {
      return routeMap[to][key]
    }
  }
  return to === 'en' ? '/en' : '/'
}
