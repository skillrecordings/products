'use client'

import {loggerLink, unstable_httpBatchStreamLink} from '@trpc/client'
import superjson from 'superjson'
import type {AppRouter} from 'trpc/routers/_app'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import {createTRPCReact} from '@trpc/react-query'
import {useState} from 'react'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

export const trpc = createTRPCReact<AppRouter>({
  overrides: {
    useMutation: {
      async onSuccess(opts) {
        /**
         * @note that order here matters: The order here allows route changes in `onSuccess` without
         *       having a flash of content change whilst redirecting.
         */
        // Calls the `onSuccess` defined in the `useQuery()`-options:
        await opts.originalFn()
        // Invalidate all queries in the react-query cache:
        await opts.queryClient.invalidateQueries()
      },
    },
  },
})

export function TRPCReactProvider(props: {
  children: React.ReactNode
  headers: Headers
}) {
  const [queryClient] = useState(() => new QueryClient())

  const [trpcClient] = useState(() =>
    trpc.createClient({
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
            const heads = new Map(props.headers)
            heads.set('x-trpc-source', 'react')
            return Object.fromEntries(heads)
          },
        }),
      ],
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </trpc.Provider>
    </QueryClientProvider>
  )
}
