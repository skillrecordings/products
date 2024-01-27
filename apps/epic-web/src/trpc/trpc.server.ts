import {
  createTRPCProxyClient,
  loggerLink,
  unstable_httpBatchStreamLink,
} from '@trpc/client'
import {headers} from 'next/headers'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import superjson from 'superjson'
import {AppRouter} from 'trpc/routers/_app'

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === 'development' ||
        (op.direction === 'down' && op.result instanceof Error),
    }),
    unstable_httpBatchStreamLink({
      url: getBaseUrl(),
      headers() {
        const heads = new Map(headers())
        heads.set('x-trpc-source', 'rsc')
        return Object.fromEntries(heads)
      },
    }),
  ],
})
