import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {tipResourcesRouter} from './tip-resources'
import {lessonResourcesRouter} from './lesson-resources'
import {tipsRouter} from './tips'
import {abilitiesRouter} from './abilities'
import {moduleResourcesRouter} from './module-resources'
import {searchRouter} from './search'
// import {unsubscribeRouter} from './unsubscribe'
// import {bonusesRouter} from './bonuses'

export const appRouter = mergeRouters(
  router({
    tipResources: tipResourcesRouter,
    lessonResources: lessonResourcesRouter,
    moduleResources: moduleResourcesRouter,
    tips: tipsRouter,
    abilities: abilitiesRouter,
    search: searchRouter,
    // unsubscribe: unsubscribeRouter,
    // bonuses: bonusesRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
