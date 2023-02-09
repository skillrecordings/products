/**
 * This file contains the tRPC http response handler and context creation for Next.js
 */
import * as trpcNext from '@trpc/server/adapters/next'
import {createContext} from '@skillrecordings/skill-lesson/trpc/trpc-context'
import {AppRouter, appRouter} from 'trpc/routers/_app'
import {nextAuthOptions} from '../auth/[...nextauth]'

export default trpcNext.createNextApiHandler<AppRouter>({
  router: appRouter,
  /**
   * @link https://trpc.io/docs/context
   */
  createContext: ({req, res}) =>
    createContext({
      req,
      res,
      nextAuthOptions,
    }),
  /**
   * Data transformer
   * @link https://trpc.io/docs/data-transformers
   */

  /**
   * @link https://trpc.io/docs/error-handling
   */
  onError({error}) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting
      console.error('Something went wrong', error)
    }
  },
  /**
   * Enable query batching
   */
  batching: {
    enabled: true,
  },
})
