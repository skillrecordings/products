import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {abilitiesRouter} from './abilities'

export const appRouter = mergeRouters(
  router({
    abilities: abilitiesRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
