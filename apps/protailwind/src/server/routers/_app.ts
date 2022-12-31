import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {lessonResourcesRouter} from './resources'

export const appRouter = mergeRouters(
  router({
    resources: lessonResourcesRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
