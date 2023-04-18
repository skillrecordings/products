import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {tipResourcesRouter} from './tip-resources'
import {lessonResourcesRouter} from './lesson-resources'
// import {moduleProgressRouter} from './module-progress'
// import {purchasesRouter} from './purchases'

export const appRouter = mergeRouters(
  router({
    tipResources: tipResourcesRouter,
    lessonResources: lessonResourcesRouter,
    // moduleProgress: moduleProgressRouter,
    // purchases: purchasesRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
