import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {lessonResourcesRouter} from './resources'
import {tipResourcesRouter} from './tip-resources'
import {solutionsRouter} from './solutions'
import {exercisesRouter} from './exercises'

export const appRouter = mergeRouters(
  router({
    resources: lessonResourcesRouter,
    tipResources: tipResourcesRouter,
    solutions: solutionsRouter,
    exercises: exercisesRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
