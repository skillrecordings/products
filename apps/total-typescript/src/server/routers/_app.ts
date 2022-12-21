/**
 * This file contains the root router of your tRPC-backend
 */
import {createRouter} from '../createRouter'
import superjson from 'superjson'
import {progressRouter} from './progress'
import {convertkitRouter} from './convertkit'
import {workshop} from './workshop'
import {abilities} from './abilities'
import {pricing} from './pricing'

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
  .merge('convertkit.', convertkitRouter)
  .merge('workshops.', workshop)
  .merge('abilities.', abilities)
  .merge('pricing.', pricing)
export type AppRouter = typeof appRouter
