/**
 * This file contains the root router of your tRPC-backend
 */
import {progressRouter} from './progress'
import {convertkitRouter} from './convertkit'
import {workshop} from './workshop'
import {abilities} from './abilities'
import {pricing} from './pricing'
import {router} from '../trpc'
import {stackblitzResourceRouter} from './stackblitz-resource'
import {lessonsRouter} from './lessons'
import {soulutionsRouter} from './solutions'

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = router({
  progress: progressRouter,
  convertkit: convertkitRouter,
  workshops: workshop,
  abilities: abilities,
  pricing: pricing,
  stackblitz: stackblitzResourceRouter,
  lessons: lessonsRouter,
  solutions: soulutionsRouter,
})

export type AppRouter = typeof appRouter
