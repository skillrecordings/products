/**
 * This file contains the root router of your tRPC-backend
 */
import {progressRouter} from './progress'
import {convertkitRouter} from './convertkit'
import {router} from '../trpc.server'
import {videoResourceRouter} from './video-resource'
import {lessonsRouter} from './lessons'
import {modulesRouter} from './modules'
import {pricing} from './pricing'
import {purchaseUserTransferRouter} from './purchaseUserTransfer'
import {invoicesRouter} from './invoices'
import {moduleProgressRouter} from './module-progress'
import {purchasesRouter} from './purchases'
import {couponsRouter} from './coupons'
import {productsRouter} from './products'
import {usersRouter} from './users'
import {userRouter} from './user'

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const skillLessonRouter = router({
  progress: progressRouter,
  convertkit: convertkitRouter,
  videoResource: videoResourceRouter,
  lessons: lessonsRouter,
  modules: modulesRouter,
  pricing: pricing,
  purchaseUserTransfer: purchaseUserTransferRouter,
  invoices: invoicesRouter,
  moduleProgress: moduleProgressRouter,
  purchases: purchasesRouter,
  coupons: couponsRouter,
  products: productsRouter,
  users: usersRouter,
  user: userRouter,
})

export type SkillLessonRouter = typeof skillLessonRouter
