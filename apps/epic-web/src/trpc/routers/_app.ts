import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {tipResourcesRouter} from './tip-resources'
import {moduleProgressRouter} from './module-progress'
import {purchasesRouter} from './purchases'

export const appRouter = mergeRouters(
  router({
    tipResources: tipResourcesRouter,
    moduleProgress: moduleProgressRouter,
    purchases: purchasesRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
