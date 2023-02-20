import React from 'react'
import {SanityDocument} from '@sanity/client'
import {SubscribeToConvertkitForm} from '@skillrecordings/convertkit-react-ui'
import {Facebook, LinkedIn, Twitter} from '@skillrecordings/react'
import {NextRouter, useRouter} from 'next/router'
import {IconGithub} from '../components/icons'
import snakeCase from 'lodash/snakeCase'
import Image from 'next/legacy/image'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {CodeIcon, XIcon} from '@heroicons/react/solid'
import cx from 'classnames'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {setUserId} from '@amplitude/analytics-browser'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {PortableText} from '@portabletext/react'
import {trpc} from '../trpc/trpc.client'
import Spinner from '../components/spinner'
import {StackBlitzIframe} from './exercise/stackblitz-iframe'
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
import {useDeviceDetect} from 'hooks/use-device-detect'
import {ExclamationIcon} from '@heroicons/react/solid'
import {getExerciseGitHubUrl} from './exercise/github-link'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import {Exercise} from '@skillrecordings/skill-lesson/schemas/exercise'
import {handlePlayFromBeginning} from '@skillrecordings/skill-lesson/utils/handle-play-from-beginning'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import SelfRedeemButton from 'team/self-redeem-button'
import {useSession} from 'next-auth/react'
import Balancer from 'react-wrap-balancer'

const useAbilities = () => {
  const {
    data: abilityRules,
    refetch,
    isFetching,
  } = trpc.abilities.getAbilities.useQuery()

  return {ability: createAppAbility(abilityRules || []), refetch, isFetching}
}

export const OverlayWrapper: React.FC<
  React.PropsWithChildren<{className?: string; dismissable?: boolean}>
> = ({children, className, dismissable = true}) => {
  const {setDisplayOverlay} = useMuxPlayer()
  const {lesson, module} = useLesson()

  return (
    <div
      id="video-overlay"
      className="relative top-0 left-0 flex aspect-video w-full items-center justify-center bg-[#070B16]"
    >
      {dismissable && (
        <button
          className="absolute top-2 right-2 z-40 flex items-center gap-1 rounded py-2 px-3 font-medium text-gray-200 transition hover:bg-gray-800"
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
          Dismiss <XIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
      <div
        className={cx(
          'absolute left-0 top-0 z-20 flex h-full w-full flex-col items-center justify-center text-center text-lg leading-relaxed',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}

const Actions = () => {
  const {nextExercise, path, handlePlay, muxPlayerRef} = useMuxPlayer()
  const {lesson, module, section} = useLesson()
  const router = useRouter()

  return (
    <>
      <button
        className="rounded bg-gray-800 px-3 py-1 text-lg font-semibold transition hover:bg-gray-700 sm:px-5 sm:py-2"
        onClick={() => {
          track('clicked replay', {
            lesson: lesson.slug,
            module: module.slug.current,
            location: 'exercise',
            moduleType: module.moduleType,
            lessonType: lesson._type,
          })
          if (router.asPath.endsWith('/exercise')) {
            router.push(router.asPath.replace('/exercise', ''))
            if (muxPlayerRef.current) {
              muxPlayerRef.current.currentTime = 0
            }
          }
          handlePlay()
        }}
      >
        <span aria-hidden="true">↺</span> Replay
      </button>
      {nextExercise && (
        <button
          className="rounded bg-cyan-600 px-3 py-1 text-lg font-semibold transition hover:bg-cyan-500 sm:px-5 sm:py-2"
          onClick={() => {
            track('clicked continue to solution', {
              lesson: lesson.slug,
              module: module?.slug.current,
              location: 'exercise',
              moduleType: module.moduleType,
              lessonType: lesson._type,
            })
            handleContinue({
              router,
              module,
              nextExercise,
              handlePlay,
              path,
              section,
            })
          }}
        >
          Solution <span aria-hidden="true">→</span>
        </button>
      )}
    </>
  )
}

const ExerciseOverlay = () => {
  const {lesson, module} = useLesson()
  const router = useRouter()
  const {data: stackblitz, status} = trpc.stackblitz.byExerciseSlug.useQuery({
    slug: router.query.lesson as string,
    type: lesson._type,
  })
  const {github} = module
  const {isSafari, isFirefox} = useDeviceDetect()
  const isStackblitzCompatibleBrowser = !(isSafari || isFirefox)

  const {exerciseGitHubUrl} = getExerciseGitHubUrl({stackblitz, module})

  return (
    <div className=" bg-black/30 ">
      {stackblitz ? (
        <>
          <div className="flex w-full items-center justify-between p-3 pl-5 font-medium sm:text-lg">
            <div className="flex flex-col">
              <div>Now it's your turn! Try solving this exercise.</div>
            </div>
            <div className="flex justify-center gap-2">
              <Actions />
            </div>
          </div>
          <div className="relative hidden h-[500px] w-full sm:block xl:h-[750px]">
            <StackBlitzIframe exercise={lesson} module={module} />
          </div>
          {!isStackblitzCompatibleBrowser && (
            <div className="mx-2 mt-2 hidden rounded-md bg-gray-800 px-4 py-3 text-base sm:block">
              <p className="pb-1 font-semibold">
                <ExclamationIcon className="inline-block h-5 w-5 text-cyan-300" />{' '}
                StackBlitz is poorly supported outside of Chrome.
              </p>
              <p>
                {isFirefox && (
                  <>
                    {
                      'Please use Chromium-based browser to work on this exercise. Or '
                    }
                    <a
                      href={`https://gitpod.io#${exerciseGitHubUrl}`}
                      target="_blank"
                      onClick={() => {
                        track('clicked gitpod code link', {
                          lesson: lesson.slug,
                          module: module.slug.current,
                          moduleType: module.moduleType,
                          lessonType: lesson._type,
                        })
                      }}
                      className="text-cyan-200 underline"
                      rel="noreferrer"
                    >
                      view on Gitpod
                    </a>
                    {'.'}
                  </>
                )}
                {isSafari && (
                  <>
                    {
                      'Please use Chromium-based browser to work on this exercise. Or '
                    }
                    <a
                      href={`https://gitpod.io#${exerciseGitHubUrl}`}
                      target="_blank"
                      onClick={() => {
                        track('clicked gitpod code link', {
                          lesson: lesson.slug,
                          module: module.slug.current,
                          moduleType: module.moduleType,
                          lessonType: lesson._type,
                        })
                      }}
                      className="text-cyan-200 underline"
                      rel="noreferrer"
                    >
                      view on Gitpod
                    </a>
                    {'.'}
                  </>
                )}
              </p>
            </div>
          )}
        </>
      ) : (
        github?.repo && (
          <div className="aspect-video">
            <p className="font-text text-3xl font-bold">Now it’s your turn!</p>
            <p className="">
              Try solving this exercise inside{' '}
              <a
                href={`https://github.com/total-typescript/${github.repo}/blob/main/${stackblitz}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1 rounded-sm bg-gray-800 py-0.5 px-1 font-mono text-sm"
              >
                <IconGithub /> {stackblitz}
              </a>{' '}
              file.
            </p>
            <Actions />
          </div>
        )
      )}
      {github?.repo && (
        <div className="flex aspect-video flex-col items-center justify-center gap-5 p-3 text-center sm:hidden">
          <p className="font-text text-3xl font-bold">Now it’s your turn!</p>
          <p className="">
            Try solving this exercise inside{' '}
            <a
              href={`https://github.com/total-typescript/${github.repo}/blob/main/${stackblitz}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 rounded-sm bg-gray-800 py-0.5 px-1 font-mono text-sm"
            >
              <IconGithub /> {stackblitz}
            </a>{' '}
            file.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Actions />
          </div>
        </div>
      )}
    </div>
  )
}

const DefaultOverlay = () => {
  const {nextExercise, path, handlePlay} = useMuxPlayer()
  const {lesson, module, section} = useLesson()
  const router = useRouter()
  const {image} = module
  const addProgressMutation = trpc.progress.add.useMutation()
  const utils = trpc.useContext()
  const {data: stackblitz} = trpc.stackblitz.byExerciseSlug.useQuery({
    slug: router.query.lesson as string,
    type: lesson._type,
  })

  return (
    <OverlayWrapper className="px-5">
      {image && (
        <div className="hidden items-center justify-center sm:flex sm:w-40 lg:w-auto">
          <Image
            src={image}
            alt=""
            aria-hidden="true"
            width={220}
            height={220}
          />
        </div>
      )}

      <p className="pt-4 text-xl font-semibold sm:text-3xl">
        <span className="font-normal text-gray-200">Up next:</span>{' '}
        {nextExercise?.title}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 py-4 sm:py-8">
        <button
          className="rounded bg-gray-800 px-3 py-1 text-lg font-semibold transition hover:bg-gray-700 sm:px-5 sm:py-3"
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
        {stackblitz && (
          <Link
            href={router.asPath.replace('solution', 'exercise')}
            className="flex items-center gap-1 rounded bg-gray-800 px-3 py-1 text-lg font-semibold transition hover:bg-gray-700 sm:px-5 sm:py-3"
          >
            <CodeIcon className="h-5 w-5" aria-hidden="true" />
            Try Again
          </Link>
        )}
        <button
          className="rounded bg-cyan-600 px-3 py-1 text-lg font-semibold transition hover:bg-cyan-500 sm:px-5 sm:py-3"
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
                  utils.moduleProgress.bySlug.invalidate({
                    slug: module.slug.current,
                  })
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
          Complete & Continue <span aria-hidden="true">→</span>
        </button>
      </div>
    </OverlayWrapper>
  )
}

const FinishedOverlay = () => {
  const {path, handlePlay} = useMuxPlayer()
  const {module, section} = useLesson()
  const [markedComplete, setMarkedComplete] = React.useState(false)

  const router = useRouter()
  const shareUrl = `${process.env.NEXT_PUBLIC_URL}${path}/${module.slug.current}`
  const shareMessage = `${module.title} ${module.moduleType} by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER}`
  const shareButtonStyles =
    'bg-gray-800 flex items-center gap-2 rounded px-3 py-2 hover:bg-gray-700'

  const addProgressMutation = trpc.progress.add.useMutation()
  const utils = trpc.useContext()

  React.useEffect(() => {
    // since this is the last lesson and we show the "module complete" overlay
    // we run this when the effect renders marking the lesson complete
    if (!markedComplete) {
      addProgressMutation.mutate(
        {lessonSlug: router.query.lesson as string},
        {
          onSettled: () => {
            utils.moduleProgress.bySlug.invalidate({slug: module.slug.current})
          },
        },
      )
      setMarkedComplete(true)
    }
  }, [])

  return (
    <OverlayWrapper className="px-5 pt-10 sm:pt-0">
      <p className="font-text text-2xl font-semibold sm:text-3xl sm:font-bold">
        Share this {module.moduleType} with your friends
      </p>
      <div className="flex items-center gap-2 py-8">
        <Twitter
          link={shareUrl}
          message={shareMessage}
          className={shareButtonStyles}
        >
          Twitter
        </Twitter>
        <Facebook
          link={shareUrl}
          message={shareMessage}
          className={shareButtonStyles}
        >
          Facebook
        </Facebook>
        <LinkedIn
          link={shareUrl}
          message={shareMessage}
          className={shareButtonStyles}
        >
          LinkedIn
        </LinkedIn>
      </div>
      <div className="flex items-center justify-center divide-x divide-gray-700">
        <button
          className="px-3 py-1 text-lg font-semibold transition hover:bg-gray-900 sm:px-5 sm:py-3"
          onClick={handlePlay}
        >
          Replay <span aria-hidden="true">↺</span>
        </button>
        <button
          onClick={() =>
            handlePlayFromBeginning({
              router,
              module,
              section,
              path,
              handlePlay,
            })
          }
          className="px-3 py-1 text-lg font-semibold transition hover:bg-gray-900 sm:px-5 sm:py-3 "
        >
          Play from beginning
        </button>
      </div>
    </OverlayWrapper>
  )
}

const BlockedOverlay = () => {
  const {lesson, module} = useLesson()
  const {refetch: refetchSubscriber} = useConvertkit()
  const {videoResourceId} = useVideoResource()
  const thumbnail = `${getBaseUrl()}/api/video-thumb?videoResourceId=${videoResourceId}`
  const {refetchAbility} = useMuxPlayer()
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
  const {ability} = useAbilities()
  const canViewTeam = ability.can('view', 'Team')
  const {data: purchaseDetails} = trpc.purchases.getLastPurchase.useQuery()

  return (
    <div
      id="video-overlay"
      className="flex w-full flex-col items-center justify-center bg-[#070B16] py-10 xl:aspect-video xl:flex-row"
    >
      <Image
        src={thumbnail}
        layout="fill"
        alt=""
        aria-hidden="true"
        className="opacity-50 blur-sm contrast-125"
        priority
      />
      {module.moduleType === 'tutorial' ? (
        <>
          <div className="z-20 flex h-full flex-shrink-0 flex-col items-center justify-center gap-5 p-5 pb-10 text-center text-lg leading-relaxed sm:p-10 sm:pb-16">
            <div className="flex w-full flex-col items-center justify-center gap-2">
              {module.image && (
                <div className="relative -mb-5">
                  <Image
                    src={module.image}
                    width={220}
                    height={220}
                    alt={module.title}
                  />
                </div>
              )}
              <h2 className="text-4xl font-semibold">
                Level up with {module.title}
              </h2>
              <h3 className="pb-5 text-xl">
                Access all lessons in this {module.moduleType}.
              </h3>
              {module.moduleType === 'tutorial' ? (
                <>
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
                  <p className="pt-2 text-base opacity-80">
                    No spam, unsubscribe at any time.
                  </p>
                </>
              ) : (
                <div>Buy Now</div>
              )}
            </div>
          </div>
          <div className="sm:pr-5">
            <div className="prose relative flex w-full max-w-2xl flex-col border-gray-700/50 bg-gray-800 p-5 text-white shadow-2xl before:absolute before:top-[-8px] before:left-1/2 before:h-4 before:w-4 before:rotate-45 before:border-l before:border-t before:border-gray-700/50 before:bg-gray-800 before:content-[''] prose-p:mb-0 prose-p:text-gray-300 sm:rounded-lg sm:border xl:prose-lg xl:max-w-lg xl:bg-transparent xl:before:hidden xl:prose-p:mb-0 2xl:prose-base 2xl:prose-p:mb-0">
              <h3 className="text-2xl font-semibold sm:text-3xl">
                This is a free tutorial.
              </h3>
              {ctaText && <PortableText value={ctaText} />}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="z-20 flex h-full flex-shrink-0 flex-col items-center justify-center gap-5 p-5 pb-10 text-center text-lg leading-relaxed sm:p-10 sm:pb-16">
            <div className="flex w-full flex-col items-center justify-center gap-2">
              {module.image && (
                <div className="relative -mb-5">
                  <Image
                    src={module.image}
                    width={220}
                    height={220}
                    alt={module.title}
                  />
                </div>
              )}
              <h2 className="text-4xl font-semibold">
                Level up your {module.title}
              </h2>
              {canViewTeam ? (
                <>
                  <h3 className="max-w-xl pb-5 pt-3 text-lg text-gray-300">
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
                        className="rounded-lg bg-cyan-400 px-5 py-3 text-base font-semibold text-gray-900 brightness-125 transition hover:brightness-100"
                      >
                        Claim one seat for yourself and start learning
                      </SelfRedeemButton>
                    )}
                  <Link
                    href="/team"
                    className="mt-3 text-center text-base text-cyan-200 hover:underline"
                  >
                    Invite your team
                  </Link>
                </>
              ) : (
                <>
                  <h3 className="max-w-xl pb-5 pt-3 text-lg text-gray-300">
                    This {lesson._type} is part of the {module.title} workshop.
                  </h3>
                  <Link
                    href={{
                      pathname: '/buy',
                    }}
                    className="group group mt-5 inline-block gap-2 rounded bg-gradient-to-b from-cyan-300 to-cyan-400 py-3 pl-5 pr-8 font-medium text-black transition hover:brightness-110"
                    onClick={() => {
                      track('clicked unlock lesson', {
                        lesson: lesson.slug,
                        module: module.slug.current,
                        location: 'blocked overlay',
                        moduleType: module.moduleType,
                        lessonType: lesson._type,
                      })
                    }}
                  >
                    <span className="pr-3">Unlock this {lesson._type} now</span>
                    <span
                      aria-hidden="true"
                      className="absolute text-cyan-700 transition group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

type LoadingOverlayProps = {}

const LoadingOverlay: React.FC<LoadingOverlayProps> = () => {
  const {videoResourceId} = useVideoResource()
  const thumbnail = `${getBaseUrl()}/api/video-thumb?videoResourceId=${videoResourceId}`

  return (
    <OverlayWrapper dismissable={false}>
      <div className="flex items-center justify-center">
        {videoResourceId && (
          <Image
            src={thumbnail}
            layout="fill"
            alt=""
            aria-hidden="true"
            className="opacity-50 blur-sm contrast-125"
          />
        )}
        <Spinner className="absolute" />
      </div>
    </OverlayWrapper>
  )
}

const FinishedSectionOverlay = () => {
  const {nextSection, path, handlePlay} = useMuxPlayer()
  const {lesson, module} = useLesson()
  const {image} = module
  const addProgressMutation = trpc.progress.add.useMutation()
  const utils = trpc.useContext()
  const nextExercise = first(nextSection?.lessons) as Lesson
  const router = useRouter()
  const {data: stackblitz} = trpc.stackblitz.byExerciseSlug.useQuery({
    slug: router.query.lesson as string,
    type: lesson._type,
  })

  return (
    <OverlayWrapper className="px-5">
      {image && (
        <div className="hidden items-center justify-center sm:flex sm:w-40 lg:w-auto">
          <Image
            src={image}
            alt=""
            aria-hidden="true"
            width={220}
            height={220}
          />
        </div>
      )}
      {nextSection && (
        <p className="pt-4 text-xl font-semibold sm:text-3xl">
          <span className="font-normal text-gray-200">Up next:</span>{' '}
          {nextSection.title}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-3 py-4 sm:py-8">
        <button
          className="rounded bg-gray-800 px-3 py-1 text-lg font-semibold transition hover:bg-gray-700 sm:px-5 sm:py-3"
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
        {stackblitz && (
          <Link
            href={router.asPath.replace('solution', 'exercise')}
            className="flex items-center gap-1 rounded bg-gray-800 px-3 py-1 text-lg font-semibold transition hover:bg-gray-700 sm:px-5 sm:py-3"
          >
            Try Again
            <CodeIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
        )}
        <button
          className="rounded bg-cyan-600 px-3 py-1 text-lg font-semibold transition hover:bg-cyan-500 sm:px-5 sm:py-3"
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
                  utils.moduleProgress.bySlug.invalidate({
                    slug: module.slug.current,
                  })
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
          Complete & Continue <span aria-hidden="true">→</span>
        </button>
      </div>
    </OverlayWrapper>
  )
}

export {
  ExerciseOverlay,
  DefaultOverlay,
  FinishedOverlay,
  FinishedSectionOverlay,
  BlockedOverlay,
  LoadingOverlay,
}

const handleContinue = async ({
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
