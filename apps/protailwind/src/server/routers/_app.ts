import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {lessonResourcesRouter} from './resources'
import {tipResourcesRouter} from './tip-resources'
import {solutionsRouter} from './solutions'
import {abilities} from './abilities'

export const appRouter = mergeRouters(
  router({
    resources: lessonResourcesRouter,
    tipResources: tipResourcesRouter,
    solutions: solutionsRouter,
    abilities: abilities,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
