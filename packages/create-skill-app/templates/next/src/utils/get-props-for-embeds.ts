import React from 'react'
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextApiRequest,
  PreviewData,
} from 'next'
import {getSection} from '@/lib/sections'
import {getExercise} from '@/lib/exercises'
import {getCsrfToken, getProviders, signIn, useSession} from 'next-auth/react'

import {
  UserSchema,
  createAppAbility,
  defineRulesForPurchases,
} from '@skillrecordings/skill-lesson/utils/ability'
import {getToken} from 'next-auth/jwt'
import {getSubscriberFromCookie} from '@skillrecordings/skill-lesson/utils/ck-subscriber-from-cookie'
import {getProducts} from '@skillrecordings/skill-lesson/lib/products'
import {getVideoResource} from '@skillrecordings/skill-lesson/lib/video-resources'
import {getWorkshop} from '@/lib/workshops'
import {ParsedUrlQuery} from 'querystring'
import {getTutorial} from '@/lib/tutorials'
import {getTip} from '@/lib/tips'
import {Exercise} from '@skillrecordings/skill-lesson/schemas/exercise'
import {getBonus} from '@/lib/bonuses'

export const getPropsForEmbed = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
  resourceType: 'tutorial' | 'workshop' | 'tip' | 'bonus',
  isSolution?: boolean,
) => {
  // resource
  const {query} = context
  const {params} = context
  const lessonSlug = (params?.lesson || params?.tip) as string
  const sectionSlug = params?.section as string
  const moduleSlug = params?.module as string
  const module = await getModule(resourceType, moduleSlug)
  const section = await getSection(sectionSlug)
  const lesson =
    resourceType === 'tip'
      ? ((await getTip(lessonSlug)) as Exercise)
      : await getExercise(lessonSlug, false)
  // @ts-ignore
  const solution = lesson.solution || lesson
  const videoResourceId = isSolution
    ? solution.videoResourceId
    : lesson.videoResourceId

  // ability rules
  const country =
    (context.req.headers['x-vercel-ip-country'] as string) ||
    process.env.DEFAULT_COUNTRY ||
    'US'

  const token = await getToken({req: context.req})
  const convertkitSubscriber = await getSubscriberFromCookie(
    context.req as NextApiRequest,
  )

  let purchasedModules = []

  if (token) {
    const user = UserSchema.parse(token)
    const productsPurchased =
      user.purchases?.map((purchase) => purchase.productId) || []
    purchasedModules = await getProducts(productsPurchased)
  }

  const abilityRules = defineRulesForPurchases({
    ...(token && {user: UserSchema.parse(token)}),
    ...(convertkitSubscriber && {
      subscriber: convertkitSubscriber,
    }),
    country,
    module,
    lesson: isSolution ? solution : lesson,
    section,
    purchasedModules,
    isSolution: isSolution,
  })

  const ability = createAppAbility(abilityRules || [])

  // can show video
  const canShowVideo = ability.can('view', 'Content')

  // full video resource
  const videoResource =
    canShowVideo && videoResourceId && (await getVideoResource(videoResourceId))

  // login
  const providers = await getProviders()
  const csrfToken = await getCsrfToken(context)

  // theme
  const theme = query.theme || 'dark'

  return {
    module,
    section,
    lesson: isSolution ? lesson.solution : lesson,
    videoResourceId,
    videoResource,
    theme,
    login: {
      providers,
      csrfToken,
    },
    convertkitSubscriber,
    abilityRules,
  }
}

const getModule = async (
  type: 'tutorial' | 'workshop' | 'tip' | 'bonus',
  slug: string,
) => {
  switch (type) {
    case 'tutorial':
      return await getTutorial(slug)
    case 'workshop':
      return await getWorkshop(slug)
    case 'bonus':
      return await getBonus(slug)
    case 'tip':
      return {
        moduleType: 'tip',
        slug: {
          current: 'tips',
        },
      }
  }
}
