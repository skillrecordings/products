import React from 'react'
import {SanityDocument} from '@sanity/client'
import {SubscribeToConvertkitForm} from '@skillrecordings/convertkit-react-ui'
import {Facebook, LinkedIn, Twitter} from '@skillrecordings/react'
import {NextRouter, useRouter} from 'next/router'
import snakeCase from 'lodash/snakeCase'
import Image from 'next/legacy/image'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {XIcon} from '@heroicons/react/solid'
import cx from 'classnames'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {setUserId} from '@amplitude/analytics-browser'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {PortableText} from '@portabletext/react'
import {trpc} from '../utils/trpc'
import Spinner from '../components/spinner'
import Link from 'next/link'
import first from 'lodash/first'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import {useQuery} from '@tanstack/react-query'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import Balancer from 'react-wrap-balancer'
import {
  confirmSubscriptionToast,
  useConvertkit,
} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import dynamic from 'next/dynamic'
import {PriceCheckProvider} from 'path-to-purchase-react/pricing-check-context'
import {Pricing} from 'path-to-purchase-react/pricing'
import {isSellingLive} from 'path-to-purchase-react/is-selling-live'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import {Exercise} from '@skillrecordings/skill-lesson/schemas/exercise'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {handlePlayFromBeginning} from '@skillrecordings/skill-lesson/utils/handle-play-from-beginning'
import Icon from 'components/icons'

const SandpackEditor: React.ComponentType<any> = dynamic(
  () => import('./exercise/sandpack/repl'),
  {ssr: false},
)

export const OverlayWrapper: React.FC<
  React.PropsWithChildren<{
    className?: string
    dismissable?: boolean
    background?: string
  }>
> = ({children, className, dismissable = true, background = 'bg-gray-900'}) => {
  const {setDisplayOverlay} = useMuxPlayer()
  const {lesson, module} = useLesson()

  return (
    <div
      id="video-overlay"
      className={cx(
        'relative top-0 left-0 flex aspect-video w-full items-center justify-center text-white',
        background,
      )}
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
  const {nextExercise, path, handlePlay} = useMuxPlayer()
  const {lesson, module, section} = useLesson()
  const router = useRouter()

  return (
    <div className="flex items-center gap-2">
      <button
        className="rounded-full bg-gray-200 px-3 py-1 font-medium transition hover:bg-gray-300/80 sm:px-5 sm:py-2"
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
        Replay <span aria-hidden="true">↺</span>
      </button>
      {nextExercise && (
        <button
          className="rounded-full bg-emerald-600 px-3 py-1 font-medium text-white transition hover:bg-emerald-500 sm:px-5 sm:py-2"
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
    </div>
  )
}

const ExerciseOverlay: React.FC<{tutorialFiles: any}> = ({tutorialFiles}) => {
  const {lesson, module} = useLesson()
  const router = useRouter()
  const {data: resources, status} = trpc.resources.byExerciseSlug.useQuery({
    slug: router.query.lesson as string,
    type: lesson._type,
  })

  const visibleFiles = resources?.sandpack
    ?.filter(({active}) => active)
    .map(({file}) => file)

  const sandpackFiles = resources?.sandpack
    ?.map(({file, code}) => {
      if (file)
        return {
          [file]: {
            code,
          },
        }
    })
    .reduce((acc, curr) => ({...acc, ...curr}))

  const files = {
    ...tutorialFiles,
    ...sandpackFiles,
  }

  const githubRepo = `https://github.com/pro-tailwind/${module?.github?.repo}`

  return status !== 'loading' ? (
    <div className="flex aspect-video flex-col items-center justify-center">
      <div className="flex w-full items-center justify-between p-3 pl-5 font-medium">
        <div>Now it's your turn! Try solving this exercise.</div>
        <Actions />
      </div>
      {resources?.sandpack ? (
        <>
          <div className="relative w-full">
            <SandpackEditor visibleFiles={visibleFiles} files={files} />
          </div>
        </>
      ) : (
        <div className="relative h-full w-full">
          {resources?.github || resources?.gitpod ? (
            <>
              <Image
                src={require('../../public/assets/editor-placeholder.svg')}
                layout="fill"
                className="object-cover object-left-top"
              />
              <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 text-center text-white">
                <p className="font-heading text-2xl font-black sm:pb-8 sm:text-3xl">
                  Try solving this exercise
                </p>
                <p className="text-lg font-semibold sm:text-xl">Run locally</p>
                <p className="max-w-sm sm:text-lg">
                  Clone{' '}
                  {module?.github?.repo ? (
                    <a
                      href={githubRepo}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-300 underline"
                    >
                      workshop repository
                    </a>
                  ) : (
                    'workshop repository'
                  )}{' '}
                  and follow instructions from the{' '}
                  {module?.github?.repo ? (
                    <a
                      href={`${githubRepo}#readme`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-300 underline"
                    >
                      README
                    </a>
                  ) : (
                    'README'
                  )}
                  .
                </p>
                <p className="text-lg font-semibold sm:py-5 sm:text-xl">or</p>
                {resources?.gitpod?.url && (
                  <a
                    href={resources.gitpod.url}
                    target="_blank"
                    className="flex items-center gap-2 rounded-full bg-orange-600 px-3 py-1 text-lg font-semibold text-white transition hover:brightness-125 sm:px-5 sm:py-3"
                    rel="noreferrer"
                  >
                    <Icon name="Gitpod" className="h-5 w-5" /> Run on Gitpod
                  </a>
                )}
                {/* {resources?.github?.url && (
                  <a
                    href={resources.github.url}
                    target="_blank"
                    className="flex items-center gap-2 rounded-full bg-gray-800 px-3 py-1 text-lg font-semibold text-white transition hover:brightness-125 sm:px-5 sm:py-3"
                    rel="noreferrer"
                  >
                    <Icon name="Github" className="h-5 w-5" /> View on Github
                  </a>
                )} */}
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  ) : null
}

const DefaultOverlay = () => {
  const {nextExercise, path, handlePlay} = useMuxPlayer()
  const {lesson, module, section} = useLesson()
  const router = useRouter()
  const {image} = module
  const addProgressMutation = trpc.progress.add.useMutation()
  const utils = trpc.useContext()

  return (
    <OverlayWrapper className="px-5">
      {image && (
        <div className="hidden items-center justify-center rounded-full bg-white p-8 sm:flex lg:w-auto">
          <Image
            src={image}
            alt=""
            aria-hidden="true"
            width={150}
            height={150}
          />
        </div>
      )}

      <p className="pt-4 text-xl font-semibold sm:text-3xl">
        <span className="font-normal text-gray-200">Up next:</span>{' '}
        {nextExercise?.title}
      </p>
      <div className="flex items-center justify-center gap-5 py-4 sm:py-8">
        <button
          className="rounded-full bg-gray-800 px-3 py-1 text-lg font-semibold transition hover:bg-gray-700 sm:px-5 sm:py-3"
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
          Replay ↺
        </button>
        <button
          className="rounded-full bg-brand-red px-3 py-1 text-lg font-semibold transition hover:brightness-125 sm:px-5 sm:py-3"
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
    addProgressMutation.mutate(
      {lessonSlug: router.query.lesson as string},
      {
        onSettled: () => {
          utils.moduleProgress.bySlug.invalidate({slug: module.slug.current})
        },
      },
    )
  }, [
    addProgressMutation,
    module.slug,
    router.query.lesson,
    utils.moduleProgress.bySlug,
  ])

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
  const router = useRouter()
  const {lesson, module} = useLesson()
  const {refetch: refetchSubscriber} = useConvertkit()
  const {videoResourceId} = useVideoResource()

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
  const thumbnail = `${getBaseUrl()}/api/video-thumb?videoResourceId=${videoResourceId}`

  return (
    <div
      id="video-overlay"
      className="flex w-full flex-col items-center justify-center bg-gray-900 p-5 text-white xl:flex-row"
    >
      {module.moduleType === 'tutorial' ? (
        <>
          <div className="z-20 flex h-full w-full flex-shrink-0 flex-col items-center justify-center gap-10 p-5 pb-10 text-center text-lg leading-relaxed sm:gap-5 sm:p-10 sm:pb-16 xl:flex-row">
            <div className="flex w-full max-w-xl flex-col items-center justify-center gap-2">
              {module.image && (
                <div className="relative flex items-center justify-center rounded-full bg-white p-5">
                  <Image
                    src={module.image}
                    width={110}
                    height={110}
                    alt={module.title}
                  />
                </div>
              )}
              <h2 className="pt-4 font-heading text-3xl font-bold">
                <Balancer>Level up with {module.title}</Balancer>
              </h2>
              <h3 className="pb-5 text-lg opacity-80 lg:text-xl">
                <Balancer>
                  Access all lessons in this {module.moduleType}.
                </Balancer>
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
            <div className="prose prose-sm relative flex w-full max-w-md flex-col rounded-lg border border-gray-700 bg-gray-800 p-8 text-left before:absolute before:top-[-8px] before:left-1/2 before:h-4 before:w-4 before:rotate-45 before:border-l before:border-t before:border-gray-700/50 before:bg-gray-800 before:content-[''] prose-p:mb-0 prose-p:text-gray-100 xl:before:hidden xl:prose-p:mb-0 2xl:prose-base 2xl:prose-p:mb-0">
              <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                This is a free tutorial.
              </h3>
              {ctaText && <PortableText value={ctaText} />}
            </div>
          </div>
        </>
      ) : (
        <>
          {videoResourceId && (
            <Image
              src={thumbnail}
              layout="fill"
              alt=""
              aria-hidden="true"
              objectFit="cover"
              className="opacity-50 blur-sm brightness-50 contrast-125"
            />
          )}
          <div className="z-20 flex h-full flex-shrink-0 flex-col items-center justify-center gap-5 p-5 pb-10 text-center text-lg leading-relaxed sm:p-10 sm:pb-16">
            <div className="flex w-full flex-col items-center justify-center gap-2">
              {module.image && (
                <div className="flex items-center justify-center rounded-full bg-white p-8">
                  <Image
                    src={module.image}
                    width={100}
                    height={100}
                    alt={module.title}
                  />
                </div>
              )}
              <h2 className="pt-5 font-heading text-4xl font-bold">
                <Balancer>Level up your {module.title}</Balancer>
              </h2>
              <h3 className="w-full pb-10 pt-3 text-lg opacity-90">
                <Balancer>Get access to all lessons in this workshop.</Balancer>
              </h3>
              <PriceCheckProvider>
                {module.product && (
                  <Pricing product={module.product as SanityProduct} />
                )}
              </PriceCheckProvider>
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
            objectFit="cover"
            className="opacity-50 blur-sm brightness-50 contrast-125"
          />
        )}
        <Spinner className="absolute h-8 w-8 text-white" />
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
      <div className="flex items-center justify-center gap-5 py-4 sm:py-8">
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
          Replay ↺
        </button>
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

      return exercise
        ? await router
            .push({
              query: {
                module: module.slug.current,
                section: section.slug,
                lesson: exercise.slug,
              },

              pathname: `${path}/[module]/[section]/[lesson]/solution`,
            })
            .then(() => handlePlay())
        : await router.push({
            query: {
              module: module.slug.current,
            },

            pathname: `${path}/[module]`,
          })
    } else {
      const exercise =
        module.lessons &&
        module.lessons.find((exercise: Exercise) => {
          const solution = exercise.solution
          return solution?._key === nextExercise._key
        })

      return exercise
        ? await router
            .push({
              query: {
                module: module.slug.current,
                lesson: exercise.slug,
              },

              pathname: `${path}/[module]/[lesson]/solution`,
            })
            .then(() => handlePlay())
        : await router.push({
            query: {
              module: module.slug.current,
            },

            pathname: `${path}/[module]`,
          })
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
