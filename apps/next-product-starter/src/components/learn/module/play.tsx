import * as React from 'react'
import Link from 'next/link'
import type {LessonResource} from '@types'
import find from 'lodash/find'

const Play: React.FC<{items: LessonResource[]; progress: any}> = ({
  items,
  progress,
}) => {
  const {isModuleInProgress, completedLessons, isModuleCompleted} = progress

  const buttonText = isModuleCompleted
    ? 'Watch Again'
    : isModuleInProgress
    ? 'Continue'
    : 'Start'

  const PlayButton = () => (
    <Link href={`/lessons/${progress.nextLesson.slug}`}>
      <a className="flex items-center group flex-shrink-0 space-x-2 font-semibold py-1">
        <span
          className={`p-1 rounded-full ${
            isModuleCompleted
              ? 'dark:bg-teal-800 bg-teal-200 dark:text-teal-500 text-teal-700'
              : 'bg-black dark:bg-white text-white dark:text-black'
          }  flex items-center justify-center`}
        >
          <i className={isModuleCompleted ? 'gg-check' : 'gg-play-button'} />
        </span>
        <span className="group-hover:underline">{buttonText}</span>
      </a>
    </Link>
  )

  const ProgressBar = () => {
    if (!isModuleInProgress) {
      return null
    }
    function isLessonCompleted(slug: string) {
      return find(completedLessons, {slug})
    }
    const width = `${100 / items.length}%`
    return (
      <div className="relative w-full h-2 flex max-w-xs">
        {items.map((item) => {
          const completed = isLessonCompleted(item.slug)
          return (
            <Link key={item.slug} href={`/lessons/${item.slug}`}>
              <a
                className={`${
                  completed
                    ? 'bg-teal-500 hover:bg-teal-400'
                    : 'bg-gray-400 hover:bg-gray-300'
                } border dark:border-black border-white h-full block`}
                style={{width}}
              />
            </Link>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between space-x-10">
      <PlayButton />
      {!isModuleCompleted && <ProgressBar />}
    </div>
  )
}

export default Play
