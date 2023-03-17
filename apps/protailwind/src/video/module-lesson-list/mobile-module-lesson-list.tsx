import * as React from 'react'
import capitalize from 'lodash/capitalize'
import Balancer from 'react-wrap-balancer'
import ModuleLessonListHeader from './module-lesson-list-header'
import {LessonList} from './lesson-list'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'

export const MobileModuleLessonList: React.FC<{
  module: Module
  section?: Section
  path: string
}> = ({module, path, section}) => {
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
        <LessonList path={path} />
      </ModuleLessonListHeader>
    </details>
  )
}
