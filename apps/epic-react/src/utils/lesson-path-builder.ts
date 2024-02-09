import {type Module} from '@skillrecordings/skill-lesson/schemas/module'
import {type Section} from '@skillrecordings/skill-lesson/schemas/section'
import {type Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import pluralize from 'pluralize'

export const lessonPathBuilder = (
  lesson: Lesson,
  module: Module,
  section?: Section,
) => {
  const pathname = `/${pluralize(module.moduleType)}/[module]/[lesson]`
  const query = {
    lesson: lesson.slug,
    module: module.slug.current,
  }
  return {pathname, query}
}
