import {SanityDocument} from '@sanity/client'
import {Facebook, LinkedIn, Twitter} from '@skillrecordings/react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React from 'react'
import {IconGithub} from './icons'

const OverlayWrapper: React.FC<React.PropsWithChildren> = ({children}) => {
  return (
    <div className="absolute top-0 left-0 flex items-center justify-center w-full bg-[#070B16] aspect-video">
      <div className="z-20 absolute left-0 top-0 w-full h-full flex flex-col gap-5 items-center justify-center text-center leading-relaxed text-lg">
        {children}
      </div>
    </div>
  )
}

type ExerciseOverlayProps = {
  lesson: SanityDocument
  nextLesson: SanityDocument
  course: SanityDocument
  handlePlay: () => void
}

const ExerciseOverlay: React.FC<ExerciseOverlayProps> = ({
  lesson,
  nextLesson,
  course,
  handlePlay,
}) => {
  const {stackblitz} = lesson
  const router = useRouter()
  return (
    <OverlayWrapper>
      <p className="text-3xl font-bold font-text">Now it’s your turn!</p>
      <p className="flex flex-wrap gap-1">
        Try solving this exercise by editing{' '}
        <a
          href="#embed"
          className="flex items-center justify-center gap-1 font-mono text-sm py-0.5 px-1 bg-gray-800 rounded-sm"
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
            className="text-lg bg-indigo-500 rounded px-5 py-3 font-semibold"
            onClick={() => {
              router
                .push({
                  query: {course: course.slug, lesson: nextLesson.slug},
                  pathname: '/[course]/[lesson]',
                })
                .then(handlePlay)
            }}
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
  course: SanityDocument
  handlePlay: () => void
}

const DefaultOverlay: React.FC<DefaultOverlayProps> = ({
  nextLesson,
  course,
  handlePlay,
}) => {
  return (
    <OverlayWrapper>
      <p className="text-3xl font-bold font-text">Up next</p>
      <p>{nextLesson.title}</p>
      <div className="flex items-center justify-center gap-5">
        <button
          className="bg-gray-900 px-5 py-3 text-lg font-semibold rounded"
          onClick={handlePlay}
        >
          Replay ↺
        </button>

        <Link
          href={{
            pathname: '/[course]/[lesson]',
            query: {
              course: course.slug,
              lesson: nextLesson.slug,
            },
          }}
          passHref
        >
          <a className="text-lg bg-indigo-500 rounded px-5 py-3 font-semibold">
            Continue →
          </a>
        </Link>
      </div>
    </OverlayWrapper>
  )
}

type FinishedOverlayProps = {
  course: SanityDocument
  handlePlay: () => void
}

const FinishedOverlay: React.FC<FinishedOverlayProps> = ({
  course,
  handlePlay,
}) => {
  const router = useRouter()
  const shareUrl = `${process.env.NEXT_PUBLIC_URL}/${course.slug}`
  const shareMessage = `${course.title}, course by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER}`
  return (
    <OverlayWrapper>
      <p className="text-3xl font-bold font-text">
        Share this course with your friends
      </p>
      <div className="flex items-center gap-2">
        <Twitter
          link={shareUrl}
          message={shareMessage}
          className="bg-indigo-500 p-5 rounded"
        />
        <Facebook
          link={shareUrl}
          message={shareMessage}
          className="bg-indigo-500 p-5 rounded"
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
                pathname: '/[course]/[lesson]',
                query: {course: course.slug, lesson: course.resources[0].slug},
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

export {ExerciseOverlay, DefaultOverlay, FinishedOverlay}
