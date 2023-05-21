import * as React from 'react'
import {LessonList} from './lesson-list'
import ModuleLessonListHeader from './module-lesson-list-header'
import {type Module} from '../../schemas/module'
import {type Section} from '../../schemas/section'
import {type Lesson} from '../../schemas/lesson'

export const LargeScreenModuleLessonList: React.FC<{
  lessonResourceRenderer: (
    path: string,
    module: Module,
    lesson: Lesson,
    section?: Section,
  ) => void
  module: Module
  path: string
}> = ({module, path, lessonResourceRenderer}) => {
  return (
    <ModuleLessonListHeader module={module} path={path}>
      <LessonList lessonResourceRenderer={lessonResourceRenderer} path={path} />
    </ModuleLessonListHeader>
  )
}
