/**
 * This file contains the tRPC http response handler and context creation for Next.js
 */
import * as trpcNext from '@trpc/server/adapters/next'
import {createContext} from '@skillrecordings/skill-lesson'
import {AppRouter, appRouter} from 'trpc/routers/_app'
import {nextAuthOptions} from '../auth/[...nextauth]'

export default trpcNext.createNextApiHandler<AppRouter>({
  router: appRouter,
  createContext: ({req, res}) =>
    createContext({
      req,
      res,
      nextAuthOptions,
    }),
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
