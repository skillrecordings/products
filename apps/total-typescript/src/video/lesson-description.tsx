import * as React from 'react'
import {PortableText} from '@portabletext/react'
import {take} from 'lodash'
import Link from 'next/link'
import cx from 'classnames'

import PortableTextComponents from './portable-text'

import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'

export const LessonDescription = () => {
  const {canShowVideo, loadingUserStatus} = useMuxPlayer()
  const {lesson} = useLesson()
  const {body} = lesson

  const displayedBody = canShowVideo ? body : take(body, 3)
  return (
    <div>
      <div
        className={cx(
          'prose relative max-w-none pt-5 prose-headings:font-semibold prose-headings:text-gray-100 prose-p:text-gray-300 sm:prose-lg xl:pt-8 2xl:pt-5',
          {
            'after:absolute after:bottom-0 after:left-0 after:h-1/2 after:w-full after:bg-gradient-to-b after:from-transparent after:via-gray-900 after:to-gray-900 after:content-[""] sm:after:via-[#0C1222] sm:after:to-[#0C1222] 2xl:after:via-gray-900/80 2xl:after:to-gray-900':
              !canShowVideo,
          },
        )}
      >
        <PortableText
          value={displayedBody}
          components={PortableTextComponents}
        />
      </div>
      {!canShowVideo && loadingUserStatus && (
        <div
          role="status"
          className="-translate-16 flex w-full animate-pulse flex-col gap-3"
        >
          <div className="h-3 w-2/3 rounded-full bg-gray-700"></div>
          <div className="h-3 rounded-full bg-gray-700"></div>
          <div className="h-3 w-1/2 rounded-full bg-gray-700"></div>
          <div className="h-3 w-5/6 rounded-full bg-gray-700"></div>
          <div className="h-3 w-2/5 rounded-full bg-gray-700"></div>
          <div className="h-3 w-1/3 rounded-full bg-gray-700"></div>
          <span className="sr-only">Loading {lesson._type}</span>
        </div>
      )}
      {!canShowVideo && !loadingUserStatus && (
        <div className="relative flex -translate-y-8 items-center justify-center rounded border border-gray-700/50 bg-gray-800 p-5 shadow-2xl before:absolute before:top-[-8px] before:h-4 before:w-4 before:rotate-45 before:border-l before:border-t before:border-gray-700/50 before:bg-gray-800 before:content-['']">
          <p className="prose max-w-none text-gray-200 prose-a:text-cyan-300 hover:prose-a:text-cyan-200 sm:prose-lg">
            This {lesson._type} is part of{' '}
            <Link href={'/buy'}>Total TypeScript Core Volume</Link> and can be
            unlocked immediately after purchase. Already purchased?{' '}
            <Link href="/login">Log in here.</Link>
          </p>
        </div>
      )}
    </div>
  )
}
