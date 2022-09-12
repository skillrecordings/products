import {
  getModuleProgressForUser,
  getSectionProgressForUser,
  getNextUpLesson,
} from './progress'
import filter from 'lodash/filter'
import flatMap from 'lodash/flatMap'
import take from 'lodash/take'

const mockLessonProgress = [
  {
    lessonSlug: 'identify-issues-by-hitting-tab',
    completedAt: new Date(),
  },
  {
    lessonSlug: 'keyboard-testing-module-wrap-up',
    completedAt: new Date(),
  },
  {
    lessonSlug: 'visualize-heading-structure-with-the-web-developer-toolbar',
    completedAt: null,
  },
  {
    lessonSlug: 'checking-and-fixing-color-contrast-issues',
    completedAt: new Date(),
  },
]

test('gets section progress for user', async () => {
  const section = mockSection[1]
  const progress = getSectionProgressForUser(
    mockLessonProgress as any,
    section as any,
  )

  expect(progress).toEqual({
    completedLessons: take(mockLessonProgress, 2),
    percentCompleted: 50,
    isCompleted: false,
  })
})

test('gets module progress for user', async () => {
  const sections = flatMap(
    filter(mockModuleSections, (section: any) => section.slug),
  )
  const progress = getModuleProgressForUser(
    mockLessonProgress as any,
    sections as any,
  )

  expect(progress).toEqual({
    completedSections: [],
    percentCompleted: 0,
    isCompleted: false,
  })
})

test('gets next up lesson', async () => {
  const nextUpLesson = getNextUpLesson(
    mockLessonProgress as any,
    mockModules as any,
  )

  expect(nextUpLesson).toEqual({
    slug: 'audit-issues-on-a-web-page-with-axe-developer-tools',
  })
})

const mockModules = [
  {
    slug: 'manual-testing',
    sections: [
      {
        lessons: null,
        slug: 'intro-and-setup',
      },
      {
        lessons: [
          {
            slug: 'identify-issues-by-hitting-tab',
          },
          {
            slug: 'refactoring-markup-for-keyboard-interactivity',
          },
          {
            slug: 'adding-additional-interactivity-with-javascript',
          },
          {
            slug: 'keyboard-testing-module-wrap-up',
          },
        ],
        slug: 'keyboard-testing',
      },
      {
        lessons: [
          {
            slug: 'identifying-common-issues-with-the-axe-accessibility-linter-and-devtools-accessibility-tree',
          },
          {
            slug: 'checking-and-fixing-color-contrast-issues',
          },
          {
            slug: 'audit-issues-on-a-web-page-with-axe-developer-tools',
          },
          {
            slug: 'visualize-heading-structure-with-the-web-developer-toolbar',
          },
          {
            slug: 'update-a-contact-form-to-be-semantic',
          },
          {
            slug: 'visualize-tab-stops-and-landmark-regions-with-accessibility-insights',
          },
          {
            slug: 'developer-tools-summary-and-closing-challenge',
          },
        ],
        slug: 'testing-with-devtools',
      },
      {
        lessons: [
          {
            slug: 'testing-zoom-in-the-browser',
          },
          {
            slug: 'testing-responsiveness-with-devtools',
          },
          {
            slug: 'zoom-at-the-os-level',
          },
          {
            slug: 'fixing-zoom-issues-in-the-campspots-app',
          },
          {
            slug: 'testing-on-a-real-device-via-tethering-on-macos',
          },
        ],
        slug: 'magnification-and-zoom-testing',
      },
      {
        lessons: [
          {
            slug: 'an-overview-of-screen-reader-software',
          },
          {
            slug: 'use-voiceover-to-read-and-audit-a-page',
          },
          {
            slug: 'interact-with-the-site-menu-using-voiceover',
          },
          {
            slug: 'fixing-voiceover-announcements',
          },
        ],
        slug: 'screen-reader-testing',
      },
    ],
  },
]

const mockModuleSections = mockModules.flatMap((module) => module.sections)
const mockSection = mockModules[0].sections.map((section) => section)
