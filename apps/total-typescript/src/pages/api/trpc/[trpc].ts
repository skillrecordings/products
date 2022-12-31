/**
 * This file contains the tRPC http response handler and context creation for Next.js
 */
import * as trpcNext from '@trpc/server/adapters/next'
import {createContext} from '@skillrecordings/skill-lesson'
import {AppRouter, appRouter} from 'server/routers/_app'

export default trpcNext.createNextApiHandler<AppRouter>({
  router: appRouter,
  createContext,
  onError({error}) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting
      console.error('Something went wrong', error)
    }
  },
  batching: {
    enabled: true,
  },
})
