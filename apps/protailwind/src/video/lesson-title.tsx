import * as React from 'react'
import cx from 'classnames'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'

export const LessonTitle = () => {
  const {lesson} = useLesson()
  const {title, _type} = lesson
  return (
    <>
      <span
        className={cx(
          'inline-block rounded-full px-2.5 py-1 font-mono text-xs font-semibold uppercase sm:mt-5 2xl:mt-0',
          {
            'bg-teal-500/20 text-teal-600': _type === 'solution',
            'bg-brand-red/20 text-brand-red': _type === 'exercise',
            'bg-indigo-500/20 text-indigo-600': _type === 'explainer',
          },
        )}
      >
        {_type}
      </span>
      <h1 className="pb-5 pt-3 font-heading text-3xl font-black tracking-tight sm:text-4xl sm:leading-tight xl:text-[2.65rem] 2xl:text-4xl">
        {title}
      </h1>
    </>
  )
}
