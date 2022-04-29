import {SanityDocument} from '@sanity/client'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'

export const getPathForLesson = (
  lessonSlug: string,
  modules: SanityDocument[],
) => {
  let path = {}
  modules?.map((module: any) => {
    module.sections.forEach((section: any) => {
      if (!isEmpty(find(section.lessons, {slug: lessonSlug}))) {
        path = {
          module: module.slug,
          section: section.slug,
          lesson: lessonSlug,
        }
      }
    })
  })
  return path
}
export const getPathForSection = (
  sectionSlug: string,
  modules: SanityDocument[],
) => {
  let path = {}
  modules?.forEach((module: any) => {
    if (!isEmpty(find(module?.sections, {slug: sectionSlug}))) {
      path = {
        module: module.slug,
        section: sectionSlug,
      }
    }
  })
  return path
}
