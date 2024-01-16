import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {lessonResourcesRouter} from './lesson-resources'
import {abilitiesRouter} from './abilities'
import {moduleResourcesRouter} from './module-resources'
import {searchRouter} from './search'
// import {unsubscribeRouter} from './unsubscribe'
// import {bonusesRouter} from './bonuses'

export const appRouter = mergeRouters(
  router({
    lessonResources: lessonResourcesRouter,
    moduleResources: moduleResourcesRouter,
    abilities: abilitiesRouter,
    search: searchRouter,
    // unsubscribe: unsubscribeRouter,
    // bonuses: bonusesRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
