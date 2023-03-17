import * as React from 'react'
import {LessonList} from './lesson-list'
import ModuleLessonListHeader from './module-lesson-list-header'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'

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
