import React from 'react'
import {SanityDocument} from '@sanity/client'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit-react-ui'
import {Facebook, LinkedIn, Twitter} from '@skillrecordings/react'
import {NextRouter, useRouter} from 'next/router'
import snakeCase from 'lodash/snakeCase'
import Image from 'next/legacy/image'
import {XIcon} from '@heroicons/react/solid'
import cx from 'classnames'
import {track} from '../utils/analytics'
import {setUserId} from '@amplitude/analytics-browser'
import {PortableText} from '@portabletext/react'
import {useQuery} from '@tanstack/react-query'
import {trpc} from '../utils/trpc'
import Spinner from './app/spinner'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import {Exercise} from '@skillrecordings/skill-lesson/schemas/exercise'

export const OverlayWrapper: React.FC<
  React.PropsWithChildren<{className?: string; dismissable?: boolean}>
> = ({children, className, dismissable = true}) => {
  const {lesson, module} = useLesson()
  const {setDisplayOverlay} = useMuxPlayer()

  return (
    <div
      id="video-overlay"
      className="relative top-0 left-0 flex aspect-video w-full items-center justify-center"
    >
      {dismissable && (
        <button
          className="absolute top-2 right-2 z-40 flex items-center gap-1 rounded-full py-2 px-3 font-medium text-gray-200 transition hover:bg-gray-700"
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
          <XIcon className="h-4 w-4 text-gray-200" aria-hidden="true" />
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

const DefaultOverlay = () => {
  const {nextExercise, path, handlePlay} = useMuxPlayer()
  const {lesson, module} = useLesson()
  const router = useRouter()
  const {image} = module
  const addProgressMutation = trpc.progress.add.useMutation()

  return (
    <OverlayWrapper className="px-5 bg-gray-800">
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
        <span className="font-normal text-gray-200">Up next:</span>{' '}
        {nextExercise?.title}
      </p>
      <div className="flex items-center justify-center gap-5 py-4 sm:py-8">
        <button
          className="rounded-full bg-gray-900 px-3 py-1 text-lg font-semibold transition hover:brightness-125 sm:px-5 sm:py-3"
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
          className="rounded-full bg-brand-red px-3 py-1 text-lg font-semibold text-white transition hover:brightness-125 sm:px-5 sm:py-3 bg-blue-400"
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
                  handleContinue({
                    router,
                    module,
                    nextExercise,
                    handlePlay,
                    path,
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
  const {lesson, module} = useLesson()
  const router = useRouter()
  const shareUrl = `${process.env.NEXT_PUBLIC_URL}${path}/${module.slug.current}`
  const shareMessage = `${module.title} ${module.moduleType} by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER}`
  const shareButtonStyles =
    'shadow-xl shadow-gray-500/5 flex items-center gap-2 rounded-full px-4 py-2 bg-gray-700'

  const addProgressMutation = trpc.progress.add.useMutation()

  React.useEffect(() => {
    // since this is the last lesson and we show the "module complete" overlay
    // we run this when the effect renders marking the lesson complete
    addProgressMutation.mutate({lessonSlug: lesson.slug})
  }, [])

  return (
    <OverlayWrapper className="px-5 pt-10 sm:pt-0 bg-gray-800">
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
          className="rounded-full bg-gray-900 px-3 py-1 text-lg font-semibold transition hover:brightness-125 sm:px-5 sm:py-3"
          onClick={handlePlay}
        >
          Replay <span aria-hidden="true">↺</span>
        </button>
        <button
          onClick={() => {
            module.lessons &&
              router
                .push({
                  pathname: `${path}/[module]/[lesson]`,
                  query: {
                    module: module.slug.current,
                    lesson: module.lessons[0].slug,
                  },
                })
                .then(handlePlay)
          }}
          className="rounded-full bg-brand-red px-3 py-1 text-lg font-semibold text-white transition hover:brightness-125 sm:px-5 sm:py-3 bg-blue-400"
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
      className="flex w-full flex-col items-center justify-center py-5 md:flex-row bg-gray-800"
    >
      <div className="z-20 flex h-full flex-shrink-0 flex-col items-center justify-center gap-5 p-5 pb-10 text-center text-lg leading-relaxed sm:p-10 sm:pb-16">
        <div className="flex w-full flex-col items-center justify-center gap-2">
          {module.image && (
            <div className="relative ">
              <Image
                src={module.image}
                width={120}
                height={120}
                alt={module.title}
              />
            </div>
          )}
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
      <div className="prose flex w-full max-w-none flex-col p-5 prose-p:mb-0 prose-p:text-gray-200 sm:max-w-sm xl:max-w-lg xl:prose-p:mb-0">
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

export {DefaultOverlay, FinishedOverlay, BlockedOverlay, LoadingOverlay}

const handleContinue = async ({
  router,
  module,
  nextExercise,
  handlePlay,
  path,
}: {
  router: NextRouter
  module: Module
  section?: Section
  nextExercise?: Lesson | null
  handlePlay: () => void
  path: string
}) => {
  if (nextExercise?._type === 'solution') {
    const lesson =
      module.lessons &&
      module.lessons.find((lesson: Exercise) => {
        const solution = lesson.solution
        return solution?._key === nextExercise?._key
      })

    return (
      lesson &&
      (await router
        .push({
          query: {module: module.slug.current, lesson: lesson.slug},
          pathname: `${path}/[module]/[lesson]/solution`,
        })
        .then(() => handlePlay()))
    )
  }

  return await router
    .push({
      query: {module: module.slug.current, lesson: nextExercise?.slug},
      pathname: `${path}/[module]/[lesson]`,
    })
    .then(() => handlePlay())
}
