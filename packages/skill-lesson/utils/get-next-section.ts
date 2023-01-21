import find from 'lodash/find'
import indexOf from 'lodash/indexOf'
import {LessonResource} from '../schemas/lesson-resource'
import {first} from 'lodash'
import {Module, Section} from '../hooks/use-progress'

export const getNextSection = ({
  module,
  currentSection,
}: {
  module: Module
  currentSection?: Section
}) => {
  const sections = module.sections

  const current = find(sections, {_id: currentSection?._id}) || first(sections)
  const nextSectionIndex = indexOf(sections, current) + 1
  const nextSection = sections[nextSectionIndex]
  return nextSection
}
