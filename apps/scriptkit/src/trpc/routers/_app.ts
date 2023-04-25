import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {tipResourcesRouter} from './tip-resources'

export const appRouter = mergeRouters(
  router({
    tipResources: tipResourcesRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
