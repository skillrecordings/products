import {SanityDocument} from '@sanity/client'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'

type Module = {
  slug: string
  sections: Section[]
} & SanityDocument

type Section = {
  slug: string
  lessons: Lesson[]
} & SanityDocument

type Lesson = {
  slug: string
} & SanityDocument

type GetLessonPathProps =
  | {
      module: string
      section: string
      lesson: string
    }
  | {}

type GetSectionPathProps =
  | {
      module: string
      section: string
    }
  | {}

export const getPathForLesson = (
  lessonSlug: string,
  modules: Module[],
): GetLessonPathProps => {
  let path = {}
  modules?.map((module: Module) => {
    module.sections?.forEach((section: Section) => {
      const currentLessonInSections = find(section.lessons, {slug: lessonSlug})
      if (!isEmpty(currentLessonInSections)) {
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
  modules: Module[],
): GetSectionPathProps => {
  let path = {}
  modules?.forEach((module: Module) => {
    const currentSectionInModule = find(module?.sections, {slug: sectionSlug})
    if (!isEmpty(currentSectionInModule)) {
      path = {
        module: module.slug,
        section: sectionSlug,
      }
    }
  })
  return path
}
