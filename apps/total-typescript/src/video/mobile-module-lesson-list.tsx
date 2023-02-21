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
    <details className="no-marker group block border-t-2 border-gray-900 lg:hidden">
      <summary className="flex w-full cursor-pointer items-center justify-between gap-1 bg-gray-800 py-3 pl-4 pr-12 font-semibold leading-tight shadow-2xl shadow-black/40 transition marker:content-[''] after:absolute after:right-3 after:flex after:h-6 after:w-6 after:rotate-180 after:items-center after:justify-center after:rounded-full after:bg-gray-700 after:text-lg after:content-['↑'] group-open:after:rotate-0 hover:bg-gray-800">
        <Balancer>
          {section ? section.title : module.title}{' '}
          {section ? null : capitalize(module.moduleType)}{' '}
        </Balancer>
        <span className="text-sm font-normal text-gray-300 opacity-80">
          {exerciseCount || 0} exercises
        </span>
      </summary>
      <ModuleLessonListHeader module={module} path={path} section={section}>
        <LessonList path={path} />
      </ModuleLessonListHeader>
    </details>
  )
}
