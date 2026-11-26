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
  fetchWorkshops.mockResolvedValue([...workshops, 'welcome-to-epic-react'])
  getProgress.mockResolvedValue({moduleCompleted: true})
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
  fetchWorkshops.mockResolvedValue(['welcome-to-epic-react'])
  await expect(canEarnCourseCertificate('test-user')).resolves.toBe(false)
  expect(getProgress).not.toHaveBeenCalled()
})

it('renders Epic React course copy and preserves a non-ASCII name', () => {
  const markup = renderToStaticMarkup(
    <CertificateTemplate
      name="Michał Test"
      issuedDate="11/28/2026"
      backgroundImage="/assets/epic-react-certificate-bg.svg"
      courseMark="/favicons/android-chrome-512x512.png"
    />,
  )
  expect(markup).toContain('Michał Test')
  expect(markup).toContain(
    'Has successfully completed all seven Epic React workshops.',
  )
  expect(markup).toContain('/assets/epic-react-certificate-bg.svg')
  expect(markup).not.toMatch(/Epic Web|Total TypeScript/i)
})
