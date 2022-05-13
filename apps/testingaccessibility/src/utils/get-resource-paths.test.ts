import {getPathForLesson, getPathForSection} from './get-resource-paths'

test('correctly resolves lesson path', async () => {
  const lessonSlug = 'testing-zoom-in-the-browser'
  const expectedLessonPath = getPathForLesson(lessonSlug, modules as any)

  expect(expectedLessonPath).toStrictEqual({
    module: 'manual-testing',
    section: 'magnification-and-zoom-testing',
    lesson: 'testing-zoom-in-the-browser',
  })
})

test('correctly resolves section path', async () => {
  const sectionSlug = 'intro-and-setup'
  const expectedSectionPath = getPathForSection(sectionSlug, modules as any)

  expect(expectedSectionPath).toStrictEqual({
    module: 'manual-testing',
    section: 'intro-and-setup',
  })
})

const modules = [
  {
    slug: 'manual-testing',
    title: 'Manual Testing',
    sections: [
      {
        lessons: null,
        slug: 'intro-and-setup',
        title: 'Intro & Setup',
      },
      {
        lessons: [
          {
            slug: 'identify-issues-by-hitting-tab',
            title: 'Identify Issues by Hitting Tab',
          },
          {
            slug: 'refactoring-markup-for-keyboard-interactivity',
            title: 'Refactoring Markup for Keyboard Interactivity',
          },
          {
            slug: 'adding-additional-interactivity-with-javascript',
            title: 'Adding Additional Interactivity with JavaScript',
          },
          {
            slug: 'keyboard-testing-module-wrap-up',
            title: 'Keyboard Testing Module Wrap-up',
          },
        ],
        slug: 'keyboard-testing',
        title: 'Keyboard Testing',
      },
      {
        lessons: [
          {
            slug: 'identifying-common-issues-with-the-axe-accessibility-linter-and-devtools-accessibility-tree',
            title:
              'Identifying Common Issues with the Axe Accessibility Linter & DevTools Accessibility Tree',
          },
          {
            slug: 'checking-and-fixing-color-contrast-issues',
            title: 'Checking and Fixing Color Contrast Issues',
          },
          {
            slug: 'audit-issues-on-a-web-page-with-axe-developer-tools',
            title: 'Audit Issues on a Web Page with Axe Developer Tools',
          },
          {
            slug: 'visualize-heading-structure-with-the-web-developer-toolbar',
            title: 'Visualize Heading Structure with the Web Developer Toolbar',
          },
          {
            slug: 'update-a-contact-form-to-be-semantic',
            title: 'Update a Contact Form to be Semantic',
          },
          {
            slug: 'visualize-tab-stops-and-landmark-regions-with-accessibility-insights',
            title:
              'Visualize Tab Stops & Landmark Regions with Accessibility Insights',
          },
          {
            slug: 'developer-tools-summary-and-closing-challenge',
            title: 'Developer Tools Summary & Closing Challenge',
          },
        ],
        slug: 'testing-with-devtools',
        title: 'Testing with DevTools',
      },
      {
        lessons: [
          {
            slug: 'testing-zoom-in-the-browser',
            title: 'Testing Zoom in the Browser',
          },
          {
            slug: 'testing-responsiveness-with-devtools',
            title: 'Testing Responsiveness with DevTools',
          },
          {
            slug: 'zoom-at-the-os-level',
            title: 'Zoom at the OS Level',
          },
          {
            slug: 'fixing-zoom-issues-in-the-campspots-app',
            title: 'Fixing Zoom Issues in the CampSpots App',
          },
          {
            slug: 'testing-on-a-real-device-via-tethering-on-macos',
            title: 'Testing on a Real Device via Tethering on MacOS',
          },
        ],
        slug: 'magnification-and-zoom-testing',
        title: 'Magnification and Zoom Testing',
      },
      {
        lessons: [
          {
            slug: 'an-overview-of-screen-reader-software',
            title: 'An Overview of Screen Reader Software',
          },
          {
            slug: 'use-voiceover-to-read-and-audit-a-page',
            title: 'Use VoiceOver to Read & Audit a Page',
          },
          {
            slug: 'interact-with-the-site-menu-using-voiceover',
            title: 'Interact with the Site Menu using VoiceOver',
          },
          {
            slug: 'fixing-voiceover-announcements',
            title: 'Fixing VoiceOver Announcements',
          },
        ],
        slug: 'screen-reader-testing',
        title: 'Screen Reader Testing',
      },
    ],
  },
]
