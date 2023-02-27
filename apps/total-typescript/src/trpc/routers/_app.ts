import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {workshop} from './workshop'
import {abilities} from './abilities'
import {stackblitzResourceRouter} from './stackblitz-resource'
import {solutionsRouter} from './solutions'
import {moduleProgressRouter} from './module-progress'
import {purchasesRouter} from './purchases'
import {userRouter} from './user'
import {productsRouter} from './products'

export const appRouter = mergeRouters(
  router({
    workshops: workshop,
    abilities: abilities,
    stackblitz: stackblitzResourceRouter,
    solutions: solutionsRouter,
    moduleProgress: moduleProgressRouter,
    purchases: purchasesRouter,
    user: userRouter,
    products: productsRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
