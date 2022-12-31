import React from 'react'
import {SanityDocument} from '@sanity/client'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit-react-ui'
import {Facebook, LinkedIn, Twitter} from '@skillrecordings/react'
import {NextRouter, useRouter} from 'next/router'
import snakeCase from 'lodash/snakeCase'
import Image from 'next/image'
import {useMuxPlayer} from 'hooks/use-mux-player'
import {XIcon} from '@heroicons/react/solid'
import cx from 'classnames'
import {track} from '../../utils/analytics'
import {setUserId} from '@amplitude/analytics-browser'
import {sanityClient} from 'utils/sanity-client'
import {PortableText} from '@portabletext/react'
import {useQuery} from 'react-query'
import {trpc} from '../../utils/trcp'
import Spinner from './spinner'

export const OverlayWrapper: React.FC<
  React.PropsWithChildren<{className?: string; dismissable?: boolean}>
> = ({children, className, dismissable = true}) => {
  const {setDisplayOverlay, lesson, module} = useMuxPlayer()

  return (
    <div
      id="video-overlay"
      className="relative top-0 left-0 flex aspect-video w-full items-center justify-center"
    >
      {dismissable && (
        <button
          className="absolute top-2 right-2 z-50 flex items-center justify-center gap-1 rounded-full  py-2 px-3.5 font-medium text-gray-600 transition"
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
          <span>Dismiss</span>{' '}
          <XIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
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
  const {nextExercise, lesson, module, path, handlePlay} = useMuxPlayer()
  const router = useRouter()
  return (
    <div className="flex justify-center gap-2">
      <button
        className="rounded-md bg-gray-600 px-3 py-1 font-medium transition hover:bg-gray-500/80 sm:px-5 sm:py-2"
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
          className="rounded-md bg-green-500 px-3 py-1 font-medium text-white transition hover:bg-green-400 sm:px-5 sm:py-2"
          onClick={() => {
            track('clicked continue to solution', {
              lesson: lesson.slug,
              module: module?.slug.current,
              location: 'exercise',
              moduleType: module.moduleType,
              lessonType: lesson._type,
            })
            handleContinue(router, module, nextExercise, handlePlay, path)
          }}
        ></button>
      )}
    </div>
  )
}

const ExerciseOverlay = () => {
  const {lesson, module} = useMuxPlayer()
  const {github} = module

  return (
    <div className=" bg-black/30 ">
      <div className="flex aspect-video flex-col items-center justify-center gap-5 p-3 text-center sm:hidden">
        <div className="flex items-center justify-center gap-3">
          <Actions />
        </div>
      </div>
    </div>
  )
}

const DefaultOverlay = () => {
  const {nextExercise, module, path, lesson, handlePlay} = useMuxPlayer()
  const router = useRouter()
  const {image} = module
  const addProgressMutation = trpc.useMutation(['progress.add'])

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

      <p className="pt-4 font-heading text-xl font-black sm:text-3xl">
        <span className="font-normal text-gray-700">Up next:</span>{' '}
        {nextExercise.title}
      </p>
      <div className="flex items-center justify-center gap-5 py-4 sm:py-8">
        <button
          className="rounded-full bg-white px-3 py-1 text-lg font-semibold transition hover:bg-gray-100 sm:px-5 sm:py-3"
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
          className="rounded-full bg-brand-red px-3 py-1 text-lg font-semibold text-white transition hover:brightness-125 sm:px-5 sm:py-3"
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
                onSettled: () => {
                  handleContinue(router, module, nextExercise, handlePlay, path)
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
  const {module, path, lesson, handlePlay} = useMuxPlayer()
  const router = useRouter()
  const shareUrl = `${process.env.NEXT_PUBLIC_URL}${path}/${module.slug.current}`
  const shareMessage = `${module.title} ${module.moduleType} by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER}`
  const shareButtonStyles =
    'shadow-xl shadow-gray-500/5 flex items-center gap-2 rounded-full px-4 py-2'

  const addProgressMutation = trpc.useMutation(['progress.add'])

  React.useEffect(() => {
    // since this is the last lesson and we show the "module complete" overlay
    // we run this when the effect renders marking the lesson complete
    addProgressMutation.mutate({lessonSlug: lesson.slug})
  }, [])

  return (
    <OverlayWrapper className="px-5 pt-10 sm:pt-0">
      <p className="font-text font-heading text-2xl font-black sm:text-3xl">
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
      <div className="flex items-center justify-center divide-x divide-gray-300">
        <button
          className="px-3 py-1 text-lg font-semibold transition sm:px-5 sm:py-3"
          onClick={handlePlay}
        >
          Replay <span aria-hidden="true">↺</span>
        </button>
        <button
          onClick={() => {
            router
              .push({
                pathname: `/${path}/[module]/[lesson]`,
                query: {
                  module: module.slug.current,
                  lesson: module.lessons[0].slug.current,
                },
              })
              .then(handlePlay)
          }}
          className="px-3 py-1 text-lg font-semibold transition sm:px-5 sm:py-3 "
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
      className="flex w-full flex-col items-center justify-center py-5 md:flex-row"
    >
      <div className="z-20 flex h-full flex-shrink-0 flex-col items-center justify-center gap-5 p-5 pb-10 text-center text-lg leading-relaxed sm:p-10 sm:pb-16">
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <div className="relative ">
            <Image
              src={module.image}
              width={150}
              height={150}
              alt={module.title}
            />
          </div>
          <h2 className="max-w-sm font-heading text-3xl font-black">
            Level up with {module.title}
          </h2>
          <h3 className="pb-5 pt-2 text-lg font-medium text-brand-red">
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
      <div className="prose flex w-full max-w-none flex-col p-5 prose-p:mb-0 prose-p:text-gray-700 sm:max-w-sm xl:max-w-lg xl:prose-p:mb-0">
        <h3 className="font-black">This is a free tutorial.</h3>
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
            className="opacity-50 blur-sm contrast-125"
          />
        )}
        <Spinner className="absolute h-8 w-8" />
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
    const lesson = module.lessons.find((lesson: SanityDocument) => {
      const solution = lesson.solution
      return solution?._key === nextExercise._key
    })

    return await router
      .push({
        query: {module: module.slug.current, lesson: lesson.slug},
        pathname: `${path}/[module]/[lesson]/solution`,
      })
      .then(() => handlePlay())
  }

  return await router
    .push({
      query: {module: module.slug.current, lesson: nextExercise.slug},
      pathname: `${path}/[module]/[lesson]`,
    })
    .then(() => handlePlay())
}
