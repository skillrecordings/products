import * as React from 'react'
import find from 'lodash/find'
import Link from 'next/link'
import type {LessonResource} from '@types'
import {convertTimeWithTitles} from 'utils/time-utils'

const Lessons: React.FC<{items: LessonResource[]; progress: any}> = ({
  items,
  progress,
}) => {
  const {completedLessons} = progress

  function isLessonCompleted(slug: string) {
    return find(completedLessons, {slug})
  }

  return items ? (
    <ol>
      {items.map((item, i) => {
        const completed = isLessonCompleted(item.slug)
        return (
          <li key={item.id}>
            <Link href={item.path}>
              <a
                className={`py-2 px-3 flex items-center group font-medium ${
                  i % 2 === 0
                    ? 'dark:bg-white bg-white dark:bg-opacity-5 bg-opacity-50'
                    : ''
                } ${completed ? 'text-opacity-70' : ''}`}
              >
                {completed && <i className={`gg-check opacity-90`} />}
                <div
                  className={`flex items-center justify-between w-full ${
                    completed ? 'opacity-70 hover:opacity-100' : ''
                  }`}
                >
                  <span className="group-hover:underline">{item.title}</span>
                  <time className="text-sm opacity-50">
                    {convertTimeWithTitles(item.duration, {
                      showSeconds: true,
                    })}
                  </time>
                </div>
              </a>
            </Link>
          </li>
        )
      })}
    </ol>
  ) : null
}

export default Lessons
