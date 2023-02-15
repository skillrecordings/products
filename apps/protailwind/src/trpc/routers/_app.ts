import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {lessonResourcesRouter} from './resources'
import {tipResourcesRouter} from './tip-resources'
import {solutionsRouter} from './solutions'
import {exercisesRouter} from './exercises'
import {abilities} from './abilities'
import {moduleProgressRouter} from './module-progress'
import {purchasesRouter} from './purchases'

export const appRouter = mergeRouters(
  router({
    resources: lessonResourcesRouter,
    tipResources: tipResourcesRouter,
    solutions: solutionsRouter,
    exercises: exercisesRouter,
    abilities: abilities,
    moduleProgress: moduleProgressRouter,
    purchases: purchasesRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
