import {convertkitRouter} from './convertkit'
import {t} from '../trpc'
import {progressRouter} from './progress'

const mainRouter = t.router({
  convertkit: convertkitRouter,
  progress: progressRouter,
})

export const appRouter = t.mergeRouters(mainRouter)

export type AppRouter = typeof appRouter
