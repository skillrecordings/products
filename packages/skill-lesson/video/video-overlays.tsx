import * as React from 'react'
import {type SanityDocument} from '@sanity/client'
import {motion} from 'framer-motion'
import {SubscribeToConvertkitForm} from '@skillrecordings/convertkit-react-ui'
import {Facebook, LinkedIn, Twitter} from '@skillrecordings/react'
import {useRouter} from 'next/router'
import ReactMarkdown from 'react-markdown'
import snakeCase from 'lodash/snakeCase'
import Image from 'next/image'
import {useMuxPlayer} from '../hooks/use-mux-player'
import {CodeIcon, XIcon, CheckCircleIcon} from '@heroicons/react/solid'
import {track} from '../utils/analytics'
import {setUserId} from '@amplitude/analytics-browser'
import {sanityClient} from '../utils/sanity-client'
import {PortableText} from '@portabletext/react'
import {trpcSkillLessons} from '../utils/trpc-skill-lessons'
import Link from 'next/link'
import first from 'lodash/first'
import {useLesson} from '../hooks/use-lesson'
import {useVideoResource} from '../hooks/use-video-resource'
import {getBaseUrl} from '../utils/get-base-url'
import {useQuery} from '@tanstack/react-query'
import {type Lesson} from '../schemas/lesson'
import {confirmSubscriptionToast, useConvertkit} from '../hooks/use-convertkit'
import SelfRedeemButton from '../team/self-redeem-button'
import {useSession} from 'next-auth/react'
import Balancer from 'react-wrap-balancer'
import {Pricing} from '../path-to-purchase/pricing'
import {usePriceCheck} from '../path-to-purchase/pricing-check-context'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import pluralize from 'pluralize'
import {portableTextComponents} from '../portable-text'
import Spinner from '../spinner'
import {isNextSectionEmpty} from '../utils/get-next-section'
import {type ModuleProgress, useModuleProgress} from './module-progress'
import * as ProgressBar from '@radix-ui/react-progress'

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

const ModuleCtaProvider: React.FC<React.PropsWithChildren<any>> = ({
  children,
}) => {
  const {module, lesson} = useLesson()
  const {subscriber, loadingSubscriber} = useConvertkit()
  const {cta: moduleCta} = module
  const emailIsNotRequiredToWatch =
    process.env.NEXT_PUBLIC_TUTORIALS_EMAIL_NOT_REQUIRED === 'true'
  const expiresAt = moduleCta?.expiresAt && new Date(moduleCta.expiresAt)
  const {data: softBlockCta, status: softBlockCtaStatus} = useQuery(
    [`exercise-free-tutorial`, lesson.slug, module.slug.current],
    async () => {
      return sanityClient
        .fetch(
          `
      *[_type == 'cta' && slug.current == "subscribe"][0]{
        body
      }
    `,
        )
        .then((response: SanityDocument) => response.body)
    },
    {
      enabled: emailIsNotRequiredToWatch,
    },
  )

  if (!moduleCta && !emailIsNotRequiredToWatch) {
    return children
  }

  if (expiresAt && expiresAt < new Date() && !emailIsNotRequiredToWatch) {
    return children
  }

  return (
    <div data-video-overlay-with-cta="">
      <div data-content="">{children}</div>
      {emailIsNotRequiredToWatch && !loadingSubscriber && !subscriber?.id ? (
        <div data-cta="">
          {softBlockCtaStatus === 'loading' && <Spinner />}
          {softBlockCta ? (
            <>
              {typeof softBlockCta === 'string' ? (
                <ReactMarkdown>{softBlockCta}</ReactMarkdown>
              ) : (
                <PortableText
                  value={softBlockCta}
                  components={portableTextComponents({
                    loadingIndicator: <Spinner />,
                  })}
                />
              )}
            </>
          ) : (
            <p>
              <Balancer>
                Be the first to know when the next course is released.
              </Balancer>
            </p>
          )}
          <Subscribe actionLabel="Subscribe" />
        </div>
      ) : moduleCta?.body ? (
        <div data-cta="">
          {typeof moduleCta.body === 'string' ? (
            <ReactMarkdown>{moduleCta.body}</ReactMarkdown>
          ) : (
            <PortableText
              value={moduleCta.body}
              components={portableTextComponents({
                loadingIndicator: <Spinner />,
              })}
            />
          )}
        </div>
      ) : null}
    </div>
  )
}

export const CompleteAndContinueButton = React.forwardRef<
  HTMLButtonElement,
  {
    setCompletedLessonCount: React.Dispatch<React.SetStateAction<number>>
    nextSection?: any
    nextExercise?: any
  }
>(({setCompletedLessonCount, nextSection, nextExercise}, ref) => {
  const addProgressMutation = trpcSkillLessons.progress.add.useMutation()
  const {
    nextExercise: nextExerciseInSection,
    path,
    handlePlay,
    handleContinue,
    nextPathBuilder,
  } = useMuxPlayer()
  const {lesson, module, section} = useLesson()
  const router = useRouter()
  const moduleProgress = useModuleProgress()
  const isLessonCompleted = moduleProgress?.lessons.find(
    (l) => l.slug === lesson.slug && l.lessonCompleted,
  )

  return (
    <button
      ref={ref}
      onMouseOver={() => {
        !isLessonCompleted && setCompletedLessonCount((prev) => prev + 1)
      }}
      onMouseOut={() => {
        !isLessonCompleted && setCompletedLessonCount((prev) => prev - 1)
      }}
      data-action="continue"
      disabled={addProgressMutation.isLoading || addProgressMutation.isSuccess}
      onClick={() => {
        !isLessonCompleted && setCompletedLessonCount((prev) => prev - 1)
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
                nextExercise: nextExercise
                  ? nextExercise
                  : nextExerciseInSection,
                handlePlay,
                path,
                section: nextSection ? nextSection : section,
                nextPathBuilder,
              })
            },
          },
        )
      }}
    >
      {addProgressMutation.isLoading || addProgressMutation.isSuccess ? (
        <Spinner className="w-7 h-7 inline-block" />
      ) : (
        <span>
          {isLessonCompleted ? 'Continue →' : 'Complete & Continue →'}
        </span>
      )}
    </button>
  )
})

const DefaultOverlay: React.FC = () => {
  const {nextExercise, handlePlay, setDisplayOverlay} = useMuxPlayer()
  const {lesson, module} = useLesson()
  const router = useRouter()
  const {image} = module

  const moduleProgress = useModuleProgress()

  const [completedLessonCount, setCompletedLessonCount] =
    React.useState<number>(0)

  React.useEffect(() => {
    setCompletedLessonCount(moduleProgress?.completedLessonCount || 0)
  }, [moduleProgress])

  const session = useSession()

  return (
    <OverlayWrapper data-video-overlay="default">
      <ModuleCtaProvider>
        {image && (
          <Image
            data-image=""
            src={image}
            alt=""
            aria-hidden="true"
            width={220}
            height={220}
            priority
          />
        )}
        <p data-title="">
          <Balancer>
            <span data-byline="">Up next:</span> {nextExercise?.title}
          </Balancer>
        </p>
        {moduleProgress && session.status === 'authenticated' && (
          <div data-progress="">
            <ProgressBar.Root
              data-progress-bar=""
              max={moduleProgress?.lessonCount}
            >
              <ProgressBar.Indicator
                data-indicator={moduleProgress?.percentComplete}
                style={{
                  transform: `translateX(-${
                    ((moduleProgress?.lessonCount -
                      (completedLessonCount || 0)) /
                      moduleProgress?.lessonCount) *
                    100
                  }%)`,
                }}
              />
            </ProgressBar.Root>
            <div data-lessons-completed="">
              {completedLessonCount} / {moduleProgress?.lessonCount} lessons
              completed
            </div>
          </div>
        )}
        <div data-actions="">
          <CompleteAndContinueButton
            setCompletedLessonCount={setCompletedLessonCount}
          />
          <div>
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
                setDisplayOverlay(false)
                handlePlay()
              }}
            >
              <span data-icon="" aria-hidden="true">
                ↺
              </span>{' '}
              Replay Video
            </button>
            {lesson._type === 'solution' && (
              <Link
                data-action="try-again"
                href={router.asPath.replace('solution', 'exercise')}
              >
                <CodeIcon data-icon="" aria-hidden="true" />
                Back to Exercise
              </Link>
            )}
          </div>
        </div>
        {session.status === 'unauthenticated' && (
          <div data-login>
            <Link href="/login">Log in</Link> to track your progress.
          </div>
        )}
      </ModuleCtaProvider>
    </OverlayWrapper>
  )
}

const FinishedOverlay = () => {
  const {path, handlePlay, handlePlayFromBeginning} = useMuxPlayer()
  const {module, section, lesson} = useLesson()
  const router = useRouter()
  const addProgressMutation = trpcSkillLessons.progress.add.useMutation()

  const shareUrl = `${process.env.NEXT_PUBLIC_URL}${path}/${module.slug.current}`
  const shareMessage = `${module.title} ${module.moduleType} by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER}`
  const shareButtonStyles =
    'bg-gray-800 flex items-center gap-2 rounded px-3 py-2 hover:bg-gray-700'
  const isNextSectionWIP = isNextSectionEmpty({
    module,
    currentSection: section,
  })
  const moduleProgress = useModuleProgress()
  const session = useSession()
  const moduleCompleted = moduleProgress?.moduleCompleted
  return (
    <OverlayWrapper data-video-overlay="finished">
      <ModuleCtaProvider>
        <h2>
          <span>{moduleCompleted ? 'Congratulations!' : ''}</span>{' '}
          <Balancer>
            {isNextSectionWIP
              ? `You've finished all currently available lessons in this workshop. We'll keep you posted when next section is released!`
              : moduleCompleted
              ? `You've finished "${module.title}" ${module.moduleType}.`
              : `This was the last lesson from "${module.title}" ${module.moduleType}. You can continue watching other lessons.`}
          </Balancer>
        </h2>
        {moduleProgress && session.status === 'authenticated' && (
          <div data-progress="">
            <ProgressBar.Root
              data-progress-bar=""
              max={moduleProgress?.lessonCount}
            >
              <ProgressBar.Indicator
                data-indicator={moduleProgress?.percentComplete}
                style={{
                  transform: `translateX(-${
                    ((moduleProgress?.lessonCount -
                      (moduleProgress.completedLessonCount || 0)) /
                      moduleProgress?.lessonCount) *
                    100
                  }%)`,
                }}
              />
            </ProgressBar.Root>
            <div data-lessons-completed="">
              {moduleProgress.completedLessonCount} /{' '}
              {moduleProgress?.lessonCount} lessons completed
            </div>
          </div>
        )}
        <p data-title="">Share with your friends</p>
        <div data-share-actions="">
          <Twitter link={shareUrl} message={shareMessage} data-action="share">
            Twitter
          </Twitter>
          {/* <Facebook link={shareUrl} message={shareMessage} data-action="share">
            Facebook
          </Facebook> */}
          <LinkedIn link={shareUrl} message={shareMessage} data-action="share">
            LinkedIn
          </LinkedIn>
        </div>
        <div data-actions="">
          <button
            data-action="restart"
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
                    handlePlayFromBeginning({
                      router,
                      module,
                      section,
                      path,
                      handlePlay,
                    })
                  },
                },
              )
            }}
          >
            Play from beginning
          </button>
          <button data-action="replay" onClick={handlePlay}>
            <span aria-hidden="true">↺</span> Replay
          </button>
        </div>
      </ModuleCtaProvider>
    </OverlayWrapper>
  )
}

const BlockedOverlay: React.FC<{
  product?: SanityProduct
}> = ({product}) => {
  const {lesson, module} = useLesson()
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
    {
      enabled: module.moduleType === 'tutorial',
    },
  )

  const canViewTeam = ability.can('view', 'Team')

  return (
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
              {module?.image && (
                <Image
                  data-image=""
                  src={module.image}
                  width={190}
                  height={190}
                  alt={module.title}
                />
              )}
              <h2 data-title="">
                <Balancer>Level up with "{module.title}"</Balancer>
              </h2>
              <h3 data-subtitle="">
                Access all lessons in this {module.moduleType}.
              </h3>
              <Subscribe />
              <p data-nospam="">No spam, unsubscribe at any time.</p>
            </div>
          </div>
          <div data-col="2">
            <div data-markdown="">
              <h3 data-title="">This is a free tutorial</h3>
              {ctaText && <PortableText value={ctaText} />}
            </div>
          </div>
        </>
      ) : product ? (
        <div data-buy="">
          {canViewTeam ? (
            <InviteTeam product={product} />
          ) : (
            <BuyProduct product={product} />
          )}
        </div>
      ) : null}
    </div>
  )
}

const BuyProduct: React.FC<{product?: SanityProduct}> = ({product}) => {
  const {ability} = useMuxPlayer()
  const {module} = useLesson()
  const productImage = product?.image?.url || product?.image || module?.image
  const canViewRegionRestriction = ability.can('view', 'RegionRestriction')
  const workshops =
    product?.modules &&
    product.modules.filter(({moduleType}) => moduleType === 'workshop')
  const bonuses =
    product?.modules &&
    product.modules.filter(({moduleType}) => moduleType === 'bonus')

  const {merchantCoupon} = usePriceCheck()
  const showBonuses = bonuses?.length && !Boolean(merchantCoupon)

  if (!product) return null

  return (
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
        <h2 data-title="">
          <Balancer>
            {canViewRegionRestriction
              ? 'Your License is Region Restricted'
              : `Level up your ${module.title}`}
          </Balancer>
        </h2>

        <h3 data-description="">
          <Balancer>
            {canViewRegionRestriction ? (
              'Your license is restricted to a specific region. You can upgrade to an unrestricted license to view this lesson anywhere.'
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
              Includes {workshops.length > 1 && 'all'} {workshops.length}{' '}
              {pluralize('workshop', workshops.length)}
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
                    key={module.slug}
                    data-type={module.moduleType}
                    href={`/workshops/${module.slug}`}
                    target="_blank"
                  >
                    {module?.image?.url || module?.image ? (
                      <Image
                        src={module.image?.url ?? module.image}
                        alt={`${module.title} workshop`}
                        width={60}
                        height={60}
                      />
                    ) : (
                      module.title
                    )}
                  </Link>
                )
              })}
              {showBonuses ? (
                <>
                  <span>+</span>
                  {bonuses.map((module) => {
                    return (
                      <Link
                        key={module.slug}
                        data-type={module.moduleType}
                        href={`/bonuses/${module.slug}`}
                        target="_blank"
                      >
                        <Image
                          src={module.image?.url ?? module.image}
                          alt={`${module.title} workshop`}
                          width={60}
                          height={60}
                        />
                      </Link>
                    )
                  })}
                </>
              ) : null}
            </div>
          </>
        )}
      </div>
      <div data-col="2">
        {product && (
          <Pricing
            allowPurchase={product.state === 'active'}
            product={product}
            canViewRegionRestriction={canViewRegionRestriction}
            cancelUrl={window.location.toString()}
          />
        )}
      </div>
    </div>
  )
}

const InviteTeam: React.FC<{
  product?: SanityProduct
}> = ({product}) => {
  const {refetchAbility, inviteTeamPagePath = '/team'} = useMuxPlayer()
  const {module} = useLesson()
  const {data: session} = useSession()
  const {data: purchaseDetails, status} =
    trpcSkillLessons.purchases.getPurchaseByProductId.useQuery({
      productId: product?.productId as string,
    })

  return (
    <div data-team-purchase="">
      {module?.image && (
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
          {purchaseDetails?.purchase?.bulkCoupon?.maxUses} seats and haven't
          claimed a seat for yourself yet.
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
      <Link href={inviteTeamPagePath} data-invite-team="">
        Invite your team
      </Link>
    </div>
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
  const {nextSection, handlePlay, setDisplayOverlay} = useMuxPlayer()
  const {lesson, module} = useLesson()
  const router = useRouter()
  const {image} = module
  const nextExercise = first(nextSection?.lessons) as Lesson
  const moduleProgress = useModuleProgress()

  const [completedLessonCount, setCompletedLessonCount] =
    React.useState<number>(0)

  React.useEffect(() => {
    setCompletedLessonCount(moduleProgress?.completedLessonCount || 0)
  }, [moduleProgress])

  const session = useSession()

  return (
    // keeping "default" variant here so we don't have to style it twice
    <OverlayWrapper data-video-overlay="default">
      <ModuleCtaProvider>
        {image && (
          <Image
            data-image=""
            src={image}
            alt=""
            aria-hidden="true"
            width={220}
            height={220}
            priority
          />
        )}
        <p data-title="">
          <Balancer>
            <span data-byline="">Up next:</span> {nextSection?.title}
          </Balancer>
        </p>
        {moduleProgress && session.status === 'authenticated' && (
          <div data-progress="">
            <ProgressBar.Root
              data-progress-bar=""
              max={moduleProgress?.lessonCount}
            >
              <ProgressBar.Indicator
                data-indicator={moduleProgress?.percentComplete}
                style={{
                  transform: `translateX(-${
                    ((moduleProgress?.lessonCount -
                      (completedLessonCount || 0)) /
                      moduleProgress?.lessonCount) *
                    100
                  }%)`,
                }}
              />
            </ProgressBar.Root>
            <div data-lessons-completed="">
              {completedLessonCount} / {moduleProgress?.lessonCount} lessons
              completed
            </div>
          </div>
        )}
        <div data-actions="">
          <CompleteAndContinueButton
            nextSection={nextSection}
            nextExercise={nextExercise}
            setCompletedLessonCount={setCompletedLessonCount}
          />
          <div>
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
                setDisplayOverlay(false)
                handlePlay()
              }}
            >
              <span data-icon="" aria-hidden="true">
                ↺
              </span>{' '}
              Replay Video
            </button>
            {lesson._type === 'solution' && (
              <Link
                data-action="try-again"
                href={router.asPath.replace('solution', 'exercise')}
              >
                <CodeIcon data-icon="" aria-hidden="true" />
                Back to Exercise
              </Link>
            )}
          </div>
        </div>
        {session.status === 'unauthenticated' && (
          <div data-login>
            <Link href="/login">Log in</Link> to track your progress.
          </div>
        )}
      </ModuleCtaProvider>
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

const Subscribe: React.FC<{actionLabel?: string}> = ({
  actionLabel = 'Continue Watching',
}) => {
  const {lesson, module} = useLesson()
  const {refetch: refetchSubscriber} = useConvertkit()
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
    [`started_${snakeCase(module.slug.current as string)}_${
      module.moduleType
    }`.toLowerCase()]: new Date().toISOString().slice(0, 10),
  }
  return (
    <SubscribeToConvertkitForm
      successMessage="Thanks! You're being redirected..."
      subscribeApiURL={process.env.NEXT_PUBLIC_CONVERTKIT_SUBSCRIBE_URL}
      actionLabel={actionLabel}
      fields={startedLearningField}
      onSuccess={(subscriber, email) => {
        return handleOnSuccess(subscriber, email)
      }}
    />
  )
}
