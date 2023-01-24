import * as React from 'react'
import {type SanityDocument} from '@sanity/client'
import {LessonList} from './lesson-list'
import ModuleLessonListHeader from './module-lesson-list-header'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'

export const LargeScreenModuleLessonList: React.FC<{
  module: Module
  section?: Section
  path: string
}> = ({module, path, section}) => {
  return (
    <ModuleLessonListHeader
      className="hidden lg:block"
      module={module}
      path={path}
      section={section}
    >
      <LessonList path={path} />
    </ModuleLessonListHeader>
  )
}
