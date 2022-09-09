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

const OverlayWrapper: React.FC<
  React.PropsWithChildren<{className?: string}>
> = ({children, className}) => {
  const {setDisplayOverlay} = useMuxPlayer()

  return (
    <div
      id="video-overlay"
      className="absolute top-0 left-0 flex items-center justify-center w-full bg-[#070B16] aspect-video"
    >
      <button
        className="absolute top-2 right-2 py-2 px-3 z-50 font-medium rounded flex items-center gap-1 hover:bg-gray-800 transition text-gray-200"
        onClick={() => {
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

type ExerciseOverlayProps = {
  lesson: SanityDocument
  nextLesson: SanityDocument
  module: SanityDocument
  handlePlay: () => void
  path: string
}

const ExerciseOverlay: React.FC<ExerciseOverlayProps> = ({
  lesson,
  nextLesson,
  module,
  handlePlay,
  path,
}) => {
  const {github} = module
  const {stackblitz} = lesson
  const router = useRouter()

  const Actions = () => {
    return (
      <>
        <button
          className="bg-gray-800 sm:px-5 px-3 sm:py-2 py-1 text-lg font-semibold rounded hover:bg-gray-700 transition"
          onClick={handlePlay}
        >
          Replay <span aria-hidden="true">↺</span>
        </button>
        {nextLesson && (
          <button
            className="text-lg bg-cyan-600 hover:bg-cyan-500 transition sm:px-5 px-3 sm:py-2 py-1 font-semibold rounded"
            onClick={() =>
              handleContinue(router, module, nextLesson, handlePlay, path)
            }
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

type DefaultOverlayProps = {
  nextLesson: SanityDocument
  module: SanityDocument
  handlePlay: () => void
  path: string
}

const DefaultOverlay: React.FC<DefaultOverlayProps> = ({
  nextLesson,
  module,
  handlePlay,
  path,
}) => {
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
          onClick={handlePlay}
        >
          Replay ↺
        </button>
        <button
          className="text-lg bg-cyan-600 hover:bg-cyan-500 transition rounded sm:px-5 px-3 sm:py-3 py-1 font-semibold"
          onClick={() =>
            handleContinue(router, module, nextLesson, handlePlay, path)
          }
        >
          Continue <span aria-hidden="true">→</span>
        </button>
      </div>
    </OverlayWrapper>
  )
}

type FinishedOverlayProps = {
  module: SanityDocument
  handlePlay: () => void
  path: string
}

const FinishedOverlay: React.FC<FinishedOverlayProps> = ({
  module,
  handlePlay,
  path,
}) => {
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

type BlockedOverlayProps = {
  module: SanityDocument
}

const BlockedOverlay: React.FC<BlockedOverlayProps> = ({module}) => {
  const router = useRouter()
  const handleOnSuccess = (subscriber: any) => {
    if (subscriber) {
      const redirectUrl = redirectUrlBuilder(subscriber, router.asPath)
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
      className="flex items-center justify-center w-full bg-[#070B16] md:aspect-video py-5"
    >
      <div className="p-5 z-20 left-0 top-0 w-full h-full flex flex-col gap-5 items-center justify-center text-center leading-relaxed text-lg">
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
            formId={3573840}
            subscribeApiURL={process.env.NEXT_PUBLIC_CONVERTKIT_SUBSCRIBE_URL}
            actionLabel="Continue Watching"
            fields={startedLearningField}
            onSuccess={(subscriber) => handleOnSuccess(subscriber)}
          />
          <p className="pt-2 text-base opacity-80">
            No spam, unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  )
}

export {ExerciseOverlay, DefaultOverlay, FinishedOverlay, BlockedOverlay}

const handleContinue = async (
  router: NextRouter,
  module: SanityDocument,
  nextLesson: SanityDocument,
  handlePlay: () => void,
  path: string,
) => {
  await router
    .push({
      query: {module: module.slug, lesson: nextLesson.slug},
      pathname: `${path}/[module]/[lesson]`,
    })
    .then(() => handlePlay())
}
