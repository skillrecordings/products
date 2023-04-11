import React from 'react'
import {SanityDocument} from '@sanity/client'
import {SubscribeToConvertkitForm} from '@skillrecordings/convertkit-react-ui'
import {Facebook, LinkedIn, Twitter} from '@skillrecordings/react'
import {NextRouter, useRouter} from 'next/router'
import ReactMarkdown from 'react-markdown'
import snakeCase from 'lodash/snakeCase'
import Image from 'next/image'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {CodeIcon, XIcon} from '@heroicons/react/solid'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {setUserId} from '@amplitude/analytics-browser'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {PortableText} from '@portabletext/react'
import {trpc} from '../../trpc/trpc.client'
import Link from 'next/link'
import first from 'lodash/first'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import {useQuery} from '@tanstack/react-query'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {
  confirmSubscriptionToast,
  useConvertkit,
} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import {Exercise} from '@skillrecordings/skill-lesson/schemas/exercise'
import {handlePlayFromBeginning} from '@skillrecordings/skill-lesson/utils/handle-play-from-beginning'
import SelfRedeemButton from 'team/self-redeem-button'
import {useSession} from 'next-auth/react'
import Balancer from 'react-wrap-balancer'
import {Pricing} from 'path-to-purchase-react/pricing'
import {usePriceCheck} from 'path-to-purchase-react/pricing-check-context'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import pluralize from 'pluralize'

const OverlayWrapper: React.FC<
  React.PropsWithChildren<{dismissable?: boolean}>
> = ({children, dismissable = true, ...props}) => {
  const {setDisplayOverlay} = useMuxPlayer()
  const {lesson, module} = useLesson()

  return (
    <div data-video-overlay-wrapper="" id="video-overlay">
      {dismissable && (
        <button
          data-dismiss=""
          onClick={() => {
            track('dismissed video overlay', {
              lesson: lesson.slug,
              module: module.slug.current,
              moduleType: module.moduleType,
              lessonType: lesson._type,
            })
            setDisplayOverlay(false)
          }}
        >
          Dismiss <XIcon aria-hidden="true" />
        </button>
      )}
      <div data-content="" {...props}>
        {children}
      </div>
    </div>
  )
}

const DefaultOverlay = () => {
  const {nextExercise, path, handlePlay} = useMuxPlayer()
  const {lesson, module, section} = useLesson()
  const router = useRouter()
  const {image} = module
  const addProgressMutation = trpc.progress.add.useMutation()

  return (
    <OverlayWrapper data-video-overlay="default">
      {image && (
        <Image
          data-image=""
          src={image}
          alt=""
          aria-hidden="true"
          width={220}
          height={220}
        />
      )}

      <p data-title="">
        <span data-byline="">Up next:</span> {nextExercise?.title}
      </p>
      <div data-actions="">
        <button
          data-action="replay"
          onClick={() => {
            track('clicked replay', {
              lesson: lesson.slug,
              module: module.slug.current,
              location: 'exercise',
              moduleType: module.moduleType,
              lessonType: lesson._type,
            })
            handlePlay()
          }}
        >
          <span data-icon="" aria-hidden="true">
            ↺
          </span>{' '}
          Replay
        </button>
        {/* TODO: Determine if we really need to check for resource such as stackblitz */}
        {/* {stackblitz && ( */}
        <Link
          data-action="try-again"
          href={router.asPath.replace('solution', 'exercise')}
        >
          <CodeIcon data-icon="" aria-hidden="true" />
          Try Again
        </Link>
        {/* )} */}
        <button
          data-action="continue"
          onClick={() => {
            track('clicked complete', {
              lesson: router.query.lesson as string,
              module: module.slug.current,
              location: 'exercise',
              moduleType: module.moduleType,
              lessonType: lesson._type,
            })
            addProgressMutation.mutate(
              {lessonSlug: router.query.lesson as string},
              {
                onSettled: (data, error, variables, context) => {
                  handleContinue({
                    router,
                    module,
                    nextExercise,
                    handlePlay,
                    path,
                    section,
                  })
                },
              },
            )
          }}
        >
          Complete & Continue{' '}
          <span aria-hidden="true" data-icon="">
            →
          </span>
        </button>
      </div>
    </OverlayWrapper>
  )
}

const FinishedOverlay = () => {
  const {path, handlePlay} = useMuxPlayer()
  const {module, section} = useLesson()

  const router = useRouter()
  const shareUrl = `${process.env.NEXT_PUBLIC_URL}${path}/${module.slug.current}`
  const shareMessage = `${module.title} ${module.moduleType} by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER}`
  const shareButtonStyles =
    'bg-gray-800 flex items-center gap-2 rounded px-3 py-2 hover:bg-gray-700'

  return (
    <OverlayWrapper data-video-overlay="finished">
      <p data-title="">Share this {module.moduleType} with your friends</p>
      <div data-share-actions="">
        <Twitter link={shareUrl} message={shareMessage} data-action="share">
          Twitter
        </Twitter>
        <Facebook link={shareUrl} message={shareMessage} data-action="share">
          Facebook
        </Facebook>
        <LinkedIn link={shareUrl} message={shareMessage} data-action="share">
          LinkedIn
        </LinkedIn>
      </div>
      <div data-actions="">
        <button data-action="replay" onClick={handlePlay}>
          Replay <span aria-hidden="true">↺</span>
        </button>
        <button
          data-action="restart"
          onClick={() =>
            handlePlayFromBeginning({
              router,
              module,
              section,
              path,
              handlePlay,
            })
          }
        >
          Play from beginning
        </button>
      </div>
    </OverlayWrapper>
  )
}

const BlockedOverlay: React.FC<{product: SanityProduct}> = ({product}) => {
  const {lesson, module} = useLesson()
  const {refetch: refetchSubscriber} = useConvertkit()
  const {videoResourceId} = useVideoResource()
  const thumbnail = `${getBaseUrl()}/api/video-thumb?videoResourceId=${videoResourceId}`
  const {refetchAbility, ability} = useMuxPlayer()
  const {data: ctaText} = useQuery(
    [`exercise-free-tutorial`, lesson.slug, module.slug.current],
    async () => {
      return sanityClient
        .fetch(
          `
      *[_type == 'cta' && slug.current == "${
        module.moduleType === 'tutorial' ? 'free-tutorial' : 'paid-workshop'
      }"][0]{
        body
      }
    `,
        )
        .then((response: SanityDocument) => response.body)
    },
  )

  const handleOnSuccess = async (subscriber: any, email?: string) => {
    if (subscriber) {
      email && setUserId(email)
      refetchSubscriber()
      track('subscribed to email list', {
        lesson: lesson.slug,
        module: module.slug.current,
        location: 'exercise',
        moduleType: module.moduleType,
        lessonType: lesson._type,
      })
      confirmSubscriptionToast()
    }
  }

  const startedLearningField = {
    // ex: started_zod_tutorial: 2022-09-02
    [`started_${snakeCase(module.title)}_${module.moduleType}`.toLowerCase()]:
      new Date().toISOString().slice(0, 10),
  }
  const {data: session} = useSession()
  const canViewTeam = ability.can('view', 'Team')
  const canViewRegionRestriction = ability.can('view', 'RegionRestriction')
  // const {data: purchaseDetails} = trpc.purchases.getLastPurchase.useQuery()
  const {data: purchaseDetails} =
    trpc.purchases.getPurchaseByProductId.useQuery({
      productId: product?.productId,
    })
  const productImage = product?.image?.url || product?.image || module?.image
  const workshops =
    product.modules &&
    product.modules.filter(({moduleType}) => moduleType === 'workshop')
  const bonuses =
    product.modules &&
    product.modules.filter(({moduleType}) => moduleType === 'bonus')
  const {merchantCoupon} = usePriceCheck()
  const showBonuses = bonuses && !Boolean(merchantCoupon)

  return product ? (
    <div data-video-overlay="blocked" id="video-overlay">
      <Image
        data-thumbnail=""
        src={thumbnail}
        fill
        alt=""
        aria-hidden="true"
        priority
      />
      {module.moduleType === 'tutorial' ? (
        <>
          <div data-subscribe="">
            <div data-col="1">
              {module.image && (
                <Image
                  data-image=""
                  src={module.image}
                  width={190}
                  height={190}
                  alt={module.title}
                />
              )}
              <h2 data-title="">Level up with {module.title}</h2>
              <h3 data-subtitle="">
                Access all lessons in this {module.moduleType}.
              </h3>
              <SubscribeToConvertkitForm
                successMessage="Thanks! You're being redirected..."
                subscribeApiURL={
                  process.env.NEXT_PUBLIC_CONVERTKIT_SUBSCRIBE_URL
                }
                actionLabel="Continue Watching"
                fields={startedLearningField}
                onSuccess={(subscriber, email) => {
                  return handleOnSuccess(subscriber, email)
                }}
              />
              <p data-nospam="">No spam, unsubscribe at any time.</p>
            </div>
          </div>
          <div data-col="2">
            <div data-markdown="">
              <h3 data-title="">This is a free tutorial.</h3>
              {ctaText && <PortableText value={ctaText} />}
            </div>
          </div>
        </>
      ) : (
        <>
          <div data-buy="">
            {canViewTeam ? (
              <div data-team-purchase="">
                {module.image && (
                  <Image
                    data-image=""
                    src={module.image}
                    width={220}
                    height={220}
                    alt={module.title}
                  />
                )}
                <h2 data-title="">Level up your {module.title}</h2>
                <h3 data-subtitle="">
                  <Balancer>
                    You've purchased a team license with{' '}
                    {purchaseDetails?.purchase?.bulkCoupon?.maxUses} seats and
                    haven't claimed a seat for yourself yet.
                  </Balancer>
                </h3>
                {purchaseDetails?.purchase?.bulkCoupon?.id &&
                  !purchaseDetails?.existingPurchase && (
                    <SelfRedeemButton
                      disabled={Boolean(purchaseDetails?.existingPurchase)}
                      userEmail={session?.user?.email}
                      bulkCouponId={purchaseDetails?.purchase?.bulkCoupon?.id}
                      onSuccess={(redeemedPurchase) => {
                        if (redeemedPurchase) {
                          refetchAbility()
                        }
                      }}
                    >
                      Claim one seat for yourself and start learning
                    </SelfRedeemButton>
                  )}
                <Link href="/team" data-invite-team="">
                  Invite your team
                </Link>
              </div>
            ) : (
              <div data-pricing="">
                <div data-col="1">
                  {productImage && (
                    <Image
                      data-image=""
                      src={productImage as string}
                      width={200}
                      height={200}
                      alt=""
                      aria-hidden="true"
                    />
                  )}
                  {canViewRegionRestriction ? (
                    <h2 data-title="">Your License is Region Restricted</h2>
                  ) : (
                    <h2 data-title="">Level up your {module.title}</h2>
                  )}
                  <h3 data-description="">
                    <Balancer>
                      {canViewRegionRestriction ? (
                        <div data-markdown="">
                          Your license is restricted to a specific region. You
                          can upgrade to an unrestricted license to view this
                          lesson anywhere.
                        </div>
                      ) : product.description ? (
                        <ReactMarkdown data-markdown="">
                          {product.description}
                        </ReactMarkdown>
                      ) : (
                        'Get access to all lessons in this workshop.'
                      )}
                    </Balancer>
                  </h3>
                  {workshops && (
                    <>
                      <div data-includes="">
                        Includes all {workshops.length} workshops
                        {showBonuses ? (
                          <span data-bonus="">
                            {' '}
                            + {bonuses.length > 1 ? bonuses.length : ''}{' '}
                            {pluralize('bonus', bonuses.length)}:
                          </span>
                        ) : (
                          ':'
                        )}
                      </div>
                      <div data-modules="">
                        {workshops.map((module) => {
                          return (
                            <Link
                              data-type={module.moduleType}
                              href={`/workshops/${module.slug}`}
                              target="_blank"
                            >
                              <Image
                                src={module.image.url}
                                alt={`${module.title} workshop`}
                                width={60}
                                height={60}
                              />
                            </Link>
                          )
                        })}
                        {showBonuses && (
                          <>
                            <span>+</span>
                            {bonuses.map((module) => {
                              return (
                                <Link
                                  data-type={module.moduleType}
                                  href={`/bonuses/${module.slug}`}
                                  target="_blank"
                                >
                                  <Image
                                    src={module.image.url}
                                    alt={`${module.title} workshop`}
                                    width={60}
                                    height={60}
                                  />
                                </Link>
                              )
                            })}
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div data-col="2">
                  {product && (
                    <Pricing
                      product={product}
                      canViewRegionRestriction={canViewRegionRestriction}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  ) : (
    <LoadingOverlay />
  )
}

type LoadingOverlayProps = {
  loadingIndicator?: React.ReactElement
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loadingIndicator = null,
}) => {
  const {videoResourceId} = useVideoResource()
  const thumbnail = `${getBaseUrl()}/api/video-thumb?videoResourceId=${videoResourceId}`

  return (
    <OverlayWrapper data-video-overlay="loading" dismissable={false}>
      <div>
        <>
          {videoResourceId && (
            <Image
              data-image=""
              src={thumbnail}
              fill
              alt=""
              aria-hidden="true"
            />
          )}
          {loadingIndicator}
        </>
      </div>
    </OverlayWrapper>
  )
}

const FinishedSectionOverlay = () => {
  const {nextSection, path, handlePlay} = useMuxPlayer()
  const {lesson, module} = useLesson()
  const {image} = module
  const addProgressMutation = trpc.progress.add.useMutation()
  const nextExercise = first(nextSection?.lessons) as Lesson
  const router = useRouter()

  return (
    <OverlayWrapper data-video-overlay="finished-section">
      {image && (
        <Image
          data-image=""
          src={image}
          alt=""
          aria-hidden="true"
          width={220}
          height={220}
        />
      )}
      {nextSection && (
        <p data-title="">
          <span>Up next:</span> {nextSection.title}
        </p>
      )}
      <div data-actions="">
        <button
          data-action="replay"
          onClick={() => {
            track('clicked replay', {
              lesson: lesson.slug,
              module: module.slug.current,
              location: 'exercise',
              moduleType: module.moduleType,
              lessonType: lesson._type,
            })
            handlePlay()
          }}
        >
          <span aria-hidden="true">↺</span> Replay
        </button>
        {/* TODO: Determine if we really need to check for resource such as stackblitz */}
        {/* {stackblitz && ( */}
        <Link
          data-action="restart"
          href={router.asPath.replace('solution', 'exercise')}
        >
          Try Again
          <CodeIcon data-icon="" aria-hidden="true" />
        </Link>
        {/* )} */}
        <button
          data-action="continue"
          onClick={() => {
            track('clicked complete', {
              lesson: lesson.slug,
              module: module.slug.current,
              location: 'exercise',
              moduleType: module.moduleType,
              lessonType: lesson._type,
            })
            addProgressMutation.mutate(
              {lessonSlug: router.query.lesson as string},
              {
                onSettled: (data, error, variables, context) => {
                  handleContinue({
                    router,
                    module,
                    nextExercise,
                    handlePlay,
                    path,
                    section: nextSection,
                  })
                },
              },
            )
          }}
        >
          Complete & Continue{' '}
          <span data-icon="" aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </OverlayWrapper>
  )
}

export {
  DefaultOverlay,
  FinishedOverlay,
  FinishedSectionOverlay,
  BlockedOverlay,
  LoadingOverlay,
  OverlayWrapper,
}

export const handleContinue = async ({
  router,
  module,
  section,
  nextExercise,
  handlePlay,
  path,
}: {
  router: NextRouter
  module: Module
  section?: Section | null
  nextExercise?: Lesson | null
  handlePlay: () => void
  path: string
}) => {
  if (nextExercise?._type === 'solution') {
    if (section) {
      const exercise =
        section.lessons &&
        section.lessons.find((exercise: Exercise) => {
          const solution = exercise.solution
          return solution?._key === nextExercise._key
        })

      return (
        exercise &&
        (await router
          .push({
            query: {
              module: module.slug.current,
              section: section.slug,
              lesson: exercise.slug,
            },

            pathname: `${path}/[module]/[section]/[lesson]/solution`,
          })
          .then(() => handlePlay()))
      )
    } else {
      const exercise =
        module.lessons &&
        module.lessons.find((exercise: Exercise) => {
          const solution = exercise.solution
          return solution?._key === nextExercise._key
        })

      return (
        exercise &&
        (await router
          .push({
            query: {
              module: module.slug.current,
              lesson: exercise.slug,
            },

            pathname: `${path}/[module]/[lesson]/solution`,
          })
          .then(() => handlePlay()))
      )
    }
  }
  if (section) {
    return await router
      .push({
        query: {
          module: module.slug.current,
          section: section.slug,
          lesson: nextExercise?.slug,
        },
        pathname: `${path}/[module]/[section]/[lesson]`,
      })
      .then(() => handlePlay())
  } else {
    return await router
      .push({
        query: {module: module.slug.current, lesson: nextExercise?.slug},
        pathname: `${path}/[module]/[lesson]`,
      })
      .then(() => handlePlay())
  }
}
