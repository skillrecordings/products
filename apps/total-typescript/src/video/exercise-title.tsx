import * as React from 'react'
import cx from 'classnames'

import {type LessonResource} from './lesson-resources'

export const ExerciseTitle: React.FC<{exercise: LessonResource}> = ({
  exercise,
}) => {
  const {title, _type} = exercise
  return (
    <>
      <span
        className={cx(
          'inline-block rounded-full px-2.5 py-1 font-mono text-xs font-semibold uppercase sm:mt-5 lg:text-sm 2xl:mt-0 2xl:text-xs',
          {
            'bg-cyan-500/20 text-cyan-300': _type === 'solution',
            'bg-orange-500/20 text-orange-300': _type === 'exercise',
            'bg-indigo-500/20 text-indigo-200': _type === 'explainer',
          },
        )}
      >
        {_type !== 'exercise' ? _type : 'Problem'}
      </span>
      <h1 className="pb-5 pt-3 text-3xl font-bold tracking-tight sm:text-4xl xl:text-[2.65rem] 2xl:text-4xl">
        {title}
      </h1>
    </>
  )
}
