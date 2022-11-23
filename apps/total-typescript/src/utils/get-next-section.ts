import {SanityDocument} from '@sanity/client'
import find from 'lodash/find'
import indexOf from 'lodash/indexOf'

export const getNextSection = ({
  module,
  currentSection,
}: {
  module: SanityDocument
  currentSection: SanityDocument
}) => {
  const sections = module.sections

  const current = find(sections, {_id: currentSection._id})
  const nextSectionIndex = indexOf(sections, current) + 1
  const nextSection = sections[nextSectionIndex]
  return nextSection
}
