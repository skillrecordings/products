import {getToken} from 'next-auth/jwt'
import {getLesson} from '../lib/lesson-resource'
import {getModule} from '../lib/modules'
import {getSection} from '../lib/sections'
import {NextApiRequest} from 'next'
import {getSubscriberFromCookie} from './ck-subscriber-from-cookie'
import {UserSchema, createAppAbility, defineRulesForPurchases} from './ability'
import {getModuleProducts, getProducts} from '../lib/products'

export async function defineAbilityRulesForResource({
  req,
  moduleSlug,
  sectionSlug,
  lessonSlug,
  isSolution,
}: {
  req: NextApiRequest
  moduleSlug?: string | null
  sectionSlug?: string
  lessonSlug?: string
  isSolution?: boolean
}) {
  const module = moduleSlug ? await getModule(moduleSlug) : undefined
  const section = sectionSlug ? await getSection(sectionSlug) : undefined
  const lesson = lessonSlug ? await getLesson(lessonSlug) : undefined

  // ability rules
  const country =
    (req.headers['x-vercel-ip-country'] as string) ||
    process.env.DEFAULT_COUNTRY ||
    'US'

  const token = await getToken({req})
  const convertkitSubscriber = await getSubscriberFromCookie(req)

  let purchasedModules = []

  if (token) {
    const user = UserSchema.parse(token)
    const productsPurchased =
      user.purchases?.map((purchase) => purchase.productId) || []
    const products = await getProducts(productsPurchased)
    const moduleProducts = await getModuleProducts(productsPurchased)
    purchasedModules.push(...products, ...moduleProducts)
  }

  const abilityRules = defineRulesForPurchases({
    ...(token && {user: UserSchema.parse(token)}),
    ...(convertkitSubscriber && {
      subscriber: convertkitSubscriber,
    }),
    country,
    module,
    lesson,
    section,
    purchasedModules,
    isSolution: isSolution || lesson?._type === 'solution',
  })

  return abilityRules
}
