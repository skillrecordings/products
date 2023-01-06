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
  const {lesson, module} = useLesson()
  const {body} = lesson

  const displayedBody = canShowVideo ? body : take(body, 3)
  return (
    <div>
      <div
        className={cx(
          'prose relative max-w-none pt-5 prose-headings:font-heading prose-headings:font-black prose-code:text-[90%] xl:pt-8 2xl:pt-5',
          {
            'after:absolute after:bottom-0 after:left-0 after:h-1/2 after:w-full after:bg-gradient-to-b after:from-transparent after:via-gray-100 after:to-gray-100 after:content-[""]':
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
          <div className="h-3 w-2/3 rounded-full bg-gray-200"></div>
          <div className="h-3 rounded-full bg-gray-200"></div>
          <div className="h-3 w-1/2 rounded-full bg-gray-200"></div>
          <div className="h-3 w-5/6 rounded-full bg-gray-200"></div>
          <div className="h-3 w-2/5 rounded-full bg-gray-200"></div>
          <div className="h-3 w-1/3 rounded-full bg-gray-200"></div>
          <span className="sr-only">Loading {lesson._type}</span>
        </div>
      )}

      {!canShowVideo && !loadingUserStatus && module.moduleType === 'workshop' && (
        <div className="relative flex -translate-y-8 items-center justify-center rounded-lg bg-white p-5 shadow-2xl shadow-gray-400/40 before:absolute before:top-[-8px] before:h-4 before:w-4 before:rotate-45 before:bg-white before:content-['']">
          <p className="prose max-w-none text-gray-800 prose-a:text-brand-red">
            This {lesson._type} is part of{' '}
            <Link href={`/workshops/${module.slug.current}`}>
              <a>{module.title} Workshop</a>
            </Link>{' '}
            and can be unlocked immediately after purchase. Already purchased?{' '}
            <Link href="/login">
              <a>Log in here.</a>
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
