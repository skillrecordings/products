import {renderToStaticMarkup} from 'react-dom/server'
import {getModuleProgress} from '@skillrecordings/skill-lesson/lib/module-progress'
import {sanityClientNoCdn} from '@/utils/sanity-client'
import {canEarnCourseCertificate} from './course-certificate.server'
import {CertificateTemplate} from './certificate-template'

jest.mock('@skillrecordings/skill-lesson/lib/module-progress', () => ({
  getModuleProgress: jest.fn(),
}))
jest.mock('@/utils/sanity-client', () => ({
  sanityClientNoCdn: {fetch: jest.fn()},
}))

const workshops = Array.from({length: 7}, (_, index) => `workshop-${index}`)
const fetchWorkshops = jest.mocked(sanityClientNoCdn.fetch)
const getProgress = jest.mocked(getModuleProgress)

beforeEach(() => {
  fetchWorkshops.mockResolvedValue(
    [...workshops, 'welcome-to-epic-react'].map((slug) => ({slug})),
  )
  getProgress.mockResolvedValue({moduleCompleted: true, lessonCount: 10})
})

it('unlocks for an authenticated learner who completed every published workshop', async () => {
  await expect(canEarnCourseCertificate('test-user')).resolves.toBe(true)
  expect(fetchWorkshops).toHaveBeenCalledWith(
    expect.stringContaining('state == "published"'),
  )
  expect(getProgress.mock.calls).toEqual(
    workshops.map((moduleSlug) => [{moduleSlug, userId: 'test-user'}]),
  )
})

it('stays locked if one lesson is missing', async () => {
  getProgress.mockResolvedValueOnce({
    moduleCompleted: false,
    completedLessonCount: 9,
    lessonCount: 10,
  })
  await expect(canEarnCourseCertificate('test-user')).resolves.toBe(false)
})

it('stays locked for signed-out learners and an empty catalog', async () => {
  await expect(canEarnCourseCertificate(undefined)).resolves.toBe(false)
  expect(fetchWorkshops).not.toHaveBeenCalled()
  fetchWorkshops.mockResolvedValue([{slug: 'welcome-to-epic-react'}])
  await expect(canEarnCourseCertificate('test-user')).resolves.toBe(false)
  expect(getProgress).not.toHaveBeenCalled()
})

it('skips malformed published rows without locking eligible learners out', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
  try {
    fetchWorkshops.mockResolvedValue([
      {slug: 'valid-workshop'},
      {slug: null},
      {slug: '  '},
    ])
    await expect(canEarnCourseCertificate('test-user')).resolves.toBe(true)
    expect(warn).toHaveBeenCalledTimes(2)
    expect(getProgress.mock.calls).toEqual([
      [{moduleSlug: 'valid-workshop', userId: 'test-user'}],
    ])
  } finally {
    warn.mockRestore()
  }
})

it('skips throwing and empty workshops but still requires a completed workshop', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
  try {
    const broken = [{slug: 'broken-workshop'}, {slug: 'empty-workshop'}]
    fetchWorkshops.mockResolvedValue([...broken, {slug: 'valid-workshop'}])
    getProgress.mockImplementation(async ({moduleSlug}) => {
      if (moduleSlug === 'broken-workshop') throw new Error('Test learner data')
      return {
        moduleCompleted: true,
        lessonCount: moduleSlug === 'empty-workshop' ? 0 : 10,
      }
    })
    await expect(canEarnCourseCertificate('test-user')).resolves.toBe(true)
    expect(warn.mock.calls).toEqual(
      broken.map(({slug}) => [
        'Skipping published workshop with unusable progress:',
        slug,
      ]),
    )
    fetchWorkshops.mockResolvedValue(broken)
    await expect(canEarnCourseCertificate('test-user')).resolves.toBe(false)
  } finally {
    warn.mockRestore()
  }
})

function templateMarkup(name) {
  return renderToStaticMarkup(
    <CertificateTemplate
      name={name}
      issuedDate="11/28/2026"
      backgroundImage="/assets/epic-react-certificate-bg.svg"
      courseMark="/favicons/android-chrome-512x512.png"
    />,
  )
}

it('renders count-independent Epic React course copy and preserves a non-ASCII name', () => {
  const markup = templateMarkup('Michał Test')
  expect(markup).toContain('Michał Test')
  expect(markup).toContain(
    'Has successfully completed all of the Epic React workshops.',
  )
  expect(markup).toContain('/assets/epic-react-certificate-bg.svg')
  expect(markup).not.toMatch(/Epic Web|Total TypeScript/i)
})

it('renders a long unbroken name at a smaller size within the certificate name box', () => {
  const name = 'W'.repeat(96)
  const markup = templateMarkup(name)
  expect(markup).toContain(name)
  expect(markup).toContain('width:1320px;height:112px;font-size:11px')
  expect(templateMarkup('Test Learner')).toContain('font-size:72px')
})
