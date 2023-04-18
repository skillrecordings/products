import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {workshop} from './workshop'
import {abilities} from './abilities'
import {solutionsRouter} from './solutions'
import {userRouter} from './user'
import {productsRouter} from './products'
import {stackblitzResourceRouter} from './stackblitz-resources'

export const appRouter = mergeRouters(
  router({
    workshops: workshop,
    abilities: abilities,
    solutions: solutionsRouter,
    user: userRouter,
    products: productsRouter,
    stackblitz: stackblitzResourceRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
