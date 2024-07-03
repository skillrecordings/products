import {
  mergeRouters,
  router,
  skillLessonRouter,
} from '@skillrecordings/skill-lesson'
import {tipResourcesRouter} from './tip-resources'
import {lessonResourcesRouter} from './lesson-resources'
import {tipsRouter} from 'trpc/routers/tips'
import {abilitiesRouter} from 'trpc/routers/abilities'
import {moduleResourcesRouter} from './module-resources'
import {deviceVerificationRouter} from 'trpc/routers/device-verification'
import {searchRouter} from './search'
import {unsubscribeRouter} from 'trpc/routers/unsubscribe'
import {bonusesRouter} from 'trpc/routers/bonuses'
import {confRouter} from './conf'
import {epicProductsRouter} from './epic-products'
import {ctaRouter} from './cta'

export const appRouter = mergeRouters(
  router({
    tipResources: tipResourcesRouter,
    lessonResources: lessonResourcesRouter,
    moduleResources: moduleResourcesRouter,
    tips: tipsRouter,
    abilities: abilitiesRouter,
    deviceVerification: deviceVerificationRouter,
    search: searchRouter,
    unsubscribe: unsubscribeRouter,
    bonuses: bonusesRouter,
    conf: confRouter,
    epicProducts: epicProductsRouter,
    cta: ctaRouter,
  }),
  skillLessonRouter,
)

export type AppRouter = typeof appRouter
