import {
  createTRPCProxyClient,
  loggerLink,
  unstable_httpBatchStreamLink,
} from '@trpc/client'
import {headers} from 'next/headers'

import superjson from 'superjson'
import {AppRouter} from '@/trpc/routers/_app'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '' // browser should use relative url
  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3021}` // dev SSR should use localhost
}

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === 'development' ||
        (op.direction === 'down' && op.result instanceof Error),
    }),
    unstable_httpBatchStreamLink({
      url: `${getBaseUrl()}/api/trpc`,
      headers() {
        const heads = new Map(headers())
        heads.set('x-trpc-source', 'rsc')
        return Object.fromEntries(heads)
      },
    }),
  ],
})
