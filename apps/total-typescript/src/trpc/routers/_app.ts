import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {workshop} from './workshop'
import {abilities} from './abilities'
import {solutionsRouter} from './solutions'
import {stackblitzResourceRouter} from './stackblitz-resources'
import {searchRouter} from './search'
import {certificateRouter} from './certificate'
import {articlesRouter} from './articles'
import {userPrefsRouter} from './user-prefs'

export const appRouter = mergeRouters(
  router({
    workshops: workshop,
    abilities: abilities,
    solutions: solutionsRouter,
    stackblitz: stackblitzResourceRouter,
    search: searchRouter,
    certificate: certificateRouter,
    articles: articlesRouter,
    userPrefs: userPrefsRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
