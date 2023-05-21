import * as React from 'react'
import capitalize from 'lodash/capitalize'
import Balancer from 'react-wrap-balancer'
import ModuleLessonListHeader from './module-lesson-list-header'
import {LessonList} from './lesson-list'
import {type Module} from '../../schemas/module'
import {type Section} from '../../schemas/section'
import {type Lesson} from '../../schemas/lesson'

export const MobileModuleLessonList: React.FC<{
  lessonResourceRenderer: (
    path: string,
    module: Module,
    lesson: Lesson,
    section?: Section,
  ) => void
  module: Module
  section?: Section
  path: string
}> = ({module, path, section, lessonResourceRenderer}) => {
  const exerciseCount = section
    ? section.lessons && section.lessons.length
    : module.lessons && module.lessons.length
  return (
    <details data-mobile-module-lesson-list="">
      <summary>
        <Balancer>
          {section ? section.title : module.title}{' '}
          {section ? null : capitalize(module.moduleType)}{' '}
        </Balancer>
        <span data-byline="">{exerciseCount || 0} exercises</span>
      </summary>
      <ModuleLessonListHeader module={module} path={path}>
        <LessonList
          path={path}
          lessonResourceRenderer={lessonResourceRenderer}
        />
      </ModuleLessonListHeader>
    </details>
  )
}
