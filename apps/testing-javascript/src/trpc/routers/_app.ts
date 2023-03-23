import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {abilitiesRouter} from './abilities'
import {resourcesRouter} from './resources'

export const appRouter = mergeRouters(
  router({
    abilities: abilitiesRouter,
    resources: resourcesRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
