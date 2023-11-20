import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {abilitiesRouter} from './abilities'
import {productsRouter} from './products'
import {lessonsRouter} from './lessons'

export const appRouter = mergeRouters(
  router({
    abilities: abilitiesRouter,
    'testingJavascript.products': productsRouter,
    'testingJavascript.lessons': lessonsRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
