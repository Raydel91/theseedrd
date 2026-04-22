import type { Metadata } from 'next'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export async function generateMetadata(args: Args): Promise<Metadata> {
  const base = await generatePageMetadata({
    config,
    params: args.params,
    searchParams: args.searchParams,
  })
  return {
    ...base,
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  }
}

export default function AdminPage({ params, searchParams }: Args) {
  return RootPage({ config, params, searchParams, importMap })
}
