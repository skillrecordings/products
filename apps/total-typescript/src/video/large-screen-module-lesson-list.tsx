import * as React from 'react'
import {type SanityDocument} from '@sanity/client'
import {LessonList} from './lesson-list'
import ModuleLessonListHeader from './module-lesson-list-header'

export const LargeScreenModuleLessonList: React.FC<{
  module: SanityDocument
  section?: SanityDocument
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
