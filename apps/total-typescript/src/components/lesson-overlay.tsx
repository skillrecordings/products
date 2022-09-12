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
import {StackBlitzIframe} from 'templates/lesson-template'
import {XIcon} from '@heroicons/react/solid'
import cx from 'classnames'
import {track} from '../utils/analytics'
import {setUserId} from '@amplitude/analytics-browser'
import {sanityClient} from 'utils/sanity-client'
import {PortableText, toPlainText} from '@portabletext/react'

const OverlayWrapper: React.FC<
  React.PropsWithChildren<{className?: string}>
> = ({children, className}) => {
  const {setDisplayOverlay, lesson, module} = useMuxPlayer()

  return (
    <div
      id="video-overlay"
      className="absolute top-0 left-0 flex items-center justify-center w-full bg-[#070B16] aspect-video"
    >
      <button
        className="absolute top-2 right-2 py-2 px-3 z-50 font-medium rounded flex items-center gap-1 hover:bg-gray-800 transition text-gray-200"
        onClick={() => {
          track('dismissed video overlay', {
            lesson: lesson.slug,
            module: module.slug,
          })
          setDisplayOverlay(false)
        }}
      >
        Dismiss <XIcon className="w-5 h-5" aria-hidden="true" />
      </button>
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
  const {nextLesson, lesson, module, path} = useMuxPlayer()
  const {github} = module
  const {stackblitz} = lesson
  const router = useRouter()

  const Actions = () => {
    return (
      <>
        <button
          className="bg-gray-800 sm:px-5 px-3 sm:py-2 py-1 text-lg font-semibold rounded hover:bg-gray-700 transition"
          onClick={() => {
            track('clicked replay', {
              lesson: lesson.slug,
              module: module.slug,
              location: 'lesson',
            })
            handlePlay()
          }}
        >
          Replay <span aria-hidden="true">↺</span>
        </button>
        {nextLesson && (
          <button
            className="text-lg bg-cyan-600 hover:bg-cyan-500 transition sm:px-5 px-3 sm:py-2 py-1 font-semibold rounded"
            onClick={() => {
              track('clicked continue to solution', {
                lesson: lesson.slug,
                module: module.slug,
                location: 'lesson',
              })
              handleContinue(router, module, nextLesson, handlePlay, path)
            }}
          >
            Solution <span aria-hidden="true">→</span>
          </button>
        )}
      </>
    )
  }

  return (
    <OverlayWrapper>
      {stackblitz ? (
        <>
          <div>
            <div className="py-4 pb-3 font-medium">
              Now it's your turn! Try solving this exercise.
            </div>
          </div>
          <div className="w-full h-full aspect-video relative sm:block hidden">
            <StackBlitzIframe lesson={lesson} module={module} />
          </div>
          <div className="px-5 py-2 flex gap-2 justify-center w-full">
            <Actions />
          </div>
        </>
      ) : (
        <>
          <p className="text-3xl font-bold font-text">Now it’s your turn!</p>
          <p className="">
            Try solving this exercise inside{' '}
            <a
              href={`https://github.com/total-typescript/${github.repo}/blob/main/${lesson.stackblitz.openFile}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 font-mono text-sm py-0.5 px-1 bg-gray-800 rounded-sm"
            >
              <IconGithub /> {stackblitz.openFile}
            </a>{' '}
            file.
          </p>
          <Actions />
        </>
      )}
    </OverlayWrapper>
  )
}

const DefaultOverlay: React.FC<OverlayProps> = ({handlePlay}) => {
  const {nextLesson, module, path, lesson} = useMuxPlayer()
  const router = useRouter()
  const {image} = module
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
        {nextLesson.title}
      </p>
      <div className="flex items-center justify-center gap-5 sm:py-8 py-4">
        <button
          className="bg-gray-800 hover:bg-gray-700 transition sm:px-5 px-3 sm:py-3 py-1 text-lg font-semibold rounded"
          onClick={() => {
            track('clicked replay', {
              lesson: lesson.slug,
              module: module.slug,
              location: 'lesson',
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
              lesson: lesson.slug,
              module: module.slug,
              location: 'lesson',
            })
            completeLesson(lesson.slug).then(() => {
              return handleContinue(
                router,
                module,
                nextLesson,
                handlePlay,
                path,
              )
            })
          }}
        >
          Complete <span aria-hidden="true">→</span>
        </button>
      </div>
    </OverlayWrapper>
  )
}

const FinishedOverlay: React.FC<OverlayProps> = ({handlePlay}) => {
  const {module, path} = useMuxPlayer()
  const router = useRouter()
  const shareUrl = `${process.env.NEXT_PUBLIC_URL}${path}/${module.slug}`
  const shareMessage = `${module.title} ${module.moduleType} by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER}`
  const shareButtonStyles =
    'bg-gray-800 flex items-center gap-2 rounded px-3 py-2 hover:bg-gray-700'
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
                pathname: `/${path}/[module]/[lesson]`,
                query: {module: module.slug, lesson: module.resources[0].slug},
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
  const [ctaText, setCtaText] = React.useState()

  React.useEffect(() => {
    sanityClient
      .fetch(
        `
      *[_type == 'cta' && slug.current == "free-tutorial"][0]{
        body
      }
    `,
      )
      .then((response) => {
        setCtaText(response.body)
      })
  }, [])

  const handleOnSuccess = (subscriber: any, email?: string) => {
    if (subscriber) {
      const redirectUrl = redirectUrlBuilder(subscriber, router.asPath)
      email && setUserId(email)
      track('subscribed to email list', {
        lesson: lesson.slug,
        module: module.slug,
        location: 'lesson',
      })
      router.push(redirectUrl).then(() => {
        toast(
          () => (
            <div>
              <strong>Confirm your subscription</strong>
              <p>
                Please check your inbox for an email that just got sent. Thanks
                and enjoy!
              </p>
            </div>
          ),
          {
            icon: '✉️',
            duration: 6000,
          },
        )
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
      className="flex flex-col lg:flex-row items-center justify-center w-full bg-[#070B16] md:aspect-video py-5"
    >
      <div className="p-5 z-20 left-0 top-0 lg:w-1/2 w-full h-full flex flex-col gap-5 items-center justify-center text-center leading-relaxed text-lg">
        <div className="flex flex-col items-center justify-center gap-2 w-full">
          <div className="2xl:block sm:hidden block">
            <Image
              src={module.image}
              width={200}
              height={200}
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
            onSuccess={(subscriber, email) =>
              handleOnSuccess(subscriber, email)
            }
          />
          <p className="pt-2 text-base opacity-80">
            No spam, unsubscribe at any time.
          </p>
        </div>
      </div>
      <div className="flex flex-col p-10 lg:w-1/2 w-full  prose prose-lg lg:max-w-xl max-w-none text-white">
        <h2>This is a free tutorial.</h2>
        {ctaText && <PortableText value={ctaText} />}
      </div>
    </div>
  )
}

export {ExerciseOverlay, DefaultOverlay, FinishedOverlay, BlockedOverlay}

const completeLesson = async (lessonSlug: string) => {
  return await fetch(`/api/progress/${lessonSlug}`, {
    method: 'POST',
  }).then((response) => response.json())
}

const handleContinue = async (
  router: NextRouter,
  module: SanityDocument,
  nextLesson: SanityDocument,
  handlePlay: () => void,
  path: string,
) => {
  return await router
    .push({
      query: {module: module.slug, lesson: nextLesson.slug},
      pathname: `${path}/[module]/[lesson]`,
    })
    .then(() => handlePlay())
}
