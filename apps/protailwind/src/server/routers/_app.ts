import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {lessonResourcesRouter} from './resources'
import {tipResourcesRouter} from './tip-resources'

export const appRouter = mergeRouters(
  router({
    resources: lessonResourcesRouter,
    tipResources: tipResourcesRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
