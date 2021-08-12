import * as React from 'react'
import type {Viewer} from '@types'
import isEmpty from 'lodash/isEmpty'
import Link from 'next/link'
import pluralize from 'pluralize'
import Spinner from 'components/spinner'

const CallToAction: React.FC<{
  viewer: Viewer
  nextLesson: any
  currentModule: any
  firstLesson: any
  progress: any
}> = ({viewer, firstLesson, nextLesson, progress, currentModule}) => {
  const {completedLessonsCount, totalLessons} = progress
  const leftToWatch = totalLessons - completedLessonsCount
  const greeting = isEmpty(viewer?.name)
    ? `Hello, ready to ${
        completedLessonsCount > 0 ? 'continue' : 'start'
      } learning?`
    : `Hey ${viewer.name}, ready to continue learning?`

  return (
    <div className="bg-gray-100 dark:bg-gray-900 leading-tight">
      <div className="p-8">
        <h1 className="text-xl font-semibold leading-tight">{greeting}</h1>
        {currentModule.title && leftToWatch !== 0 && (
          <p className="pt-2 opacity-80">
            There {pluralize('is', leftToWatch)}{' '}
            {pluralize('lesson', leftToWatch, true)} left to watch in{' '}
            <strong>{currentModule?.title}</strong>
          </p>
        )}
      </div>
      {currentModule ? (
        <>
          {nextLesson ? (
            <Link href={`/lessons/${nextLesson.slug}`}>
              <a className="px-8 py-5 flex bg-gray-200 dark:bg-gray-800 items-center font-semibold space-x-2 hover:underline">
                <span className="flex items-center justify-center p-1 rounded-full dark:bg-white dark:text-black bg-black text-white">
                  <i className="gg-play-button" />
                </span>
                <span>Continue Learning</span>
              </a>
            </Link>
          ) : (
            <div className="p-8">
              <Spinner />
            </div>
          )}
        </>
      ) : (
        <>
          {firstLesson ? (
            <Link href={`/lessons/${firstLesson.slug}`}>
              <a className="px-8 py-5 flex bg-gray-200 dark:bg-gray-800 items-center font-semibold space-x-2 hover:underline">
                <span className="flex items-center justify-center p-1 rounded-full dark:bg-white dark:text-black bg-black text-white">
                  <i className="gg-play-button" />
                </span>
                <span>Start Learning</span>
              </a>
            </Link>
          ) : (
            <div className="flex w-full h-full items-center justify-center bg-gray-100 dark:bg-gray-900 p-10">
              <Spinner />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CallToAction
