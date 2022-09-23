import React from 'react'
import {SanityDocument} from '@sanity/client'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import {Facebook, LinkedIn, Twitter} from '@skillrecordings/react'
import {NextRouter, useRouter} from 'next/router'
import {IconGithub} from './icons'
import snakeCase from 'lodash/snakeCase'
import toast from 'react-hot-toast'
import Image from 'next/image'
import {useMuxPlayer} from 'hooks/use-mux-player'
import {StackBlitzIframe} from 'templates/exercise-template'
import {XIcon} from '@heroicons/react/solid'
import cx from 'classnames'
import {track} from '../utils/analytics'
import {setUserId} from '@amplitude/analytics-browser'
import {sanityClient} from 'utils/sanity-client'
import {PortableText} from '@portabletext/react'
import {useQuery} from 'react-query'
import {trpc} from '../utils/trpc'
import Spinner from './spinner'
import {Exercise} from 'lib/exercises'

export const OverlayWrapper: React.FC<
  React.PropsWithChildren<{className?: string; dismissable?: boolean}>
> = ({children, className, dismissable = true}) => {
  const {setDisplayOverlay, lesson, module} = useMuxPlayer()

  return (
    <div
      id="video-overlay"
      className="relative top-0 left-0 flex items-center justify-center w-full bg-[#070B16] aspect-video"
    >
      {dismissable && (
        <button
          className="absolute top-2 right-2 py-2 px-3 z-50 font-medium rounded flex items-center gap-1 hover:bg-gray-800 transition text-gray-200"
          onClick={() => {
            track('dismissed video overlay', {
              lesson: lesson.slug.current,
              module: module.slug.current,
              moduleType: module.moduleType,
              lessonType: lesson._type,
            })
            setDisplayOverlay(false)
          }}
        >
          Dismiss <XIcon className="w-5 h-5" aria-hidden="true" />
        </button>
      )}
      <div
        className={cx(
          'z-20 absolute left-0 top-0 w-full h-full flex flex-col items-center justify-center text-center leading-relaxed text-lg',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}

type OverlayProps = {
  handlePlay: () => void
}

const ExerciseOverlay: React.FC<OverlayProps> = ({handlePlay}) => {
  const {nextExercise, lesson, module, path} = useMuxPlayer()
  const {github} = module
  const stackblitz = lesson.resources.find(
    (resource: SanityDocument) => resource._type === 'stackblitz',
  )
  const router = useRouter()

  const Actions = () => {
    return (
      <>
        <button
          className="bg-gray-800 sm:px-5 px-3 sm:py-2 py-1 text-lg font-semibold rounded hover:bg-gray-700 transition"
          onClick={() => {
            track('clicked replay', {
              lesson: lesson.slug.current,
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
            className="text-lg bg-cyan-600 hover:bg-cyan-500 transition sm:px-5 px-3 sm:py-2 py-1 font-semibold rounded"
            onClick={() => {
              track('clicked continue to solution', {
                lesson: lesson.slug.current,
                module: module?.slug.current,
                location: 'exercise',
                moduleType: module.moduleType,
                lessonType: lesson._type,
              })
              handleContinue(router, module, nextExercise, handlePlay, path)
            }}
          >
            Solution <span aria-hidden="true">→</span>
          </button>
        )}
      </>
    )
  }

  return (
    <div className=" bg-black/30 ">
      {stackblitz ? (
        <>
          <div className="p-3 pl-5 font-medium sm:text-lg flex items-center justify-between w-full">
            <div>Now it's your turn! Try solving this exercise.</div>
            <div className="flex gap-2 justify-center">
              <Actions />
            </div>
          </div>
          <div className="xl:h-[750px] h-[500px] w-full sm:block hidden relative">
            <StackBlitzIframe exercise={lesson as Exercise} module={module} />
          </div>
        </>
      ) : (
        <div className="aspect-video">
          <p className="text-3xl font-bold font-text">Now it’s your turn!</p>
          <p className="">
            Try solving this exercise inside{' '}
            <a
              href={`https://github.com/total-typescript/${github.repo}/blob/main/${stackblitz.openFile}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 font-mono text-sm py-0.5 px-1 bg-gray-800 rounded-sm"
            >
              <IconGithub /> {stackblitz.openFile}
            </a>{' '}
            file.
          </p>
          <Actions />
        </div>
      )}
      <div className="aspect-video sm:hidden gap-5 flex flex-col items-center justify-center p-3 text-center">
        <p className="text-3xl font-bold font-text">Now it’s your turn!</p>
        <p className="">
          Try solving this exercise inside{' '}
          <a
            href={`https://github.com/total-typescript/${github.repo}/blob/main/${stackblitz.openFile}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 font-mono text-sm py-0.5 px-1 bg-gray-800 rounded-sm"
          >
            <IconGithub /> {stackblitz.openFile}
          </a>{' '}
          file.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Actions />
        </div>
      </div>
    </div>
  )
}

const DefaultOverlay: React.FC<OverlayProps> = ({handlePlay}) => {
  const {nextExercise, module, path, lesson} = useMuxPlayer()
  const router = useRouter()
  const {image} = module
  const addProgressMutation = trpc.useMutation(['progress.add'])

  return (
    <OverlayWrapper className="px-5">
      {image && (
        <div className="sm:flex hidden items-center justify-center lg:w-auto sm:w-40">
          <Image
            src={image}
            alt=""
            aria-hidden="true"
            width={220}
            height={220}
          />
        </div>
      )}

      <p className="pt-4 sm:text-3xl text-xl font-semibold">
        <span className="font-normal text-gray-200">Up next:</span>{' '}
        {nextExercise.title}
      </p>
      <div className="flex items-center justify-center gap-5 sm:py-8 py-4">
        <button
          className="bg-gray-800 hover:bg-gray-700 transition sm:px-5 px-3 sm:py-3 py-1 text-lg font-semibold rounded"
          onClick={() => {
            track('clicked replay', {
              lesson: lesson.slug.current,
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
          className="text-lg bg-cyan-600 hover:bg-cyan-500 transition rounded sm:px-5 px-3 sm:py-3 py-1 font-semibold"
          onClick={() => {
            track('clicked complete', {
              lesson: lesson.slug.current,
              module: module.slug.current,
              location: 'exercise',
              moduleType: module.moduleType,
              lessonType: lesson._type,
            })
            addProgressMutation.mutate(
              {lessonSlug: lesson.slug.current},
              {
                onSettled: (data, error, variables, context) => {
                  handleContinue(router, module, nextExercise, handlePlay, path)
                },
              },
            )
          }}
        >
          Complete <span aria-hidden="true">→</span>
        </button>
      </div>
    </OverlayWrapper>
  )
}

const FinishedOverlay: React.FC<OverlayProps> = ({handlePlay}) => {
  const {module, path, lesson} = useMuxPlayer()
  const router = useRouter()
  const shareUrl = `${process.env.NEXT_PUBLIC_URL}${path}/${module.slug.current}`
  const shareMessage = `${module.title} ${module.moduleType} by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER}`
  const shareButtonStyles =
    'bg-gray-800 flex items-center gap-2 rounded px-3 py-2 hover:bg-gray-700'

  const addProgressMutation = trpc.useMutation(['progress.add'])

  React.useEffect(() => {
    // since this is the last lesson and we show the "module complete" overlay
    // we run this when the effect renders marking the lesson complete
    addProgressMutation.mutate({lessonSlug: lesson.slug.current})
  }, [])

  return (
    <OverlayWrapper className="px-5 sm:pt-0 pt-10">
      <p className="sm:text-3xl text-2xl sm:font-bold font-semibold font-text">
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
          className="hover:bg-gray-900 transition sm:px-5 px-3 sm:py-3 py-1 text-lg font-semibold"
          onClick={handlePlay}
        >
          Replay <span aria-hidden="true">↺</span>
        </button>
        <button
          onClick={() => {
            router
              .push({
                pathname: `/${path}/[module]/[exercise]`,
                query: {
                  module: module.slug.current,
                  exercise: module.exercises[0].slug.current,
                },
              })
              .then(handlePlay)
          }}
          className="hover:bg-gray-900 transition sm:px-5 px-3 sm:py-3 py-1 text-lg font-semibold "
        >
          Play from beginning
        </button>
      </div>
    </OverlayWrapper>
  )
}

const BlockedOverlay: React.FC = () => {
  const router = useRouter()
  const {lesson, module} = useMuxPlayer()

  const {data: ctaText} = useQuery([`exercise-free-tutorial`], async () => {
    return sanityClient
      .fetch(
        `
      *[_type == 'cta' && slug.current == "free-tutorial"][0]{
        body
      }
    `,
      )
      .then((response: SanityDocument) => response.body)
  })

  const handleOnSuccess = (subscriber: any, email?: string) => {
    if (subscriber) {
      const redirectUrl = redirectUrlBuilder(subscriber, router.asPath)
      email && setUserId(email)
      track('subscribed to email list', {
        lesson: lesson.slug.current,
        module: module.slug.current,
        location: 'exercise',
        moduleType: module.moduleType,
        lessonType: lesson._type,
      })
      router.push(redirectUrl).then(() => {
        confirmSubscriptionToast()
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
      className="flex flex-col md:flex-row items-center justify-center w-full bg-[#070B16] lg:aspect-video py-10"
    >
      <div className="sm:p-10 sm:pb-16 pb-10 p-5 z-20 h-full flex flex-col gap-5 items-center justify-center text-center leading-relaxed text-lg flex-shrink-0">
        <div className="flex flex-col items-center justify-center gap-2 w-full">
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
          <h3 className="text-xl pb-5">
            Access all lessons in this {module.moduleType}.
          </h3>
          <SubscribeToConvertkitForm
            successMessage="Thanks! You're being redirected..."
            subscribeApiURL={process.env.NEXT_PUBLIC_CONVERTKIT_SUBSCRIBE_URL}
            actionLabel="Continue Watching"
            fields={startedLearningField}
            onSuccess={(subscriber, email) => {
              return handleOnSuccess(subscriber, email)
            }}
          />
          <p className="pt-2 text-base opacity-80">
            No spam, unsubscribe at any time.
          </p>
        </div>
      </div>
      <div className="flex flex-col p-5 w-full prose xl:prose-lg xl:max-w-lg sm:max-w-sm max-w-none text-white prose-p:mb-0 xl:prose-p:mb-0 prose-p:text-gray-300">
        <h3 className="text-3xl font-semibold">This is a free tutorial.</h3>
        {ctaText && <PortableText value={ctaText} />}
      </div>
    </div>
  )
}

type LoadingOverlayProps = {}

const LoadingOverlay: React.FC<LoadingOverlayProps> = () => {
  const {
    muxPlayerProps: {playbackId},
  } = useMuxPlayer()
  const thumbnail = `https://image.mux.com/${playbackId}/thumbnail.png?width=480&height=384&fit_mode=preserve`

  return (
    <OverlayWrapper dismissable={false}>
      <div className="flex items-center justify-center">
        {playbackId && (
          <Image
            src={thumbnail}
            layout="fill"
            alt=""
            aria-hidden="true"
            className="opacity-50 contrast-125 blur-sm"
          />
        )}
        <Spinner className="absolute" />
      </div>
    </OverlayWrapper>
  )
}

export {
  ExerciseOverlay,
  DefaultOverlay,
  FinishedOverlay,
  BlockedOverlay,
  LoadingOverlay,
}

const handleContinue = async (
  router: NextRouter,
  module: SanityDocument,
  nextExercise: SanityDocument,
  handlePlay: () => void,
  path: string,
) => {
  if (nextExercise._type === 'solution') {
    const exercise = module.exercises.find((exercise: SanityDocument) => {
      const solution = exercise.resources.find((resource: SanityDocument) => {
        return resource._key === nextExercise._key
      })
      return solution?._key === nextExercise._key
    })

    return await router
      .push({
        query: {module: module.slug.current, exercise: exercise.slug.current},
        pathname: `${path}/[module]/[exercise]/solution`,
      })
      .then(() => handlePlay())
  }

  return await router
    .push({
      query: {module: module.slug.current, exercise: nextExercise.slug.current},
      pathname: `${path}/[module]/[exercise]`,
    })
    .then(() => handlePlay())
}

const confirmSubscriptionToast = () => {
  return toast(
    () => (
      <div>
        <strong>Confirm your subscription</strong>
        <p>
          Please check your inbox for an email that just got sent. Thanks and
          enjoy!
        </p>
      </div>
    ),
    {
      icon: '✉️',
      duration: 6000,
    },
  )
}
