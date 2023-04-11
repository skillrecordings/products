import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {tipResourcesRouter} from './tip-resources'
import {moduleProgressRouter} from './module-progress'

export const appRouter = mergeRouters(
  router({
    tipResources: tipResourcesRouter,
    moduleProgress: moduleProgressRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
