import React from 'react'
import {SanityDocument} from '@sanity/client'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit-react-ui'
import {Facebook, LinkedIn, Twitter} from '@skillrecordings/react'
import {NextRouter, useRouter} from 'next/router'
import {IconGithub} from './icons'
import snakeCase from 'lodash/snakeCase'
import Image from 'next/image'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {XIcon} from '@heroicons/react/solid'
import cx from 'classnames'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {setUserId} from '@amplitude/analytics-browser'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {PortableText} from '@portabletext/react'
import {trpc} from '../utils/trpc'
import Spinner from './spinner'
import {StackBlitzIframe} from './exercise/stackblitz-iframe'
import Link from 'next/link'
import first from 'lodash/first'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import {useQuery} from '@tanstack/react-query'

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
  const {nextExercise, path, handlePlay} = useMuxPlayer()
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
          handlePlay()
        }}
      >
        Replay <span aria-hidden="true">↺</span>
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
            handleContinue(
              router,
              module,
              nextExercise,
              handlePlay,
              path,
              section,
            )
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
    slug: router.query.exercise as string,
    type: lesson._type,
  })
  const {github} = module

  return status !== 'loading' ? (
    <div className=" bg-black/30 ">
      {stackblitz ? (
        <>
          <div className="flex w-full items-center justify-between p-3 pl-5 font-medium sm:text-lg">
            <div>Now it's your turn! Try solving this exercise.</div>
            <div className="flex justify-center gap-2">
              <Actions />
            </div>
          </div>
          <div className="relative hidden h-[500px] w-full sm:block xl:h-[750px]">
            <StackBlitzIframe exercise={lesson} module={module} />
          </div>
        </>
      ) : (
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
      )}
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
    </div>
  ) : null
}

const DefaultOverlay = () => {
  const {nextExercise, path, handlePlay} = useMuxPlayer()
  const {lesson, module, section} = useLesson()
  const router = useRouter()
  const {image} = module
  const addProgressMutation = trpc.progress.add.useMutation()

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
        {nextExercise.title}
      </p>
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
              {lessonSlug: lesson.slug},
              {
                onSettled: (data, error, variables, context) => {
                  handleContinue(
                    router,
                    module,
                    nextExercise,
                    handlePlay,
                    path,
                    section,
                  )
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
  const {lesson, module, section} = useLesson()

  const router = useRouter()
  const shareUrl = `${process.env.NEXT_PUBLIC_URL}${path}/${module.slug.current}`
  const shareMessage = `${module.title} ${module.moduleType} by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER}`
  const shareButtonStyles =
    'bg-gray-800 flex items-center gap-2 rounded px-3 py-2 hover:bg-gray-700'

  const addProgressMutation = trpc.progress.add.useMutation()

  React.useEffect(() => {
    // since this is the last lesson and we show the "module complete" overlay
    // we run this when the effect renders marking the lesson complete
    addProgressMutation.mutate({lessonSlug: lesson.slug})
  }, [])

  const handlePlayFromBeginning = () => {
    router
      .push({
        pathname: section
          ? `/${path}/[module]/[section]/[exercise]`
          : `/${path}/[module]/[exercise]`,
        query: section
          ? {
              module: module.slug.current,
              section: module.sections[0].slug,
              exercise: module.sections[0].exercises[0].slug,
            }
          : {
              module: module.slug.current,
              exercise: module.exercises[0].slug,
            },
      })
      .then(handlePlay)
  }

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
          onClick={handlePlayFromBeginning}
          className="px-3 py-1 text-lg font-semibold transition hover:bg-gray-900 sm:px-5 sm:py-3 "
        >
          Play from beginning
        </button>
      </div>
    </OverlayWrapper>
  )
}

const BlockedOverlay: React.FC = () => {
  const router = useRouter()
  const {lesson, module} = useLesson()

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

  const handleOnSuccess = (subscriber: any, email?: string) => {
    if (subscriber) {
      const redirectUrl = redirectUrlBuilder(subscriber, router.asPath, {
        confirmToast: 'true',
      })
      email && setUserId(email)
      track('subscribed to email list', {
        lesson: lesson.slug,
        module: module.slug.current,
        location: 'exercise',
        moduleType: module.moduleType,
        lessonType: lesson._type,
      })
      router.push(redirectUrl).then(() => {
        router.reload()
      })
    }
  }

  const startedLearningField = {
    // ex: started_zod_tutorial: 2022-09-02
    [`started_${snakeCase(module.title)}_${module.moduleType}`.toLowerCase()]:
      new Date().toISOString().slice(0, 10),
  }

  return (
    <div
      id="video-overlay"
      className="flex w-full flex-col items-center justify-center bg-[#070B16] py-10 md:flex-row lg:aspect-video"
    >
      {module.moduleType === 'tutorial' ? (
        <>
          <div className="z-20 flex h-full flex-shrink-0 flex-col items-center justify-center gap-5 p-5 pb-10 text-center text-lg leading-relaxed sm:p-10 sm:pb-16">
            <div className="flex w-full flex-col items-center justify-center gap-2">
              <div className="relative -mb-5">
                <Image
                  src={module.image}
                  width={220}
                  height={220}
                  alt={module.title}
                />
              </div>
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
          <div className="prose flex w-full max-w-none flex-col p-5 text-white prose-p:mb-0 prose-p:text-gray-300 sm:max-w-sm xl:prose-lg xl:max-w-lg xl:prose-p:mb-0">
            <h3 className="text-3xl font-semibold">This is a free tutorial.</h3>
            {ctaText && <PortableText value={ctaText} />}
          </div>
        </>
      ) : (
        <>
          <div className="z-20 flex h-full flex-shrink-0 flex-col items-center justify-center gap-5 p-5 pb-10 text-center text-lg leading-relaxed sm:p-10 sm:pb-16">
            <div className="flex w-full flex-col items-center justify-center gap-2">
              <div className="relative -mb-5">
                <Image
                  src={module.image}
                  width={220}
                  height={220}
                  alt={module.title}
                />
              </div>
              <h2 className="text-4xl font-semibold">
                Level up your {module.title}
              </h2>
              <h3 className="max-w-xl pb-5 pt-3 text-lg text-gray-300">
                This {lesson._type} is part of the {module.title} workshop.
              </h3>
              <Link
                href={{
                  pathname: '/buy',
                }}
              >
                <a
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
                </a>
              </Link>
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
  const nextExercise = first(nextSection?.exercises) as SanityDocument
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

      <p className="pt-4 text-xl font-semibold sm:text-3xl">
        <span className="font-normal text-gray-200">Up next:</span>{' '}
        {nextSection.title}
      </p>
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
              {lessonSlug: lesson.slug},
              {
                onSettled: (data, error, variables, context) => {
                  handleContinue(
                    router,
                    module,
                    nextExercise,
                    handlePlay,
                    path,
                    nextSection,
                  )
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

const handleContinue = async (
  router: NextRouter,
  module: SanityDocument,
  nextExercise: SanityDocument,
  handlePlay: () => void,
  path: string,
  section?: SanityDocument,
) => {
  if (nextExercise._type === 'solution') {
    if (section) {
      const exercise = section.exercises.find((exercise: SanityDocument) => {
        const solution = exercise.solution
        return solution?._key === nextExercise._key
      })

      return await router
        .push({
          query: {
            module: module.slug.current,
            section: section.slug,
            exercise: exercise.slug,
          },

          pathname: `${path}/[module]/[section]/[exercise]/solution`,
        })
        .then(() => handlePlay())
    } else {
      const exercise = module.exercises.find((exercise: SanityDocument) => {
        const solution = exercise.solution
        return solution?._key === nextExercise._key
      })

      return await router
        .push({
          query: {
            module: module.slug.current,
            exercise: exercise.slug,
          },

          pathname: `${path}/[module]/[exercise]/solution`,
        })
        .then(() => handlePlay())
    }
  }
  if (section) {
    return await router
      .push({
        query: {
          module: module.slug.current,
          section: section.slug,
          exercise: nextExercise.slug,
        },
        pathname: `${path}/[module]/[section]/[exercise]`,
      })
      .then(() => handlePlay())
  } else {
    return await router
      .push({
        query: {module: module.slug.current, exercise: nextExercise.slug},
        pathname: `${path}/[module]/[exercise]`,
      })
      .then(() => handlePlay())
  }
}
