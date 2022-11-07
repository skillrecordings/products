import * as React from 'react'
import LessonList from '../lesson-list'
import ModuleLessonListHeader from '../module-lesson-list-header'
import {SanityDocument} from '@sanity/client'

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
      <LessonList module={module} path={path} section={section} />
    </ModuleLessonListHeader>
  )
}
