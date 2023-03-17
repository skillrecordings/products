import * as React from 'react'
import {LessonList} from 'video/module-lesson-list/lesson-list'
import ModuleLessonListHeader from 'video/module-lesson-list/module-lesson-list-header'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'

export const LargeScreenModuleLessonList: React.FC<{
  module: Module
  path: string
}> = ({module, path}) => {
  return (
    <ModuleLessonListHeader module={module} path={path}>
      <LessonList path={path} />
    </ModuleLessonListHeader>
  )
}
