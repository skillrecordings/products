import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {tipResourcesRouter} from './tip-resources'
import {lessonResourcesRouter} from './lesson-resources'

export const appRouter = mergeRouters(
  router({
    tipResources: tipResourcesRouter,
    lessonResources: lessonResourcesRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
