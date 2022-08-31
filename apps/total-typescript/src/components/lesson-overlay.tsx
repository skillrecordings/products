import SanityClientConstructor, {SanityDocument} from '@sanity/client'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import {Facebook, Twitter} from '@skillrecordings/react'
import Image from 'next/image'
import {NextRouter, useRouter} from 'next/router'
import React from 'react'
import {IconGithub} from './icons'

const OverlayWrapper: React.FC<React.PropsWithChildren> = ({children}) => {
  return (
    <div
      id="video-overlay"
      className="absolute top-0 left-0 flex items-center justify-center w-full bg-[#070B16] aspect-video"
    >
      <div className="p-5 z-20 absolute left-0 top-0 w-full h-full flex flex-col gap-5 items-center justify-center text-center leading-relaxed text-lg">
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

  return (
    <OverlayWrapper>
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
      <div className="flex items-center justify-center gap-5">
        <button
          className="bg-gray-900 px-5 py-3 text-lg font-semibold rounded"
          onClick={handlePlay}
        >
          Replay ↺
        </button>
        {nextLesson && (
          <button
            className="text-lg bg-blue-500 rounded px-5 py-3 font-semibold"
            onClick={() =>
              handleContinue(router, module, nextLesson, handlePlay, path)
            }
          >
            Solution →
          </button>
        )}
      </div>
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

  return (
    <OverlayWrapper>
      <p className="text-3xl font-bold font-text">
        Up next: {nextLesson.title}
      </p>
      <div className="flex items-center justify-center gap-5">
        <button
          className="bg-gray-900 px-5 py-3 text-lg font-semibold rounded"
          onClick={handlePlay}
        >
          Replay ↺
        </button>
        <button
          className="text-lg bg-blue-500 rounded px-5 py-3 font-semibold"
          onClick={() =>
            handleContinue(router, module, nextLesson, handlePlay, path)
          }
        >
          Continue →
        </button>
      </div>
    </OverlayWrapper>
  )
}

type FinishedOverlayProps = {
  module: SanityDocument
  handlePlay: () => void
}

const FinishedOverlay: React.FC<FinishedOverlayProps> = ({
  module,
  handlePlay,
}) => {
  const router = useRouter()
  const shareUrl = `${process.env.NEXT_PUBLIC_URL}/${module.slug}`
  const shareMessage = `${module.title} by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER}`
  return (
    <OverlayWrapper>
      <p className="text-3xl font-bold font-text">
        Share this {module.moduleType} with your friends
      </p>
      <div className="flex items-center gap-2">
        <Twitter
          link={shareUrl}
          message={shareMessage}
          className="bg-blue-500 p-5 rounded"
        />
        <Facebook
          link={shareUrl}
          message={shareMessage}
          className="bg-blue-500 p-5 rounded"
        />
      </div>
      <div className="flex items-center justify-center gap-5">
        <button
          className="bg-gray-900 px-5 py-3 text-lg font-semibold rounded"
          onClick={handlePlay}
        >
          Replay ↺
        </button>
        <button
          onClick={() => {
            router
              .push({
                pathname: '/[module]/[lesson]',
                query: {module: module.slug, lesson: module.resources[0].slug},
              })
              .then(handlePlay)
          }}
          className="bg-gray-900 px-5 py-3 text-lg font-semibold rounded"
        >
          Play from beginning
        </button>
      </div>
    </OverlayWrapper>
  )
}

type BlockedOverlayProps = {
  module: SanityDocument
  subscriberHasToConfirm?: boolean
}

const BlockedOverlay: React.FC<BlockedOverlayProps> = ({
  module,
  subscriberHasToConfirm = false,
}) => {
  const router = useRouter()
  return (
    <OverlayWrapper>
      {subscriberHasToConfirm ? (
        <div className="max-w-lg">
          <Image
            src={require('../../public/assets/email-confirm.svg')}
            alt="confirm your email address"
          />
          <h2 className="py-6 text-4xl font-semibold">
            Please check your inbox for an email that just got sent.
          </h2>
          <p className="sm:text-lg leading-relaxed mx-auto pb-8 text-gray-200">
            {' '}
            You'll need to click the confirmation link continue watching this{' '}
            {module.moduleType}. If you don't see the email after a few minutes,
            you might check your spam folder or other filters and add{' '}
            <strong>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</strong> to your
            contacts.
          </p>
        </div>
      ) : (
        <>
          <div className="2xl:block hidden">
            <Image
              src={require('../../public/assets/landing/scroll-ts@2x.png')}
              width={200}
              height={200}
              alt="TS Scroll"
            />
          </div>
          <h2 className="text-4xl font-semibold">
            Level up with {module.title}
          </h2>
          <h3 className="text-xl pb-4">
            Access all lessons in this {module.moduleType}.
          </h3>
          <SubscribeToConvertkitForm
            formId={3573840}
            actionLabel="Continue Watching"
            onSuccess={(subscriber: any) => {
              if (subscriber) {
                // send them to confirm page
                const redirectUrl = redirectUrlBuilder(
                  subscriber,
                  `/confirm?source=video`,
                )
                router.push(redirectUrl)
                // OR stay on current page and reload subscriber
                // const redirectUrl = redirectUrlBuilder(
                //   subscriber,
                //   router.asPath,
                // )
                // window.location.assign(redirectUrl)
              }
            }}
          />
          <p className="pt-2 text-base opacity-80">
            No spam, unsubscribe at any time.
          </p>
        </>
      )}
    </OverlayWrapper>
  )
}

export {ExerciseOverlay, DefaultOverlay, FinishedOverlay, BlockedOverlay}

const handleContinue = (
  router: NextRouter,
  module: SanityDocument,
  nextLesson: SanityDocument,
  handlePlay: () => void,
  path: string,
) => {
  router
    .push({
      query: {module: module.slug, lesson: nextLesson.slug},
      pathname: `${path}/[module]/[lesson]`,
    })
    .then(handlePlay)
}
