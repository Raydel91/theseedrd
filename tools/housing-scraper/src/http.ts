const DEFAULT_UA =
  'Mozilla/5.0 (compatible; DR-Housing-Scraper/1.0; +https://github.com/) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

export async function fetchText(url: string, init?: RequestInit & { delayMs?: number }): Promise<string> {
  const { delayMs = 800, ...rest } = init ?? {}
  await new Promise((r) => setTimeout(r, delayMs))
  const res = await fetch(url, {
    ...rest,
    headers: {
      'User-Agent': DEFAULT_UA,
      Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'es-DO,es;q=0.9,en;q=0.8',
      ...rest.headers,
    },
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${url}`)
  }
  return res.text()
}
