/**
 * This file contains the root router of your tRPC-backend
 */
import {createRouter} from '../createRouter'
import superjson from 'superjson'
import {progressRouter} from './progress'

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = createRouter()
  /**
   * Add data transformers
   * @link https://trpc.io/docs/data-transformers
   */
  .transformer(superjson)
  /**
   * Optionally do custom error (type safe!) formatting
   * @link https://trpc.io/docs/error-formatting
   */
  .merge('progress.', progressRouter)
  // .formatError(({ shape, error }) => { })
  .query('healthz', {
    resolve() {
      return 'yay!'
    },
  })

export type AppRouter = typeof appRouter
